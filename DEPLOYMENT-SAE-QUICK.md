# 课程管理系统 - SAE 快速部署指南（IP访问版）

> **最经济方案**：使用SAE内置MySQL + 公网IP直接访问，无需域名  
> **预估费用**: ¥10-29/月  
> **部署时间**: 30 分钟

---

## 📋 方案优势

- ✅ **零域名成本**：直接使用SAE提供的公网IP访问
- ✅ **内置数据库**：使用SAE内置MySQL免费额度（1GB）
- ✅ **前端集成**：前端打包到后端JAR，统一访问入口
- ✅ **无需备案**：IP访问不需要域名备案
- ✅ **极简部署**：一键脚本完成构建打包

---

## 🚀 快速部署（3步完成）

### 步骤 1: 运行一键部署脚本

```powershell
# 在项目根目录执行
.\deploy-sae.ps1
```

脚本会自动完成：
1. 构建前端（生产环境）
2. 复制前端到后端静态资源目录
3. 构建后端JAR包
4. 显示部署说明

### 步骤 2: 创建SAE应用

1. 登录 [SAE控制台](https://sae.console.aliyun.com/)
2. 点击 **创建应用**
3. 配置如下：

```
基本信息:
- 应用名称: course-management
- 地域: 华东1-杭州（或就近地域）

部署方式:
- 部署包类型: JAR
- 部署包来源: 本地上传
- 选择文件: backend/target/course-management-1.0.0.jar

应用配置:
- 规格类型: 标准规格
- 实例规格: 0.5核 1GB（最低配置）
- 实例数量: 1
- JDK 版本: OpenJDK 17

网络配置:
- 专有网络: 默认或新建
- 公网访问: 开启（获取公网IP）
```

### 步骤 3: 创建RDS MySQL数据库

**重要**：SAE不提供内置数据库，需要单独创建RDS MySQL

1. 访问 [RDS控制台](https://rdsnext.console.aliyun.com/)
2. 创建MySQL实例：
   ```
   - 数据库类型: MySQL 8.0
   - 规格: 1核2GB 基础版
   - 存储: 40GB
   - 地域: 与SAE相同
   - 网络: 专有网络（与SAE相同VPC）
   ```
3. 创建数据库和用户：
   ```sql
   CREATE DATABASE course_db CHARACTER SET utf8mb4;
   CREATE USER 'course_user'@'%' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON course_db.* TO 'course_user'@'%';
   ```
4. 配置白名单：添加SAE的VPC网段
5. 导入数据：
   ```bash
   mysql -h <RDS内网地址> -u course_user -p course_db < backend/src/main/resources/db/init.sql
   ```

### 步骤 4: 配置环境变量

在SAE控制台 -> 应用设置 -> 环境变量中添加：

```bash
SPRING_PROFILES_ACTIVE=sae
SPRING_DATASOURCE_URL=jdbc:mysql://<RDS内网地址>:3306/course_db?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai&useSSL=true
SPRING_DATASOURCE_USERNAME=course_user
SPRING_DATASOURCE_PASSWORD=你的数据库密码
JWT_SECRET=course-management-sae-production-secret-key-2024-very-long
FILE_UPLOAD_PATH=/tmp/uploads
```

点击 **部署**，等待3-5分钟完成。

---

## 📊 访问地址

部署完成后，在SAE控制台获取公网IP：

```
管理后台: http://<SAE公网IP>:8082/
API接口:  http://<SAE公网IP>:8082/api/...
```

**示例**：
```
http://121.196.123.45:8082/
```

---

## 🔍 验证部署

```powershell
# 测试API健康检查
curl http://<SAE公网IP>:8082/api/health

# 测试登录接口
curl -X POST http://<SAE公网IP>:8082/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"username":"ADMIN001","password":"admin123"}'

# 浏览器访问前端
# 打开: http://<SAE公网IP>:8082/
```

---

## 🗄️ 数据库初始化

### 方式1：SAE控制台SQL执行（推荐）

1. SAE控制台 -> 应用 -> 数据库管理
2. 执行 `backend/src/main/resources/db/init.sql` 脚本

### 方式2：命令行导入

```bash
# 获取SAE内置MySQL连接信息（在控制台查看）
mysql -h 127.0.0.1 -P 3306 -u root -p course_db < backend/src/main/resources/db/init.sql
```

---

## 💰 费用明细

| 组件 | 配置 | 月费用 |
|------|------|--------|
| SAE应用 | 0.5核1GB × 1实例 | ¥29（包月）或 ¥10-20（按量） |
| RDS MySQL | 1核2GB 40GB 基础版 | ¥35 |
| 公网IP | SAE自带 | ¥0 |
| 域名 | 不需要 | ¥0 |
| **合计** | - | **¥45-64/月** |

---

## ⚙️ 更新部署

当代码有更新时：

```powershell
# 重新运行部署脚本
.\deploy-sae.ps1

# 然后在SAE控制台：
# 1. 应用管理 -> 部署管理
# 2. 创建新版本 -> 上传新JAR包
# 3. 部署
```

---

## ⚠️ 注意事项

### RDS数据库配置
- 需要单独创建RDS MySQL实例
- 确保SAE和RDS在同一VPC
- 配置白名单允许SAE访问
- 初期可使用1核2GB基础版（¥35/月）

### IP访问限制
- 微信小程序要求HTTPS域名（IP不可用）
- 仅适合Web管理后台和H5访问
- 如需小程序，后续可添加域名（¥6/年）

### 安全建议
- 修改默认JWT密钥
- 设置强数据库密码
- 限制SAE安全组访问IP（如可能）

---

## 📁 项目结构

```
Course/
├── backend/
│   ├── src/main/resources/
│   │   ├── application.yml          # 主配置
│   │   ├── application-sae.yml      # SAE生产配置（新增）
│   │   ├── static/                  # 前端静态资源（构建后生成）
│   │   └── db/init.sql              # 数据库初始化脚本
│   └── target/
│       └── course-management-1.0.0.jar  # 部署包
├── frontend/
│   ├── .env.production              # 生产环境配置
│   └── dist/                        # 构建产物
└── deploy-sae.ps1                   # 一键部署脚本（新增）
```

---

## 🔧 故障排查

### 应用启动失败
```
1. 查看SAE日志：控制台 -> 日志管理 -> 实时日志
2. 常见问题：
   - 数据库连接失败：检查环境变量
   - 端口冲突：确保使用8082端口
   - JAR包损坏：重新运行部署脚本
```

### 前端无法访问
```
1. 检查static目录是否存在于JAR包中
2. 重新运行部署脚本
3. 查看应用日志确认静态资源配置
```

### 数据库初始化失败
```
1. 确认数据库已创建
2. 检查init.sql脚本语法
3. 手动执行SQL排查错误
```

---

## 📞 技术支持

- SAE文档：https://help.aliyun.com/product/52367.html
- 常见问题：参见 [DEPLOYMENT-SAE.md](./DEPLOYMENT-SAE.md)

---

**文档版本**: v1.0  
**最后更新**: 2026-04-17  
**适用场景**: 内部系统、低预算、快速部署
