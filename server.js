const http = require("http");
const fs = require("fs");
const path = require("path");
const { buildEvalCaseFromProfile, scoreCase, summarize } = require("./eval/evaluator");

const root = __dirname;
const dataDir = path.join(root, "data");
const generationStore = path.join(dataDir, "generations.jsonl");
const evalStore = path.join(dataDir, "eval-runs.jsonl");
const rubricPath = path.join(root, "eval", "rubric.json");
const evalReportsDir = path.join(root, "eval", "reports");

loadEnv(path.join(root, ".env.local"));
loadEnv(path.join(root, ".env"));

const port = Number(process.env.PORT || 5173);
const host = process.env.HOST || "0.0.0.0";
const model = process.env.KIMI_MODEL || "kimi-k2.6";
const kimiBaseUrl = process.env.KIMI_BASE_URL || "https://api.moonshot.cn/v1";
const historyToken = process.env.HISTORY_TOKEN || "";
const rateLimitWindowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);
const rateLimitMax = Number(process.env.RATE_LIMIT_MAX || 12);
const kimiTimeoutMs = Number(process.env.KIMI_TIMEOUT_MS || 180_000);
const rateLimitStore = new Map();

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png"
};

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === "POST" && url.pathname === "/api/generate") {
      if (!checkRateLimit(req, res)) return;
      const payload = await readJson(req);
      const result = await generatePlan(payload);
      saveGeneration(payload, result);
      sendJson(res, 200, result);
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/content") {
      if (!checkRateLimit(req, res)) return;
      const payload = await readJson(req);
      const result = await generateContent(payload);
      sendJson(res, 200, result);
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/review") {
      if (!checkRateLimit(req, res)) return;
      const payload = await readJson(req);
      const result = await generateReview(payload);
      saveReview(payload, result);
      sendJson(res, 200, result);
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/eval/snapshot") {
      const payload = await readJson(req);
      const result = saveEvalSnapshot(payload);
      sendJson(res, 200, result);
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/eval/runs") {
      sendJson(res, 200, readEvalRuns());
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/eval/cases") {
      sendJson(res, 200, readEvalCases());
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/eval/cases") {
      const payload = await readJson(req);
      sendJson(res, 200, saveEvalCase(payload));
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/eval/benchmarks") {
      sendJson(res, 200, readBenchmarkReports());
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/history") {
      if (!historyToken || req.headers.authorization !== `Bearer ${historyToken}`) {
        sendJson(res, 404, { error: "Not found" });
        return;
      }
      sendJson(res, 200, readHistory());
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/health") {
      const health = {
        ok: true,
        model,
        kimiConfigured: Boolean(process.env.KIMI_API_KEY)
      };
      if (url.searchParams.get("probe") === "1") {
        try {
          const content = await callKimi([
            { role: "system", content: "你是服务健康检查助手。只输出严格 JSON，不要 markdown。" },
            { role: "user", content: "请输出 {\"ok\":true,\"message\":\"pong\"}" }
          ]);
          health.kimiProbe = { ok: true, sample: content.slice(0, 200) };
        } catch (error) {
          health.kimiProbe = { ok: false, error: error.message };
        }
      }
      sendJson(res, 200, health);
      return;
    }

    if (req.method === "GET" || req.method === "HEAD") {
      serveStatic(url.pathname, res, req.method === "HEAD");
      return;
    }

    sendJson(res, 405, { error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    sendJson(res, 500, {
      error: "Server error",
      message: error.message,
      code: error.code || "SERVER_ERROR"
    });
  }
});

server.listen(port, host, () => {
  console.log(`KOC demo running at http://${host}:${port}`);
});

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

function serveStatic(requestPath, res, headOnly = false) {
  const normalized = requestPath === "/" ? "/index.html" : requestPath === "/eval" ? "/eval-dashboard.html" : requestPath;
  const decodedPath = decodeURIComponent(normalized);
  const relativePath = decodedPath.replace(/^\/+/, "");
  const filePath = path.resolve(root, relativePath);
  const relativeToRoot = path.relative(root, filePath);
  const allowedFiles = new Set(["index.html", "styles.css", "script.js", "eval-dashboard.html", "eval-dashboard.css", "eval-dashboard.js", "growthmate-logo.svg", "growthmate-logo.png"]);
  const isAllowedAsset = relativeToRoot.startsWith(`assets${path.sep}`);

  if (
    relativeToRoot.startsWith("..") ||
    path.isAbsolute(relativeToRoot) ||
    (!allowedFiles.has(relativeToRoot) && !isAllowedAsset)
  ) {
    sendText(res, 403, "Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      sendText(res, 404, "Not found");
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
      "Content-Length": content.length
    });
    if (headOnly) {
      res.end();
      return;
    }
    res.end(content);
  });
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        reject(new Error("Request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function checkRateLimit(req, res) {
  const now = Date.now();
  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";
  const current = rateLimitStore.get(ip);

  if (!current || now - current.startedAt > rateLimitWindowMs) {
    rateLimitStore.set(ip, { startedAt: now, count: 1 });
    return true;
  }

  current.count += 1;
  if (current.count > rateLimitMax) {
    sendJson(res, 429, { error: "Too many requests", message: "请求过于频繁，请稍后再试。" });
    return false;
  }

  return true;
}

async function generatePlan(data) {
  try {
    return await callKimi([
      {
        role: "system",
        content: [
          "你是资深 KOC 内容增长产品经理。",
          "只输出严格 JSON，不要 markdown。",
          "建议必须基于用户画像、阶段、素材、痛点，具体可执行。",
          "不要声称真实抓取平台数据，只能做平台经验推断。"
        ].join("\n")
      },
      {
        role: "user",
        content: buildPrompt(data)
      }
    ], { maxTokens: 2200, timeoutMs: 55_000 }).then((content) => normalizePlan(parseModelJson(content), data));
  } catch (error) {
    if (!String(error.message || "").includes("timeout")) throw error;
    return buildFastPlan(data);
  }
}

async function generateContent(data) {
  return callKimi([
    {
      role: "system",
      content: [
        "你是资深 KOC 内容主编和短视频编导。",
        "只输出严格 JSON，不要 markdown。",
        "必须生成可直接发布或拍摄的内容，避免大纲式空话。",
        "内容要贴合用户画像、选题阶段、已有素材、平台风格。"
      ].join("\n")
    },
    {
      role: "user",
      content: buildContentPrompt(data)
    }
  ]).then((content) => normalizeContent(parseModelJson(content), data));
}

async function generateReview(data) {
  return callKimi([
    {
      role: "system",
      content: [
        "你是 KOC 内容增长复盘 Agent。",
        "只输出严格 JSON，不要 markdown。",
        "必须基于发布数据、评论反馈、用户画像和原始选题判断下一步。",
        "不要声称真实抓取平台数据，只能分析用户手动输入的数据。"
      ].join("\n")
    },
    {
      role: "user",
      content: buildReviewPrompt(data)
    }
  ]).then((content) => normalizeReview(parseModelJson(content), data));
}

async function callKimi(messages, options = {}) {
  const apiKey = process.env.KIMI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing KIMI_API_KEY. Create .env.local from .env.example and restart the server.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs || kimiTimeoutMs);
  const request = {
    method: "POST",
    signal: controller.signal,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.6,
      max_tokens: options.maxTokens,
      response_format: { type: "json_object" },
      thinking: { type: "disabled" },
      messages
    }, (key, value) => value === undefined ? undefined : value)
  };

  let response;
  try {
    response = await fetch(`${kimiBaseUrl.replace(/\/$/, "")}/chat/completions`, request);
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(`Kimi API timeout after ${kimiTimeoutMs}ms`);
    }
    console.warn(`Kimi request failed once, retrying: ${error.message}`);
    response = await fetch(`${kimiBaseUrl.replace(/\/$/, "")}/chat/completions`, request);
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Kimi API ${response.status}: ${text.slice(0, 300)}`);
  }

  const json = await response.json();
  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new Error("Kimi API returned empty content");

  return content;
}

function buildPrompt(data) {
  const platformGuide = getPlatformGuide(data.platform);
  return `
