# GrowthMate 评测平台化方案

## 目标

离线评测脚本解决的是“能不能跑一版固定测试集”。评测平台要解决的是：

- Prompt 改动后，质量有没有提升？
- 哪些用户场景最容易失败？
- 自动评分和人工标注是否一致？
- Agent 的复盘结论和真实用户反馈是否一致？
- 下一轮 Prompt 应该优先改哪里？

平台不面向普通用户，而是面向产品、算法、运营和开发，用于持续迭代 GrowthMate。

## 信息架构

### 1. Dashboard

展示整体质量趋势：

- 当前 Prompt 版本平均分。
- 各层级得分：输入理解、策略决策、执行交付、反馈迭代、信任边界。
- 最近 10 次评测趋势折线图。
- 最差 Top 5 用例。
- 高风险输出数量，例如过度承诺、错平台、未使用用户素材。

### 2. Test Set

管理评测集：

- 新增/编辑 KOC 测试画像。
- 维护目标平台、用户素材、真实发布稿、发布数据、评论反馈。
- 标记用例类型：冷启动、已有粉丝、准备商业化、数据不稳定等。
- 标记难度：基础、复杂、多约束、高风险。

### 3. Run Center

管理评测运行：

- 选择 Prompt 版本和模型版本。
- 选择全量评测或部分用例。
- 查看运行状态：等待、生成中、评分中、失败、完成。
- 支持失败重试和超时设置。

### 4. Result Review

查看单个用例结果：

- 左侧：用户画像、素材、平台、发布数据。
- 中间：Agent 输出，包括诊断、增长任务、内容、复盘。
- 右侧：自动评分、人工评分、差异解释。
- 支持人工标注员按 Rubric 逐项打 1-5 分。
- 支持标注问题类型：泛化、错平台、不可执行、素材未绑定、复盘归因错误、过度承诺。

### 5. Prompt Lab

用于 Prompt 迭代：

- 记录 Prompt 版本。
- 比较 A/B 两个 Prompt 在同一评测集上的得分差异。
- 展示维度级变化：例如平台适配 +8，复盘质量 -3。
- 聚合失败样本，生成 Prompt 修改建议。
- 支持把一次有效修改沉淀为版本说明。

## 数据模型草案

### eval_cases

- `id`
- `name`
- `profile_json`
- `review_metrics_json`
- `must_mention_json`
- `avoid_json`
- `tags_json`
- `difficulty`
- `created_at`

### prompt_versions

- `id`
- `name`
- `model`
- `generate_prompt_hash`
- `content_prompt_hash`
- `review_prompt_hash`
- `notes`
- `created_at`

### eval_runs

- `id`
- `prompt_version_id`
- `case_count`
- `status`
- `average_score`
- `started_at`
- `finished_at`

### eval_results

- `id`
- `run_id`
- `case_id`
- `raw_output_json`
- `auto_scores_json`
- `manual_scores_json`
- `group_scores_json`
- `error`
- `created_at`

### annotations

- `id`
- `result_id`
- `dimension_id`
- `score`
- `issue_type`
- `evidence`
- `comment`
- `annotator`
- `created_at`

## 关键可视化

- 总分趋势：看每次 Prompt 版本是否整体提升。
- 五层雷达图：看 Agent 是策略弱、执行弱，还是复盘弱。
- 维度热力图：横轴是用例，纵轴是维度，快速发现系统性短板。
- 自动分 vs 人工分散点图：判断自动评分是否可靠。
- 用户反馈一致性：比较复盘 Agent 的问题归因和真实用户反馈是否一致。
- Prompt 版本对比表：展示 A/B 版本在每个维度上的差值。

## 迭代闭环

1. 收集测试用例或真实用户匿名数据。
2. 选择 Prompt 版本运行评测。
3. 自动评分给出初步结果。
4. 人工标注重点失败样本。
5. 聚合低分维度和典型错误。
6. 修改 Prompt 或 Agent 流程。
7. 重新运行同一评测集，比较分数变化。
8. 如果新版本总分提升且高风险项不增加，再合入主流程。

## 与真实用户反馈结合

后续可以把用户前台的复盘数据匿名化进入评测平台：

- 用户最终发布稿。
- 发布后数据。
- 用户对 Agent 建议是否采纳。
- 用户手动反馈：有用、一般、没用。
- 后续内容是否继续沿用 Agent 建议。

平台可以比较：

- 自动评测认为高分的内容，用户是否真的觉得有用。
- 复盘 Agent 判断的问题，是否和用户后续反馈一致。
- 哪些维度最能预测用户满意度，例如素材绑定度、内容可用性、复盘质量。

## MVP 建议

第一阶段不需要真的做完整后台，可以按这个顺序敏捷推进：

1. 继续维护 `eval/rubric.json` 和 `eval/cases.json`。
2. 每次 Prompt 改动后跑 `npm run eval:live`。
3. 把 Markdown 报告作为人工复核入口。
4. 在报告 JSON 中补人工评分字段。
5. 后续再用简单 Web 页面读取 reports，做趋势图和用例详情。

这样既能在比赛/面试中讲出平台化路线，也不会现在就把工程量膨胀到不可控。
