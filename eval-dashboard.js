const $ = (id) => document.getElementById(id);

let currentView = "cases";
let caseData = null;
let benchmarkData = null;
let liveData = null;

const escapeHtml = (value) => String(value || "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

async function loadJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function postJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function loadAll() {
  const [cases, benchmarks, live] = await Promise.all([
    loadJson("/api/eval/cases"),
    loadJson("/api/eval/benchmarks"),
    loadJson("/api/eval/runs")
  ]);
  caseData = cases;
  benchmarkData = benchmarks;
  liveData = live;
}

function render() {
  renderSummary();
  renderPrimary();
  $("rubricPanel").style.display = "none";
  document.querySelectorAll(".eval-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.view === currentView);
  });
}

function renderSummary() {
  const latestReport = benchmarkData?.reports?.[0];
  const latestLive = liveData?.runs?.[0]?.result;
  const generatedCases = (caseData?.cases || []).filter((item) => item.latestResult?.generatedOutput).length;
  const judgeSummary = latestReport?.judgeSummary;
  const judgeStatus = judgeSummary?.caseCount ? judgeSummary.averageTotal : "待运行";

  $("summaryGrid").innerHTML = `
    <article class="summary-card">
      <span>固定评测集</span>
      <b>${caseData?.cases?.length || 0}</b>
      <p>${generatedCases} 个已绑定最新 Agent 输出</p>
    </article>
    <article class="summary-card">
      <span>最近模型评审</span>
      <b>${judgeStatus}</b>
      <p>${judgeSummary?.caseCount ? `${escapeHtml(judgeSummary.grade)} / ${judgeSummary.caseCount} judged cases` : "运行 eval:judge 后展示"}</p>
    </article>
    <article class="summary-card">
      <span>评审报告</span>
      <b>${benchmarkData?.reports?.filter((item) => item.judgeSummary?.caseCount)?.length || 0}</b>
      <p>包含 LLM Judge 结果的报告</p>
    </article>
    <article class="summary-card">
      <span>线上回流</span>
      <b>${liveData?.runs?.length || 0}</b>
      <p>前台使用后自动写入的评测快照</p>
    </article>
  `;
}

function renderPrimary() {
  const titleMap = {
    cases: ["Case Set", "评测集管理", "新增评测用例"],
    runs: ["Evaluation Runs", "评测运行", "运行评测"],
    live: ["User Feedback", "线上回流", "抽样复核"]
  };
  const [kicker, title, action] = titleMap[currentView];
  $("primaryKicker").textContent = kicker;
  $("primaryTitle").textContent = title;
  $("primaryAction").textContent = action;
  $("primaryAction").onclick = () => handlePrimaryAction();

  if (currentView === "cases") renderCaseManagement();
  if (currentView === "runs") renderRunConsole();
  if (currentView === "live") renderLiveFeedback();
}

function handlePrimaryAction() {
  if (currentView === "cases") {
    const form = $("caseForm");
    if (form) form.hidden = !form.hidden;
    return;
  }
  if (currentView === "runs") {
    showToast("当前先用命令运行：npm run eval:judge -- --timeout-ms=240000 --base-url=http://127.0.0.1:5176。后续再做页面内异步运行按钮。");
    return;
  }
  showToast("线上回流当前已自动收集快照；人工标注队列下一步接入。");
}

function renderCaseManagement() {
  const cases = caseData?.cases || [];
  $("primaryContent").innerHTML = `
    <div class="workflow-strip">
      <article><b>输入覆盖</b><span>评测集字段与前台用户输入保持一致，避免离线测试和真实使用脱节。</span></article>
      <article><b>输出绑定</b><span>每个 case 绑定最新一次 Agent 真实输出，包括诊断、打法、内容和复盘。</span></article>
      <article><b>可迭代</b><span>后续可按线上分布新增 case，也可加入边界场景检验 Prompt 稳定性。</span></article>
    </div>
    ${renderCaseForm()}
    <div class="case-management-grid">
      ${cases.map((item) => renderManagedCase(item)).join("") || `<div class="empty-state">暂无评测集</div>`}
    </div>
  `;
  bindCaseForm();
}