请基于下面画像生成“首屏快速版”KOC 起号方案。目标是 60 秒内返回可演示结果；完整正文会在内容生成页单独生成。

个人背景：${data.profile || "未填写"}
目标人群：${data.audience || "未填写"}
用户最需要你的时刻：${data.audienceMoment || "未填写"}
内容赛道：${data.niche || "未填写"}
账号阶段：${data.stage || "未填写"}
内容优势：${data.edge || "未填写"}
当前最大卡点：${data.bottleneck || "未填写"}
已有素材：${data.assets || "未填写"}
最有把握连续讲的经历：${data.story || "未填写"}
内容边界：${data.contentBoundary || "未填写"}
主平台：${data.platform || "未填写"}
内容形式：${data.format || "未填写"}
变现目标：${data.goal || "未填写"}
每周投入：${data.timeBudget || "未填写"}
当前卡点：${data.pain || "未填写"}

平台适配要求：
${platformGuide.plan}
平台选题类型必须贴合：${platformGuide.topicTypes}

硬性要求：
1. 只输出严格 JSON，不要 markdown。
2. 语句短，禁止长段落。除数组外，每个字符串尽量 15-45 个汉字；diagnosis/playbook 可 60-90 字。
3. 必须绑定用户输入里的背景、目标人群、用户时刻、已有素材或变现目标，不能泛泛讲赛道。
4. 冷启动观察指标只能写低样本信号，例如“是否有人追问模板”“收藏/点赞相对变化”，不要写绝对高 KPI。
5. research 只能写“基于平台公开内容观察/用户素材推断”，不能伪装真实抓取数据。
6. topics 必须 7 个；前 2 条建立信任，中间 3 条验证方向，最后 2 条轻转化/系列化。
7. 不要输出 tasks，后端会根据 topics 自动生成每日任务，避免首屏超时。

