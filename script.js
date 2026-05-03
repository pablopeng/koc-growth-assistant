const sample = {
  profile: "刚工作一年的女生，在互联网运营岗",
  audience: "刚入职场的新人、想提升效率和表达能力的大学生",
  niche: "职场成长",
  edge: "真实经历",
  stage: "准备起号，还没正式发布",
  bottleneck: "不知道自己该做什么定位",
  assets: "一些真实工作经历、工具使用截图、复盘笔记",
  story: "刚入职后如何拆任务、写复盘、用工具提效",
  audienceMoment: "刚遇到具体问题，不知道第一步怎么做",
  contentBoundary: "不装专家，只讲真实过程和可复制动作",
  platform: "小红书",
  format: "图文 + 短视频",
  goal: "接效率工具/课程类商单",
  timeBudget: "3-5 小时",
  pain: "不知道账号定位够不够清晰，每天选题靠刷平台，发完也不知道怎么复盘。"
};

const topicPools = {
  "职场成长": [
    [
    ["我用 3 个免费工具，把一周工作整理清楚了", "效率工具", "收藏", 91, 36],
    ["刚入职别急着表现，先做好这 4 件小事", "职场新人", "评论", 87, 28],
    ["我的低成本下班复盘模板，10 分钟就够", "自我管理", "保存", 84, 24],
    ["领导说“你看着办”时，我现在会这样拆任务", "职场沟通", "转发", 92, 42],
    ["普通运营岗也能做作品集：从这 5 个素材开始", "职业成长", "私信", 86, 39],
    ["把焦虑变成待办：我每周日都做这张表", "情绪管理", "收藏", 81, 22],
    ["新手 KOC 的第一条商业内容，别写成广告", "变现准备", "评论", 88, 44]
    ],
    [
    ["如果只能保留一个效率习惯，我会选这个", "强观点", "评论", 89, 25],
    ["入职第一年，我踩过的 6 个沟通坑", "避坑", "收藏", 93, 35],
    ["从 0 开始搭个人知识库，我建议先别买课", "工具方法", "转发", 86, 31],
    ["小红书职场号怎么起步：我的 7 天选题法", "起号", "保存", 90, 40],
    ["不会写周报的人，可以直接套这个结构", "模板", "收藏", 94, 20],
    ["为什么你很努力，但账号看起来没有记忆点", "定位", "评论", 88, 37],
    ["把一个普通选题改成系列内容，我会这样做", "内容运营", "私信", 85, 33]
    ]
  ],
  "健身减脂": [
    [
      ["上班族减脂别先买课，先改这 3 个晚餐习惯", "饮食", "收藏", 90, 28],
      ["我用 20 分钟居家训练，撑过了最忙的一周", "训练", "评论", 86, 31],
      ["体重没变但腰围小了，我才知道要看这 4 个指标", "复盘", "收藏", 88, 35],
      ["减脂期外卖怎么点：我的低成本菜单", "生活方式", "转发", 93, 26],
      ["新手最容易放弃的第 7 天，我这样继续下去", "陪伴记录", "评论", 84, 22],
      ["别再只做有氧了，新手力量训练从这 5 个动作开始", "知识科普", "收藏", 89, 39],
      ["一条真实减脂记录，怎么自然植入健康食品商单", "变现准备", "私信", 82, 43]
    ],
    [
      ["我不靠饿瘦，靠的是这张一周饮食表", "模板", "收藏", 92, 29],
      ["减脂失败不是懒，可能是目标设错了", "认知", "评论", 87, 33],
      ["女生新手健身房第一周，照这个顺序练", "新手指南", "保存", 91, 40],
      ["把奶茶换成这 3 个选择，我没有痛苦戒糖", "替代方案", "转发", 85, 21],
      ["平台上很火的减脂法，我试了 7 天后的真实感受", "测评", "评论", 88, 36],
      ["减脂 KOC 怎么做人设：别装自律，记录变化", "定位", "收藏", 83, 30],
      ["评论区最常问的 5 个减脂问题，一次讲清楚", "互动延展", "评论", 86, 27]
    ]
  ],
  "本地探店": [
    [
      ["这家店不适合约会，但很适合一个人放空", "场景", "评论", 88, 22],
      ["人均 40 的工作日午餐，我会不会二刷", "性价比", "收藏", 91, 27],
      ["别只拍门头，探店视频前 3 秒应该拍这里", "方法", "转发", 86, 34],
      ["周末半日路线：咖啡、展览和晚饭都安排好了", "路线", "收藏", 93, 38],
      ["新店开业不要急着夸，先看这 4 个细节", "测评", "评论", 87, 31],
      ["本地 KOC 第一条商单，怎么写得不像硬广", "变现准备", "私信", 84, 42],
      ["评论区问最多的停车和排队问题，我整理好了", "互动延展", "保存", 82, 20]
    ],
    [
      ["同一条街 3 家咖啡店，谁更适合办公", "横评", "收藏", 90, 36],
      ["这家店的真正卖点，不在菜单上", "洞察", "评论", 86, 28],
      ["探店别只说好吃，我用这张表判断值不值", "模板", "转发", 89, 26],
      ["预算 100 元的约会路线，真实踩点后这样排", "路线", "收藏", 92, 39],
      ["本地生活号怎么起号：先做 3 类稳定栏目", "起号", "保存", 88, 33],
      ["店家最喜欢的 KOC 内容，通常不是夸得最狠的", "商业", "私信", 85, 35],
      ["把一次普通吃饭，拆成 5 条内容", "系列化", "评论", 87, 24]
    ]
  ],
  "美妆护肤": [
    [
      ["新手护肤别叠太多，先把这 3 步做稳定", "新手", "收藏", 91, 25],
      ["一支口红怎么拍出 4 种内容角度", "内容方法", "转发", 85, 32],
      ["我的空瓶复盘：哪些会回购，哪些不会", "测评", "评论", 89, 29],
      ["通勤淡妆 10 分钟流程，适合赶早八和上班", "场景", "收藏", 93, 27],
      ["别被种草词绕晕，敏感肌先看这几个成分", "科普", "保存", 88, 38],
      ["美妆 KOC 接商单前，要先准备这 5 类素材", "变现准备", "私信", 84, 41],
      ["评论区问肤质，我会这样引导继续互动", "互动", "评论", 83, 22]
    ],
    [
      ["平价底妆真实通勤 8 小时，我只说缺点", "真实测评", "评论", 90, 35],
      ["新手眉毛总画脏，问题通常在这一步", "教程", "收藏", 87, 26],
      ["一套护肤品要不要买，我用这张表判断", "决策模板", "转发", 88, 30],
      ["美妆账号不是越精致越好，记忆点更重要", "定位", "评论", 85, 33],
      ["同一产品图文和短视频怎么分别写", "平台适配", "保存", 86, 37],
      ["别急着接广，先做 7 条建立信任的内容", "商业化", "私信", 89, 39],
      ["把粉丝提问变成下一条爆款选题", "互动延展", "收藏", 84, 21]
    ]
  ],
  "读书学习": [
    [
      ["一本书读完没输出，等于只完成了一半", "读书方法", "评论", 88, 24],
      ["我用 30 分钟做读书笔记，不追求漂亮", "效率", "收藏", 90, 27],
      ["备考焦虑时，先拆这张最小任务表", "学习计划", "保存", 92, 31],
      ["普通人做知识类 KOC，别一上来讲大道理", "定位", "评论", 86, 29],
      ["把一本书拆成 5 条内容：金句、案例、行动清单", "系列化", "转发", 89, 35],
      ["学习博主的第一条商单，怎么不伤信任", "变现准备", "私信", 83, 42],
      ["评论区说坚持不下去，我会这样回复", "互动", "评论", 84, 20]
    ],
    [
      ["我不再做满页笔记后，反而记得更牢", "反常识", "收藏", 91, 28],
      ["考前 7 天别乱刷题，先做这个排序", "备考", "保存", 93, 34],
      ["读书号怎么起步：先固定 3 个栏目", "起号", "收藏", 87, 30],
      ["把一个知识点讲给小白听，我会用这个结构", "表达", "转发", 89, 25],
      ["这类学习工具我会推荐，但不会硬夸", "测评", "评论", 85, 38],
      ["为什么你的学习内容有用，但没人看完", "内容优化", "评论", 88, 33],
      ["把粉丝的问题整理成一周选题", "互动延展", "私信", 86, 22]
    ]
  ]
};