function renderCaseForm() {
  return `
    <form class="case-form" id="caseForm" hidden>
      <div class="form-head">
        <div>
          <b>手动新增评测用例</b>
          <p>先做轻量版本，字段和前台输入保持一致，提交后写入 eval/cases.json。</p>
        </div>
      </div>
      <div class="form-grid">
        ${renderField("name", "用例名称", "例如：低粉美食探店视频号")}
        ${renderField("platform", "平台", "小红书 / 抖音 / 视频号 / 公众号")}
        ${renderField("profile", "人设", "用户是谁，有什么经历")}
        ${renderField("audience", "目标用户", "服务谁")}
        ${renderField("niche", "赛道", "内容方向")}
        ${renderField("stage", "账号阶段", "冷启动 / 已发布但不稳定")}
        ${renderField("bottleneck", "当前卡点", "最大问题")}
        ${renderField("assets", "素材资产", "已有素材")}
        ${renderField("goal", "商业目标", "未来想接什么")}
        ${renderField("whySelected", "为什么选它", "它覆盖了什么评测场景")}
        ${renderField("mustMention", "期望命中词", "逗号分隔")}
        ${renderField("avoid", "风险词", "逗号分隔")}
      </div>
      <button type="submit">保存用例</button>
    </form>
  `;
}

function renderField(name, label, placeholder) {
  return `
    <label>
      <span>${escapeHtml(label)}</span>
      <input name="${escapeHtml(name)}" placeholder="${escapeHtml(placeholder)}" />
    </label>
  `;
}

function bindCaseForm() {
  const form = $("caseForm");
  if (!form) return;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      await postJson("/api/eval/cases", {
        name: data.name,
        whySelected: data.whySelected,
        mustMention: data.mustMention,
        avoid: data.avoid,
        profile: {
          profile: data.profile,
          audience: data.audience,
          niche: data.niche,
          stage: data.stage,
          bottleneck: data.bottleneck,
          assets: data.assets,
          goal: data.goal,
          platform: data.platform,
          edge: "",
          story: "",
          audienceMoment: "",
          contentBoundary: "",
          format: "",
          timeBudget: "",
          pain: data.bottleneck
        }
      });
      showToast("评测用例已保存。");
      await refresh();
      currentView = "cases";
      render();
    } catch (error) {
      showToast(`保存失败：${error.message}`);
    }
  });
}

function renderManagedCase(item) {
  const profile = item.profile || {};
  const output = item.latestResult?.generatedOutput;
  return `
    <details class="managed-case">
      <summary class="managed-summary">
        <span>${escapeHtml(profile.platform)} / ${escapeHtml(profile.stage)}</span>
        <b>${escapeHtml(item.name)}</b>
        <em>${escapeHtml(item.latestResult?.judge?.grade || "待评")}</em>
      </summary>
      <div class="case-title-row">
        <div>
          <span>${escapeHtml(profile.platform)} / ${escapeHtml(profile.stage)}</span>
          <h3>${escapeHtml(item.name)}</h3>
        </div>
        <b>${escapeHtml(item.latestResult?.judge?.grade || "待评")}</b>
      </div>
      ${renderCaseJudgeStatus(item)}
      <p class="case-reason">${escapeHtml(item.whySelected)}</p>
      <div class="input-grid">
        ${renderInputPair("人设", profile.profile)}
        ${renderInputPair("目标用户", profile.audience)}
        ${renderInputPair("赛道", profile.niche)}
        ${renderInputPair("当前卡点", profile.bottleneck)}
        ${renderInputPair("素材资产", profile.assets)}
        ${renderInputPair("商业目标", profile.goal)}
      </div>
      <details class="case-detail">
        <summary>查看真实生成输出</summary>
        ${output ? renderGeneratedOutput({ generatedOutput: output }) : renderMissingOutput()}
      </details>
    </details>
  `;
}

