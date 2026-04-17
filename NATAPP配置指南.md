# NATAPP 外网穿透配置指南

**状态**: 需要手动下载和配置  
**优势**: 国内服务器，速度快，延迟低

---

## 📥 第1步：下载 NATAPP

### 方式A：官网下载（推荐）

1. 访问：**https://natapp.cn/**
2. 点击顶部菜单 **下载**
3. 下载 **Windows 64位版本**
4. 解压到项目目录：`d:\Myproject\Course\natapp\`

### 方式B：备用下载

如果官网慢，可以尝试：
- 百度网盘：搜索 "natapp windows"
- 或使用其他国内穿透工具（花生壳、cpolar等）

---

## 🔑 第2步：注册并获取 Authtoken

1. 访问：**https://natapp.cn/**
2. 注册账号（手机号或邮箱）
3. 登录后进入 **我的隧道** → **购买免费隧道**
4. 选择 **免费隧道**（无需付费）
5. 配置隧道：
   - 端口：`3000`（前端）
   - 协议：`http`
6. 复制 **Authtoken**（在控制台首页）

---

## ⚙️ 第3步：配置 NATAPP

### 创建配置文件

在项目根目录创建 `natapp\config.ini`：

```ini
# NATAPP 配置文件
authtoken=您的Authtoken（从控制台复制）

# 隧道配置
clienttoken=
log=stdout
loglevel=INFO
http_proxy=
```

### 或者使用命令行配置

```bash
# 在项目根目录运行
natapp -authtoken=您的Authtoken
```

---

## 🚀 第4步：启动 NATAPP

### 方式A：使用脚本（推荐）

创建并运行 `启动NATAPP穿透.bat`：

```batch
@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ========================================
echo   NATAPP 外网穿透启动
echo ========================================
echo.

set NATAPP=natapp\natapp.exe

if not exist "%NATAPP%" (
    echo [错误] 找不到 natapp.exe
    echo 请先下载并解压到 natapp\ 目录
    pause
    exit /b 1
)

echo 正在启动 NATAPP 穿透 (端口 3000)...
echo.
echo 请在控制台查看外网地址
echo.

%NATAPP% -authtoken=您的Authtoken
```

### 方式B：直接运行

```powershell
cd d:\Myproject\Course
.\natapp\natapp.exe -authtoken=您的Authtoken
```

---

## 🌐 第5步：获取外网地址

启动后，NATAPP 会显示类似：

```
Tunnel Status         Online
Version               4.2.6
Forwarding            http://abc123.natappfree.cc -> http://localhost:3000
Web Interface         http://127.0.0.1:4040
```

**您的外网地址**：
```
http://abc123.natappfree.cc
```

**管理后台登录**：
```
http://abc123.natappfree.cc/admin/login
```

---

## ✅ 验证访问

在浏览器访问您的外网地址：
```
http://您的域名.natappfree.cc/admin/login
```

**应该能看到登录页面，而且速度比ngrok快很多！**

---

## 📊 NATAPP vs Ngrok

| 特性 | NATAPP | Ngrok |
|------|--------|-------|
| **速度** | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **延迟** | 50-100ms | 200-500ms |
| **服务器位置** | 国内 | 境外 |
| **免费域名** | ✅ 固定 | ❌ 每次变化 |
| **带宽限制** | 较少 | 40MB/分钟 |
| **稳定性** | 较好 | 一般 |
| **中文支持** | ✅ | ❌ |

---

## 💡 常见问题

### Q1: 提示 "authtoken is null"
**解决**：确保在命令行或配置文件中正确设置了 authtoken

### Q2: 隧道不可用
**解决**：
1. 检查是否购买了免费隧道
2. 确认端口配置为 3000
3. 查看 NATAPP 控制台状态

### Q3: 访问速度慢
**解决**：
1. 免费隧道有限速，考虑购买付费隧道（¥9/月起）
2. 检查网络是否正常

### Q4: 如何停止 NATAPP
**解决**：在运行窗口按 `Ctrl + C`

---

## 🔧 高级配置

### 配置多个隧道

编辑 `config.ini`：

```ini
authtoken=您的Authtoken
log=stdout

# 前端隧道
[web]
proto=http
localport=3000

# 后端隧道（如果需要）
[api]
proto=http
localport=8082
```

启动所有隧道：
```bash
natapp -config=config.ini
```

---

## 📞 获取帮助

- **官网**: https://natapp.cn
- **文档**: https://natapp.cn/article/natapp_newbie
- **常见问题**: https://natapp.cn/site/faq
- **客服**: 官网在线聊天

---

## ✅ 配置检查清单

- [ ] 已下载 NATAPP 并解压到 `natapp\` 目录
- [ ] 已注册 NATAPP 账号
- [ ] 已创建免费隧道（端口3000）
- [ ] 已复制 Authtoken
- [ ] 已配置 authtoken（命令行或配置文件）
- [ ] 已启动 NATAPP
- [ ] 获取到外网地址
- [ ] 外网访问测试成功

---

## 🎯 下一步

**配置完成后**：

1. 访问外网地址测试登录功能
2. 将地址分享给其他人
3. 如需长期使用，考虑购买付费隧道（¥9/月）

---

**祝您使用愉快！** 🚀