let topicPoolIndex = 0;
let selectedTopicIndex = 0;
let wizardStep = 0;
let aiPlan = null;
let contentPlan = null;
let reviewPlan = null;
let contentMode = "图文 + 视频";
let isContentGenerating = false;
let isReviewGenerating = false;
let appMode = "idle";
let generationRequestId = 0;
let creatorProfile = { ...sample };
const wizardState = {
  niche: "职场成长",
  stage: "准备起号，还没正式发布",
  edge: "真实经历",
  bottleneck: "不知道自己该做什么定位",
  platform: "小红书",
  timeBudget: "3-5 小时",
  audienceMoment: "刚遇到具体问题，不知道第一步怎么做",
  contentBoundary: "不装专家，只讲真实过程和可复制动作"
};

const $ = (id) => document.getElementById(id);

const escapeHtml = (value) => String(value || "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

const sanitizeForHtml = (value) => {
  if (Array.isArray(value)) return value.map(sanitizeForHtml);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, sanitizeForHtml(item)])
    );
  }
  if (typeof value === "string") return escapeHtml(value);
  return value;
};

const getFormData = () => ({ ...creatorProfile });
const getSafeFormData = () => sanitizeForHtml(getFormData());
const isFileMode = () => window.location.protocol === "file:";
try {
  localStorage.removeItem("koc-growth-workspace-v1");
} catch {
  // Ignore storage access failures.
}

const syncWizardFromProfile = () => {
  const data = getFormData();
  Object.assign(wizardState, {
    niche: data.niche || wizardState.niche,
    stage: data.stage || wizardState.stage,
    edge: data.edge || wizardState.edge,
    bottleneck: data.bottleneck || wizardState.bottleneck,
    platform: data.platform || wizardState.platform,
    timeBudget: data.timeBudget || wizardState.timeBudget,
    audienceMoment: data.audienceMoment || wizardState.audienceMoment,
    contentBoundary: data.contentBoundary || wizardState.contentBoundary
  });
  if ($("wizardProfile")) $("wizardProfile").value = data.profile || "";
  if ($("wizardAudience")) $("wizardAudience").value = data.audience || "";
  if ($("wizardAssets")) $("wizardAssets").value = data.assets || "";
  if ($("wizardStory")) $("wizardStory").value = data.story || "";
};

const delay = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

const fallbackNicheRule = {
  userNeed: "目标用户需要更具体、更低门槛、更可复制的内容，而不是泛泛建议",
  contentPillars: ["真实经历", "方法模板", "测评避坑", "互动复盘"],
  similar: ["真实记录型账号", "方法模板型账号", "垂类测评型账号"],
  firstTopic: "从一个真实问题切入，验证用户最关心的痛点"
};

const getNicheRule = (niche) => nicheRules[niche] || fallbackNicheRule;
const getPlatformRule = (platform) => platformRules[platform] || platformRules["小红书"];
const getTopicPools = (niche) => topicPools[niche] || topicPools["职场成长"];
const getFallbackTopicPool = (data) => {
  const pools = getTopicPools(data.niche);
  return pools[topicPoolIndex % pools.length] || pools[0];
};

const setCreatorProfile = (profile) => {
  creatorProfile = { ...creatorProfile, ...profile };
  renderProfileSummary();
};

const postJsonWithRetry = async (url, payload, options = {}) => {
  const attempts = options.attempts || 2;
  let lastError = null;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        const message = error?.message || error?.error || `请求失败（HTTP ${response.status}）`;
        const apiError = new Error(message);
        apiError.status = response.status;
        throw apiError;
      }

      return response.json();
    } catch (error) {
      lastError = error;
      const shouldRetry = attempt < attempts && (!error.status || error.status >= 500);
      if (!shouldRetry) break;
      setApiStatus("首次请求未完成，正在自动重试一次...", "live");
      $("waitNote").textContent = "服务正在唤醒，已自动重试，请继续等待。";
      await delay(900);
    }
  }

  throw lastError;
};

const renderProfileSummary = () => {
  const data = getSafeFormData();
  const el = $("profileSummary");
  if (!el) return;
  el.innerHTML = `
    <div class="summary-row"><span>内容方向</span><b>${data.niche}</b></div>
    <div class="summary-row"><span>主平台</span><b>${data.platform}</b></div>
    <div class="summary-row"><span>账号阶段</span><b>${data.stage}</b></div>
    <div class="summary-row"><span>内容优势</span><b>${data.edge}</b></div>
    <div class="summary-row"><span>当前卡点</span><b>${data.bottleneck}</b></div>
    <div class="summary-row"><span>观看理由</span><b>${data.audienceMoment || "未填写"}</b></div>
    <div class="summary-row"><span>内容感觉</span><b>${data.contentBoundary || "未填写"}</b></div>
    <div class="summary-note">${data.profile}</div>
  `;
};

const platformRules = {
  "小红书": {
    style: "经验感标题 + 强封面 + 收藏理由",
    timing: "工作日 20:30-22:30",
    hook: "先给结论，再给可照做步骤",
    risk: "不要写成百科式干货，用户更吃真实经历和清单"
  },
  "抖音": {
    style: "强钩子 + 快节奏冲突 + 明确反转",
    timing: "午休 12:00-13:30 或晚间 19:30-22:00",
    hook: "前 3 秒必须出现痛点或结果",
    risk: "不要铺垫过长，信息密度要靠画面和字幕承接"
  },
  "视频号": {
    style: "真实口播 + 信任建立 + 私域承接",
    timing: "工作日 7:30-9:00 或 20:00-22:00",
    hook: "先说一个具体场景，再给个人判断",
    risk: "不要过度网感，保持真实表达和连续更新"
  },
  "B站": {
    style: "完整结构 + 陪伴感 + 可复看信息",
    timing: "周五晚或周末下午",
    hook: "用完整问题开场，承诺看完能获得什么",
    risk: "不要只做短平快，要给足过程和细节"
  },
  "公众号": {
    style: "观点标题 + 结构化论证 + 私域沉淀",
    timing: "工作日 8:00-9:00 或 21:00 后",
    hook: "用一个高共鸣问题引出观点",
    risk: "不要堆技巧，文章要有判断和可信案例"
  }
};

const nicheRules = {
  "职场成长": {
    userNeed: "新人想变得专业，但不想被高压成功学裹挟",
    contentPillars: ["真实工作场景", "沟通与协作避坑", "效率工具实测", "低成本成长复盘"],
    similar: ["成长记录型新人", "工具模板型运营", "职场沟通拆解者"],
    firstTopic: "从一个真实工作问题切入，把解决过程拆成模板"
  },
  "健身减脂": {
    userNeed: "普通人想健康变瘦，但害怕高门槛和反复失败",
    contentPillars: ["低门槛饮食", "新手训练", "变化记录", "误区避坑"],
    similar: ["陪伴型减脂记录", "外卖减脂方案", "新手训练测评"],
    firstTopic: "用一周真实记录证明方法可执行"
  },
  "本地探店": {
    userNeed: "用户想降低踩雷成本，快速知道一家店适合什么场景",
    contentPillars: ["场景化推荐", "真实测评", "路线组合", "商单内容自然化"],
    similar: ["城市生活路线号", "高性价比测评号", "场景探店 KOC"],
    firstTopic: "先定义使用场景，再判断值不值得去"
  },
  "美妆护肤": {
    userNeed: "新手想被种草，但更需要可信、克制、适合自己的判断",
    contentPillars: ["肤质场景", "真实测评", "新手教程", "成分与避坑"],
    similar: ["真实空瓶复盘", "通勤妆教程", "敏感肌避坑号"],
    firstTopic: "用自己的使用条件和缺点描述建立信任"
  },
  "读书学习": {
    userNeed: "用户想持续学习，但缺少能立刻照做的结构和陪伴",
    contentPillars: ["读书输出", "学习计划", "方法模板", "坚持复盘"],
    similar: ["普通人读书记录", "备考计划型账号", "知识输出模板号"],
    firstTopic: "把一个抽象方法变成当天能执行的小任务"
  }
};

const edgeRules = {
  "真实经历": "把“我遇到的问题 -> 我怎么试 -> 结果如何”做成固定结构，可信度会比直接讲道理更高。",
  "方法整理": "把零散经验沉淀成清单、模板、步骤，适合做高收藏内容。",
  "测评对比": "用同一标准比较多个方案，适合建立理性、靠谱的人设。",
  "陪伴记录": "持续记录变化和失败过程，适合积累信任和长期关注。"
};

const loadingTips = [
  ["先别急着商业化", "新号前几条内容更重要的是让用户相信你这个人，而不是立刻证明你能卖东西。"],
  ["标题网感不是越强越好", "起号早期过度标题党会带来点击，但不一定带来信任和关注。"],
  ["选题顺序很重要", "先做真实经历和问题共鸣，再做方法模板，最后才适合轻度转化。"],
  ["普通 KOC 的优势", "不需要像专家一样全知，真实试错和可复制过程反而更容易建立亲近感。"],
  ["别把内容做成说明书", "用户不是来读产品文档的，先给场景和情绪，再给步骤。"],
  ["评论区就是选题库", "高频评论不只是互动指标，也是下一条内容最便宜的需求调研。"],
  ["素材比灵感可靠", "截图、备忘录、聊天记录、踩坑复盘，比凭空想标题更能支撑稳定更新。"],
  ["第一周不要太散", "7 条内容应该围绕同一个人设建立记忆点，而不是每条都换方向。"]
];

