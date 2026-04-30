# 国内服务器部署教程

推荐使用腾讯云轻量应用服务器，镜像选择 Ubuntu。部署后可以用服务器公网 IP 访问 Demo。

## 1. 买服务器

建议配置：

```text
地域：广州 / 上海 / 北京任选，离评委和朋友近一点即可
系统镜像：Ubuntu 22.04 LTS
配置：最低配即可
带宽：1-3 Mbps 可用，越高越稳
```

## 2. 放通端口

在腾讯云轻量应用服务器控制台里找到服务器，进入「防火墙」，添加规则：

```text
协议：TCP
端口：8080
策略：允许
```

如果后面绑定域名，再额外开放：

```text
TCP 80
TCP 443
```

## 3. 登录服务器

在腾讯云控制台点「登录」，进入 WebShell。

## 4. 安装 Docker

在服务器里依次执行：

```bash
curl -fsSL https://get.docker.com | bash
systemctl enable docker
systemctl start docker
```

## 5. 上传代码

最简单的方式：把 GitHub 仓库拉到服务器。

```bash
git clone 你的GitHub仓库地址 koc-growth-assistant
cd koc-growth-assistant
```

如果服务器提示没有 git，先执行：

```bash
apt update
apt install -y git
```

## 6. 创建环境变量文件

在服务器项目目录里创建 `.env`：

```bash
cat > .env <<'EOF'
KIMI_API_KEY=你的KimiKey
KIMI_MODEL=kimi-k2.6
KIMI_BASE_URL=https://api.moonshot.cn/v1
HOST=0.0.0.0
PORT=8080
RATE_LIMIT_MAX=12
RATE_LIMIT_WINDOW_MS=60000
EOF
```

不要把 `.env` 上传到 GitHub。

`/api/history` 默认关闭。只有你需要临时查看最近生成记录时，才在 `.env` 里加 `HISTORY_TOKEN=一段足够随机的管理密码`，访问时带上 `Authorization: Bearer <HISTORY_TOKEN>`。

## 7. 构建并启动

```bash
docker build -t koc-growth-assistant .
docker run -d --name koc-growth-assistant --env-file .env -p 8080:8080 --restart unless-stopped koc-growth-assistant
```

## 8. 测试

浏览器打开：

```text
http://服务器公网IP:8080
```

健康检查：

```text
http://服务器公网IP:8080/api/health
```

看到 `kimiConfigured: true` 就说明 Key 已经被服务读取。

## 9. 更新代码

如果之后改了代码，在服务器目录里执行：

```bash
git pull
docker stop koc-growth-assistant
docker rm koc-growth-assistant
docker build -t koc-growth-assistant .
docker run -d --name koc-growth-assistant --env-file .env -p 8080:8080 --restart unless-stopped koc-growth-assistant
```