function renderCaseJudgeStatus(item) {
  const result = item.latestResult || {};
  if (result.judge) {
    return `
      <div class="judge-summary">
        <b>LLM Judge：${result.judge.total}/100 · ${escapeHtml(result.judge.grade)}</b>
        <p>${escapeHtml(result.judge.summary || "模型已完成评审")}</p>
      </div>
    `;
  }
  if (result.generatedOutput) {
    return `<div class="detail-alert"><b>已生成，待模型评审</b><span>运行 eval:judge 后会写入 LLM Judge 分数、理由和 Prompt 建议。</span></div>`;
  }
  return `<div class="detail-alert"><b>待生成</b><span>这个 case 还没有 Agent 输出，先运行评测生成内容。</span></div>`;
}

function renderInputPair(label, value) {
  return `
    <div>
      <span>${escapeHtml(label)}</span>
      <p>${escapeHtml(value || "未填写")}</p>
    </div>
  `;
}

function renderRunConsole() {
  const allReports = benchmarkData?.reports || [];
  const reports = getEffectiveReports(allReports);
  const latestReport = reports[0];
  $("primaryContent").innerHTML = `
    ${renderIterationStory(reports)}
    ${renderEvalDashboard(latestReport, reports, allReports)}
    <div class="command-card">
      <div>
        <b>运行新的模型评审</b>
        <p>正式跑新版本时调用 Agent 生成输出，再调用 Kimi Judge；调 Judge Prompt 时可复用已有快照重评。</p>
      </div>
      <code>npm run eval:judge -- --timeout-ms=240000 --base-url=http://127.0.0.1:5176</code>
    </div>
    <div class="command-card compact-command">
      <div>
        <b>复用已有输出重评</b>
        <p>不重新生成内容，只用新的 Judge Prompt 读取历史 report 里的 generatedOutput 重评。</p>
      </div>
      <code>node scripts/run-eval.js --judge-report=eval/reports/报告名.json --timeout-ms=300000</code>
    </div>
    ${renderReportInsights(latestReport)}
    <div class="runs-list">
      ${reports.map((report) => renderBenchmarkReport(report)).join("") || `<div class="empty-state">还没有评测报告。</div>`}
    </div>
    ${renderRunLog(allReports, reports)}
  `;
}

function getEffectiveReports(reports) {
  return reports.filter((report) => report.judgeSummary?.caseCount > 0);
}

function renderIterationStory(reports) {
  const rejudge = reports.find((report) => String(report.mode || "").includes("_rejudge"));
  const source = reports.find((report) => report.file === "eval-2026-05-03T08-53-40-988Z-remaining-4-judge.json");
  const latestBeauty = reports.find((report) => report.results?.[0]?.id === "beauty_sensitive_xhs" && report.judgeSummary?.caseCount === 1);
  return `
    <section class="iteration-story">
      <article>
        <span>Step 1</span>
        <b>模型评审发现问题</b>
        <p>${source ? `剩余 4 个 case 均分 ${source.judgeSummary.averageTotal}，主要问题集中在工作流边界和复盘证据。` : "用 LLM Judge 识别 Agent 输出质量问题。"}</p>
      </article>
      <article>
        <span>Step 2</span>
        <b>复用快照重评</b>
        <p>${rejudge ? `不重新生成内容，仅更新 Judge Prompt 后重评到 ${rejudge.judgeSummary.averageTotal}。` : "同一批 Agent 输出可反复用不同 Judge Prompt 评审。"}</p>
      </article>
      <article>
        <span>Step 3</span>
        <b>反向迭代 Agent</b>
        <p>${latestBeauty ? `修复关键记忆点和复盘证据边界后，敏感肌 case 达到 ${latestBeauty.judgeSummary.averageTotal} / ${latestBeauty.judgeSummary.grade}。` : "将问题写回 Agent Prompt 和规范化逻辑。"}</p>
      </article>
    </section>
  `;
}