请输出 JSON，结构必须是：
{
  "agentTrace": [
    {"step": "诊断", "thought": "一句判断", "action": "一句动作"},
    {"step": "规划", "thought": "一句判断", "action": "一句动作"}
  ],
  "diagnosis": {
    "stageAssessment": "一句阶段判断",
    "mainBlocker": "一句阻塞点",
    "usableAssets": ["素材1", "素材2", "素材3"],
    "strategy": "一句第一周策略",
    "avoid": ["不建议1", "不建议2"],
    "nextPriority": "一句优先动作"
  },
  "research": [
    {"title": "趋势观察", "source": "平台公开内容观察/用户素材推断", "body": "一句观察"},
    {"title": "相似打法", "source": "平台公开内容观察/用户素材推断", "body": "一句打法"},
    {"title": "平台提醒", "source": "平台公开内容观察/用户素材推断", "body": "一句提醒"}
  ],
  "positioning": {
    "headline": "一句账号定位",
    "diagnosis": "60-90字，说明为什么不能做泛方向",
    "tags": ["标签1", "标签2", "标签3", "标签4"],
    "metrics": [
      {"value": "4", "label": "内容支柱"},
      {"value": "7", "label": "天选题计划"},
      {"value": "3-5小时", "label": "适配投入"}
    ],
    "userNeed": "一句真实需求",
    "pillars": ["内容支柱1", "内容支柱2", "内容支柱3", "内容支柱4"],
    "playbook": "60-90字，说明前两周先做什么、不做什么"
  },
  "topics": [
    {
      "title": "选题标题",
      "category": "类别",
      "stage": "建立信任/验证方向/轻转化",
      "intent": "一句目的",
      "whyNow": "一句顺序理由",
      "contentType": "${platformGuide.topicTypes}",
      "reason": "一句推荐理由",
      "material": "一句可用素材",
      "interaction": "收藏/评论/私信/转发"
    }
  ],
  "publish": {
    "titles": ["标题A", "标题B", "标题C"],
    "suggestions": ["发布建议1", "发布建议2", "发布建议3"],
    "interactions": ["互动建议1", "互动建议2", "互动建议3"],
    "series": ["延展选题1", "延展选题2", "延展选题3"]
  }
}`;
}

function buildFastPlan(data) {
  const platformGuide = getPlatformGuide(data.platform);
  const audienceMoment = data.audienceMoment || data.pain || "用户最需要帮助的具体时刻";
  const audience = data.audience || "目标用户";
  const assets = data.assets || data.story || "已有经历、截图或复盘记录";
  const niche = data.niche || "内容";
  const platform = data.platform || "小红书";
  const baseTopics = [
    ["建立信任", `我为什么开始记录${audienceMoment}`, "真实经历"],
    ["建立信任", `${audience}最容易踩的3个坑`, "避坑笔记"],
    ["验证方向", `用${assets}做一次真实复盘`, "真实记录"],
    ["验证方向", `${audienceMoment}时我会先看这张清单`, "清单模板"],
    ["验证方向", `同样是${niche}内容，为什么这条更适合你`, "测评对比"],
    ["轻转化", `把这周最高频问题整理成模板`, "清单模板"],
    ["轻转化", `下一周继续更新的${platform}系列`, "系列栏目"]
  ];
  const topics = baseTopics.map(([stage, title, category], index) => ({
    title,
    category,
    stage,
    intent: index < 2 ? "先建立可信人设" : index < 5 ? "验证用户真实需求" : "沉淀系列心智",
    whyNow: index < 2 ? "冷启动先证明你有真实经历" : index < 5 ? "用不同内容形态测试反馈" : "把有效方向做成可追更资产",
    contentType: platformGuide.topicTypes.split("/")[0] || data.format || "图文笔记",
    reason: `绑定${audienceMoment}和${assets}，避免泛泛讲${niche}`,
    material: assets,
    interaction: index < 5 ? "收藏/评论" : "评论/私信"
  }));
  return normalizePlan({
    agentTrace: [
      {
        step: "诊断",
        thought: `Agent 已进入快速规划模式，先用用户画像生成可执行路径。`,
        action: "先给出稳定起号方案，完整内容可在下一步继续生成。"
      },
      {
        step: "规划",
        thought: `围绕${audienceMoment}，用${assets}做7天低成本验证。`,
        action: "生成一周增长任务，完整内容仍可单独调用大模型。"
      }
    ],
    diagnosis: {
      stageAssessment: data.stage || "有素材但方向需要验证的冷启动期",
      mainBlocker: data.bottleneck || "定位和选题还没有绑定到用户最需要的时刻",
      usableAssets: [assets, data.profile || "个人经历", data.goal || "商业目标"].filter(Boolean).slice(0, 3),
      strategy: `先用${assets}建立信任，再测试${audienceMoment}下的收藏和评论信号。`,
      avoid: ["不要做泛泛赛道科普", "不要一上来硬转化"],
      nextPriority: "先跑完7天任务，找到评论区最高频需求。"
    },
    research: [
      {
        title: "趋势观察",
        source: "用户素材推断",
        body: `${audienceMoment}是更适合搜索和收藏的强场景。`
      },
      {
        title: "相似打法",
        source: "平台公开内容观察",
        body: `${platform}冷启动更适合用真实截图、清单和复盘建立信任。`
      },
      {
        title: "平台提醒",
        source: "平台公开内容观察",
        body: "首周重点看评论追问和收藏比例，不看绝对涨粉。"
      }
    ],
    positioning: {
      headline: `${audienceMoment}时能被想起的${niche}记录者`,
      diagnosis: `用户不是缺少内容方向，而是缺少一个能被目标用户记住的具体时刻。把${audienceMoment}和${assets}绑定后，账号会比泛泛讲${niche}更可信，也更容易产生评论追问。`,
      tags: [niche, audience, "真实记录", "低成本验证"].filter(Boolean).slice(0, 4),
      metrics: [
        { value: "4", label: "内容支柱" },
        { value: "7", label: "天选题计划" },
        { value: data.timeBudget || "3-5小时", label: "适配投入" }
      ],
      userNeed: `${audience}需要在${audienceMoment}时获得具体、可信、可照做的建议。`,
      pillars: ["真实经历", "避坑清单", "素材复盘", "系列模板"],
      playbook: `前两周先做${platform}轻量内容，不追求大制作。每天围绕一个具体痛点发布，用评论追问决定下一条，把有效格式沉淀成系列。`
    },
    topics,
    publish: {
      titles: topics.slice(0, 3).map((topic) => topic.title),
      suggestions: ["首图突出具体痛点和真实素材", "结尾只问一个容易回答的问题", "前7天先看反馈再扩写正文"],
      interactions: ["置顶回复收集下一条需求", "把求模板评论沉淀成系列", "优先回复同类追问"],
      series: ["真实记录系列", "避坑清单系列", "评论区答疑系列"]
    }
  }, data);
}

function buildContentPrompt(data) {
  const topic = data.topic || {};
  const platformGuide = getPlatformGuide(data.platform);
  return `
请为下面这个 KOC 选题生成完整内容交付。

用户画像：
个人背景：${data.profile || "未填写"}
目标人群：${data.audience || "未填写"}
用户最需要你的时刻：${data.audienceMoment || "未填写"}
内容赛道：${data.niche || "未填写"}
账号阶段：${data.stage || "未填写"}
内容优势：${data.edge || "未填写"}
当前卡点：${data.bottleneck || "未填写"}
已有素材：${data.assets || "未填写"}
最有把握连续讲的经历：${data.story || "未填写"}
内容边界：${data.contentBoundary || "未填写"}
主平台：${data.platform || "未填写"}
变现目标：${data.goal || "未填写"}
关键记忆点/必须自然出现的元素：${formatList(data.mustMention)}
需要规避的表达：${formatList(data.avoid)}

选题：
标题：${topic.title || "未填写"}
类别：${topic.category || "未填写"}
阶段：${topic.stage || "未填写"}
目的：${topic.intent || "未填写"}
为什么现在发：${topic.whyNow || "未填写"}
推荐理由：${topic.reason || "未填写"}

用户要生成的形式：${data.contentMode || "图文 + 视频"}

平台适配要求：
${platformGuide.content}

写作要求：
1. 正文和脚本必须显式使用用户已有素材或经历，不要写成泛泛教程。
2. 开头要命中“用户最需要你的时刻”，让目标用户觉得这是在说自己。
3. 全文遵守内容边界：${data.contentBoundary || "不要装专家，优先真实、具体、可执行"}。
4. 结尾互动要能收集下一条内容线索，而不是泛泛求点赞关注。
5. 如果正文里提出模板、方法论、步骤或表格，字段名和数量必须前后一致；标题、正文、首评、复盘建议不能出现“四栏/五列”等互相矛盾的表达。
6. 指标和互动设计必须匹配平台内容形态。图文不要写“完播率”，短视频不要写“读完率”，公众号不要写“小红书首图停留”。
7. 发布文案或首评要预埋评论区反馈路径：明确问用户一个可回答的问题，并给出可置顶回复方向。
8. 关键记忆点必须自然进入标题、正文/脚本或发布文案，不能只出现在素材清单里；如果某个关键词不适合逐字出现，要用同义表达并说明。
9. 需要规避的表达不能出现，尤其不能保证涨粉、保证效果、伪装医学/专业诊断或虚构平台数据。

