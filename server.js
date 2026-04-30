const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const dataDir = path.join(root, "data");
const generationStore = path.join(dataDir, "generations.jsonl");

loadEnv(path.join(root, ".env.local"));
loadEnv(path.join(root, ".env"));

const port = Number(process.env.PORT || 5173);
const host = process.env.HOST || "0.0.0.0";
const model = process.env.KIMI_MODEL || "kimi-k2.6";
const kimiBaseUrl = process.env.KIMI_BASE_URL || "https://api.moonshot.cn/v1";
const historyToken = process.env.HISTORY_TOKEN || "";
const rateLimitWindowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);
const rateLimitMax = Number(process.env.RATE_LIMIT_MAX || 12);
const rateLimitStore = new Map();

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8"
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

    if (req.method === "GET" && url.pathname === "/api/history") {
      if (!historyToken || req.headers.authorization !== `Bearer ${historyToken}`) {
        sendJson(res, 404, { error: "Not found" });
        return;
      }
      sendJson(res, 200, readHistory());
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/health") {
      sendJson(res, 200, {
        ok: true,
        model,
        kimiConfigured: Boolean(process.env.KIMI_API_KEY)
      });
      return;
    }

    if (req.method === "GET") {
      serveStatic(url.pathname, res);
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

function serveStatic(requestPath, res) {
  const normalized = requestPath === "/" ? "/index.html" : requestPath;
  const decodedPath = decodeURIComponent(normalized);
  const relativePath = decodedPath.replace(/^\/+/, "");
  const filePath = path.resolve(root, relativePath);
  const relativeToRoot = path.relative(root, filePath);
  const allowedFiles = new Set(["index.html", "styles.css", "script.js"]);
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
    res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
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
  return callKimi([
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
  ]).then((content) => normalizePlan(parseModelJson(content), data));
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

async function callKimi(messages) {
  const apiKey = process.env.KIMI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing KIMI_API_KEY. Create .env.local from .env.example and restart the server.");
  }

  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.6,
      response_format: { type: "json_object" },
      thinking: { type: "disabled" },
      messages
    })
  };

  let response;
  try {
    response = await fetch(`${kimiBaseUrl.replace(/\/$/, "")}/chat/completions`, request);
  } catch (error) {
    console.warn(`Kimi request failed once, retrying: ${error.message}`);
    response = await fetch(`${kimiBaseUrl.replace(/\/$/, "")}/chat/completions`, request);
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
请基于下面的 KOC 画像生成一个起号方案：

个人背景：${data.profile || "未填写"}
目标人群：${data.audience || "未填写"}
内容赛道：${data.niche || "未填写"}
账号阶段：${data.stage || "未填写"}
内容优势：${data.edge || "未填写"}
当前最大卡点：${data.bottleneck || "未填写"}
已有素材：${data.assets || "未填写"}
主平台：${data.platform || "未填写"}
内容形式：${data.format || "未填写"}
变现目标：${data.goal || "未填写"}
每周投入：${data.timeBudget || "未填写"}
当前卡点：${data.pain || "未填写"}

平台适配要求：
${platformGuide.plan}

请输出 JSON，结构必须是：
{
  "research": [
    {"title": "趋势观察", "body": "一句具体观察"},
    {"title": "相似打法", "body": "一句具体打法"},
    {"title": "平台提醒", "body": "一句具体提醒"}
  ],
  "positioning": {
    "headline": "一句账号定位",
    "diagnosis": "一段基于用户背景/阶段/素材的诊断，指出为什么不能做泛方向",
    "tags": ["标签1", "标签2", "标签3", "标签4"],
    "metrics": [
      {"value": "4", "label": "内容支柱"},
      {"value": "7", "label": "天选题计划"},
      {"value": "3-5小时", "label": "适配投入"}
    ],
    "userNeed": "目标用户真实需求",
    "pillars": ["内容支柱1", "内容支柱2", "内容支柱3", "内容支柱4"],
    "playbook": "具体打法建议，说明前两周先做什么、不做什么"
  },
  "topics": [
    {
      "title": "选题标题",
      "category": "类别",
      "stage": "建立信任/验证方向/轻转化",
      "intent": "这条内容要解决什么用户心理或账号目标",
      "whyNow": "为什么放在这个顺序，而不是后面发",
      "contentType": "图文/短视频/口播",
      "reason": "推荐理由",
      "interaction": "收藏/评论/私信/转发"
    }
  ],
  "content": {
    "graphicTitle": "图文标题",
    "graphicSteps": ["完整图文结构1", "完整图文结构2", "完整图文结构3", "完整图文结构4", "结尾互动"],
    "videoTitle": "视频标题",
    "videoSteps": ["0-3秒开头", "3-15秒场景", "15-40秒主体", "40-60秒收尾"]
  },
  "publish": {
    "titles": ["标题A", "标题B", "标题C"],
    "suggestions": ["发布建议1", "发布建议2", "发布建议3"],
    "interactions": ["互动建议1", "互动建议2", "互动建议3"],
    "series": ["延展选题1", "延展选题2", "延展选题3"]
  }
}

topics 必须给 7 个。顺序必须有阶段逻辑：前2条建立信任，中间3条验证方向，最后2条轻转化或系列延展。标题和内容形式必须符合主平台，不要一律写成小红书风格。`;
}

function buildContentPrompt(data) {
  const topic = data.topic || {};
  const platformGuide = getPlatformGuide(data.platform);
  return `
请为下面这个 KOC 选题生成完整内容交付。

用户画像：
个人背景：${data.profile || "未填写"}
目标人群：${data.audience || "未填写"}
内容赛道：${data.niche || "未填写"}
账号阶段：${data.stage || "未填写"}
内容优势：${data.edge || "未填写"}
当前卡点：${data.bottleneck || "未填写"}
已有素材：${data.assets || "未填写"}
主平台：${data.platform || "未填写"}
变现目标：${data.goal || "未填写"}

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

请输出 JSON：
{
  "selectedTopic": {
    "title": "选题标题",
    "strategy": "为什么这条内容应该这样写，说明内容逻辑"
  },
  "graphic": {
    "coverTitle": "平台需要封面时写封面主标题；公众号可写文章摘要标题",
    "coverSubtitle": "平台需要封面时写封面副标题；公众号可写导语摘要",
    "postTitle": "发布标题",
    "body": "完整正文，分段清楚，可直接发布。公众号至少 900 字，其他平台至少 500 字",
    "imagePlan": ["配图/配图位/公众号插图建议1", "配图建议2", "配图建议3", "配图建议4"],
    "tags": ["平台适合的话题或栏目标签1", "标签2", "标签3", "标签4"]
  },
  "video": {
    "hook": "0-3秒开头台词",
    "script": [
      {"time": "0-3秒", "voice": "口播台词", "visual": "画面建议", "subtitle": "字幕重点"},
      {"time": "3-15秒", "voice": "口播台词", "visual": "画面建议", "subtitle": "字幕重点"},
      {"time": "15-40秒", "voice": "口播台词", "visual": "画面建议", "subtitle": "字幕重点"},
      {"time": "40-60秒", "voice": "口播台词", "visual": "画面建议", "subtitle": "字幕重点"}
    ],
    "shotList": ["镜头1", "镜头2", "镜头3", "镜头4"]
  },
  "publish": {
    "titles": ["标题A", "标题B", "标题C"],
    "bestTime": "发布时间建议",
    "firstComment": "首评建议",
    "interactionQuestion": "结尾互动问题",
    "nextRevision": "如果用户想改，第一优先改哪里"
  }
}

如果用户只要图文，video 也保留但可以简短；如果只要视频，graphic 也保留但可以简短。正文和脚本必须具体，不能只写结构。严禁把所有平台都写成小红书种草笔记。`;
}

function getPlatformGuide(platform) {
  const guides = {
    "公众号": {
      plan: "公众号是订阅和长文阅读场景，重点看标题打开率、导语、正文结构、读完率和收藏转发。选题应偏深度复盘、经验文章、系列栏目，不要写成小红书封面笔记或话题标签堆砌。",
      content: "公众号内容必须像一篇完整文章：给出标题、导语、分节小标题、连续正文、结尾总结和关注/留言引导。正文少用小红书式 emoji 和强网感短句，不要强调首图封面，不要输出小红书话题标签；配图建议应是文中插图、截图、表格或分割图。"
    },
    "小红书": {
      plan: "小红书是双列信息流和搜索场景，重点看首图、标题、收藏、评论。选题适合清单、模板、避坑、真实截图和强场景。",
      content: "小红书内容要有封面标题、副标题、正文分点、配图计划和话题标签。可以使用更强的标题钩子，但不要过度标题党。"
    },
    "视频号": {
      plan: "视频号偏熟人推荐和信任表达，重点看真实口播、持续更新、私域承接。选题适合真实经历、观点复盘和可持续栏目。",
      content: "视频号内容优先生成口播脚本、镜头节奏、字幕重点和结尾私域/评论引导；图文部分可作为视频号文案说明，不要写成小红书笔记。"
    },
    "抖音": {
      plan: "抖音是短视频强分发场景，重点看前3秒、完播率、冲突和转折。选题适合强钩子、明确情绪和快速信息密度。",
      content: "抖音内容优先生成 60 秒以内脚本、强钩子、分镜、字幕和互动口播；图文部分只作为发布文案辅助。"
    },
    "B站": {
      plan: "B站偏中长视频和陪伴感，重点看结构完整、信息密度和人设可信度。选题适合完整复盘、教程、横评和系列内容。",
      content: "B站内容应生成更完整的视频结构、章节标题、口播稿和素材清单；图文部分可作为视频简介和专栏摘要。"
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

  return {
    research: Array.isArray(plan.research) ? plan.research.slice(0, 3) : [],
    positioning: plan.positioning || {},
    topics,
    content: plan.content || {},
    publish: plan.publish || {}
  };
}

function normalizeContent(plan, data) {
  return {
    selectedTopic: plan.selectedTopic || {
      title: data.topic?.title || "当前选题",
      strategy: data.topic?.whyNow || data.topic?.reason || "围绕当前选题生成内容。"
    },
    graphic: plan.graphic || {},
    video: plan.video || {},
    publish: plan.publish || {}
  };
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