function renderEvalDashboard(latestReport, reports, allReports) {
  const judgedReports = reports.filter((report) => report.judgeSummary?.caseCount);
  const judgedCases = latestReport?.judgeSummary?.caseCount || 0;
  const totalCases = latestReport?.summary?.caseCount || latestReport?.results?.length || 0;
  const completion = totalCases ? Math.round((judgedCases / totalCases) * 100) : 0;
  const trend = getJudgeTrend(judgedReports);
  return `
    <section class="eval-board">
      <article class="board-hero">
        <span>Latest LLM Judge</span>
        <b>${latestReport?.judgeSummary?.averageTotal || "-"}</b>
        <p>${latestReport?.judgeSummary?.grade ? `${escapeHtml(latestReport.judgeSummary.grade)} 级模型评审` : "还没有模型评审结果"}</p>
      </article>
      <article>
        <span>评审覆盖</span>
        <b>${judgedCases}/${totalCases || "-"}</b>
        <p>${completion}% cases 已完成 LLM Judge</p>
      </article>
      <article>
        <span>有效批次</span>
        <b>${judgedReports.length}</b>
        <p>默认只展示有效 LLM Judge 批次</p>
      </article>
      <article>
        <span>隐藏日志</span>
        <b>${Math.max((allReports?.length || 0) - reports.length, 0)}</b>
        <p>失败/旧版报告收进运行日志</p>
      </article>
    </section>
  `;
}

function getJudgeTrend(reports) {
  if (reports.length < 2) return "-";
  const current = Number(reports[0].judgeSummary?.averageTotal || 0);
  const previous = Number(reports[1].judgeSummary?.averageTotal || 0);
  const diff = round(current - previous);
  if (diff > 0) return `+${diff}`;
  return String(diff);
}

function renderReportInsights(report) {
  if (!report) return "";
  const results = report.results || [];
  const weakDimensions = findWeakJudgeDimensions(results).slice(0, 3);
  const allIssues = topItems(results.flatMap((result) => result.judge?.issues || []), 4);
  const allSuggestions = topItems(results.flatMap((result) => result.judge?.promptSuggestions || []), 4);
  return `
    <section class="insight-grid">
      <article>
        <div class="insight-head"><span>Weak Dimensions</span><b>低分维度</b></div>
        <div class="weak-list">
          ${weakDimensions.map((item) => `<p><b>${escapeHtml(item.name)}</b><span>${item.average}/5，优先看这个维度的 Prompt 约束。</span></p>`).join("") || `<p><b>暂无</b><span>最新批次还没有模型维度分。</span></p>`}
        </div>
      </article>
      <article>
        <div class="insight-head"><span>Top Issues</span><b>主要问题</b></div>
        ${renderCompactList(allIssues)}
      </article>
      <article>
        <div class="insight-head"><span>Prompt Actions</span><b>迭代建议</b></div>
        ${renderCompactList(allSuggestions)}
      </article>
    </section>
  `;
}

function topItems(items, limit) {
  return items.filter(Boolean).slice(0, limit);
}

function renderCompactList(items) {
  return `<ul class="compact-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("") || "<li>暂无模型评审内容</li>"}</ul>`;
}

function findWeakJudgeDimensions(results) {
  const rows = new Map();
  results.forEach((result) => {
    (result.judge?.dimensionScores || []).forEach((item) => {
      const row = rows.get(item.id) || { id: item.id, name: item.name, total: 0, count: 0 };
      row.total += Number(item.score || 0);
      row.count += 1;
      rows.set(item.id, row);
    });
  });
  return [...rows.values()]
    .map((item) => ({ ...item, average: round(item.total / Math.max(item.count, 1)) }))
    .sort((a, b) => a.average - b.average);
}

