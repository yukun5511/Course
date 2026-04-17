# Ngrok 外网穿透配置指南

**创建时间**: 2026-04-16 15:10  
**状态**: ✅ Ngrok 已安装，需要配置

---

## 📋 当前状态

- ✅ Ngrok 3.37.6 已安装（最新版本）
- ⬜ 需要注册账号并配置 Token
- ⬜ 需要启动穿透服务

---

## 🚀 快速开始（3步搞定）

### 步骤1：注册 Ngrok 账号

1. 访问：https://ngrok.com
2. 点击 **Sign Up** 注册账号
3. 或使用 GitHub/Google 账号登录

---

### 步骤2：获取 Authtoken

1. 登录后进入 **Dashboard**（控制台）
2. 在左侧菜单找到 **Getting Started** 或 **Your Authtoken**
3. 复制您的 authtoken（类似：`2AbCdEfGhIjKlMnOpQrStUvWxYz_123456789`）

**Token 位置**：
```
Dashboard → Your Authtoken
或直接访问：https://dashboard.ngrok.com/get-started/your-authtoken
```

---

### 步骤3：运行配置脚本（推荐）

**方式A：使用自动化脚本（最简单）**

双击运行项目根目录的：
```
启动外网穿透.bat
```

脚本会自动：
1. 检查 ngrok 安装
2. 提示输入 token
3. 配置 token
4. 选择要穿透的服务
5. 启动穿透

---

**方式B：手动配置**

直接在项目根目录运行：
```powershell
cd d:\Myproject\Course

# 1. 配置 token（替换为您的实际token）
.\ngrok\ngrok.exe config add-authtoken 您的authtoken

# 2. 启动后端穿透
.\ngrok\ngrok.exe http 8082 --region=ap

# 或启动前端穿透
.\ngrok\ngrok.exe http 3000 --region=ap
```

---

## 📊 启动后的输出示例

启动 ngrok 后，您会看到类似这样的输出：

```
ngrok by @inconshreveable

Session Status                online
Account                       Your Name (Plan: Free)
Version                       3.3.1
Region                        Asia Pacific (ap)
Latency                       25ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok.io -> http://localhost:8082
Forwarding                    http://abc123.ngrok.io -> http://localhost:8082

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**关键信息**：
- `Forwarding`: 您的外网访问地址
- `Web Interface`: http://127.0.0.1:4040 - 可以查看请求详情

---

## 🌐 访问您的服务

### 后端 API

```
HTTPS（推荐）: https://abc123.ngrok.io/api/test/ping
HTTP: http://abc123.ngrok.io/api/test/ping
```

### 前端页面

```
HTTPS（推荐）: https://def456.ngrok.io
HTTP: http://def456.ngrok.io
```

**将 `abc123.ngrok.io` 替换为您的实际域名**

---

## 📱 分享给他人

现在任何人（包括手机）都可以通过外网地址访问您的服务：

1. **复制 Forwarding 地址**
2. **发送给朋友/同事**
3. **在任何设备上访问**（需要互联网连接）

---

## ⚙️ 常用命令

### 查看所有配置
```bash
ngrok config check
```

### 查看历史会话
```bash
ngrok http 8082 --log=stdout
```

### 指定区域（加速访问）
```bash
# 选择离用户最近的区域
ngrok http 8082 --region=ap    # 亚太（推荐中国用户）
ngrok http 8082 --region=us    # 美国
ngrok http 8082 --region=eu    # 欧洲
```

### 同时穿透多个端口
```bash
# 创建配置文件 ngrok.yml
version: "2"
authtoken: your-authtoken
tunnels:
  backend:
    addr: 8082
    proto: http
  frontend:
    addr: 3000
    proto: http

# 启动所有隧道
ngrok start --all
```

---

## 🔒 安全注意事项

### 免费版本限制
- ⚠️ 每次重启会生成新的域名
- ⚠️ 8 小时后会断开连接
- ⚠️ 有流量限制（40MB/分钟）
- ⚠️ 不支持自定义域名

### 安全建议
1. **不要暴露敏感信息**
   - 移除测试账号
   - 关闭 Swagger 文档
   - 限制 API 访问

2. **使用 HTTPS**
   - Ngrok 自动提供 HTTPS
   - 始终使用 https:// 地址

3. **监控访问**
   - 访问 http://127.0.0.1:4040 查看所有请求
   - 定期检查访问日志

4. **及时关闭**
   - 演示结束后立即关闭
   - 按 `Ctrl+C` 停止 ngrok

---

##  免费 vs 付费

| 特性 | 免费版 | 付费版 ($5/月起) |
|------|--------|-----------------|
| 域名固定 | ❌ 每次变化 | ✅ 固定域名 |
| HTTPS | ✅ | ✅ |
| 自定义域名 | ❌ | ✅ |
| 流量限制 | 40MB/分钟 | 更高 |
| 连接时长 | 8小时 | 无限制 |
| TCP 穿透 | ❌ | ✅ |
| Web 检查器 | ✅ | ✅ |

**对于临时演示，免费版完全够用！**

---

## 🚨 常见问题

### Q1: 提示 "authentication failed"
**解决**：
```bash
# 重新配置 token
ngrok config add-authtoken 您的token
```

### Q2: 端口被占用
**解决**：
```bash
# 检查端口占用
netstat -ano | findstr :8082

# 结束占用进程
taskkill /PID 进程ID /F
```

### Q3: 连接速度慢
**解决**：
```bash
# 指定更近的区域
ngrok http 8082 --region=ap
```

### Q4: 如何停止 ngrok
**解决**：
```
在运行 ngrok 的窗口按 Ctrl+C
```

### Q5: 前端访问后端跨域问题
**解决**：
修改前端 API 配置，使用 ngrok 地址：
```typescript
// vite.config.ts
proxy: {
  '/api': {
    target: 'https://abc123.ngrok.io',  // 使用ngrok地址
    changeOrigin: true,
    secure: false,
  },
}
```

---

## 📞 获取帮助

- **Ngrok 文档**: https://ngrok.com/docs
- **状态页面**: https://status.ngrok.com
- **支持论坛**: https://community.ngrok.com

---

## ✅ 配置检查清单

- [ ] Ngrok 已安装 (`ngrok version`)
- [ ] 已注册 Ngrok 账号
- [ ] 已获取 authtoken
- [ ] 已配置 token (`ngrok config add-authtoken`)
- [ ] 后端服务已启动 (端口 8082)
- [ ] 前端服务已启动 (端口 3000)
- [ ] Ngrok 已启动并获取到外网地址
- [ ] 外网访问测试成功

---

**配置完成后，您的服务就可以从互联网任何地方访问了！** 🎉
