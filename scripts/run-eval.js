const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const casesPath = path.join(root, "eval", "cases.json");
const rubricPath = path.join(root, "eval", "rubric.json");
const reportsDir = path.join(root, "eval", "reports");

loadEnv(path.join(root, ".env.local"));
loadEnv(path.join(root, ".env"));

const args = new Set(process.argv.slice(2));
const live = args.has("--live");
const judge = args.has("--judge");
const judgeReport = getArgValue("--judge-report");
const baseUrl = getArgValue("--base-url") || "http://127.0.0.1:5176";
const caseFilter = getArgValue("--case");
const timeoutMs = Number(getArgValue("--timeout-ms") || 120_000);
const judgeTimeoutMs = Number(getArgValue("--judge-timeout-ms") || timeoutMs);
const judgeModel = process.env.KIMI_JUDGE_MODEL || process.env.KIMI_MODEL || "kimi-k2.6";
const kimiBaseUrl = process.env.KIMI_BASE_URL || "https://api.moonshot.cn/v1";

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function main() {
  let cases = readJson(casesPath);
  const rubric = readJson(rubricPath);
  validateRubric(rubric);
  validateCases(cases);
  if (caseFilter) {
    cases = cases.filter((item) => item.id === caseFilter);
    if (!cases.length) throw new Error(`No eval case found for --case=${caseFilter}`);
  }

  if (judgeReport) {
    await judgeExistingReport(judgeReport, cases, rubric);
    return;
  }

  if (!live) {
    console.log(`Validated ${cases.length} eval cases and ${rubric.dimensions.length} rubric dimensions.`);
    console.log("Run with --live to call the local Agent APIs and generate real benchmark reports.");
    return;
  }

  fs.mkdirSync(reportsDir, { recursive: true });
  const results = [];

  for (const evalCase of cases) {
    console.log(`Running ${evalCase.id}...`);
    try {
      const plan = await postJson("/api/generate", evalCase.profile);
      const firstTopic = mergeTopicAndTask(plan, 0);
      const content = await postJson("/api/content", {
        ...evalCase.profile,
        topic: firstTopic,
        contentMode: evalCase.profile.format || "图文 + 视频",
        mustMention: evalCase.mustMention,
        avoid: evalCase.avoid
      });
      const review = await postJson("/api/review", {
        ...evalCase.profile,
        topic: firstTopic,
        content,
        metrics: evalCase.reviewMetrics,
        mustMention: evalCase.mustMention,
        avoid: evalCase.avoid
      });

      const result = scoreCase(evalCase, rubric, { plan, content, review });
      if (judge) {
        console.log(`Judging ${evalCase.id}...`);
        try {
          result.judge = await judgeCase(evalCase, rubric, { plan, content, review });
        } catch (error) {
          result.judgeError = error.message;
          console.warn(`Judge ${evalCase.id} failed: ${error.message}`);
        }
      }
      results.push(result);
    } catch (error) {
      console.warn(`Case ${evalCase.id} failed: ${error.message}`);
      results.push({
        id: evalCase.id,
        name: evalCase.name,
        platform: evalCase.profile.platform,
        total: 0,
        grade: "F",
        error: error.message,
        dimensionScores: [],
        missingMustMention: evalCase.mustMention,
        avoidHits: []
      });
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    mode: judge ? "live_judge" : "live",
    baseUrl,
    timeoutMs,
    judgeModel: judge ? judgeModel : null,
    rubricVersion: rubric.version,
    summary: summarize(results),
    judgeSummary: summarizeJudge(results),
    results
  };

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const jsonPath = path.join(reportsDir, `eval-${stamp}.json`);
  const mdPath = path.join(reportsDir, `eval-${stamp}.md`);
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), "utf8");
  fs.writeFileSync(mdPath, renderMarkdown(report), "utf8");

  console.log(`Wrote ${path.relative(root, jsonPath)}`);
  console.log(`Wrote ${path.relative(root, mdPath)}`);
}

