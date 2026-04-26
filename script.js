const sample = {
  profile: "刚工作一年的女生，在互联网运营岗",
  audience: "刚入职场的新人、想提升效率和表达能力的大学生",
  niche: "职场成长",
  edge: "真实经历",
  stage: "准备起号，还没正式发布",
  bottleneck: "不知道自己该做什么定位",
  assets: "一些真实工作经历、工具使用截图、复盘笔记",
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
let contentMode = "图文 + 视频";
let isContentGenerating = false;
let creatorProfile = { ...sample };
const wizardState = {
  niche: "职场成长",
  stage: "准备起号，还没正式发布",
  edge: "真实经历",
  bottleneck: "不知道自己该做什么定位"
};

const $ = (id) => document.getElementById(id);

const getFormData = () => ({ ...creatorProfile });
const isFileMode = () => window.location.protocol === "file:";

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

const renderProfileSummary = () => {
  const data = getFormData();
  const el = $("profileSummary");
  if (!el) return;
  el.innerHTML = `
    <div class="summary-row"><span>内容方向</span><b>${data.niche}</b></div>
    <div class="summary-row"><span>主平台</span><b>${data.platform}</b></div>
    <div class="summary-row"><span>账号阶段</span><b>${data.stage}</b></div>
    <div class="summary-row"><span>内容优势</span><b>${data.edge}</b></div>
    <div class="summary-row"><span>当前卡点</span><b>${data.bottleneck}</b></div>
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

const renderPositioning = (data) => {
  if (aiPlan?.positioning?.headline) {
    const plan = aiPlan.positioning;
    $("positioningResult").innerHTML = `
      <div class="insight-card">
        <div class="big-statement">${plan.headline}</div>
        <p class="muted">${plan.diagnosis || ""}</p>
        <div class="tag-row">
          ${(plan.tags || []).map((tag) => `<span class="tag">${tag}</span>`).join("")}
        </div>
      </div>

      <div class="insight-card">
        <h4>用户真实需求</h4>
        <p class="muted">${plan.userNeed || ""}</p>
      </div>

      <div class="insight-card">
        <h4>内容支柱</h4>
        <ul>${(plan.pillars || []).map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>

      <div class="insight-card">
        <h4>打法建议</h4>
        <p class="muted">${plan.playbook || ""}</p>
      </div>
    `;
    return;
  }

  const niche = getNicheRule(data.niche);
  const platform = getPlatformRule(data.platform);
  $("positioningResult").innerHTML = `
    <div class="insight-card">
      <div class="big-statement">定位建议：${data.edge}型 ${data.niche} KOC</div>
      <p class="muted">基于你的背景“${data.profile || "暂无补充"}”，更建议把账号做成“普通人可复制的过程记录”，服务 ${data.audience || "目标用户"}。核心不是证明你多专业，而是让用户看到你如何把问题拆小、试错、复盘，并最终承接 ${data.goal}。</p>
      <div class="tag-row">
        <span class="tag">普通人可复制</span>
        <span class="tag">${data.niche}</span>
        <span class="tag">${data.edge}</span>
        <span class="tag">系列内容</span>
        <span class="tag">${data.platform}</span>
      </div>
    </div>

    <div class="insight-card">
      <h4>用户真实需求</h4>
      <p class="muted">${niche.userNeed}。你的账号应该持续回答：为什么这个方法适合普通人、执行成本有多低、用了之后能看到什么变化。</p>
    </div>

    <div class="insight-card">
      <h4>内容支柱</h4>
      <ul>
        ${niche.contentPillars.map((item) => `<li>${item}：围绕一个具体问题输出，不做泛泛建议。</li>`).join("")}
      </ul>
    </div>

    <div class="insight-card">
      <h4>打法建议</h4>
      <p class="muted">${edgeRules[data.edge]} 第一阶段建议先做：${niche.firstTopic}。${platform.risk}</p>
    </div>
  `;
};

const renderTopics = (data) => {
  const topics = aiPlan?.topics?.length
    ? aiPlan.topics.map((topic) => [
      topic.title,
      topic.category,
      topic.interaction,
      topic.potential,
      topic.difficulty,
      topic.reason,
      topic.stage,
      topic.intent,
      topic.whyNow,
      topic.contentType
    ])
    : getFallbackTopicPool(data);
  $("topicsResult").innerHTML = topics
    .map((topic, index) => `
      <button class="topic-card ${index === selectedTopicIndex ? "selected" : ""}" type="button" data-topic-index="${index}" data-step="${index + 1}">
        <div class="tag-row">
          <span class="path-stage">${topic[6] || fallbackStage(index)}</span>
          <span class="tag">${topic[1]}</span>
          <span class="tag">${topic[9] || data.platform}</span>
        </div>
        <h4>${topic[0]}</h4>
        <p class="muted">推荐理由：${topic[5] || `贴合 ${data.audience || "目标用户"} 的即时痛点，符合“${data.edge}”优势，适合引导用户${topic[2]}。`}</p>
        <div class="path-details">
          <div class="path-meta"><span class="path-label">这一条解决</span><span>${topic[7] || fallbackIntent(index)}</span></div>
          <div class="path-meta"><span class="path-label">为什么现在发</span><span>${topic[8] || "用于建立账号记忆点，并为后续系列内容铺垫。"}</span></div>
        </div>
      </button>
    `)
    .join("");

  document.querySelectorAll(".topic-card").forEach((card) => {
    card.addEventListener("click", () => {
      selectedTopicIndex = Number(card.dataset.topicIndex);
      contentPlan = null;
      renderAll(false);
      switchTab("content");
    });
  });
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
  const topic = aiPlan?.topics?.[selectedTopicIndex];
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
    contentType: data.format
  };
};

const getTopicOptions = (data) => aiPlan?.topics?.length
  ? aiPlan.topics
  : getFallbackTopicPool(data).map((topic, index) => ({
    title: topic[0],
    category: topic[1],
    interaction: topic[2],
    reason: `贴合 ${data.audience || "目标用户"} 的即时痛点。`,
    stage: fallbackStage(index),
    intent: fallbackIntent(index),
    whyNow: "用于建立账号记忆点，并为后续系列内容铺垫。",
    contentType: data.format
  }));

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
          <button class="mode-button active" data-content-mode="图文 + 视频" type="button">图文 + 视频</button>
          <button class="mode-button" data-content-mode="图文" type="button">只要图文</button>
          <button class="mode-button" data-content-mode="视频" type="button">只要视频</button>
        </div>
        <p class="muted">选择后会针对当前选题生成完整正文、脚本、素材建议和发布建议。</p>
        <button class="primary-button content-generate-button" id="generateContent" type="button">生成这条内容</button>
      </section>
    `;
    bindContentControls();
    return;
  }

  const graphic = contentPlan.graphic || {};
  const video = contentPlan.video || {};
  const showGraphic = contentMode !== "视频";
  const showVideo = contentMode !== "图文";
  const isWechatArticle = data.platform === "公众号";
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

    ${showGraphic ? `<article class="output-card graphic-output">
      <header>
        <p class="eyebrow">Graphic Post</p>
        <h4>${data.platform} 图文版</h4>
      </header>
      <div class="output-body">
        <div class="cover-preview">
          <span>${isWechatArticle ? "导语摘要" : "封面"}</span>
          <strong>${graphic.coverTitle || topic.title}</strong>
          <p>${graphic.coverSubtitle || (isWechatArticle ? "用一段导语交代问题、冲突和读者收益。" : "用真实场景和具体收益做封面副标题。")}</p>
        </div>
        <div class="output-section">
          <span class="section-kicker">${isWechatArticle ? "文章标题" : "发布标题"}</span>
          <h4>${graphic.postTitle || topic.title}</h4>
        </div>
        <div class="article-copy">${formatParagraphs(graphic.body || "内容正文生成失败，请重新生成。")}</div>
        <div class="output-section">
          <span class="section-kicker">${isWechatArticle ? "文中插图建议" : "配图建议"}</span>
          <ul>${(graphic.imagePlan || []).map((item) => `<li>${item}</li>`).join("")}</ul>
        </div>
        <div class="tag-row output-tags">${(graphic.tags || []).map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
      </div>
    </article>` : ""}

    ${showVideo ? `<article class="output-card video-output">
      <header>
        <p class="eyebrow">Video Script</p>
        <h4>短视频/口播版</h4>
      </header>
      <div class="output-body">
        <div class="output-section hook-section">
          <span class="section-kicker">0-3 秒钩子</span>
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
      </div>
    </article>` : ""}
  `;
};

const formatParagraphs = (text) => String(text)
  .split(/\n+/)
  .filter(Boolean)
  .map((line) => `<p>${line}</p>`)
  .join("");

const bindContentControls = () => {
  $("contentTopicSelect")?.addEventListener("change", (event) => {
    selectedTopicIndex = Number(event.target.value);
    contentPlan = null;
    renderContent(getFormData());
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

const renderAll = (resetTopic = true) => {
  if (resetTopic) selectedTopicIndex = 0;
  const data = getFormData();
  renderResearch(data);
  renderPositioning(data);
  renderTopics(data);
  renderContent(data);
  renderPublish(data);
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
        <p class="muted">${error.message}</p>
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
  const data = getFormData();
  setLoading(true);
  setApiStatus("正在生成个性化方案，请耐心等待 1-2 分钟...", "live");
  showGenerationScreen("正在生成起号方案。", "请耐心等待 1-2 分钟。");
  startLoadingMotion();

  try {
    if (isFileMode()) {
      throw new Error("当前是 file:// 静态预览，真实 API 需要打开 http://localhost:5175/");
    }
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "API 请求失败");
    }

    aiPlan = await response.json();
    contentPlan = null;
    renderAll(resetTopic);
    setApiStatus("已生成真实方案", "live");
  } catch (error) {
    aiPlan = null;
    renderAll(resetTopic);
    setApiStatus(`API 未连接，已回退静态演示：${error.message}`, "error");
  } finally {
    stopLoadingMotion();
    hideGenerationScreen();
    setLoading(false);
  }
};

const generateSelectedContent = async () => {
  const data = getFormData();
  const topic = getSelectedTopic(data);
  const button = $("generateContent");
  isContentGenerating = true;
  renderContent(data);
  setApiStatus("正在生成完整内容，预计需要 1-2 分钟...", "live");

  try {
    const response = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        contentMode,
        topic
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "内容生成失败");
    }

    contentPlan = await response.json();
    isContentGenerating = false;
    renderContent(data);
    renderPublish(data);
    setApiStatus("已生成当前选题的完整内容", "live");
  } catch (error) {
    isContentGenerating = false;
    renderContent(data);
    setApiStatus(`内容生成失败：${error.message}`, "error");
  } finally {
    isContentGenerating = false;
  }
};

const switchTab = (tabId) => {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === tabId);
  });
  document.querySelectorAll(".tab-page").forEach((page) => {
    page.classList.toggle("active", page.id === tabId);
  });
};

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => switchTab(tab.dataset.tab));
});

$("regeneratePlan").addEventListener("click", () => {
  generateWithApi(true);
  switchTab("positioning");
});

$("shuffleTopics").addEventListener("click", async () => {
  contentPlan = null;
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
  wizardStep = 0;
  setWizardProgress();
  $("appShell").classList.add("hidden");
  $("generationScreen").classList.add("hidden");
  $("onboarding").classList.remove("hidden");
});

const setWizardProgress = () => {
  document.querySelectorAll(".wizard-step").forEach((step) => {
    step.classList.toggle("active", Number(step.dataset.step) === wizardStep);
  });
  document.querySelectorAll(".wizard-progress span").forEach((dot, index) => {
    dot.classList.toggle("active", index <= wizardStep);
  });
  $("prevStep").style.visibility = wizardStep === 0 ? "hidden" : "visible";
  $("nextStep").textContent = wizardStep === 4 ? "生成我的起号方案" : "下一步";
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
  if (wizardStep < 4) {
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
    platform: $("wizardPlatform").value,
    format: "图文 + 短视频",
    goal: "接效率工具/课程类商单",
    timeBudget: $("wizardTimeBudget").value,
    pain: `${finalBottleneck}。我的优势是${finalEdge}，已有素材包括：${$("wizardAssets").value}。`
  });
  $("onboarding").classList.add("hidden");
  generateWithApi(true);
});

setWizardProgress();
renderProfileSummary();

window.addEventListener("error", (event) => {
  showRecoverableError(event.error || new Error(event.message));
});

window.addEventListener("unhandledrejection", (event) => {
  showRecoverableError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)));
});