function renderBenchmarkReport(report) {
  const judged = report.results?.filter((result) => result.judge).length || 0;
  const total = report.results?.length || 0;
  return `
    <details class="report-card" ${report === benchmarkData?.reports?.[0] ? "open" : ""}>
      <summary class="report-head">
        <div>
          <span>${escapeHtml(new Date(report.generatedAt).toLocaleString())}</span>
          <h3>${escapeHtml(formatReportTitle(report))}</h3>
          <p>${escapeHtml(report.mode || "legacy")} ${report.judgeModel ? `/ ${escapeHtml(report.judgeModel)}` : ""} / ${judged}/${total} cases judged</p>
        </div>
        <div class="report-score">
          <b>${report.judgeSummary?.averageTotal || "-"}</b>
          <span>${escapeHtml(report.judgeSummary?.grade || "待评")}</span>
        </div>
      </summary>
      <div class="case-result-list">
        ${(report.results || []).map((result) => renderCaseCard(result)).join("")}
      </div>
    </details>
  `;
}

function formatReportTitle(report) {
  if (report.mode === "live_judge_prompt_iteration_remaining_4_rejudge") return "Judge Prompt 校准后重评 · 剩余 4 个";
  if (report.mode === "live_judge_prompt_iteration_remaining_4") return "Prompt 迭代后评审批次 · 剩余 4 个";
  if (report.mode === "live_judge_partial") return "模型评审批次 · 部分完成";
  if (report.results?.length === 1) return `单用例验证 · ${report.results[0].name || report.results[0].id}`;
  if (report.mode === "live_judge") return "模型评审批次";
  if (report.mode === "live") return "Agent 输出批次";
  return report.file || "历史批次";
}

function renderRunLog(allReports, visibleReports) {
  const visibleFiles = new Set(visibleReports.map((report) => report.file));
  const hidden = allReports.filter((report) => !visibleFiles.has(report.file));
  if (!hidden.length) return "";
  return `
    <details class="run-log">
      <summary>运行日志：失败批次与旧版报告（${hidden.length}）</summary>
      <div class="run-log-list">
        ${hidden.map((report) => `
          <div>
            <b>${escapeHtml(report.file)}</b>
            <span>${escapeHtml(report.mode || "legacy")} / ${escapeHtml(new Date(report.generatedAt).toLocaleString())} / errors ${(report.results || []).filter((item) => item.error || item.judgeError).length}</span>
          </div>
        `).join("")}
      </div>
    </details>
  `;
}

function renderCaseCard(result) {
  return `
    <details class="case-result-card">
      <summary class="case-result-head">
        <div>
          <span>${escapeHtml(result.platform || "未知平台")}</span>
          <h4>${escapeHtml(result.name)}</h4>
          <p>${escapeHtml(result.judge?.summary || result.judgeError || result.error || "待模型评审")}</p>
        </div>
        <div class="case-score">
          <b>${result.judge?.total || "-"}</b>
          <span>${escapeHtml(result.judge?.grade || "待评")}</span>
        </div>
      </summary>
      <div class="case-result-body">
        ${result.error ? `<div class="detail-alert"><b>运行失败</b><span>${escapeHtml(result.error)}</span></div>` : ""}
        ${renderJudgeDetail(result)}
        <details class="score-detail generated-fold">
          <summary>查看 Agent 原始输出</summary>
          ${renderGeneratedOutput(result)}
        </details>
      </div>
      </details>
  `;
}