const renderResearch = (data) => {
  if (aiPlan?.research?.length) {
    $("researchResult").innerHTML = aiPlan.research
      .map((item) => `
        <div class="research-item">
          <b>${item.title}</b>
          <span>${item.body}</span>
        </div>
      `)
      .join("");
    return;
  }

  const niche = getNicheRule(data.niche);
  const platform = getPlatformRule(data.platform);
  $("researchResult").innerHTML = `
    <div class="research-item">
      <b>趋势观察</b>
      <span>${data.niche} 赛道里，用户更关注“真实可复制”而不是完美人设。</span>
    </div>
    <div class="research-item">
      <b>相似打法</b>
      <span>${niche.similar.join(" / ")}，都适合从小样本经验做起。</span>
    </div>
    <div class="research-item">
      <b>平台提醒</b>
      <span>${data.platform} 更适合 ${platform.style}。</span>
    </div>
  `;
};

const renderAgentTrace = (data) => {
  const trace = aiPlan?.agentTrace?.length
    ? aiPlan.agentTrace
    : [
      {
        step: "诊断",
        thought: `基于“${data.stage}”和“${data.bottleneck}”判断当前阻塞点。`,
        action: "先明确账号切口和第一周验证路径。"
      },
      {
        step: "规划",
        thought: "第一周先建立信任，再验证方向，最后轻转化。",
        action: "把选题拆成每天可执行的增长任务。"
      }
    ];
  const el = $("agentTraceResult");
  if (!el) return;
  el.innerHTML = trace
    .map((item, index) => `
      <article class="trace-step" data-step="${index + 1}">
        <span>${item.step || `Step ${index + 1}`}</span>
        <p>${item.action || item.thought || "进入下一步 Agent 工作流。"}</p>
      </article>
    `)
    .join("");
};

const renderPositioning = (data) => {
  if (aiPlan?.positioning?.headline) {
    const plan = aiPlan.positioning;
    const diagnosis = aiPlan.diagnosis || {};
    $("positioningResult").innerHTML = `
      <div class="insight-card diagnosis-card">
        <div class="diagnosis-head">
          <span class="section-kicker">Agent Diagnosis</span>
          <h4>${plan.headline || "当前账号需要先收敛内容切口"}</h4>
          <p>${diagnosis.strategy || plan.diagnosis || ""}</p>
        </div>
        <div class="diagnosis-grid">
          <div><span>阶段判断</span><b>${diagnosis.stageAssessment || data.stage}</b></div>
          <div><span>主要阻塞</span><b>${diagnosis.mainBlocker || data.bottleneck}</b></div>
          <div><span>下一优先级</span><b>${diagnosis.nextPriority || "先完成第一周低成本验证。"}</b></div>
        </div>
      </div>

      <div class="strategy-summary">
        <article>
          <span>可用素材</span>
          <p>${(diagnosis.usableAssets || []).join(" / ") || data.assets || "真实经历、截图或复盘笔记"}</p>
        </article>
        <article>
          <span>内容方向</span>
          <p>${(plan.pillars || []).slice(0, 3).join(" / ") || plan.userNeed || "围绕一个具体问题连续验证"}</p>
        </article>
        <article>
          <span>先别做</span>
          <p>${(diagnosis.avoid || []).join(" / ") || "不要一开始做泛泛干货或硬转化"}</p>
        </article>
      </div>
    `;
    return;
  }

  const niche = getNicheRule(data.niche);
  const platform = getPlatformRule(data.platform);
  $("positioningResult").innerHTML = `
    <div class="insight-card diagnosis-card">
      <div class="diagnosis-head">
        <span class="section-kicker">Agent Diagnosis</span>
        <h4>${data.edge}型 ${data.niche} KOC，先做低成本验证</h4>
        <p>你现在不是单纯缺文案，而是需要把“${data.niche}”收敛成一个更像你的内容切口，再用连续任务验证用户是否愿意互动和收藏。</p>
      </div>
      <div class="diagnosis-grid">
        <div><span>阶段判断</span><b>${data.stage}</b></div>
        <div><span>主要阻塞</span><b>${data.bottleneck}</b></div>
        <div><span>下一优先级</span><b>先完成第一周低成本验证</b></div>
      </div>
    </div>

    <div class="strategy-summary">
      <article>
        <span>可用素材</span>
        <p>${data.assets || data.story || "真实经历、截图或复盘笔记"}</p>
      </article>
      <article>
        <span>内容方向</span>
        <p>${niche.contentPillars.slice(0, 3).join(" / ")}</p>
      </article>
      <article>
        <span>先别做</span>
        <p>${platform.risk}</p>
      </article>
    </div>
  `;
};

const renderTopics = (data) => {
  const tasks = getTaskOptions(data);
  $("topicsResult").innerHTML = tasks
    .map((task, index) => `
      <button class="topic-card ${index === selectedTopicIndex ? "selected" : ""}" type="button" data-topic-index="${index}" data-step="${index + 1}">
        <div class="tag-row">
          <span class="path-stage">Day ${task.day || index + 1}｜${task.goal || fallbackStage(index)}</span>
          <span class="tag">${task.category || "增长任务"}</span>
          <span class="tag">${task.contentType || data.platform}</span>
        </div>
        <h4>${task.title}</h4>
        <p class="muted">Agent 任务：${task.whyThisTask || task.reason || `贴合 ${data.audience || "目标用户"} 的即时痛点，符合“${data.edge}”优势。`}</p>
        <div class="path-details">
          <div class="path-meta"><span class="path-label">任务目标</span><span>${task.goal || fallbackStage(index)}：${task.intent || fallbackIntent(index)}</span></div>
          <div class="path-meta"><span class="path-label">可用素材</span><span>${task.material || data.assets || "用一条真实经历或截图做证据。"}</span></div>
          <div class="path-meta"><span class="path-label">观察指标</span><span>${task.publishMetric || "发布后重点看收藏、评论和关注转化。"}</span></div>
          <div class="path-meta"><span class="path-label">下一步信号</span><span>${task.nextSignal || "根据评论区最高频问题延展下一条内容。"}</span></div>
        </div>
      </button>
    `)
    .join("");

  document.querySelectorAll(".topic-card").forEach((card) => {
    card.addEventListener("click", () => {
      selectedTopicIndex = Number(card.dataset.topicIndex);
      contentPlan = null;
      reviewPlan = null;
      renderAll(false);
      switchTab("content");
    });
  });
};

const getTaskOptions = (data) => {
  if (aiPlan?.tasks?.length) {
    return aiPlan.tasks.map((task, index) => {
      const topic = aiPlan.topics?.[index] || {};
      return {
        ...topic,
        ...task,
        title: task.title || topic.title,
        category: task.category || topic.category,
        contentType: task.contentType || topic.contentType,
        interaction: task.interaction || topic.interaction,
        stage: task.goal || topic.stage,
        whyNow: task.whyThisTask || topic.whyNow,
        material: task.material || topic.material
      };
    });
  }

  return getFallbackTopicPool(data).map((topic, index) => ({
    day: index + 1,
    goal: fallbackStage(index),
    title: topic[0],
    category: topic[1],
    contentType: data.format,
    interaction: topic[2],
    whyThisTask: `贴合 ${data.audience || "目标用户"} 的即时痛点，适合引导用户${topic[2]}。`,
    intent: fallbackIntent(index),
    material: data.assets || data.story || "用一条真实经历或截图做证据。",
    publishMetric: index < 2 ? "重点看评论共鸣和关注转化。" : index < 5 ? "重点看收藏、评论问题和转发。" : "重点看私信、咨询和转化反馈。",
    nextSignal: "根据评论区最高频问题延展下一条内容。"
  }));
};

const fallbackStage = (index) => {
  if (index < 2) return "建立信任";
  if (index < 5) return "验证方向";
  return "轻转化";
};

const fallbackIntent = (index) => {
  if (index < 2) return "让用户先相信你是真实的人，不急着卖方法。";
  if (index < 5) return "测试用户更关心的具体问题，形成稳定栏目。";
  return "在已有信任基础上，引出工具、模板或服务场景。";
};

