# ⚠️ NATAPP 未安装

## 问题

NATAPP可执行文件不存在，需要先下载。

## 📥 立即下载

### 步骤1：访问官网
打开浏览器访问：**https://natapp.cn/**

### 步骤2：下载客户端
1. 点击顶部菜单 **下载**
2. 选择 **Windows 64位版本**
3. 下载ZIP文件

### 步骤3：解压
1. 找到下载的ZIP文件
2. 解压到：`d:\Myproject\Course\natapp\`
3. 确保目录结构如下：

```
d:\Myproject\Course\natapp\
  ├── natapp.exe  ← 必须有这个文件
  └── config.ini  ← 已有
```

### 步骤4：确认Authtoken
检查 `natapp\config.ini` 文件，确保已填写您的Authtoken：

```ini
authtoken=您的真实Authtoken
```

### 步骤5：启动NATAPP
双击运行：
```
启动NATAPP穿透.bat
```

或者在PowerShell运行：
```powershell
cd d:\Myproject\Course
.\natapp\natapp.exe -config=natapp\config.ini
```

---

## 🔍 验证

启动后应该看到：
```
Forwarding: http://xxxxx.natappfree.cc -> http://127.0.0.1:3000
```

然后访问：
```
http://xxxxx.natappfree.cc/admin/login
```

---

## 💡 提示

- NATAPP需要保持运行，关闭窗口就会停止
- 生产版本已构建，运行在3000端口
- 只需下载一次，之后直接用即可

---

**现在就下载吧！** 🚀

官网：https://natapp.cn/