请输出 JSON：
{
  "selectedTopic": {
    "title": "选题标题",
    "strategy": "为什么这条内容应该这样写，说明内容逻辑"
  },
  ${platformGuide.contentSchema},
  "publish": {
    "titles": ["标题A", "标题B", "标题C"],
    "bestTime": "发布时间建议",
    "firstComment": "首评建议",
    "interactionQuestion": "结尾互动问题",
    "expectedComments": ["预判评论1", "预判评论2", "预判评论3"],
    "nextRevision": "如果用户想改，第一优先改哪里"
  }
}

只输出上面结构，不要额外输出其他同级字段。正文和脚本必须具体，不能只写结构。严禁把所有平台都写成小红书种草笔记。`;
}

function buildReviewPrompt(data) {
  const topic = data.topic || {};
  const metrics = data.metrics || {};
  return `
请基于下面的 KOC 内容发布数据做一次复盘，并给出下一条内容任务。

用户画像：
个人背景：${data.profile || "未填写"}
目标人群：${data.audience || "未填写"}
内容赛道：${data.niche || "未填写"}
账号阶段：${data.stage || "未填写"}
内容优势：${data.edge || "未填写"}
当前卡点：${data.bottleneck || "未填写"}
已有素材：${data.assets || "未填写"}
主平台：${data.platform || "未填写"}
内容边界：${data.contentBoundary || "未填写"}

已发布选题：
标题：${topic.title || "未填写"}
阶段/目标：${topic.stage || topic.goal || "未填写"}
为什么当时发布：${topic.whyNow || topic.whyThisTask || topic.reason || "未填写"}
使用素材：${topic.material || "未填写"}
用户实际发布稿：
${metrics.actualPublishedContent || data.actualPublishedContent || "未填写"}

Agent 建议稿/生成稿（仅用于对比，不等于用户真实发布稿）：
${summarizeGeneratedContent(data.content)}

关键记忆点/必须检查的元素：${formatList(data.mustMention)}
需要规避的表达：${formatList(data.avoid)}

发布数据（用户手动输入，不代表平台实时抓取）：
曝光/阅读：${metrics.views || "未填写"}
点赞：${metrics.likes || "未填写"}
收藏：${metrics.saves || "未填写"}
评论：${metrics.comments || "未填写"}
转发：${metrics.shares || "未填写"}
完播率/读完率：${metrics.completionRate || "未填写"}
典型评论反馈：${metrics.commentSamples || "未填写"}

分析要求：
1. 先判断这条内容的问题更可能出在标题、开头、选题、素材、内容结构、互动设计还是账号定位。
2. 必须解释判断依据，依据只能来自用户输入的数据、实际发布稿和评论反馈。
3. 给出下一条内容任务，说明继续、改写、扩展还是换方向。
4. 给出一个 Prompt 迭代提示，方便后续做评分体系和提示词评测。
5. 必须先校验平台指标类型：${data.platform || "当前平台"} 的内容形态是什么，就只能使用对应指标。图文/公众号用读完率、收藏、评论、转发；短视频用完播率、3 秒留存、评论触发。不要混用。
6. 复盘不能把“没有数据来源”的判断写成事实。所有归因必须标注来自“发布数据”“评论样本”“实际发布稿”或“用户画像”的哪一类证据。
7. 下一条 observeMetric 必须是可执行的观察信号，不要写不现实的绝对高 KPI。冷启动场景优先写“是否出现同类追问”“收藏/点赞相对变化”“评论是否索要模板/清单”。
8. 如果发现实际发布稿和原方案在方法论字段、步骤数量或核心概念上不一致，必须把它作为内容结构问题指出。
9. 必须严格区分“用户实际发布稿”和“Agent 建议稿/生成稿”：用户实际发布稿是复盘的一手证据，Agent 建议稿只能作为对比基准。不能把 Agent 建议稿里的内容当成用户已经发布的内容。
10. evidence 每条都要标注证据来源，例如【发布数据】、【评论样本】、【实际发布稿】、【Agent建议稿】。如果实际发布稿信息不足，要明确说“实际发布稿不足以支持该归因”，不能擅自补全。
11. 复盘时要检查关键记忆点是否在实际发布稿中出现。如果没有出现，要说明它可能如何影响用户理解或互动。

