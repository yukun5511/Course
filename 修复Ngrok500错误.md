# 修复 Ngrok 500 错误 - 重要

**问题**: 访问 ngrok 地址时显示 500 错误或安全警告页面

**原因**: ngrok 免费版会显示浏览器警告页面，需要添加特殊的响应头才能跳过

---

## ✅ 已完成的修复

我已经为您创建了 `NgrokWarningInterceptor` 拦截器，会自动为所有响应添加跳过警告的头。

**修改的文件**:
1. ✅ 新建: `backend/src/main/java/com/course/interceptor/NgrokWarningInterceptor.java`
2. ✅ 修改: `backend/src/main/java/com/course/config/WebConfig.java`

---

## 🔄 现在需要您做的

### 步骤1：重启后端服务

**在运行后端的窗口**：

1. 按 `Ctrl + C` 停止当前后端
2. 重新启动：

```bash
cd d:\Myproject\Course\backend
mvn spring-boot:run
```

等待看到：
```
Started CourseApplication in X.XXX seconds
```

---

### 步骤2：测试访问

重启后，在浏览器访问：

```
https://cheesy-resubmit-moonwalk.ngrok-free.dev/api/test/ping
```

**预期结果**：
```json
{
  "code": 200,
  "message": "pong",
  "data": null
}
```

---

## 🎯 如果还是不行

### 方案A：前端请求时添加头

在前端的 API 请求中添加这个头：

```typescript
// frontend/src/api/client.ts
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'ngrok-skip-browser-warning': 'true',  // 添加这行
    'Content-Type': 'application/json',
  },
});
```

---

### 方案B：使用付费版 Ngrok

付费版不会有这个警告：
- $5/月起
- 固定域名
- 无警告页面
- 更多功能

---

## 📝 为什么会出现这个问题？

Ngrok 免费版为了防止恶意使用，会在用户首次访问时显示一个确认页面：

```
"You are about to visit xxx.ngrok.io...
This website is served for free through ngrok.com.
You should only visit this website if you trust whoever sent the link to you."
```

**解决方案**：
1. 在响应中添加 `ngrok-skip-browser-warning: true` 头（我们已实现）
2. 或在请求中添加 `ngrok-skip-browser-warning: true` 头
3. 或升级到付费版

---

## ✅ 验证清单

- [ ] 后端已重启
- [ ] 看到 "Started CourseApplication" 日志
- [ ] 访问 `/api/test/ping` 返回 200
- [ ] 不再显示安全警告页面
- [ ] 可以正常访问所有 API

---

## 📞 如果遇到问题

**查看后端日志**：
```bash
# 在后端窗口查看是否有错误
tail -f backend/logs/application.log
```

**测试本地是否正常**：
```bash
# 先测试本地
curl http://localhost:8082/api/test/ping

# 再测试 ngrok
curl https://cheesy-resubmit-moonwalk.ngrok-free.dev/api/test/ping
```

---

**重启后端后应该就能正常访问了！** 🎉
