# GrowthMate Agent Demo

一个面向普通 KOC 的 AI 内容增长 Agent Demo。产品覆盖“画像诊断-增长任务规划-内容生成-发布执行-复盘迭代”的闭环，不只是生成单篇文案，而是帮助创作者判断下一步怎么起号、怎么发布、怎么根据数据继续迭代。

前端为静态页面，后端通过 Node.js 转发 Kimi API，避免 API Key 暴露到浏览器。

## 核心能力

- Agent 诊断：基于创作者阶段、素材、优势和卡点，判断账号阻塞点与第一优先级。
- 增长任务：生成 7 天增长任务，每天包含目标、素材、观察指标和下一步信号。
- 内容生成：针对某一天任务生成图文、视频脚本、素材清单和发布建议。
- 发布执行：输出标题测试、发布时间、首评互动和后续观察重点。
- 复盘迭代：用户手动输入发布数据后，Agent 判断问题归因并给出下一条任务。

## 本地运行

1. 复制环境变量文件：

```bash
cp .env.example .env.local
```

2. 在 `.env.local` 中填写 `KIMI_API_KEY`。

3. 启动服务：

```bash
npm run dev
```

4. 打开：

```text
http://localhost:5173
```

如果 `.env.local` 里改了 `PORT`，以实际端口为准。

## 上线部署

推荐部署到 Railway、Render、Zeabur 或腾讯云轻量服务器。部署平台需要使用：

```bash
npm start
```

必须配置环境变量：

```text
KIMI_API_KEY=你的 Kimi API Key
KIMI_MODEL=kimi-k2.6
KIMI_BASE_URL=https://api.moonshot.cn/v1
HOST=0.0.0.0
RATE_LIMIT_MAX=12
RATE_LIMIT_WINDOW_MS=60000
```

`PORT` 通常由部署平台自动注入，不需要手动填写。

`/api/history` 默认不开放。如果确实需要查看最近生成记录，额外设置 `HISTORY_TOKEN`，并用 `Authorization: Bearer <HISTORY_TOKEN>` 访问。不要在公开页面暴露这个 token。

## 健康检查

部署后可以访问：

```text
/api/health
```

如果返回 `ok: true` 且 `kimiConfigured: true`，说明服务和 Kimi Key 已配置成功。

## 安全说明

服务只暴露前端页面、样式、脚本和 `assets/` 静态资源；`.env`、`data/`、`package.json` 等项目文件不会被浏览器直接读取。生成历史会写入本地 `data/generations.jsonl`，该目录已加入 `.gitignore`，上线时也建议定期清理或改接数据库。

## API 概览

- `POST /api/generate`：生成 Agent 诊断、7 天增长任务和发布策略。
- `POST /api/content`：基于选中任务生成完整图文或视频内容。
- `POST /api/review`：基于手动输入的发布数据生成复盘结论和下一条任务。
- `GET /api/health`：服务健康检查。
- `GET /api/history`：可选调试接口，需要 `HISTORY_TOKEN`。

## 后续 TODO

- 建立内容质量评分体系：标题点击力、素材绑定度、可保存结构、互动触发、平台适配。
- 建立 Prompt 评测集，用典型 KOC 样例持续对比输出质量。
- 将本地 JSONL 历史记录升级为数据库与多用户方案管理。