const getSelectedTopic = (data) => {
  const task = aiPlan?.tasks?.[selectedTopicIndex];
  const topic = aiPlan?.topics?.[selectedTopicIndex];
  if (task || topic) {
    return {
      ...(topic || {}),
      ...(task || {}),
      title: task?.title || topic?.title,
      category: task?.category || topic?.category,
      stage: task?.goal || topic?.stage,
      intent: topic?.intent || task?.goal,
      whyNow: task?.whyThisTask || topic?.whyNow,
      reason: task?.whyThisTask || topic?.reason,
      contentType: task?.contentType || topic?.contentType,
      material: task?.material || topic?.material,
      interaction: task?.interaction || topic?.interaction
    };
  }
  if (topic) return topic;
  const fallback = getFallbackTopicPool(data)[selectedTopicIndex] || getFallbackTopicPool(data)[0];
  return {
    title: fallback[0],
    category: fallback[1],
    interaction: fallback[2],
    reason: `贴合 ${data.audience || "目标用户"} 的即时痛点。`,
    stage: fallbackStage(selectedTopicIndex),
    intent: fallbackIntent(selectedTopicIndex),
    whyNow: "用于建立账号记忆点，并为后续系列内容铺垫。",
    material: data.assets || data.story || "用一条真实经历或截图做证据。",
    contentType: data.format
  };
};

const getTopicOptions = (data) => aiPlan?.topics?.length || aiPlan?.tasks?.length
  ? getTaskOptions(data)
  : getFallbackTopicPool(data).map((topic, index) => ({
    title: topic[0],
    category: topic[1],
    interaction: topic[2],
    reason: `贴合 ${data.audience || "目标用户"} 的即时痛点。`,
    stage: fallbackStage(index),
    intent: fallbackIntent(index),
    whyNow: "用于建立账号记忆点，并为后续系列内容铺垫。",
    material: data.assets || data.story || "用一条真实经历或截图做证据。",
    contentType: data.format
  }));

const getModeNotice = () => {
  if (appMode === "live") {
    return {
      className: "mode-notice live",
      title: "真实生成结果",
      body: "这版内容来自当前填写的创作者画像和 AI 生成结果。"
    };
  }
  if (appMode === "demo") {
    return {
      className: "mode-notice demo",
      title: "演示样例结果",
      body: "当前未连上真实 API，页面展示的是本地样例，适合先体验流程和交互。"
    };
  }
  return {
    className: "mode-notice",
    title: "等待生成",
    body: "填写画像后会生成一版起号方案；没有配置 API 时会进入演示模式。"
  };
};

const renderModeNotice = () => {
  const notice = getModeNotice();
  return `
    <div class="${notice.className}">
      <b>${notice.title}</b>
      <span>${notice.body}</span>
    </div>
  `;
};

const renderContent = (data) => {
  const topic = getSelectedTopic(data);
  if (isContentGenerating) {
    $("contentResult").innerHTML = `
      <section class="content-brief">
        <div class="brief-card">
          <h4>当前选题</h4>
          <p>${topic.title}</p>
        </div>
        <div class="brief-card">
          <h4>生成形式</h4>
          <p>${contentMode}。正在基于你的画像、素材和平台风格生成完整成稿。</p>
        </div>
      </section>

      <section class="content-loading-panel">
        <div class="content-loader">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div>
          <p class="eyebrow">Writing Draft</p>
          <h4>正在把选题变成可发布内容</h4>
          <p class="muted" id="contentLoadingTip">请耐心等待 1-2 分钟，正在生成完整正文、脚本、素材建议和发布优化。</p>
        </div>
      </section>
    `;
    return;
  }

  if (!contentPlan) {
    const topicOptions = getTopicOptions(data);
    $("contentResult").innerHTML = `
      <section class="content-brief">
        <div class="brief-card">
          <h4>当前选题</h4>
          <p>${topic.title}</p>
        </div>
        <div class="brief-card">
          <h4>生成前判断</h4>
          <p>${topic.whyNow || topic.reason || "先明确这条内容承担的账号目标，再生成可落地成稿。"}</p>
        </div>
      </section>

      <section class="format-panel">
        <p class="eyebrow">Choose Output</p>
        <h4>选择选题和生成形式</h4>
        <label class="topic-select-label">
          选择要生成的选题
          <select id="contentTopicSelect">
            ${topicOptions.map((item, index) => `<option value="${index}" ${index === selectedTopicIndex ? "selected" : ""}>${index + 1}. ${item.title}</option>`).join("")}
          </select>
        </label>
        <div class="mode-row">
          <button class="mode-button ${contentMode === "图文 + 视频" ? "active" : ""}" data-content-mode="图文 + 视频" type="button">图文 + 视频</button>
          <button class="mode-button ${contentMode === "图文" ? "active" : ""}" data-content-mode="图文" type="button">只要图文</button>
          <button class="mode-button ${contentMode === "视频" ? "active" : ""}" data-content-mode="视频" type="button">只要视频</button>
        </div>
        <p class="muted">${appMode === "demo" ? "当前为演示模式，会生成一版可预览样稿；接入 API 后会换成真实 AI 结果。" : "选择后会针对当前选题生成完整正文、脚本、素材建议和发布建议。"}</p>
        <button class="primary-button content-generate-button" id="generateContent" type="button">${appMode === "demo" ? "生成演示样稿" : "生成这条内容"}</button>
      </section>
    `;
    bindContentControls();
    return;
  }

  $("contentResult").innerHTML = `
    <section class="content-brief">
      <div class="brief-card">
        <h4>当前选题</h4>
        <p>${contentPlan.selectedTopic?.title || topic.title}</p>
      </div>
      <div class="brief-card">
        <h4>写作逻辑</h4>
        <p>${contentPlan.selectedTopic?.strategy || topic.whyNow || "先建立具体场景，再给可执行方法，最后引导用户互动。"}</p>
      </div>
    </section>

    ${renderPlatformOutput(data, topic)}
  `;
};

const renderPlatformOutput = (data, topic) => {
  if (data.platform === "公众号") return renderArticleOutput(contentPlan.article || {}, topic);
  if (data.platform === "B站") return renderLongVideoOutput(contentPlan.longVideo || {}, topic);
  if (data.platform === "抖音" || data.platform === "视频号") return renderVideoOutput(contentPlan.video || {}, data.platform, topic);
  return renderNoteOutput(contentPlan.note || contentPlan.graphic || {}, topic);
};

const renderArticleOutput = (article, topic) => `
  <article class="output-card graphic-output">
    <header>
      <p class="eyebrow">WeChat Article</p>
      <h4>公众号文章</h4>
    </header>
    <div class="output-body">
      <div class="output-section">
        <span class="section-kicker">标题</span>
        <h4>${article.articleTitle || topic.title}</h4>
      </div>
      <div class="cover-preview">
        <span>导语摘要</span>
        <strong>${article.dek || "用一段摘要说明问题、冲突和读者收益。"}</strong>
        <p>${article.intro || ""}</p>
      </div>
      <div class="article-copy">
        ${(article.sections || []).map((section) => `
          <h4>${section.heading || "小标题"}</h4>
          ${formatParagraphs(section.body || "")}
          ${section.insert ? `<p class="muted">插图/案例：${section.insert}</p>` : ""}
        `).join("") || formatParagraphs(article.body || "内容正文生成失败，请重新生成。")}
      </div>
      <div class="output-section">
        <span class="section-kicker">金句</span>
        <ul>${(article.pullQuotes || []).map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>
      <div class="output-section">
        <span class="section-kicker">文中素材</span>
        <ul>${(article.mediaPlan || []).map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>
      <div class="article-copy">${formatParagraphs(article.ending || "")}</div>
    </div>
  </article>
`;

const renderNoteOutput = (note, topic) => `
  <article class="output-card graphic-output">
    <header>
      <p class="eyebrow">Xiaohongshu Note</p>
      <h4>小红书笔记</h4>
    </header>
    <div class="output-body">
      <div class="cover-preview">
        <span>首图</span>
        <strong>${note.coverTitle || topic.title}</strong>
        <p>${note.coverSubtitle || "用真实场景和具体收益做封面副标题。"}</p>
      </div>
      <div class="output-section">
        <span class="section-kicker">发布标题</span>
        <h4>${note.postTitle || topic.title}</h4>
      </div>
      <div class="article-copy">${formatParagraphs(note.body || "内容正文生成失败，请重新生成。")}</div>
      <div class="output-section">
        <span class="section-kicker">配图建议</span>
        <ul>${(note.imagePlan || []).map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>
      <div class="tag-row output-tags">${(note.tags || []).map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
    </div>
  </article>
`;