请输出 JSON：
{
  "review": {
    "summary": "一句话复盘结论",
    "diagnosis": "具体诊断",
    "bottleneck": "标题/开头/选题/素材/内容结构/互动设计/账号定位",
    "evidence": ["依据1", "依据2", "依据3"],
    "nextAction": "下一步应该怎么做"
  },
  "nextTask": {
    "title": "下一条推荐选题",
    "goal": "下一条内容目标",
    "format": "建议形式",
    "material": "建议使用素材",
    "whyNext": "为什么下一条这样做",
    "observeMetric": "下一条发布后重点观察什么",
    "commentPlan": "下一条如何预埋评论区反馈"
  },
  "promptIterationHint": {
    "issue": "这次输出或发布暴露的策略问题",
    "suggestion": "后续同类 Prompt 应该强化什么"
  }
}`;
}

function getPlatformGuide(platform) {
  const guides = {
    "公众号": {
      plan: "公众号是订阅和长文阅读场景，核心是标题打开率、导语承诺、正文结构、读完率、收藏转发和留言。选题偏深度复盘、经验文章、系列专栏、案例拆解、问题答疑；不要写成小红书封面笔记、话题标签堆砌或短视频脚本。",
      topicTypes: "深度复盘/经验文章/系列专栏/案例拆解/问题答疑",
      content: "公众号内容必须像一篇完整文章：标题准确克制，导语提出问题和阅读收益，正文有分节小标题、连续论述、具体案例或素材，结尾总结并引导留言。不要输出小红书话题标签，不要强调首图封面；图片应作为文中插图、表格、截图或分割图。",
      contentSchema: `"article": {
    "articleTitle": "公众号文章标题，准确清晰，避免标题党",
    "dek": "摘要/导语，用 80-120 字说明问题、冲突和读者收益",
    "intro": "正式开头，像公众号文章而不是笔记",
    "sections": [
      {"heading": "分节小标题", "body": "连续正文段落，必须结合用户素材或经历", "insert": "这一节适合插入的截图/表格/案例"}
    ],
    "pullQuotes": ["可加粗引用句1", "可加粗引用句2"],
    "ending": "结尾总结和关注/留言引导",
    "mediaPlan": ["文中插图/表格/截图建议1", "建议2", "建议3"]
  }`
    },
    "小红书": {
      plan: "小红书是双列信息流、搜索和种草场景，核心是首图停留、标题搜索感、收藏、评论和真实生活证据。选题适合清单、模板、避坑、真实截图、测评对比、强场景经验。",
      topicTypes: "图文笔记/清单模板/避坑笔记/测评对比/短视频笔记",
      content: "小红书内容要有封面标题、副标题、正文分点、配图计划和话题标签。标题可以更有钩子，但必须真实具体；正文要像一个人分享经验，不要写成公众号长文。",
      contentSchema: `"note": {
    "coverTitle": "首图主标题，短、有场景、有搜索词",
    "coverSubtitle": "首图副标题",
    "postTitle": "发布标题",
    "body": "小红书正文，分点清楚，至少 500 字，具体到步骤和素材",
    "imagePlan": ["首图建议", "第2图建议", "第3图建议", "第4图建议"],
    "tags": ["话题标签1", "标签2", "标签3", "标签4"]
  }`
    },
    "视频号": {
      plan: "视频号偏微信生态、熟人推荐和信任表达，核心是真实口播、观点稳定、持续更新、评论/私域承接。选题适合真实经历、观点复盘、案例拆解、连续栏目和轻私域转化。",
      topicTypes: "口播视频/观点复盘/案例拆解/系列栏目/直播预热",
      content: "视频号优先生成真实口播脚本、镜头节奏、字幕重点和结尾评论/私域承接。语气更稳、更可信，不要写成抖音式强冲突，也不要写成小红书笔记。",
      contentSchema: `"video": {
    "title": "视频号标题",
    "hook": "开头 3 秒口播，真实具体，不夸张",
    "script": [
      {"time": "0-5秒", "voice": "口播台词", "visual": "画面建议", "subtitle": "字幕重点"},
      {"time": "5-25秒", "voice": "口播台词", "visual": "画面建议", "subtitle": "字幕重点"},
      {"time": "25-55秒", "voice": "口播台词", "visual": "画面建议", "subtitle": "字幕重点"}
    ],
    "caption": "视频号发布文案",
    "shotList": ["镜头1", "镜头2", "镜头3"],
    "commentPrompt": "评论或私域承接问题"
  }`
    },
    "抖音": {
      plan: "抖音是短视频强分发场景，核心是前3秒、完播率、节奏、情绪冲突、转折和互动。选题适合强钩子、明确痛点、快速信息密度、对比反差、评论触发。",
      topicTypes: "短视频脚本/强钩子口播/对比反差/剧情演绎/评论答疑",
      content: "抖音内容优先生成 60 秒以内脚本，必须有强钩子、节奏分镜、字幕重点、转折和互动口播。不要生成公众号长文或小红书配图笔记。",
      contentSchema: `"video": {
    "title": "抖音视频标题",
    "hook": "0-3秒强钩子",
    "script": [
      {"time": "0-3秒", "voice": "口播台词", "visual": "画面建议", "subtitle": "字幕重点"},
      {"time": "3-15秒", "voice": "口播台词", "visual": "画面建议", "subtitle": "字幕重点"},
      {"time": "15-40秒", "voice": "口播台词", "visual": "画面建议", "subtitle": "字幕重点"},
      {"time": "40-60秒", "voice": "口播台词", "visual": "画面建议", "subtitle": "字幕重点"}
    ],
    "shotList": ["镜头1", "镜头2", "镜头3", "镜头4"],
    "caption": "短发布文案",
    "commentPrompt": "评论触发问题"
  }`
    },
    "B站": {
      plan: "B站偏中长视频、搜索和社区沉淀，核心是标题封面、开场承诺、章节结构、信息密度、弹幕互动和人设可信度。选题适合完整复盘、教程、横评、系列内容、资料整理。",
      topicTypes: "中长视频/教程拆解/完整复盘/横评对比/系列企划",
      content: "B站内容应生成中长视频结构：标题、封面文案、开场承诺、章节、口播大纲、素材清单、简介和弹幕互动点。不要写成 60 秒短视频，也不要写成小红书笔记。",
      contentSchema: `"longVideo": {
    "title": "B站视频标题",
    "coverText": "封面主文案",
    "opening": "前30秒开场承诺",
    "chapters": [
      {"time": "00:00", "heading": "章节标题", "talkingPoints": ["要点1", "要点2"], "material": "素材/画面建议"}
    ],
    "description": "视频简介",
    "danmakuPrompts": ["弹幕互动点1", "互动点2"],
    "assetList": ["素材1", "素材2", "素材3"]
  }`
    }
  };
  return guides[platform] || guides["小红书"];
}

function parseModelJson(content) {
  try {
    return JSON.parse(content);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Model did not return JSON");
    return JSON.parse(match[0]);
  }
}

function normalizePlan(plan, data) {
  const topics = Array.isArray(plan.topics) ? plan.topics.slice(0, 7) : [];
  while (topics.length < 7) {
    topics.push({
      title: `${data.niche || "内容"}选题 ${topics.length + 1}`,
      category: "补充选题",
      reason: "根据用户定位补足一周更新节奏。",
      interaction: "评论",
      stage: topics.length < 2 ? "建立信任" : topics.length < 5 ? "验证方向" : "轻转化",
      intent: "补足一周更新节奏。",
      whyNow: "按照起号路径递进安排。",
      contentType: "图文"
    });
  }

  const tasks = Array.isArray(plan.tasks) && plan.tasks.length
    ? plan.tasks.slice(0, 7)
    : topics.map((topic, index) => ({
      day: index + 1,
      goal: topic.stage || (index < 2 ? "建立信任" : index < 5 ? "验证方向" : "轻转化"),
      title: topic.title,
      category: topic.category || "增长任务",
      contentType: topic.contentType || data.format || "图文",
      whyThisTask: topic.whyNow || topic.reason || "按照起号路径递进安排。",
      material: topic.material || topic.firstMaterial || topic.proof || data.assets || "用一条真实经历或截图做证据。",
      publishMetric: index < 2 ? "重点看评论共鸣和关注转化" : index < 5 ? "重点看收藏、评论问题和转发" : "重点看私信、咨询和转化反馈",
      nextSignal: "根据评论区最高频问题延展下一条内容。",
      interaction: topic.interaction || "评论"
    }));
  while (tasks.length < 7) {
    const index = tasks.length;
    const topic = topics[index] || topics[0] || {};
    tasks.push({
      day: index + 1,
      goal: topic.stage || (index < 2 ? "建立信任" : index < 5 ? "验证方向" : "轻转化"),
      title: topic.title || `${data.niche || "内容"}增长任务 ${index + 1}`,
      category: topic.category || "增长任务",
      contentType: topic.contentType || data.format || "图文",
      whyThisTask: topic.whyNow || topic.reason || "按照起号路径递进安排。",
      material: topic.material || data.assets || "用一条真实经历或截图做证据。",
      publishMetric: index < 2 ? "重点看评论共鸣和关注转化" : index < 5 ? "重点看收藏、评论问题和转发" : "重点看私信、咨询和转化反馈",
      nextSignal: "根据评论区最高频问题延展下一条内容。",
      interaction: topic.interaction || "评论"
    });
  }
  tasks.forEach((task, index) => {
    task.publishMetric = calibratePublishMetric(task.publishMetric, data, index);
    task.commentPlan = task.commentPlan || {
      expectedComments: ["求模板/清单", "追问具体做法", "分享自己的类似情况"],
      pinnedReply: "置顶回复一个可继续追问的问题，引导用户说出下一条最想看的细节。"
    };
  });

  return {
    agentTrace: Array.isArray(plan.agentTrace) ? plan.agentTrace.slice(0, 4) : [
      {
        step: "诊断",
        thought: `基于“${data.stage || "当前阶段"}”和“${data.bottleneck || "当前卡点"}”判断起号阻塞点。`,
        action: "先生成账号切口和第一周低成本验证路径。"
      },
      {
        step: "规划",
        thought: "第一周先建立信任，再验证方向，最后轻转化或系列延展。",
        action: "把选题包装成每天可执行的增长任务。"
      }
    ],
    diagnosis: plan.diagnosis || {
      stageAssessment: data.stage || "准备起号阶段",
      mainBlocker: data.bottleneck || "定位和选题还不够具体",
      usableAssets: [data.assets || "真实经历", data.story || "复盘笔记"].filter(Boolean),
      strategy: "先用真实经历建立可信度，再用模板和复盘内容验证方向。",
      avoid: ["不要一开始做泛泛干货", "不要过早硬转化"],
      nextPriority: "完成第一周低成本内容验证。"
    },
    research: Array.isArray(plan.research)
      ? plan.research.slice(0, 3).map((item) => ({
        title: item.title || "观察",
        source: item.source || "基于用户输入和平台公开内容观察",
        body: item.body || item.observation || ""
      }))
      : [],
    positioning: plan.positioning || {},
    topics,
    tasks,
    content: {},
    publish: plan.publish || {}
  };
}

function normalizeContent(plan, data) {
  const publish = plan.publish || {};
  publish.expectedComments = Array.isArray(publish.expectedComments) && publish.expectedComments.length
    ? publish.expectedComments.slice(0, 3)
    : ["求具体模板", "追问适用场景", "分享自己的类似情况"];
  publish.firstComment = publish.firstComment || "我会把大家追问最多的问题整理成下一条，先想看模板还是案例？";
  const mustMention = toStringList(data.mustMention);
  const selectedTopic = plan.selectedTopic || {
    title: data.topic?.title || "当前选题",
    strategy: data.topic?.whyNow || data.topic?.reason || "围绕当前选题生成内容。"
  };
  const note = plan.note || {};
  if (isXhsLike(data.platform) && !note.body) {
    note.body = buildFallbackNoteBody(data, selectedTopic, mustMention);
  }
  const article = plan.article || {};
  if (data.platform === "公众号" && !article.intro && !article.sections?.length) {
    article.articleTitle = article.articleTitle || selectedTopic.title;
    article.intro = buildFallbackIntro(data, selectedTopic, mustMention);
    article.sections = [
      {
        heading: "先把问题说具体",
        body: buildFallbackNoteBody(data, selectedTopic, mustMention),
        insert: data.assets || "用户已有素材截图"
      }
    ];
  }
  const video = plan.video || {};
  if (isVideoPlatform(data.platform) && (!Array.isArray(video.script) || !video.script.length)) {
    video.title = video.title || selectedTopic.title;
    video.hook = video.hook || `如果你也遇到${data.bottleneck || "这个问题"}，先别急着换方向。`;
    video.script = [
      {
        time: "0-5秒",
        voice: video.hook,
        visual: data.assets || "展示真实素材",
        subtitle: selectedTopic.title
      },
      {
        time: "5-35秒",
        voice: buildFallbackNoteBody(data, selectedTopic, mustMention),
        visual: "切换素材细节和操作过程",
        subtitle: "用真实素材讲清楚方法"
      },
      {
        time: "35-60秒",
        voice: "你更想看模板、避坑还是完整过程？我会按评论最多的方向继续更。",
        visual: "评论区问题截图或口播收尾",
        subtitle: "评论区决定下一条"
      }
    ];
  }
  return {
    selectedTopic,
    article,
    note,
    longVideo: plan.longVideo || {},
    graphic: plan.graphic || {},
    video,
    publish
  };
}

function normalizeReview(plan, data) {
  return {
    review: plan.review || {
      summary: "这条内容需要结合更多发布数据继续判断。",
      diagnosis: "当前数据不足，先从标题点击、收藏价值和评论反馈三个方向排查。",
      bottleneck: "内容结构",
      evidence: ["用户输入的数据较少", "暂未看到足够评论样本"],
      nextAction: "下一条优先做更具体、更可保存的内容。"
    },
    nextTask: plan.nextTask || {
      title: data.topic?.title ? `${data.topic.title} 的模板版延展` : "把高频问题整理成一条模板内容",
      goal: "提高收藏和评论",
      format: data.platform === "公众号" ? "结构化长文" : "图文模板",
      material: data.assets || data.topic?.material || "已有素材和评论问题",
      whyNext: "用更可保存的结构验证用户是否愿意继续互动。",
      observeMetric: "重点观察收藏/点赞相对关系，以及评论里是否出现同类追问。",
      commentPlan: "结尾直接问用户最想要模板、案例还是避坑清单，并置顶回复承接。"
    },
    promptIterationHint: plan.promptIterationHint || {
      issue: "暂未形成正式评分标准。",
      suggestion: "后续建立评测集时，将标题、结构、素材绑定和互动设计纳入指标。"
    }
  };
}

function calibratePublishMetric(metric, data, index) {
  const raw = String(metric || "");
  const hasHighAbsolute = /(?:收藏|评论|点赞|转发|私信)[^，。；;]{0,8}(?:超过|达到|大于|>|≥)?\s*(?:50|100|200|500|1000)/.test(raw);
  const isColdStart = /准备起号|还没|冷启动|零粉|起号/.test(`${data.stage || ""} ${data.bottleneck || ""}`);
  if (hasHighAbsolute || (isColdStart && /\d{2,}/.test(raw))) {
    return index < 2
      ? "重点看是否出现 2-3 条同类追问、评论是否表达共鸣，不设绝对高 KPI。"
      : "重点看收藏/点赞相对关系、评论是否索要模板或细节，不用绝对数判断成败。";
  }
  if (!raw) {
    return index < 2
      ? "重点看评论共鸣、关注转化和是否有人追问细节。"
      : "重点看收藏/点赞相对关系、评论问题和转发意愿。";
  }
  return raw;
}

function formatList(value) {
  const list = toStringList(value);
  return list.length ? list.join("、") : "无";
}

function summarizeGeneratedContent(content) {
  if (!content) return "未提供";
  const chunks = [];
  if (content.selectedTopic?.title) chunks.push(`选题：${content.selectedTopic.title}`);
  if (content.note?.postTitle || content.note?.body) chunks.push(`小红书稿：${[content.note.postTitle, content.note.body].filter(Boolean).join(" / ").slice(0, 500)}`);
  if (content.article?.articleTitle || content.article?.intro) chunks.push(`公众号稿：${[content.article.articleTitle, content.article.intro].filter(Boolean).join(" / ").slice(0, 500)}`);
  if (content.video?.title || content.video?.script) {
    const script = Array.isArray(content.video.script) ? content.video.script.map((item) => item.voice).join(" ") : "";
    chunks.push(`视频稿：${[content.video.title, content.video.hook, script].filter(Boolean).join(" / ").slice(0, 500)}`);
  }
  return chunks.length ? chunks.join("\n") : JSON.stringify(content).slice(0, 800);
}

function isXhsLike(platform) {
  return platform === "小红书";
}

function isVideoPlatform(platform) {
  return ["抖音", "视频号", "B站"].includes(platform);
}

function buildFallbackNoteBody(data, topic, mustMention) {
  const terms = mustMention.length ? `这条内容要自然带出：${mustMention.join("、")}。` : "";
  return [
    `这条先不讲大道理，直接从“${data.bottleneck || "当前卡点"}”切入。`,
    `我的背景是${data.profile || "普通创作者"}，想服务的是${data.audience || "有相似问题的人"}。`,
    `这次会用到的素材是：${data.assets || "已有真实经历和截图"}。${terms}`,
    `具体做法是先把场景讲清楚，再给一个低成本动作，最后请评论区选择下一条想看的方向。`
  ].join("\n");
}

function buildFallbackIntro(data, topic, mustMention) {
  const terms = mustMention.length ? `文中会围绕 ${mustMention.join("、")} 展开。` : "";
  return `很多人卡在“${data.bottleneck || "不知道怎么开始"}”，不是因为没有努力，而是没有把场景、素材和下一步动作拆开。${terms}`;
}

function saveGeneration(input, output) {
  try {
    fs.mkdirSync(dataDir, { recursive: true });
    const record = {
      id: cryptoId(),
      createdAt: new Date().toISOString(),
      input: {
        profile: input.profile,
        audience: input.audience,
        niche: input.niche,
        stage: input.stage,
        edge: input.edge,
        bottleneck: input.bottleneck,
        assets: input.assets,
        story: input.story,
        audienceMoment: input.audienceMoment,
        contentBoundary: input.contentBoundary,
        platform: input.platform,
        format: input.format,
        goal: input.goal,
        timeBudget: input.timeBudget,
        pain: input.pain
      },
      output
    };
    fs.appendFileSync(generationStore, `${JSON.stringify(record)}\n`, "utf8");
  } catch (error) {
    console.warn(`Could not save generation history: ${error.message}`);
  }
}

function saveReview(input, output) {
  try {
    fs.mkdirSync(dataDir, { recursive: true });
    const record = {
      id: cryptoId(),
      type: "review",
      createdAt: new Date().toISOString(),
      input: {
        profile: input.profile,
        audience: input.audience,
        niche: input.niche,
        platform: input.platform,
        topic: input.topic,
        metrics: input.metrics
      },
      output
    };
    fs.appendFileSync(generationStore, `${JSON.stringify(record)}\n`, "utf8");
  } catch (error) {
    console.warn(`Could not save review history: ${error.message}`);
  }
}

function saveEvalSnapshot(payload) {
  const rubric = readRubric();
  const profile = payload.profile || {};
  const output = {
    plan: payload.plan || {},
    content: payload.content || {},
    review: payload.review || {}
  };
  const evalCase = buildEvalCaseFromProfile(profile, payload.stage || "snapshot");
  if (payload.metrics) evalCase.reviewMetrics = payload.metrics;
  const result = scoreCase(evalCase, rubric, output);
  const record = {
    id: cryptoId(),
    type: "eval",
    stage: payload.stage || "snapshot",
    createdAt: new Date().toISOString(),
    profile: {
      niche: profile.niche,
      platform: profile.platform,
      stage: profile.stage,
      bottleneck: profile.bottleneck
    },
    summary: summarize([result]),
    result
  };

  try {
    fs.mkdirSync(dataDir, { recursive: true });
    fs.appendFileSync(evalStore, `${JSON.stringify(record)}\n`, "utf8");
  } catch (error) {
    console.warn(`Could not save eval snapshot: ${error.message}`);
  }

  return record;
}

function readEvalRuns() {
  try {
    if (!fs.existsSync(evalStore)) {
      return {
        rubric: readRubricMeta(),
        summary: { caseCount: 0, averageTotal: 0, grade: "F", lowestCases: [] },
        runs: []
      };
    }
    const runs = fs
      .readFileSync(evalStore, "utf8")
      .trim()
      .split(/\n+/)
      .filter(Boolean)
      .slice(-50)
      .map((line) => JSON.parse(line))
      .reverse();
    const results = runs.map((item) => item.result).filter(Boolean);
    return {
      rubric: readRubricMeta(),
      summary: summarize(results),
      runs
    };
  } catch (error) {
    return {
      rubric: readRubricMeta(),
      summary: { caseCount: 0, averageTotal: 0, grade: "F", lowestCases: [] },
      runs: [],
      error: error.message
    };
  }
}

function readBenchmarkReports() {
  try {
    if (!fs.existsSync(evalReportsDir)) {
      return {
        rubric: readRubricMeta(),
        summary: { caseCount: 0, averageTotal: 0, grade: "F", lowestCases: [] },
        reports: []
      };
    }
    const reports = fs
      .readdirSync(evalReportsDir)
      .filter((file) => file.endsWith(".json"))
      .map((file) => {
        const filePath = path.join(evalReportsDir, file);
        const report = JSON.parse(fs.readFileSync(filePath, "utf8"));
        return {
          file,
          generatedAt: report.generatedAt,
          mode: report.mode || "legacy",
          baseUrl: report.baseUrl,
          summary: report.summary,
          judgeSummary: report.judgeSummary,
          judgeModel: report.judgeModel,
          results: report.results || []
        };
      })
      .filter((report) => report.mode !== "demo")
      .sort((a, b) => String(b.generatedAt).localeCompare(String(a.generatedAt)))
      .slice(0, 20);
    return {
      rubric: readRubricMeta(),
      caseSet: readEvalCaseMeta(),
      summary: reports[0]?.summary || { caseCount: 0, averageTotal: 0, grade: "F", lowestCases: [] },
      reports
    };
  } catch (error) {
    return {
      rubric: readRubricMeta(),
      caseSet: readEvalCaseMeta(),
      summary: { caseCount: 0, averageTotal: 0, grade: "F", lowestCases: [] },
      reports: [],
      error: error.message
    };
  }
}

function readEvalCases() {
  try {
    const cases = JSON.parse(fs.readFileSync(path.join(root, "eval", "cases.json"), "utf8"));
    const latestReport = readLatestBenchmarkReport();
    const latestResults = new Map((latestReport?.results || []).map((result) => [result.id, result]));
    return {
      rubric: readRubricMeta(),
      generatedAt: latestReport?.generatedAt || null,
      mode: latestReport?.mode || null,
      cases: cases.map((item) => {
        const result = latestResults.get(item.id);
        return {
          id: item.id,
          name: item.name,
          profile: item.profile || {},
          whySelected: item.whySelected || "",
          reviewMetrics: item.reviewMetrics || {},
          mustMention: item.mustMention || [],
          avoid: item.avoid || [],
          latestResult: result ? {
            total: result.total,
            grade: result.grade,
            judge: result.judge || null,
            judgeError: result.judgeError || "",
            generatedOutput: result.generatedOutput || null,
            missingMustMention: result.missingMustMention || [],
            avoidHits: result.avoidHits || []
          } : null
        };
      })
    };
  } catch (error) {
    return {
      rubric: readRubricMeta(),
      generatedAt: null,
      mode: null,
      cases: [],
      error: error.message
    };
  }
}

function saveEvalCase(payload) {
  const casesPath = path.join(root, "eval", "cases.json");
  const cases = JSON.parse(fs.readFileSync(casesPath, "utf8"));
  const profile = payload.profile || {};
  const nowId = `custom_${Date.now().toString(36)}`;
  const evalCase = {
    id: String(payload.id || nowId).trim(),
    name: String(payload.name || `${profile.niche || "自定义"}评测用例`).trim(),
    profile: {
      profile: profile.profile || "",
      audience: profile.audience || "",
      niche: profile.niche || "",
      edge: profile.edge || "",
      stage: profile.stage || "",
      bottleneck: profile.bottleneck || "",
      assets: profile.assets || "",
      story: profile.story || "",
      audienceMoment: profile.audienceMoment || "",
      contentBoundary: profile.contentBoundary || "",
      platform: profile.platform || "",
      format: profile.format || "",
      goal: profile.goal || "",
      timeBudget: profile.timeBudget || "",
      pain: profile.pain || ""
    },
    whySelected: String(payload.whySelected || "手动新增，用于补充冷启动评测覆盖。").trim(),
    reviewMetrics: payload.reviewMetrics || {
      views: "",
      likes: "",
      saves: "",
      comments: "",
      shares: "",
      completionRate: "",
      commentSamples: "",
      actualPublishedContent: ""
    },
    mustMention: toStringList(payload.mustMention),
    avoid: toStringList(payload.avoid)
  };

  if (!evalCase.id || cases.some((item) => item.id === evalCase.id)) {
    evalCase.id = nowId;
  }
  cases.push(evalCase);
  fs.writeFileSync(casesPath, `${JSON.stringify(cases, null, 2)}\n`, "utf8");
  return { ok: true, case: evalCase };
}

function toStringList(value) {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  return String(value || "")
    .split(/[,\n，、]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function readLatestBenchmarkReport() {
  if (!fs.existsSync(evalReportsDir)) return null;
  const latestFile = fs
    .readdirSync(evalReportsDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const filePath = path.join(evalReportsDir, file);
      const report = JSON.parse(fs.readFileSync(filePath, "utf8"));
      return { file, report };
    })
    .filter((item) => (item.report.mode || "legacy") !== "demo")
    .sort((a, b) => String(b.report.generatedAt).localeCompare(String(a.report.generatedAt)))[0];
  return latestFile?.report || null;
}

function readRubric() {
  return JSON.parse(fs.readFileSync(rubricPath, "utf8"));
}

function readRubricMeta() {
  const rubric = readRubric();
  return {
    version: rubric.version,
    totalScore: rubric.totalScore,
    groups: rubric.groups.map((group) => ({
      id: group.id,
      name: group.name,
      weight: group.weight,
      description: group.description
    })),
    dimensions: rubric.dimensions.map((dimension) => ({
      id: dimension.id,
      groupId: dimension.groupId,
      name: dimension.name,
      weight: dimension.weight,
      definition: dimension.definition,
      criteria: dimension.criteria || [],
      scoreGuide: dimension.scoreGuide || {}
    }))
  };
}

function readEvalCaseMeta() {
  try {
    const cases = JSON.parse(fs.readFileSync(path.join(root, "eval", "cases.json"), "utf8"));
    return cases.map((item) => ({
      id: item.id,
      name: item.name,
      platform: item.profile?.platform,
      niche: item.profile?.niche,
      stage: item.profile?.stage,
      bottleneck: item.profile?.bottleneck,
      whySelected: item.whySelected || "",
      mustMention: item.mustMention || [],
      avoid: item.avoid || []
    }));
  } catch {
    return [];
  }
}

function readHistory() {
  try {
    if (!fs.existsSync(generationStore)) return [];
    return fs
      .readFileSync(generationStore, "utf8")
      .trim()
      .split(/\n+/)
      .filter(Boolean)
      .slice(-20)
      .map((line) => JSON.parse(line))
      .reverse();
  } catch {
    return [];
  }
}

function cryptoId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function sendJson(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

function sendText(res, status, text) {
  res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(text);
}