async function judgeExistingReport(reportPath, cases, rubric) {
  fs.mkdirSync(reportsDir, { recursive: true });
  const sourcePath = path.isAbsolute(reportPath) ? reportPath : path.join(root, reportPath);
  const source = readJson(sourcePath);
  const caseById = new Map(cases.map((item) => [item.id, item]));
  const results = [];

  for (const result of source.results || []) {
    const evalCase = caseById.get(result.id);
    if (!evalCase) {
      console.warn(`Skipping ${result.id}: no eval case found`);
      continue;
    }
    if (!result.generatedOutput) {
      console.warn(`Skipping ${result.id}: no generatedOutput in source report`);
      results.push({
        ...result,
        judge: undefined,
        judgeError: "No generatedOutput in source report"
      });
      continue;
    }
    console.log(`Re-judging ${result.id} from ${path.basename(sourcePath)}...`);
    const nextResult = { ...result };
    delete nextResult.judgeError;
    try {
      nextResult.judge = await judgeCase(evalCase, rubric, result.generatedOutput);
    } catch (error) {
      nextResult.judgeError = error.message;
      console.warn(`Judge ${result.id} failed: ${error.message}`);
    }
    results.push(nextResult);
  }

  const report = {
    ...source,
    generatedAt: new Date().toISOString(),
    mode: `${source.mode || "report"}_rejudge`,
    sourceReport: path.relative(root, sourcePath),
    judgeModel,
    rubricVersion: rubric.version,
    judgeSummary: summarizeJudge(results),
    results
  };

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const jsonPath = path.join(reportsDir, `eval-${stamp}-rejudge.json`);
  const mdPath = path.join(reportsDir, `eval-${stamp}-rejudge.md`);
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), "utf8");
  fs.writeFileSync(mdPath, renderMarkdown(report), "utf8");
  console.log(`Wrote ${path.relative(root, jsonPath)}`);
  console.log(`Wrote ${path.relative(root, mdPath)}`);
}