const renderVideoOutput = (video, platform, topic) => `
  <article class="output-card video-output">
    <header>
      <p class="eyebrow">Video Script</p>
      <h4>${platform}脚本</h4>
    </header>
    <div class="output-body">
      <div class="output-section hook-section">
        <span class="section-kicker">开头</span>
        <h4>${video.hook || `直接抛出选题冲突：“${topic.title}”。`}</h4>
      </div>
      <div class="script-table">
        ${(video.script || []).map((item) => `
          <div class="script-row">
            <strong>${item.time || "片段"}</strong>
            <p>${item.voice || ""}</p>
            <span>画面：${item.visual || "真实场景/截图/操作录屏"}</span>
            <span>字幕：${item.subtitle || "提炼一句关键结论"}</span>
          </div>
        `).join("")}
      </div>
      <div class="output-section">
        <span class="section-kicker">镜头清单</span>
        <ul>${(video.shotList || []).map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>
      <div class="article-copy">${formatParagraphs(video.caption || video.commentPrompt || "")}</div>
    </div>
  </article>
`;

const renderLongVideoOutput = (video, topic) => `
  <article class="output-card video-output">
    <header>
      <p class="eyebrow">Bilibili Video</p>
      <h4>B站中长视频</h4>
    </header>
    <div class="output-body">
      <div class="cover-preview">
        <span>封面文案</span>
        <strong>${video.coverText || topic.title}</strong>
        <p>${video.opening || ""}</p>
      </div>
      <div class="script-table">
        ${(video.chapters || []).map((item) => `
          <div class="script-row">
            <strong>${item.time || "章节"}</strong>
            <p>${item.heading || ""}</p>
            <span>${(item.talkingPoints || []).join(" / ")}</span>
            <span>素材：${item.material || "录屏/截图/口播补充"}</span>
          </div>
        `).join("")}
      </div>
      <div class="output-section">
        <span class="section-kicker">素材清单</span>
        <ul>${(video.assetList || []).map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>
      <div class="article-copy">${formatParagraphs(video.description || "")}</div>
    </div>
  </article>
`;

const formatParagraphs = (text) => String(text)
  .split(/\n+/)
  .filter(Boolean)
  .map((line) => `<p>${line}</p>`)
  .join("");

const bindContentControls = () => {
  $("contentTopicSelect")?.addEventListener("change", (event) => {
    selectedTopicIndex = Number(event.target.value);
    contentPlan = null;
    reviewPlan = null;
    renderAll(false);
    switchTab("content");
  });
  document.querySelectorAll(".mode-button").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".mode-button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      contentMode = button.dataset.contentMode;
    });
  });
  $("generateContent")?.addEventListener("click", generateSelectedContent);
};

const sectionHtml = (title, selector) => {
  const html = document.querySelector(selector)?.innerHTML || "";
  return `
    <section class="print-section">
      <h2>${title}</h2>
      <div>${html}</div>
    </section>
  `;
};

