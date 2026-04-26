# KOC Growth Assistant Demo

一个面向普通 KOC 的 AI 起号与内容生成 Demo。前端为静态页面，后端通过 Node.js 转发 Kimi API，避免 API Key 暴露到浏览器。

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
```

`PORT` 通常由部署平台自动注入，不需要手动填写。

## 健康检查

部署后可以访问：

```text
/api/health
```

如果返回 `ok: true` 且 `kimiConfigured: true`，说明服务和 Kimi Key 已配置成功。