function renderJudgeSummary(result) {
  if (!result.judge) {
    const message = result.judgeError ? `模型评审失败：${result.judgeError}` : "运行 eval:judge 后展示。";
    return `<div class="detail-alert"><b>还没有模型评审</b><span>${escapeHtml(message)}</span></div>`;
  }
  return `
    <div class="judge-summary">
      <b>${escapeHtml(result.judge.summary || "模型已完成评审")}</b>
      <p>${(result.judge.issues || []).slice(0, 2).map(escapeHtml).join("；") || "暂无主要问题"}</p>
    </div>
  `;
}

function renderJudgeDetail(result) {
  const judge = result.judge;
  if (!judge) return "";
  return `
    <section class="judge-detail">
      <div class="judge-detail-head">
        <div>
          <span>LLM Judge</span>
          <h5>${judge.total}/100 · ${escapeHtml(judge.grade)}</h5>
        </div>
        <p>${escapeHtml(judge.summary || "")}</p>
      </div>
      <div class="judge-columns">
        <article class="positive"><span>优点</span>${listItems(judge.strengths)}</article>
        <article class="negative"><span>问题</span>${listItems(judge.issues)}</article>
        <article class="action"><span>Prompt 迭代建议</span>${listItems(judge.promptSuggestions)}</article>
      </div>
      <div class="dimension-result-list">
        ${(judge.dimensionScores || []).map((score) => `
          <article class="dimension-result">
            <div>
              <span>${escapeHtml(score.name)}</span>
              <b>${score.score}/5</b>
            </div>
            <p>${escapeHtml(score.reason)}</p>
            ${score.evidence?.length ? `<small>证据：${score.evidence.map(escapeHtml).join("；")}</small>` : ""}
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function listItems(items) {
  return `<ul>${(items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("") || "<li>暂无</li>"}</ul>`;
}

function renderGeneratedOutput(result) {
  const output = result.generatedOutput;
  if (!output) return renderMissingOutput();
  const plan = output.plan || {};
  const content = output.content || {};
  const review = output.review || {};
  const positioning = plan.positioning || {};
  const diagnosis = plan.diagnosis || {};
  return `
    <section class="generated-output">
      <h5>本次 Agent 生成内容</h5>
      <div class="generated-grid">
        <article>
          <span>Agent 诊断</span>
          <b>${escapeHtml(positioning.headline || diagnosis.mainBlocker || "暂无诊断标题")}</b>
          <p>${escapeHtml(diagnosis.strategy || positioning.diagnosis || positioning.playbook || "暂无诊断说明")}</p>
        </article>
        <article>
          <span>账号定位/打法</span>
          <b>${escapeHtml(positioning.headline || "暂无定位")}</b>
          <p>${escapeHtml(positioning.userNeed || positioning.playbook || "暂无打法建议")}</p>
        </article>
        <article>
          <span>内容成稿</span>
          <b>${escapeHtml(content.selectedTopic?.title || content.note?.postTitle || content.article?.articleTitle || content.video?.title || "暂无内容标题")}</b>
          <p>${escapeHtml(extractContentPreview(content))}</p>
        </article>
        <article>
          <span>复盘结果</span>
          <b>${escapeHtml(review.review?.summary || "暂无复盘结论")}</b>
          <p>${escapeHtml(review.review?.nextAction || review.nextTask?.whyNext || "暂无下一步动作")}</p>
        </article>
      </div>
      <div class="task-detail">
        <h6>7 天增长任务</h6>
        ${(plan.tasks || []).map((task, index) => `
          <div class="task-row">
            <span>Day ${task.day || index + 1}</span>
            <b>${escapeHtml(task.title || "未命名任务")}</b>
            <p>${escapeHtml(task.goal || "")} / ${escapeHtml(task.material || "")} / ${escapeHtml(task.publishMetric || "")}</p>
          </div>
        `).join("") || `<p class="detail-note">暂无 7 天任务。</p>`}
      </div>
    </section>
  `;
}

function renderMissingOutput() {
  return `
    <div class="detail-alert">
      <b>缺少生成内容快照</b>
      <span>这份数据还没有保存 Agent 原始输出。重新运行 <code>npm run eval:live -- --timeout-ms=240000</code> 后，会展示诊断、7 天任务、生成内容和复盘结果。</span>
    </div>
  `;
}

function extractContentPreview(content) {
  if (content.note?.body) return content.note.body.slice(0, 180);
  if (content.article?.intro) return content.article.intro.slice(0, 180);
  if (content.article?.sections?.[0]?.body) return content.article.sections[0].body.slice(0, 180);
  if (content.video?.script?.[0]?.voice) return content.video.script.map((item) => item.voice).join(" ").slice(0, 180);
  if (content.longVideo?.opening) return content.longVideo.opening.slice(0, 180);
  return "暂无内容预览";
}

function renderLiveFeedback() {
  const runs = liveData?.runs || [];
  $("primaryContent").innerHTML = `
    <div class="workflow-strip">
      <article><b>自动回流</b><span>用户在前台完成方案、内容或复盘时，自动写入快照。</span></article>
      <article><b>样本筛选</b><span>后续按低分、异常平台、人工反馈挑样本进入复核队列。</span></article>
      <article><b>校准闭环</b><span>对比用户真实反馈、模型评审和人工标注，反向迭代 Prompt。</span></article>
    </div>
    <div class="runs-list">
      ${runs.map((run) => renderLiveRun(run)).join("") || `<div class="empty-state">还没有线上快照。先回到主应用生成一次方案、内容或复盘。</div>`}
    </div>
  `;
}

function renderLiveRun(run) {
  const result = run.result || {};
  return `
    <article class="run-card">
      <div class="run-meta">
        <span>${escapeHtml(new Date(run.createdAt).toLocaleString())}</span>
        <b>${result.total || 0}</b>
        <span>${escapeHtml(run.stage)} / ${escapeHtml(run.profile?.platform || "")}</span>
      </div>
      <div class="run-body">
        <h3>${escapeHtml(run.profile?.niche || "GrowthMate")}｜${escapeHtml(run.profile?.bottleneck || "评测快照")}</h3>
        <p>这类数据未来用于观察线上真实分布，并进入 LLM Judge 或人工复核队列。</p>
      </div>
      <div class="grade">${escapeHtml(result.grade || "-")}</div>
    </article>
  `;
}

function latestGroupScores() {
  const results = benchmarkData?.reports?.[0]?.results || [];
  if (!results.length) return [];
  const groups = results[0].groupScores || [];
  return groups.map((group) => {
    const values = results
      .map((result) => result.groupScores?.find((item) => item.id === group.id))
      .filter(Boolean);
    const weightedScore = round(values.reduce((sum, item) => sum + item.weightedScore, 0) / Math.max(values.length, 1));
    return { ...group, weightedScore, score: round((weightedScore / group.weight) * 5) };
  });
}

function renderLayers() {
  const latestGroups = latestGroupScores();
  const groups = benchmarkData?.rubric?.groups || caseData?.rubric?.groups || [];
  $("layerGrid").innerHTML = groups.map((group) => {
    const score = latestGroups.find((item) => item.id === group.id);
    return `
      <article class="layer-card">
        <h3>${escapeHtml(group.name)}</h3>
        <strong>${score ? `${score.weightedScore}/${score.weight}` : "-"}</strong>
        <p>${escapeHtml(group.description)}</p>
      </article>
    `;
  }).join("") || `<div class="empty-state">暂无层级数据</div>`;
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

function round(value) {
  return Math.round(value * 10) / 10;
}

async function refresh() {
  try {
    await loadAll();
    render();
  } catch (error) {
    $("primaryContent").innerHTML = `<div class="empty-state">评测后台读取失败：${escapeHtml(error.message)}</div>`;
  }
}

document.querySelectorAll(".eval-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    currentView = tab.dataset.view;
    render();
  });
});
$("refreshButton").addEventListener("click", refresh);
refresh();