const exportPlanToPdf = () => {
  renderAll(false);
  const data = getFormData();
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    setApiStatus("浏览器拦截了导出窗口，请允许弹窗后再试。", "error");
    return;
  }

  printWindow.document.write(`
    <!doctype html>
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8" />
        <title>${escapeHtml(data.niche)} KOC 起号方案</title>
        <style>
          body {
            margin: 0;
            padding: 32px;
            color: #161914;
            background: #f7f7f4;
            font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
          }
          .print-cover,
          .print-section {
            margin: 0 auto 18px;
            max-width: 920px;
            padding: 24px;
            border: 1px solid #e2e3dd;
            border-radius: 12px;
            background: #fff;
          }
          h1, h2, h3, h4, p { margin-top: 0; }
          h1 { font-size: 34px; line-height: 1.15; }
          h2 { font-size: 22px; border-bottom: 1px solid #e2e3dd; padding-bottom: 10px; }
          h3, h4 { font-size: 17px; }
          p, li, span { line-height: 1.75; }
          .print-meta {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
            margin-top: 18px;
          }
          .print-meta div,
          .insight-card,
          .research-item,
          .topic-card,
          .brief-card,
          .output-card,
          .publish-step {
            page-break-inside: avoid;
            margin-bottom: 12px;
            padding: 14px;
            border: 1px solid #e2e3dd;
            border-radius: 10px;
            background: #fbfcf8;
          }
          .tag, .path-stage {
            display: inline-block;
            margin: 0 6px 6px 0;
            padding: 4px 8px;
            border-radius: 999px;
            background: #e8eee7;
            font-size: 12px;
            font-weight: 700;
          }
          button, select, .content-generate-button, .mode-row, .topic-select-label {
            display: none !important;
          }
          .tab-page, .content-columns, .output-stack, .topic-list, .research-strip, .agent-trace, .review-layout {
            display: block !important;
          }
          @media print {
            body { background: #fff; padding: 0; }
            .print-cover, .print-section { border-radius: 0; box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <section class="print-cover">
          <p>AI Content Growth</p>
          <h1>${escapeHtml(data.niche)} KOC 起号方案</h1>
          <p>基于你的创作者画像、目标平台和当前卡点生成，可用于 Demo 评审、复盘或后续继续修改。</p>
          <div class="print-meta">
            <div><b>创作者</b><br>${escapeHtml(data.profile)}</div>
            <div><b>目标用户</b><br>${escapeHtml(data.audience)}</div>
            <div><b>主平台</b><br>${escapeHtml(data.platform)}</div>
            <div><b>账号阶段</b><br>${escapeHtml(data.stage)}</div>
          </div>
        </section>
        ${sectionHtml("01 Agent 诊断", "#positioning")}
        ${sectionHtml("02 增长任务", "#topics")}
        ${sectionHtml("03 内容生成", "#content")}
        ${sectionHtml("04 发布执行", "#publish")}
        ${sectionHtml("05 复盘迭代", "#review")}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  window.setTimeout(() => printWindow.print(), 350);
};

const renderPublish = (data) => {
  const topic = getSelectedTopic(data);
  const platform = getPlatformRule(data.platform);
  const publish = contentPlan?.publish || aiPlan?.publish;
  const titles = publish?.titles || [
    topic.title,
    `我做 ${data.niche} 后，最想早点知道这件事`,
    "新手也能用的低成本方法，别等踩坑才整理"
  ];
  const suggestions = publish?.suggestions || [
    `建议时间：${platform.timing}。`,
    `平台钩子：${platform.hook}。`,
    "首评：把模板使用步骤补在评论区，引导“想要模板”。",
    `话题：${data.niche}、普通人成长、真实复盘、低成本方法。`
  ];
  const interactions = publish?.interactions || [
    "高价值评论优先回复，沉淀成下一条内容。",
    "如果评论集中在“工具怎么选”，下一条做工具对比。",
    "如果收藏高评论低，补一个“模板领取”互动问题。"
  ];
  const series = publish?.series || [
    "第 2 条：同一主题的避坑版内容。",
    "第 3 条：同一主题的工具/清单版内容。",
    "第 4 条：同一主题的真实复盘版内容。"
  ];
  const contentPublish = contentPlan?.publish;
  const publishSteps = contentPublish
    ? [
      {
        title: "定稿标题",
        label: "先确定用户为什么点开",
        body: titles.map((title, index) => `${String.fromCharCode(65 + index)}. ${title}`)
      },
      {
        title: "发布时间",
        label: "选择更容易被目标用户看到的窗口",
        body: [contentPublish.bestTime || platform.timing]
      },
      {
        title: "首评与互动",
        label: "用第一条评论启动反馈循环",
        body: [
          `首评：${contentPublish.firstComment || "补充素材/模板，引导用户评论。"}`,
          `互动问题：${contentPublish.interactionQuestion || "你遇到过类似问题吗？"}`
        ]
      },
      {
        title: "下一版修改",
        label: "发布后优先看这一处数据",
        body: [contentPublish.nextRevision || "优先根据评论区反馈调整标题和开头。"]
      }
    ]
    : [
      {
        title: "标题测试",
        label: "准备 3 个不同切入点",
        body: titles.map((title, index) => `${String.fromCharCode(65 + index)}. ${title}`)
      },
      {
        title: "发布窗口",
        label: "先保证被正确人群看到",
        body: suggestions
      },
      {
        title: "互动启动",
        label: "让评论区变成下一条选题来源",
        body: interactions
      },
      {
        title: "系列延展",
        label: "把单条内容变成可持续栏目",
        body: series
      }
    ];
  $("publishResult").innerHTML = `
    <div class="publish-path">
      ${publishSteps.map((step, index) => `
        <article class="publish-step" data-step="${index + 1}">
          <div class="publish-step-head">
            <span>${step.label}</span>
            <h4>${step.title}</h4>
          </div>
          <ul>
            ${step.body.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </article>
      `).join("")}
    </div>
  `;
};

const renderReview = (data) => {
  const topic = getSelectedTopic(data);
  const topicOptions = getTopicOptions(data);
  if (isReviewGenerating) {
    $("reviewResult").innerHTML = `
      <section class="content-loading-panel review-loading">
        <div class="content-loader">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div>
          <p class="eyebrow">Review Agent</p>
          <h4>正在分析发布数据和评论反馈</h4>
          <p class="muted">Agent 会判断问题更可能出在标题、开头、选题、素材、内容结构还是互动设计。</p>
        </div>
      </section>
    `;
    return;
  }

  $("reviewResult").innerHTML = `
    <section class="review-layout">
      <form class="review-form" id="reviewForm">
        <p class="eyebrow">Manual Metrics</p>
        <h4>输入发布后的关键数据</h4>
        <label>
          选择复盘的任务
          <select id="reviewTopicSelect">
            ${topicOptions.map((item, index) => `<option value="${index}" ${index === selectedTopicIndex ? "selected" : ""}>${index + 1}. ${item.title}</option>`).join("")}
          </select>
        </label>
        <div class="metric-input-grid">
          <label>曝光/阅读<input id="metricViews" inputmode="numeric" value="1200" /></label>
          <label>点赞<input id="metricLikes" inputmode="numeric" value="48" /></label>
          <label>收藏<input id="metricSaves" inputmode="numeric" value="16" /></label>
          <label>评论<input id="metricComments" inputmode="numeric" value="9" /></label>
          <label>转发<input id="metricShares" inputmode="numeric" value="3" /></label>
          <label>完播/读完率<input id="metricCompletionRate" value="32%" /></label>
        </div>
        <label>
          典型评论反馈
          <textarea id="metricCommentSamples" rows="5">有人说“很真实”，也有人问有没有模板可以直接用。</textarea>
        </label>
        <label>
          实际发布稿
          <textarea id="actualPublishedContent" rows="7" placeholder="粘贴你最终发出去的正文、口播稿或视频脚本。可以和 AI 初稿不同，Agent 会按真实发布版本复盘。"></textarea>
        </label>
        <button class="primary-button" id="generateReview" type="submit">${appMode === "demo" ? "生成演示复盘" : "让 Agent 复盘"}</button>
        <p class="muted">复盘数据先手动填写。实际发布稿越接近最终版本，复盘判断会越准确。</p>
      </form>

      <section class="review-output">
        <div class="brief-card">
          <h4>当前复盘对象</h4>
          <p>${topic.title}</p>
        </div>
        ${reviewPlan ? renderReviewOutput(reviewPlan) : `
          <div class="empty-review">
            <p class="eyebrow">Waiting Review</p>
            <h4>发布后把数据填进来，Agent 会给下一条内容判断</h4>
            <p class="muted">这里会输出问题归因、证据和下一步动作，不展示内部 Prompt 迭代信息。</p>
          </div>
        `}
      </section>
    </section>
  `;
  bindReviewControls();
};

const renderReviewOutput = (plan) => {
  const review = plan.review || {};
  return `
    <article class="review-card">
      <span class="section-kicker">复盘结论</span>
      <h4>${review.summary || "需要更多数据继续判断"}</h4>
      <p>${review.diagnosis || ""}</p>
      <div class="tag-row">
        <span class="tag">主要问题：${review.bottleneck || "内容结构"}</span>
      </div>
      <ul>${(review.evidence || []).map((item) => `<li>${item}</li>`).join("")}</ul>
      <div class="output-section">
        <span class="section-kicker">下一步动作</span>
        <p>${review.nextAction || "下一条优先做更具体、更可保存的内容。"}</p>
      </div>
    </article>
  `;
};

const bindReviewControls = () => {
  $("reviewTopicSelect")?.addEventListener("change", (event) => {
    selectedTopicIndex = Number(event.target.value);
    reviewPlan = null;
    renderAll(false);
    switchTab("review");
  });
  $("reviewForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    generateReview();
  });
};

const collectReviewMetrics = () => ({
  views: $("metricViews")?.value.trim() || "",
  likes: $("metricLikes")?.value.trim() || "",
  saves: $("metricSaves")?.value.trim() || "",
  comments: $("metricComments")?.value.trim() || "",
  shares: $("metricShares")?.value.trim() || "",
  completionRate: $("metricCompletionRate")?.value.trim() || "",
  commentSamples: $("metricCommentSamples")?.value.trim() || "",
  actualPublishedContent: $("actualPublishedContent")?.value.trim() || ""
});

const renderAll = (resetTopic = true) => {
  if (resetTopic) selectedTopicIndex = 0;
  const data = getSafeFormData();
  document.querySelectorAll("#positioning .mode-notice").forEach((notice) => notice.remove());
  renderResearch(data);
  renderAgentTrace(data);
  renderPositioning(data);
  renderTopics(data);
  renderContent(data);
  renderPublish(data);
  renderReview(data);
  const target = $("researchResult");
  if (target) target.insertAdjacentHTML("beforebegin", renderModeNotice());
};

const submitEvalSnapshot = async (stage, extra = {}) => {
  if (isFileMode()) return;
  try {
    await fetch("/api/eval/snapshot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        stage,
        profile: getFormData(),
        plan: aiPlan,
        content: contentPlan,
        review: reviewPlan,
        ...extra
      })
    });
  } catch (error) {
    console.warn(`Eval snapshot failed: ${error.message}`);
  }
};

const setApiStatus = (message, type = "") => {
  const el = $("apiStatus");
  if (!el) return;
  el.textContent = message;
  el.className = `api-status ${type}`;
};

const showRecoverableError = (error) => {
  stopLoadingMotion();
  $("generationScreen")?.classList.add("hidden");
  $("appShell")?.classList.remove("hidden");
  setApiStatus(`页面遇到异常：${error.message}`, "error");
  const target = $("positioningResult");
  if (target) {
    target.innerHTML = `
      <div class="insight-card">
        <h4>生成失败，但页面已恢复</h4>
        <p class="muted">${escapeHtml(error.message)}</p>
      </div>
    `;
  }
};

const setLoading = (isLoading) => {
  const button = $("regeneratePlan");
  if (!button) return;
  button.classList.toggle("loading", isLoading);
  button.textContent = isLoading ? "AI 正在生成..." : "重新生成方案";
};

const showGenerationScreen = (message = "读取画像与阶段，判断第一周内容顺序...", note = "请耐心等待 1-2 分钟。") => {
  $("generationScreen").classList.remove("hidden");
  $("appShell").classList.add("hidden");
  $("loadingText").textContent = message;
  $("waitNote").textContent = note;
  updateLoadingStep(0);
};

const hideGenerationScreen = () => {
  $("generationScreen").classList.add("hidden");
  $("appShell").classList.remove("hidden");
};

let loadingTimer = null;
let tipTimer = null;
const updateLoadingStep = (index) => {
  const labels = [
    "读取画像与阶段，判断第一周内容顺序...",
    "收敛账号定位，避开泛泛赛道建议...",
    "生成起号路径，区分信任、验证和转化内容...",
    "整理首篇内容结构与发布建议..."
  ];
  if (index > 0) $("loadingText").textContent = labels[index] || labels[labels.length - 1];
  $("loadingBar").style.width = `${[18, 42, 68, 86][index] || 86}%`;
  document.querySelectorAll(".loading-steps span").forEach((item, stepIndex) => {
    item.classList.toggle("active", stepIndex <= index);
  });
};

const renderLoadingTips = (activeIndex = 0) => {
  const tip = loadingTips[activeIndex % loadingTips.length];
  const tipBox = $("singleTip");
  tipBox.classList.add("fading");
  window.setTimeout(() => {
    tipBox.innerHTML = `
      <b>${tip[0]}</b>
      <span>${tip[1]}</span>
    `;
    tipBox.classList.remove("fading");
  }, 420);
};

const startLoadingMotion = () => {
  let step = 0;
  let tipIndex = 0;
  clearInterval(loadingTimer);
  clearInterval(tipTimer);
  updateLoadingStep(step);
  renderLoadingTips(tipIndex);
  loadingTimer = setInterval(() => {
    step = Math.min(step + 1, 3);
    updateLoadingStep(step);
  }, 1800);
  tipTimer = setInterval(() => {
    tipIndex = (tipIndex + 1) % loadingTips.length;
    renderLoadingTips(tipIndex);
  }, 3600);
};

const stopLoadingMotion = () => {
  clearInterval(loadingTimer);
  clearInterval(tipTimer);
  loadingTimer = null;
  tipTimer = null;
};

const generateWithApi = async (resetTopic = true) => {
  const requestId = generationRequestId + 1;
  generationRequestId = requestId;
  const data = getFormData();
  appMode = "loading";
  setLoading(true);
  setApiStatus("正在生成定位、路径和发布策略；完整正文会在内容页单独生成。", "live");
  showGenerationScreen("正在生成起号策略。", "先生成定位与一周路径，完整正文进入内容页后再生成。");
  startLoadingMotion();

  try {
    if (isFileMode()) {
      throw new Error("当前是 file:// 静态预览，真实 API 需要打开 http://localhost:5173/ 或线上部署地址。");
    }
    const result = sanitizeForHtml(await postJsonWithRetry("/api/generate", data));
    if (generationRequestId !== requestId) return;
    aiPlan = result;
    appMode = "live";
    contentPlan = null;
    reviewPlan = null;
    renderAll(resetTopic);
    setApiStatus("已生成真实方案", "live");
    submitEvalSnapshot("generate");
  } catch (error) {
    if (generationRequestId !== requestId) return;
    aiPlan = null;
    appMode = "demo";
    contentPlan = null;
    reviewPlan = null;
    renderAll(resetTopic);
    setApiStatus(`已进入演示模式：${friendlyApiError(error)}`, "demo");
  } finally {
    if (generationRequestId === requestId) {
      stopLoadingMotion();
      hideGenerationScreen();
      setLoading(false);
    }
  }
};

const generateSelectedContent = async () => {
  const data = getFormData();
  const renderData = getSafeFormData();
  const topic = getSelectedTopic(data);
  isContentGenerating = true;
  renderContent(renderData);
  setApiStatus(appMode === "demo" ? "正在生成演示样稿..." : "正在生成完整内容，预计需要 1-2 分钟...", appMode === "demo" ? "demo" : "live");

  try {
    if (appMode === "demo" || isFileMode()) {
      await delay(600);
      contentPlan = sanitizeForHtml(buildDemoContent(data, topic));
    } else {
      contentPlan = sanitizeForHtml(await postJsonWithRetry("/api/content", {
        ...data,
        contentMode,
        topic
      }));
    }
    isContentGenerating = false;
    renderContent(renderData);
    renderPublish(renderData);
    setApiStatus(appMode === "demo" ? "已生成演示样稿，接入 API 后可生成真实内容" : "已生成当前选题的完整内容", appMode === "demo" ? "demo" : "live");
    submitEvalSnapshot("content");
  } catch (error) {
    isContentGenerating = false;
    renderContent(renderData);
    setApiStatus(`内容生成失败：${friendlyApiError(error)}`, "error");
  } finally {
    isContentGenerating = false;
  }
};

const generateReview = async () => {
  const data = getFormData();
  const renderData = getSafeFormData();
  const topic = getSelectedTopic(data);
  const metrics = collectReviewMetrics();
  isReviewGenerating = true;
  renderReview(renderData);
  setApiStatus(appMode === "demo" ? "正在生成演示复盘..." : "复盘 Agent 正在分析发布数据...", appMode === "demo" ? "demo" : "live");

  try {
    if (appMode === "demo" || isFileMode()) {
      await delay(600);
      reviewPlan = sanitizeForHtml(buildDemoReview(data, topic, metrics));
    } else {
      reviewPlan = sanitizeForHtml(await postJsonWithRetry("/api/review", {
        ...data,
        topic,
        content: contentPlan,
        metrics
      }));
    }
    isReviewGenerating = false;
    renderReview(renderData);
    setApiStatus(appMode === "demo" ? "已生成演示复盘，接入 API 后可分析真实输入" : "复盘完成，已生成下一条增长任务", appMode === "demo" ? "demo" : "live");
    submitEvalSnapshot("review", { metrics });
  } catch (error) {
    isReviewGenerating = false;
    renderReview(renderData);
    setApiStatus(`复盘失败：${friendlyApiError(error)}`, "error");
  } finally {
    isReviewGenerating = false;
  }
};

const friendlyApiError = (error) => {
  const message = String(error?.message || "");
  if (error?.status === 429) return "请求过于频繁，请稍后再试。";
  if (message.includes("KIMI_API_KEY")) return "服务端还没有配置 API Key。";
  if (message.includes("Kimi API timeout")) return "Kimi 响应超时，请稍后重试或提高 KIMI_TIMEOUT_MS。";
  if (message.includes("Kimi API")) return message;
  if (isFileMode()) return "当前是本地文件预览，需要通过 localhost 或线上地址访问真实 API。";
  return "真实生成暂时不可用，已保留完整演示流程。";
};

const buildDemoContent = (data, topic) => {
  const audience = data.audience || "目标用户";
  const niche = data.niche || "内容方向";
  const platform = data.platform || "小红书";
  const baseTitle = topic.title || `${niche}的一条可发布内容`;
  const audienceMoment = data.audienceMoment || "刚遇到具体问题，不知道第一步怎么做";
  const story = data.story || "一段真实经历";
  const boundary = data.contentBoundary || "不装专家，只讲真实过程和可复制动作";
  const assets = data.assets || "真实经历、截图或复盘笔记";
  return {
    selectedTopic: {
      title: baseTitle,
      strategy: `这条内容先命中“${audienceMoment}”这个时刻，再用“${story}”作为证据，遵守“${boundary}”的边界，最后用评论问题收集下一条选题。`
    },
    article: {
      articleTitle: baseTitle,
      dek: `给 ${audience} 的一篇完整复盘，重点解决“${audienceMoment}”。`,
      intro: `${audience} 最容易被打动的，不是一个完美方法，而是你真的理解他们在“${audienceMoment}”时的犹豫。`,
      sections: [
        {
          heading: "先从一个真实场景开始",
          body: `这篇文章可以用“${story}”开场，再展示你手里已有的材料：${assets}。这样读者会先相信你经历过这个问题。`,
          insert: assets
        },
        {
          heading: "把过程拆成可复制动作",
          body: `不要直接给结论。先写当时发生了什么，再写你怎么尝试，最后写结果和下一次会怎么改。内容边界是：${boundary}。`,
          insert: "过程表格或复盘截图"
        }
      ],
      pullQuotes: ["可信过程比完美答案更重要。", "评论区的问题，就是下一篇文章的题目。"],
      ending: "结尾可以邀请读者留言：你现在最卡的是哪一步？下一篇就从评论最多的问题继续拆。",
      mediaPlan: [`文中插入：${assets}`, "插入一张步骤表", "插入一张复盘前后对比"]
    },
    note: {
      coverTitle: baseTitle,
      coverSubtitle: `给 ${audience} 的低门槛做法`,
      postTitle: baseTitle,
      body: [
        `${audience} 最容易被打动的，不是一个完美方法，而是你真的理解他们在“${audienceMoment}”时的犹豫。`,
        `所以这条内容不要先讲大道理。先拿“${story}”开场，再展示你手里已有的材料：${assets}。越具体，用户越容易判断这是不是和自己有关。`,
        `第二步，把过程拆成 3 个动作：先做什么、怎么判断有没有用、下一次怎么优化。不要只给结论，因为新号最需要建立的是可信过程。`,
        `第三步，记住你的内容边界：${boundary}。这会让账号更像一个稳定的人，而不是今天讲干货、明天追热点的杂货铺。`,
        `如果这条内容数据不错，下一条可以继续做避坑版、模板版或真实复盘版，让用户看到这是一个能持续更新的栏目。`
      ].join("\n\n"),
      imagePlan: [
        "首图：一句具体痛点 + 结果承诺",
        "过程图：把 3 个动作做成清单",
        `素材图：展示 ${assets}`,
        "结尾图：放评论区互动问题"
      ],
      tags: platform === "公众号" ? ["个人复盘", "内容创作", "普通人成长"] : ["KOC起号", niche, "内容创作", "普通人成长"]
    },
    graphic: {},
    video: {
      title: baseTitle,
      hook: `别一上来就做完整人设，先把“${baseTitle}”这件事讲清楚。`,
      script: [
        {
          time: "0-3秒",
          voice: `如果你也在${audienceMoment}，先别急着找爆款模板。`,
          visual: "正面口播，屏幕出现选题标题",
          subtitle: "先命中一个真实时刻"
        },
        {
          time: "3-15秒",
          voice: `我会先拿自己的经历讲，比如：${story}。`,
          visual: `展示 ${assets}`,
          subtitle: "可信过程 > 完美人设"
        },
        {
          time: "15-40秒",
          voice: `按三个步骤写：先说具体场景，再说你怎么尝试，最后说结果和下一步怎么改。边界是：${boundary}。`,
          visual: "三段式清单逐条出现",
          subtitle: "场景 / 尝试 / 复盘"
        },
        {
          time: "40-60秒",
          voice: "发布后重点看评论区，用户问得最多的问题，就是你下一条内容的题目。",
          visual: "切到评论区问题和下一条选题草稿",
          subtitle: "评论区就是下一条选题库"
        }
      ],
      caption: `围绕“${baseTitle}”做一次真实复盘。`,
      commentPrompt: "你第一条内容最想解决什么问题？",
      shotList: ["正面口播", "素材截图", "三步清单", "评论区问题"]
    },
    longVideo: {
      title: baseTitle,
      coverText: baseTitle,
      opening: `这期视频会用“${story}”拆一条普通人也能照做的内容路径。`,
      chapters: [
        { time: "00:00", heading: "为什么先讲真实场景", talkingPoints: ["用户为什么会信你", audienceMoment], material: assets },
        { time: "02:00", heading: "如何拆成可执行步骤", talkingPoints: ["场景", "尝试", "复盘"], material: "复盘表或录屏" },
        { time: "05:00", heading: "下一条内容怎么延展", talkingPoints: ["评论区问题", "系列栏目"], material: "选题清单" }
      ],
      description: `适合围绕 ${niche} 做一条结构完整的 B站视频。`,
      danmakuPrompts: ["你也遇到过这个问题吗？", "你更想看模板还是案例？"],
      assetList: [assets, "口播画面", "选题清单"]
    },
    publish: {
      titles: [baseTitle, `做 ${niche} 新号，我建议先发这一类内容`, `别急着找爆款，先把这件事讲清楚`],
      bestTime: getPlatformRule(platform).timing,
      firstComment: "你现在最卡的是定位、选题还是表达？我可以按这个继续拆下一条。",
      interactionQuestion: "你第一条内容最想解决什么问题？",
      nextRevision: "如果点击低，先改标题里的具体场景；如果收藏低，补一张可保存清单。"
    }
  };
};

const buildDemoReview = (data, topic, metrics) => {
  const saves = Number(metrics.saves || 0);
  const likes = Number(metrics.likes || 0);
  const comments = Number(metrics.comments || 0);
  const saveSignal = saves > 0 && likes > 0 ? saves / Math.max(likes, 1) : 0;
  const likelyBottleneck = saveSignal < 0.35 ? "内容结构" : comments < 5 ? "互动设计" : "选题延展";
  const nextTitle = saveSignal < 0.35
    ? `${topic.title}：可以直接套用的模板版`
    : `${topic.title} 后，评论区问得最多的 3 个问题`;

  return {
    review: {
      summary: saveSignal < 0.35
        ? "这条内容有一定共鸣，但可保存价值还不够强。"
        : "这条内容已经验证了用户兴趣，下一步适合做系列延展。",
      diagnosis: `从手动输入的数据看，点赞 ${metrics.likes || 0}、收藏 ${metrics.saves || 0}、评论 ${metrics.comments || 0}。${metrics.actualPublishedContent ? "结合你粘贴的实际发布稿，" : ""}如果评论反馈集中在“真实”和“想要模板”，说明用户认可场景，但还需要更明确的可执行交付。`,
      bottleneck: likelyBottleneck,
      evidence: [
        `收藏/点赞关系显示可保存结构${saveSignal < 0.35 ? "偏弱" : "有一定基础"}。`,
        `典型评论反馈：${metrics.commentSamples || "暂无评论样本"}`,
        `当前选题目标是“${topic.stage || topic.goal || "验证方向"}”，下一条应继续沿着同一问题做更具体版本。`
      ],
      nextAction: "下一条不要换大方向，优先把这条内容改成模板、清单或案例拆解，验证用户是否愿意收藏和继续提问。"
    },
    nextTask: {
      title: nextTitle,
      goal: saveSignal < 0.35 ? "提高收藏价值" : "延展评论区需求",
      format: data.platform === "公众号" ? "结构化长文" : "图文模板",
      material: data.assets || topic.material || "已有素材和评论反馈",
      whyNext: "用户已经对当前场景有反馈，继续深挖比立刻换方向更容易验证账号切口。",
      observeMetric: "重点观察收藏率、评论中的模板需求和是否出现新的高频问题。"
    },
    promptIterationHint: {
      issue: "评分体系尚未正式建立，当前只做复盘归因和下一步建议。",
      suggestion: "后续评测标准应拆成标题点击力、素材绑定度、可保存结构、互动触发和平台适配五类指标。"
    }
  };
};

const switchTab = (tabId) => {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === tabId);
  });
  document.querySelectorAll(".tab-page").forEach((page) => {
    page.classList.toggle("active", page.id === tabId);
  });
};

const showOnboarding = () => {
  $("landing")?.classList.add("hidden");
  $("appShell")?.classList.add("hidden");
  $("generationScreen")?.classList.add("hidden");
  $("onboarding")?.classList.remove("hidden");
  setWizardProgress();
};

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => switchTab(tab.dataset.tab));
});

$("startDiagnosis")?.addEventListener("click", showOnboarding);
$("startDiagnosisTop")?.addEventListener("click", showOnboarding);

$("regeneratePlan").addEventListener("click", () => {
  generateWithApi(true);
  switchTab("positioning");
});

$("exportPlan")?.addEventListener("click", exportPlanToPdf);

$("shuffleTopics").addEventListener("click", async () => {
  contentPlan = null;
  reviewPlan = null;
  selectedTopicIndex = 0;
  if (aiPlan && !isFileMode()) {
    await generateWithApi(true);
    switchTab("topics");
    return;
  }
  const pools = getTopicPools(getFormData().niche);
  topicPoolIndex = pools.length ? (topicPoolIndex + 1) % pools.length : 0;
  renderAll(false);
});

$("restartOnboarding").addEventListener("click", () => {
  aiPlan = null;
  contentPlan = null;
  reviewPlan = null;
  wizardStep = 0;
  showOnboarding();
});

const setWizardProgress = () => {
  document.querySelectorAll(".wizard-step").forEach((step) => {
    step.classList.toggle("active", Number(step.dataset.step) === wizardStep);
  });
  document.querySelectorAll(".wizard-progress span").forEach((dot, index) => {
    dot.classList.toggle("active", index <= wizardStep);
  });
  $("prevStep").style.visibility = wizardStep === 0 ? "hidden" : "visible";
  $("nextStep").textContent = wizardStep === 8 ? "生成我的起号方案" : "下一步";
};

document.querySelectorAll(".choice-grid").forEach((grid) => {
  grid.addEventListener("click", (event) => {
    const choice = event.target.closest(".choice");
    if (!choice) return;
    grid.querySelectorAll(".choice").forEach((item) => item.classList.remove("selected"));
    choice.classList.add("selected");
    const bindKey = grid.dataset.bind;
    const customInput = document.querySelector(`[data-custom-for="${bindKey}"]`);
    const isCustom = choice.classList.contains("custom-choice");
    if (customInput) {
      customInput.classList.toggle("hidden", !isCustom);
      if (isCustom) customInput.focus();
    }
    wizardState[bindKey] = isCustom ? (customInput?.value.trim() || "") : choice.dataset.value;
  });
});

document.querySelectorAll(".custom-input").forEach((input) => {
  input.addEventListener("input", () => {
    const bindKey = input.dataset.customFor;
    const grid = document.querySelector(`.choice-grid[data-bind="${bindKey}"]`);
    const customChoice = grid?.querySelector(".custom-choice");
    if (!customChoice?.classList.contains("selected")) return;
    wizardState[bindKey] = input.value.trim();
  });
});

$("prevStep").addEventListener("click", () => {
  wizardStep = Math.max(0, wizardStep - 1);
  setWizardProgress();
});

$("nextStep").addEventListener("click", () => {
  if (wizardStep < 8) {
    wizardStep += 1;
    setWizardProgress();
    return;
  }

  const finalNiche = wizardState.niche || "其他内容方向";
  const finalStage = wizardState.stage || "其他账号阶段";
  const finalEdge = wizardState.edge || "其他内容优势";
  const finalBottleneck = wizardState.bottleneck || "其他卡点";
  wizardState.edge = finalEdge;
  wizardState.bottleneck = finalBottleneck;
  setCreatorProfile({
    profile: $("wizardProfile").value.trim(),
    audience: $("wizardAudience").value.trim(),
    niche: finalNiche,
    stage: finalStage,
    edge: finalEdge,
    bottleneck: finalBottleneck,
    assets: $("wizardAssets").value.trim(),
    story: $("wizardStory").value.trim(),
    audienceMoment: wizardState.audienceMoment,
    contentBoundary: wizardState.contentBoundary,
    platform: wizardState.platform,
    format: "图文 + 短视频",
    goal: "接效率工具/课程类商单",
    timeBudget: wizardState.timeBudget,
    pain: `${finalBottleneck}。我的优势是${finalEdge}，已有素材包括：${$("wizardAssets").value}。最有把握连续讲的经历是：${$("wizardStory").value}。`
  });
  $("landing")?.classList.add("hidden");
  $("onboarding").classList.add("hidden");
  generateWithApi(true);
});

syncWizardFromProfile();
setWizardProgress();
renderProfileSummary();

window.addEventListener("error", (event) => {
  showRecoverableError(event.error || new Error(event.message));
});

window.addEventListener("unhandledrejection", (event) => {
  showRecoverableError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)));
});
