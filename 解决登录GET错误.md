# 🔧 解决登录GET方法错误

## 问题

后端报错：`HttpRequestMethodNotSupportedException: Request method 'GET' is not supported`

## 原因

浏览器缓存了旧的JavaScript文件，导致发送了错误的HTTP请求方法。

## ✅ 解决方案

### 方案1：强制刷新浏览器（推荐）

**Windows/Linux**：
```
Ctrl + Shift + R
```
或
```
Ctrl + F5
```

**Mac**：
```
Cmd + Shift + R
```

---

### 方案2：清除浏览器缓存

**Chrome/Edge**：
1. 按 `F12` 打开开发者工具
2. 右键点击刷新按钮
3. 选择"清空缓存并硬性重新加载"

**或者**：
1. 按 `Ctrl + Shift + Delete`
2. 选择"缓存的图片和文件"
3. 点击"清除数据"
4. 刷新页面

---

### 方案3：无痕模式测试

打开无痕/隐私模式访问：
```
http://vc9abe67.natappfree.cc/admin/login
```

如果无痕模式正常，说明确实是缓存问题。

---

### 方案4：重启前端服务

如果以上都不行，重启前端：

```powershell
# 停止前端（Ctrl + C）
# 然后重新启动
cd d:\Myproject\Course\frontend
npm run dev
```

---

## 📋 验证步骤

1. **强制刷新浏览器**（Ctrl + Shift + R）
2. **打开开发者工具**（F12）
3. **查看 Network 标签**
4. **尝试登录**
5. **检查请求方法** - 应该是 POST

---

## 💡 提示

- 前端代码是正确的（使用POST方法）
- 后端代码是正确的（接受POST方法）
- 99%是浏览器缓存问题

---

**立即尝试强制刷新（Ctrl + Shift + R）！** 🚀
