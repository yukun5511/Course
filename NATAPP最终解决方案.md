# 🚨 NATAPP外网穿透 - 最终解决方案

## 问题分析

免费版NATAPP只能穿透一个端口，无法同时穿透前端(3000)和后端(8082)。

当前情况：
- ✅ NATAPP穿透了3000端口（前端）
- ✅ 前端可以访问
- ❌ 前端调用 `/api` 时，请求被发到3000端口（没有后端）
- ❌ 登录失败

## 解决方案

### 方案1：使用开发模式（推荐，简单）

开发模式的Vite有代理功能，可以转发API请求。

**步骤**：

1. **停止所有服务**
   - 关闭NATAPP窗口
   - 关闭前端serve窗口

2. **使用开发模式启动前端**
   ```powershell
   cd d:\Myproject\Course\frontend
   npm run dev
   ```
   Vite会自动代理 `/api` 到 `http://localhost:8082`

3. **启动NATAPP穿透3000端口**
   ```powershell
   cd d:\Myproject\Course
   .\natapp\natapp.exe -config=natapp\config-final.ini
   ```

4. **访问**
   ```
   http://vc9abe67.natappfree.cc/admin/login
   ```

**优势**：
- ✅ 简单，无需修改代码
- ✅ Vite自动代理API请求
- ✅ 开发模式有热更新

**劣势**：
- ⚠️ 性能不如生产版本
- ⚠️ 文件较大

---

### 方案2：升级NATAPP付费版（长期方案）

付费版支持多隧道和路径转发。

**费用**：¥9/月起

**配置**：
- 隧道1：vc9abe67.natappfree.cc → 3000（前端）
- 隧道2：vc9abe67.natappfree.cc/api/* → 8082（后端API）

---

### 方案3：使用其他工具（推荐）

**推荐工具**：

1. **Cloudflare Tunnel**（免费，支持多服务）
   - 官网：https://www.cloudflare.com/products/tunnel/
   - 支持配置多个服务
   - 完全免费

2. **Ngrok付费版**（$5/月）
   - 支持多隧道
   - 稳定可靠

---

## 立即使用方案1（开发模式）

**执行以下步骤**：

### 1. 停止当前服务
关闭所有NATAPP和serve窗口

### 2. 启动后端（如果未运行）
```powershell
cd d:\Myproject\Course\backend
mvn spring-boot:run
```

### 3. 启动前端（开发模式）
```powershell
cd d:\Myproject\Course\frontend
npm run dev
```

### 4. 启动NATAPP
```powershell
cd d:\Myproject\Course
.\natapp\natapp.exe -config=natapp\config-final.ini
```

### 5. 访问
```
http://vc9abe67.natappfree.cc/admin/login
```

**账号**：`ADMIN001`  
**密码**：`admin123`

---

## 为什么生产版本不行？

生产版本（`serve -s dist`）是纯静态文件服务器：
- ❌ 没有代理功能
- ❌ 无法转发 `/api` 请求
- ❌ 所有请求都返回静态文件

开发版本（`npm run dev`）使用Vite：
- ✅ 内置代理功能
- ✅ 可以将 `/api` 转发到后端
- ✅ vite.config.ts 中有代理配置

---

**现在就使用方案1（开发模式）吧！** 🚀

这是最简单有效的解决方案！