function getArgValue(name) {
  const prefix = `${name}=`;
  const match = process.argv.slice(2).find((item) => item.startsWith(prefix));
  return match ? match.slice(prefix.length) : "";
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

function validateRubric(rubric) {
  if (!Array.isArray(rubric.dimensions) || !rubric.dimensions.length) {
    throw new Error("rubric.dimensions must be a non-empty array");
  }
  if (!Array.isArray(rubric.groups) || !rubric.groups.length) {
    throw new Error("rubric.groups must be a non-empty array");
  }
  const total = rubric.dimensions.reduce((sum, item) => sum + Number(item.weight || 0), 0);
  if (total !== rubric.totalScore) {
    throw new Error(`Rubric weights sum to ${total}, expected ${rubric.totalScore}`);
  }
  const groupTotal = rubric.groups.reduce((sum, item) => sum + Number(item.weight || 0), 0);
  if (groupTotal !== rubric.totalScore) {
    throw new Error(`Rubric group weights sum to ${groupTotal}, expected ${rubric.totalScore}`);
  }
  const dimensionIds = new Set(rubric.dimensions.map((item) => item.id));
  for (const group of rubric.groups) {
    for (const id of group.dimensionIds || []) {
      if (!dimensionIds.has(id)) throw new Error(`Group ${group.id} references missing dimension ${id}`);
    }
  }
}

function validateCases(cases) {
  if (!Array.isArray(cases) || !cases.length) throw new Error("eval/cases.json must contain cases");
  for (const item of cases) {
    const required = ["id", "name", "profile", "reviewMetrics", "mustMention", "avoid"];
    for (const key of required) {
      if (!item[key]) throw new Error(`Case ${item.id || "unknown"} missing ${key}`);
    }
    const profileRequired = ["profile", "audience", "niche", "stage", "bottleneck", "assets", "platform"];
    for (const key of profileRequired) {
      if (!item.profile[key]) throw new Error(`Case ${item.id} profile missing ${key}`);
    }
  }
}

async function postJson(pathname, payload) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  let response;
  try {
    response = await fetch(`${baseUrl}${pathname}`, {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(`${pathname} timed out after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${pathname} failed: HTTP ${response.status} ${text.slice(0, 300)}`);
  }
  return response.json();
}

async function judgeCase(evalCase, rubric, output) {
  const prompt = buildJudgePrompt(evalCase, rubric, output);
  const content = await callKimiJson([
    {
      role: "system",
      content: [
        "你是 GrowthMate 的独立评测官，负责评估 AI Agent 给 KOC 用户生成的分步增长工作流质量。",
        "你必须严格基于 Rubric、用户输入、Agent 输出和复盘数据打分。",
        "不要因为内容结构完整就给高分，要判断策略是否真的有洞察、首条内容是否像平台原生表达、7天任务是否能指导用户继续执行。",
        "注意：GrowthMate 不是一次性生成7天所有正文/脚本的工具。它先生成7天增长任务，再对用户当前选择的首条任务生成完整内容，最后基于用户实际发布稿做复盘。",
        "只输出严格 JSON，不要 markdown。"
      ].join("\n")
    },
    { role: "user", content: prompt }
  ]);
  return normalizeJudgeResult(parseModelJson(content), rubric);
}

async function callKimiJson(messages) {
  const apiKey = process.env.KIMI_API_KEY;
  if (!apiKey) throw new Error("Missing KIMI_API_KEY for LLM Judge.");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), judgeTimeoutMs);
  let response;
  try {
    response = await fetch(`${kimiBaseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: judgeModel,
        temperature: 0.6,
        response_format: { type: "json_object" },
        thinking: { type: "disabled" },
        messages
      })
    });
  } catch (error) {
    if (error.name === "AbortError") throw new Error(`LLM Judge timeout after ${judgeTimeoutMs}ms`);
    throw error;
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`LLM Judge API ${response.status}: ${text.slice(0, 300)}`);
  }
  const json = await response.json();
  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new Error("LLM Judge returned empty content");
  return content;
}

function buildJudgePrompt(evalCase, rubric, output) {
  const compactRubric = rubric.dimensions.map((item) => ({
    id: item.id,
    name: item.name,
    weight: item.weight,
    definition: item.definition,
    scoreGuide: item.scoreGuide,
    criteria: (item.criteria || []).map((criterion) => ({
      label: criterion.label,
      annotationGuide: criterion.annotationGuide,
      positiveExample: criterion.positiveExample,
      negativeExample: criterion.negativeExample
    }))
  }));
  return `
请评估下面这个 GrowthMate Agent 输出。

产品工作流边界：
1. plan 是 7 天增长任务规划，应该评估“任务路径是否递进、每一天目标/素材/观察信号是否清楚”，不要要求 Day2-Day7 都有完整正文或视频脚本。
2. content 是用户当前选择的首条任务/选题的完整内容交付。只要求这一个 selectedTopic 对应的内容完整、平台适配、可发布。
3. review 是基于用户手动输入的数据、评论样本和 actualPublishedContent 做复盘。复盘应评估真实发布稿与方案/内容的差距，但不能要求 Agent 已经自动生成所有后续内容。
4. 如果 content 只包含一个平台形态字段，例如 video/note/article，这是正常的；不要因为其他平台字段为空而扣分。
5. 只有在“首条 selectedTopic 的内容也缺少正文/脚本/发布文案”时，才可以因为内容交付不完整扣分。
6. 如果你发现问题来自 Judge 预期和产品工作流边界不一致，不要把它记为 Agent 缺陷；应在 promptSuggestions 中建议补充评测说明。

评测 case:
${JSON.stringify(evalCase, null, 2)}

Rubric:
${JSON.stringify(compactRubric, null, 2)}

Agent 输出:
${JSON.stringify(output, null, 2)}

打分要求：
1. 每个维度 score 为 1-5 分，可以有一位小数。
2. reason 必须解释为什么给这个分，不能只复述标准。
3. evidence 引用 Agent 输出里的具体内容或缺失点，便于人工复核。
4. total 由维度加权汇总到 100 分。如果你不确定，也必须给出最合理判断。
5. promptSuggestions 要直接服务于下一轮 Prompt 迭代。
6. content_usability 维度只评估当前 selectedTopic 的内容是否可发布，不评估 Day2-Day7 是否都有完整成稿。
7. task_planning 维度评估 Day1-Day7 的任务规划质量，包括阶段递进、素材绑定、观察信号和评论区预埋。
8. review_quality 维度评估复盘是否基于 actualPublishedContent、metrics 和 commentSamples，而不是把 Agent 自己生成的内容误当成用户真实发布稿。

输出 JSON：
{
  "summary": "一句话总体判断",
  "total": 0,
  "dimensionScores": [
    {"id": "profile_fit", "score": 4.5, "reason": "给分理由", "evidence": ["证据1", "证据2"]}
  ],
  "strengths": ["优点1", "优点2"],
  "issues": ["问题1", "问题2"],
  "promptSuggestions": ["Prompt 迭代建议1", "Prompt 迭代建议2"]
}
`;
}

function normalizeJudgeResult(raw, rubric) {
  const byId = new Map((raw.dimensionScores || []).map((item) => [item.id, item]));
  const dimensionScores = rubric.dimensions.map((dimension) => {
    const item = byId.get(dimension.id) || {};
    const score = clampScore(Number(item.score || 3));
    return {
      id: dimension.id,
      groupId: dimension.groupId,
      name: dimension.name,
      weight: dimension.weight,
      score,
      weightedScore: round((score / 5) * dimension.weight),
      reason: String(item.reason || "模型未给出该维度的详细理由。"),
      evidence: Array.isArray(item.evidence) ? item.evidence.slice(0, 4).map(String) : []
    };
  });
  const total = round(dimensionScores.reduce((sum, item) => sum + item.weightedScore, 0));
  return {
    type: "llm_judge",
    model: judgeModel,
    total,
    grade: grade(total),
    summary: String(raw.summary || ""),
    dimensionScores,
    groupScores: scoreGroups(rubric, dimensionScores),
    strengths: Array.isArray(raw.strengths) ? raw.strengths.slice(0, 5).map(String) : [],
    issues: Array.isArray(raw.issues) ? raw.issues.slice(0, 5).map(String) : [],
    promptSuggestions: Array.isArray(raw.promptSuggestions) ? raw.promptSuggestions.slice(0, 5).map(String) : []
  };
}

function parseModelJson(content) {
  try {
    return JSON.parse(content);
  } catch {
    const match = String(content || "").match(/\{[\s\S]*\}/);
    if (!match) throw new Error("LLM Judge did not return JSON");
    return JSON.parse(match[0]);
  }
}

function clampScore(value) {
  if (!Number.isFinite(value)) return 3;
  return Math.min(5, Math.max(1, Math.round(value * 10) / 10));
}

function mergeTopicAndTask(plan, index) {
  const topic = plan.topics?.[index] || {};
  const task = plan.tasks?.[index] || {};
  return {
    ...topic,
    ...task,
    title: task.title || topic.title,
    stage: task.goal || topic.stage,
    whyNow: task.whyThisTask || topic.whyNow,
    material: task.material || topic.material
  };
}

function scoreCase(evalCase, rubric, output) {
  const text = JSON.stringify(output);
  const dimensionScores = rubric.dimensions.map((dimension) => {
    const score = scoreDimension(dimension.id, evalCase, output, text);
    return {
      id: dimension.id,
      groupId: dimension.groupId,
      name: dimension.name,
      weight: dimension.weight,
      score,
      weightedScore: round((score / 5) * dimension.weight),
      notes: notesForDimension(dimension.id, evalCase, output, text)
    };
  });
  const total = round(dimensionScores.reduce((sum, item) => sum + item.weightedScore, 0));
  return {
    id: evalCase.id,
    name: evalCase.name,
    platform: evalCase.profile.platform,
    total,
    grade: grade(total),
    dimensionScores,
    groupScores: scoreGroups(rubric, dimensionScores),
    missingMustMention: evalCase.mustMention.filter((word) => !text.includes(word)),
    avoidHits: evalCase.avoid.filter((word) => text.includes(word)),
    generatedOutput: {
      plan: output.plan,
      content: output.content,
      review: output.review
    }
  };
}

function scoreGroups(rubric, dimensionScores) {
  return rubric.groups.map((group) => {
    const dimensions = dimensionScores.filter((item) => group.dimensionIds.includes(item.id));
    const weightedScore = round(dimensions.reduce((sum, item) => sum + item.weightedScore, 0));
    return {
      id: group.id,
      name: group.name,
      weight: group.weight,
      weightedScore,
      score: round((weightedScore / group.weight) * 5),
      description: group.description
    };
  });
}

function scoreDimension(id, evalCase, output, text) {
  const profile = evalCase.profile;
  const plan = output.plan || {};
  const content = output.content || {};
  const review = output.review || {};

  if (id === "profile_fit") {
    return average([
      includesAny(text, [profile.profile, profile.audience, profile.assets]) ? 5 : 3,
      evalCase.mustMention.filter((word) => text.includes(word)).length >= 3 ? 5 : 3,
      text.includes(profile.bottleneck) || text.includes(profile.edge) ? 4 : 3
    ]);
  }
  if (id === "specificity") {
    return average([
      countArray(plan.tasks) >= 7 ? 5 : 2,
      countStringHits(text, ["素材", "观察", "下一步", "评论", "收藏"]) >= 4 ? 5 : 3,
      text.length > 3000 ? 4 : 3
    ]);
  }
  if (id === "agent_workflow") {
    return average([
      countArray(plan.agentTrace) >= 2 ? 5 : 2,
      plan.diagnosis ? 5 : 2,
      countStringHits(text, ["诊断", "规划", "发布", "复盘", "下一步"]) >= 4 ? 5 : 3
    ]);
  }
  if (id === "task_planning") {
    const goals = (plan.tasks || []).map((item) => item.goal || "").join(" ");
    return average([
      countArray(plan.tasks) === 7 ? 5 : 2,
      countStringHits(goals, ["建立信任", "验证方向", "轻转化"]) >= 2 ? 5 : 3,
      (plan.tasks || []).every((item) => item.material && item.publishMetric) ? 5 : 3
    ]);
  }
  if (id === "platform_fit") {
    const platform = profile.platform;
    const platformHit = text.includes(platform);
    const badXhs = platform !== "小红书" && countStringHits(text, ["首图", "小红书", "话题标签"]) >= 3;
    return average([platformHit ? 5 : 3, badXhs ? 2 : 5]);
  }
  if (id === "content_usability") {
    return average([
      content.selectedTopic ? 5 : 2,
      hasPlatformContent(content) ? 5 : 2,
      countStringHits(JSON.stringify(content), ["标题", "脚本", "素材", "互动", "评论"]) >= 3 ? 5 : 3
    ]);
  }
  if (id === "review_quality") {
    const reviewText = JSON.stringify(review);
    return average([
      review.review?.bottleneck ? 5 : 2,
      Array.isArray(review.review?.evidence) && review.review.evidence.length >= 2 ? 5 : 3,
      reviewText.includes(evalCase.reviewMetrics.commentSamples.slice(0, 6)) ||
      reviewText.includes("评论") ? 4 : 3
    ]);
  }
  if (id === "safety_and_boundary") {
    return evalCase.avoid.some((word) => text.includes(word)) ? 2 : 5;
  }
  return 3;
}

function notesForDimension(id, evalCase, output, text) {
  if (id === "profile_fit") {
    const missing = evalCase.mustMention.filter((word) => !text.includes(word));
    return missing.length ? `Missing expected terms: ${missing.join(", ")}` : "Expected profile terms covered.";
  }
  if (id === "safety_and_boundary") {
    const hits = evalCase.avoid.filter((word) => text.includes(word));
    return hits.length ? `Avoid terms found: ${hits.join(", ")}` : "No avoid terms found.";
  }
  if (id === "task_planning") return `${countArray(output.plan?.tasks)} tasks returned.`;
  return "Heuristic score. Manual review recommended for final decision.";
}

function countArray(value) {
  return Array.isArray(value) ? value.length : 0;
}

function hasPlatformContent(content) {
  return Boolean(content.article?.articleTitle || content.note?.postTitle || content.video?.script || content.longVideo?.chapters);
}

function countStringHits(text, words) {
  return words.filter((word) => text.includes(word)).length;
}

function includesAny(text, values) {
  return values.filter(Boolean).some((value) => text.includes(String(value).slice(0, 8)));
}

function average(values) {
  return round(values.reduce((sum, item) => sum + item, 0) / values.length);
}

function round(value) {
  return Math.round(value * 10) / 10;
}

function grade(total) {
  if (total >= 85) return "A";
  if (total >= 75) return "B";
  if (total >= 65) return "C";
  if (total >= 50) return "D";
  return "F";
}

function summarize(results) {
  const averageTotal = round(results.reduce((sum, item) => sum + item.total, 0) / results.length);
  return {
    caseCount: results.length,
    averageTotal,
    grade: grade(averageTotal),
    lowestCases: [...results].sort((a, b) => a.total - b.total).slice(0, 3).map((item) => ({
      id: item.id,
      total: item.total,
      grade: item.grade
    }))
  };
}

function summarizeJudge(results) {
  const judged = results.filter((item) => item.judge?.total);
  if (!judged.length) {
    return { caseCount: 0, averageTotal: 0, grade: "F", lowestCases: [] };
  }
  const averageTotal = round(judged.reduce((sum, item) => sum + item.judge.total, 0) / judged.length);
  return {
    caseCount: judged.length,
    averageTotal,
    grade: grade(averageTotal),
    lowestCases: [...judged].sort((a, b) => a.judge.total - b.judge.total).slice(0, 3).map((item) => ({
      id: item.id,
      total: item.judge.total,
      grade: item.judge.grade
    }))
  };
}

function renderMarkdown(report) {
  const lines = [
    "# GrowthMate Eval Report",
    "",
    `Generated: ${report.generatedAt}`,
    `Base URL: ${report.baseUrl}`,
    `Rubric: ${report.rubricVersion}`,
    "",
    `Average: ${report.summary.averageTotal}/100 (${report.summary.grade})`,
    report.judgeSummary?.caseCount ? `LLM Judge Average: ${report.judgeSummary.averageTotal}/100 (${report.judgeSummary.grade})` : "",
    "",
    "## Cases",
    ""
  ];

  for (const result of report.results) {
    lines.push(`### ${result.name}`);
    lines.push("");
    lines.push(`- Case: \`${result.id}\``);
    lines.push(`- Platform: ${result.platform}`);
    lines.push(`- Total: ${result.total}/100 (${result.grade})`);
    if (result.judge) {
      lines.push(`- LLM Judge: ${result.judge.total}/100 (${result.judge.grade})`);
      lines.push(`- Judge Summary: ${result.judge.summary}`);
    }
    if (result.error) lines.push(`- Error: ${result.error}`);
    if (result.missingMustMention.length) lines.push(`- Missing expected terms: ${result.missingMustMention.join(", ")}`);
    if (result.avoidHits.length) lines.push(`- Avoid hits: ${result.avoidHits.join(", ")}`);
    lines.push("");
    if (result.groupScores?.length) {
      lines.push("| Layer | Score | Weighted |");
      lines.push("| --- | ---: | ---: |");
      for (const group of result.groupScores) {
        lines.push(`| ${group.name} | ${group.score}/5 | ${group.weightedScore}/${group.weight} |`);
      }
      lines.push("");
    }
    lines.push("| Dimension | Score | Weighted | Notes |");
    lines.push("| --- | ---: | ---: | --- |");
    for (const dimension of result.dimensionScores) {
      lines.push(`| ${dimension.name} | ${dimension.score}/5 | ${dimension.weightedScore} | ${dimension.notes} |`);
    }
    lines.push("");
    if (result.judge?.dimensionScores?.length) {
      lines.push("| LLM Judge Dimension | Score | Weighted | Reason |");
      lines.push("| --- | ---: | ---: | --- |");
      for (const dimension of result.judge.dimensionScores) {
        lines.push(`| ${dimension.name} | ${dimension.score}/5 | ${dimension.weightedScore} | ${String(dimension.reason || "").replaceAll("\n", " ")} |`);
      }
      lines.push("");
    }
  }

  return `${lines.join("\n")}\n`;
}
