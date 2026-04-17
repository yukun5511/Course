# cpolar 外网穿透配置指南

**优势**: 免费、稳定、国内服务器、支持自定义域名

---

## 📥 第1步：下载 cpolar

1. 访问：**https://www.cpolar.com/**
2. 点击 **下载** → **Windows 客户端**
3. 安装（下一步即可）

---

## 🔑 第2步：注册并获取 Token

1. 访问：**https://dashboard.cpolar.com/signup**
2. 注册账号（手机号或邮箱）
3. 登录后进入 **仪表盘**
4. 复制 **Authtoken**（在个人中心）

---

## ⚙️ 第3步：配置 cpolar

### 方式A：图形界面（推荐）

1. 打开 cpolar
2. 粘贴 Authtoken
3. 点击 **添加隧道**
4. 配置：
   - **隧道协议**：HTTP
   - **本地地址**：`127.0.0.1:3000`
   - **域名类型**：免费域名
5. 点击 **启动**

### 方式B：命令行

```powershell
# 配置 token
cpolar authtoken 您的Token

# 启动隧道
cpolar http 3000
```

---

## 🌐 第4步：获取外网地址

启动后，cpolar 会显示：

```
Forwarding: http://abc123.cpolar.cn -> http://localhost:3000
```

**您的外网地址**：
```
http://abc123.cpolar.cn
```

**管理后台登录**：
```
http://abc123.cpolar.cn/admin/login
```

---

## 📊 cpolar 免费版特性

| 特性 | 说明 |
|------|------|
| **隧道数量** | 2个 |
| **带宽** | 1Mbps |
| **域名** | 随机免费域名 |
| **流量** | 不限 |
| **在线时长** | 不限 |

---

## 💡 提示

- cpolar 支持 **WebSocket**，适合前后端分离项目
- 免费版有广告，可升级到标准版（¥9/月）去除广告
- 支持 **自定义域名**（需备案）

---

**祝您使用愉快！** 🚀
