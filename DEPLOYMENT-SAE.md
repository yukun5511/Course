# 课程管理系统 - 阿里云 SAE 部署方案

> **适用场景**: 内部系统、用户量小（<100人）、低并发  
> **预估费用**: ¥30-100/月  
> **部署时间**: 20 分钟

---

## 📋 目录

- [一、为什么选择 SAE](#一为什么选择-sae)
- [二、SAE vs ECS 对比](#二sae-vs-ecs-对比)
- [三、架构设计](#三架构设计)
- [四、准备工作](#四准备工作)
- [五、后端部署（Spring Boot）](#五后端部署spring-boot)
- [六、前端部署（OSS+CDN）](#六前端部署osscdn)
- [七、数据库配置](#七数据库配置)
- [八、文件存储配置](#八文件存储配置)
- [九、域名与HTTPS](#九域名与https)
- [十、微信小程序配置](#十微信小程序配置)
- [十一、费用明细](#十一费用明细)
- [十二、运维指南](#十二运维指南)
- [十三、常见问题](#十三常见问题)

---

## 一、为什么选择 SAE

### 1.1 SAE 是什么？

**SAE（Serverless App Engine）** 是阿里云推出的 Serverless PaaS 平台：
- 无需管理服务器（ECS）
- 支持 WAR/JAR 包直接部署
- 自动弹性伸缩
- 按实际使用量计费
- 内置负载均衡、监控、日志

### 1.2 适合你的场景

| 特征 | 你的系统 | SAE 匹配度 |
|------|---------|-----------|
| 用户量 | <100人（内部） | ✅ 完美 |
| 并发量 | 低（<50并发） | ✅ 完美 |
| 访问频率 | 工作日使用 | ✅ 适合 |
| 运维能力 | 希望简化 | ✅ 零运维 |
| 成本控制 | 越低越好 | ✅ 按量付费 |
| 技术栈 | Spring Boot | ✅ 原生支持 |

---

## 二、SAE vs ECS 对比

| 对比项 | SAE（推荐） | ECS |
|--------|------------|-----|
| **月费用** | ¥30-100 | ¥165-520 |
| **运维成本** | 零运维 | 需手动维护 |
| **部署难度** | ⭐ 简单 | ⭐⭐⭐ 复杂 |
| **冷启动** | 5-15秒 | 无 |
| **弹性伸缩** | 自动 | 手动 |
| **负载均衡** | 内置 | 需单独购买 SLB |
| **SSL 证书** | 自动配置 | 手动配置 |
| **监控日志** | 内置 | 需手动配置 |
| **数据库** | 需外置 RDS | 可本地或 RDS |
| **文件存储** | 需 OSS/NAS | 本地磁盘 |
| **适合场景** | 内部系统、小流量 | 生产环境、大流量 |

**结论**: 你的场景选择 SAE 可以节省 **60-80% 成本**，且零运维！

---

## 三、架构设计

### 3.1 SAE 架构图

```
用户访问
   ↓
[阿里云 DNS]
   ↓
[SAE 网关] ← 自动 HTTPS + 负载均衡
   ↓
┌─────────────────────────┐
│  SAE 应用实例            │
│  ┌───────────────────┐  │
│  │ Spring Boot 后端   │  │
│  │ (JAR 包部署)      │  │
│  └───────────────────┘  │
└─────────────────────────┘
   ↓                    ↓
[RDS MySQL]        [OSS 对象存储]
  数据存储            文件上传
   ↓
[前端静态资源]
  OSS + CDN
```

### 3.2 组件清单

| 组件 | 产品 | 用途 | 费用 |
|------|------|------|------|
| 后端应用 | SAE | Spring Boot API | ¥20-60/月 |
| 前端资源 | OSS + CDN | React 静态文件 | ¥5-15/月 |
| 数据库 | RDS MySQL 基础版 | 数据存储 | ¥35-65/月 |
| 文件存储 | OSS 标准存储 | 文件上传 | ¥3-10/月 |
| 域名 | 阿里云域名 | 访问入口 | ¥6/年 |
| HTTPS | SAE 自动 | SSL 加密 | 免费 |

**总费用**: ¥60-150/月（按量付费可更低）

---

## 四、准备工作

### 4.1 阿里云账号

- [ ] 注册阿里云账号
- [ ] 完成实名认证
- [ ] 开通 SAE 服务
- [ ] 开通 RDS MySQL
- [ ] 开通 OSS 服务
- [ ] 开通 CDN（可选）

### 4.2 本地环境

```bash
# 1. 安装 JDK 17（本地测试用）
java -version

# 2. 安装 Maven
mvn -version

# 3. 安装 Node.js（前端构建）
node -v
npm -v
```

### 4.3 项目构建

```bash
# 构建后端 JAR 包
cd backend
mvn clean package -DskipTests

# 确认生成文件
ls -lh target/course-management-1.0.0.jar

# 构建前端
cd ../frontend
npm install
npm run build

# 确认构建结果
ls -la dist/
```

---

## 五、后端部署（Spring Boot）

### 5.1 创建 SAE 应用

#### 步骤 1: 登录控制台

访问 [SAE 控制台](https://sae.console.aliyun.com/)

#### 步骤 2: 创建应用

点击 **创建应用**，填写配置：

```
基本信息:
- 应用名称: course-management-backend
- 应用描述: 课程管理系统后端 API
- 地域: 选择离用户最近的地域（如华东1-杭州）

部署方式:
- 部署包类型: JAR
- 部署包来源: 本地上传
- 选择文件: target/course-management-1.0.0.jar

应用配置:
- 规格类型: 标准规格
- 实例规格: 0.5 核 1 GB（最低配置，内部系统足够）
- 实例数量: 1
- JDK 版本: OpenJDK 17

网络配置:
- 专有网络: 选择或创建 VPC
- 交换机: 选择可用区
- 安全组: 创建或选择现有

端口配置:
- 监听端口: 8082
- 健康检查路径: /api/health（如有）或 /
```

#### 步骤 3: 配置环境变量

在应用设置中添加环境变量：

```bash
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=jdbc:mysql://<RDS地址>:3306/course_db?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai&useSSL=true
SPRING_DATASOURCE_USERNAME=course_user
SPRING_DATASOURCE_PASSWORD=<数据库密码>
JWT_SECRET=<你的JWT密钥>
FILE_UPLOAD_PATH=/tmp/uploads
OSS_ENDPOINT=https://oss-cn-hangzhou.aliyuncs.com
OSS_BUCKET=course-uploads
OSS_ACCESS_KEY_ID=<你的AccessKey>
OSS_ACCESS_KEY_SECRET=<你的AccessKeySecret>
```

#### 步骤 4: 部署应用

点击 **部署**，等待 3-5 分钟完成。

### 5.2 生产环境配置

在项目中创建 `application-sae.yml`：

```yaml
server:
  port: 8082

spring:
  application:
    name: course-management
  datasource:
    url: ${SPRING_DATASOURCE_URL}
    username: ${SPRING_DATASOURCE_USERNAME}
    password: ${SPRING_DATASOURCE_PASSWORD}
    driver-class-name: com.mysql.cj.jdbc.Driver
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB

mybatis-plus:
  mapper-locations: classpath:mapper/*.xml
  type-aliases-package: com.course.entity
  configuration:
    map-underscore-to-camel-case: true
    log-impl: org.apache.ibatis.logging.nologging.NoLoggingImpl
  global-config:
    db-config:
      id-type: auto
      logic-delete-field: deleted
      logic-delete-value: 1
      logic-not-delete-value: 0

jwt:
  secret: ${JWT_SECRET:your-secret-key-must-be-very-long-2024}
  access-token-expiration: 7200000
  refresh-token-expiration: 604800000

file:
  upload-path: ${FILE_UPLOAD_PATH:/tmp/uploads}

springdoc:
  api-docs:
    path: /api-docs
  swagger-ui:
    path: /swagger-ui.html
    enabled: false  # 生产环境关闭

logging:
  level:
    com.course: info
    org.springframework.security: warn
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
```

修改打包配置，确保包含此文件：

```xml
<!-- pom.xml -->
<build>
    <resources>
        <resource>
            <directory>src/main/resources</directory>
            <includes>
                <include>**/*</include>
            </includes>
        </resource>
    </resources>
</build>
```

### 5.3 启动参数配置

在 SAE 控制台配置启动参数：

```bash
-Dspring.profiles.active=sae
-Xms512m
-Xmx1024m
-XX:+UseG1GC
-XX:MaxGCPauseMillis=200
```

### 5.4 验证部署

```bash
# 获取 SAE 应用的公网地址
# 在 SAE 控制台 -> 应用详情 -> 访问设置 中查看

# 测试健康检查
curl https://<your-sae-domain>/api/health

# 测试登录接口
curl -X POST https://<your-sae-domain>/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"ADMIN001","password":"admin123"}'
```

---

## 六、前端部署（OSS+CDN）

### 6.1 创建 OSS Bucket

1. 登录 [OSS 控制台](https://oss.console.aliyun.com/)
2. 点击 **创建 Bucket**

```
Bucket 名称: course-frontend-<随机后缀>
地域: 与 SAE 相同（如华东1-杭州）
存储类型: 标准存储
读写权限: 公共读
```

### 6.2 上传前端文件

#### 方式 1: 控制台上传

1. 进入 Bucket -> 文件管理
2. 创建文件夹 `admin` 和 `mini`
3. 上传 `dist/admin/*` 到 `admin/`
4. 上传 `dist/mini/*` 到 `mini/`

#### 方式 2: 使用 ossutil 命令行

```bash
# 安装 ossutil
curl -o ossutil http://gosspublic.alicdn.com/ossutil/1.7.16/ossutil-v1.7.16-linux-amd64
chmod +x ossutil
./ossutil config

# 上传管理后台
./ossutil cp -r dist/admin/ oss://course-frontend-xxx/admin/

# 上传小程序端
./ossutil cp -r dist/mini/ oss://course-frontend-xxx/mini/
```

### 6.3 配置 CDN 加速（可选但推荐）

1. 登录 [CDN 控制台](https://cdn.console.aliyun.com/)
2. 添加域名 `static.your-domain.com`
3. 源站类型选择 **OSS 域名**
4. 配置 HTTPS 证书

### 6.4 配置自定义域名

如果需要自定义域名访问前端：

```
前端管理后台: https://admin.your-domain.com
前端小程序端: https://mini.your-domain.com
```

在 OSS 控制台配置：
1. Bucket -> 域名管理 -> 绑定域名
2. 添加 CNAME 解析

---

## 七、数据库配置

### 7.1 创建 RDS MySQL

1. 登录 [RDS 控制台](https://rdsnext.console.aliyun.com/)
2. 创建实例

```
数据库类型: MySQL
版本: 8.0
规格类型: 基础版（内部系统足够）
规格: 1核 2GB
存储空间: 40GB
地域: 与 SAE 相同
网络类型: 专有网络（与 SAE 相同 VPC）
```

### 7.2 创建数据库和账号

```sql
-- 登录 RDS
mysql -h <RDS地址> -u root -p

-- 创建数据库
CREATE DATABASE course_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 创建用户
CREATE USER 'course_user'@'%' IDENTIFIED BY 'YourStrongPassword123!';

-- 授权
GRANT ALL PRIVILEGES ON course_db.* TO 'course_user'@'%';
FLUSH PRIVILEGES;
```

### 7.3 导入数据

```bash
# 导入表结构
mysql -h <RDS地址> -u course_user -p course_db < backend/src/main/resources/db/schema.sql

# 导入初始数据
mysql -h <RDS地址> -u course_user -p course_db < backend/src/main/resources/db/data.sql
```

### 7.4 配置白名单

在 RDS 控制台 -> 数据安全性 -> 白名单设置：

```
添加 SAE 的 VPC 网段
例如: 172.16.0.0/12
```

---

## 八、文件存储配置

### 8.1 创建 OSS Bucket（用于文件上传）

```
Bucket 名称: course-uploads-<随机后缀>
地域: 与 SAE 相同
存储类型: 标准存储
读写权限: 私有
```

### 8.2 配置跨域（CORS）

在 OSS 控制台 -> 权限管理 -> 跨域设置：

```xml
<CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>POST</AllowedMethod>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
    <ExposeHeader>ETag</ExposeHeader>
    <MaxAgeSeconds>3600</MaxAgeSeconds>
</CORSRule>
```

### 8.3 后端集成 OSS

在 `pom.xml` 添加依赖：

```xml
<dependency>
    <groupId>com.aliyun.oss</groupId>
    <artifactId>aliyun-sdk-oss</artifactId>
    <version>3.17.1</version>
</dependency>
```

创建文件上传服务类：

```java
@Service
public class OssFileService {
    
    @Value("${OSS_ENDPOINT}")
    private String endpoint;
    
    @Value("${OSS_ACCESS_KEY_ID}")
    private String accessKeyId;
    
    @Value("${OSS_ACCESS_KEY_SECRET}")
    private String accessKeySecret;
    
    @Value("${OSS_BUCKET}")
    private String bucketName;
    
    public String uploadFile(MultipartFile file, String objectKey) {
        OSS ossClient = new OSSClientBuilder().build(endpoint, accessKeyId, accessKeySecret);
        
        try {
            ossClient.putObject(bucketName, objectKey, file.getInputStream());
            // 返回文件访问URL
            return "https://" + bucketName + "." + endpoint + "/" + objectKey;
        } finally {
            ossClient.shutdown();
        }
    }
}
```

---

## 九、域名与HTTPS

### 9.1 域名备案

1. 登录 [阿里云备案系统](https://beian.aliyun.com/)
2. 提交备案申请
3. 等待审核（7-20个工作日）

### 9.2 域名解析

```
登录阿里云控制台 -> 域名 -> 解析

添加记录:
类型: CNAME
主机记录: @ (或 www)
记录值: <SAE 应用的公网域名>
```

### 9.3 配置 SAE 自定义域名

1. SAE 控制台 -> 应用 -> 访问设置
2. 添加自定义域名
3. 上传 SSL 证书（或使用免费证书）

### 9.4 申请免费 SSL 证书

1. 登录 [SSL 证书控制台](https://yundun.console.aliyun.com/?p=cas)
2. 免费证书 -> 购买证书
3. 申请证书 -> 填写域名
4. DNS 验证
5. 下载证书（选择 PEM 格式）

---

## 十、微信小程序配置

### 10.1 配置服务器域名

登录 [微信小程序后台](https://mp.weixin.qq.com/)

```
开发管理 -> 开发设置 -> 服务器域名

request合法域名:
https://api.your-domain.com

uploadFile合法域名:
https://api.your-domain.com

downloadFile合法域名:
https://api.your-domain.com
```

### 10.2 修改前端 API 配置

创建 `.env.production`：

```env
VITE_API_BASE_URL=https://api.your-domain.com/api
VITE_FILE_BASE_URL=https://course-uploads.oss-cn-hangzhou.aliyuncs.com
```

重新构建前端：

```bash
cd frontend
npm run build
```

重新上传到 OSS。

---

## 十一、费用明细

### 11.1 基础方案（推荐内部系统）

| 组件 | 配置 | 月费用 |
|------|------|--------|
| SAE | 0.5核1GB × 1实例 | ¥29 |
| RDS MySQL | 1核2GB 40GB 基础版 | ¥35 |
| OSS（前端） | 40GB 标准存储 | ¥3 |
| OSS（上传） | 20GB 标准存储 | ¥2 |
| 域名 | .com | ¥0.5 |
| SSL | 免费证书 | ¥0 |
| **合计** | - | **约 ¥70/月** |

### 11.2 经济方案（最低成本）

| 组件 | 配置 | 月费用 |
|------|------|--------|
| SAE | 按量付费 | ¥10-20 |
| RDS Serverless | 0.5-2RCU | ¥25-50 |
| OSS | 40GB | ¥5 |
| **合计** | - | **约 ¥40-75/月** |

### 11.3 成本对比

| 方案 | SAE | ECS | 节省 |
|------|-----|-----|------|
| 月费用 | ¥70 | ¥242 | **71%** |
| 年费用 | ¥840 | ¥2,904 | **¥2,064** |
| 运维成本 | 零 | 需专人 | **高** |

---

## 十二、运维指南

### 12.1 查看日志

SAE 控制台 -> 应用 -> 日志管理：
- 实时日志
- 历史日志
- 日志下载

### 12.2 监控告警

SAE 控制台 -> 应用 -> 监控：
- CPU 使用率
- 内存使用率
- QPS
- 响应时间
- 错误率

配置告警规则：
```
CPU > 80% 持续 5 分钟
内存 > 85% 持续 5 分钟
错误率 > 5%
```

### 12.3 弹性伸缩配置

SAE 控制台 -> 应用 -> 弹性伸缩：

```
扩容规则:
- CPU 使用率 > 70% 时扩容
- 最大实例数: 3

缩容规则:
- CPU 使用率 < 30% 时缩容
- 最小实例数: 1
```

### 12.4 更新应用

```bash
# 1. 本地重新打包
cd backend
mvn clean package -DskipTests

# 2. SAE 控制台 -> 应用 -> 部署管理
# 3. 创建新版本 -> 上传新 JAR 包
# 4. 分批发布（推荐）或快速发布

# 5. 验证新版本
curl https://<your-domain>/api/health
```

### 12.5 数据库备份

RDS 控制台 -> 备份恢复：

```
自动备份:
- 备份周期: 每天
- 备份时间: 02:00-03:00
- 备份保留: 7天

手动备份:
- 需要时手动创建
```

---

## 十三、常见问题

### Q1: SAE 应用启动失败？

```bash
# 1. 查看日志
SAE 控制台 -> 日志管理 -> 实时日志

# 2. 常见问题:
# - 端口配置错误（必须使用 8082）
# - 数据库连接失败（检查白名单）
# - 环境变量未配置
# - JAR 包损坏（重新打包）
```

### Q2: 如何绑定自定义域名？

```
1. SAE 控制台 -> 应用 -> 访问设置
2. 添加域名 -> 输入你的域名
3. 上传 SSL 证书
4. DNS 添加 CNAME 记录
5. 等待生效（5-10分钟）
```

### Q3: 文件上传失败？

```bash
# 1. 检查 OSS 配置
# - Endpoint 是否正确
# - AccessKey 是否有效
# - Bucket 权限

# 2. 检查 SAE 临时目录
# /tmp 目录最大 512MB
# 大文件建议直接上传 OSS

# 3. 查看错误日志
SAE 控制台 -> 日志管理
```

### Q4: 数据库连接超时？

```bash
# 1. 检查 RDS 白名单
# 添加 SAE 的 VPC 网段

# 2. 检查网络连接
# SAE 和 RDS 必须在同一 VPC

# 3. 测试连接
# 在 SAE 控制台使用诊断工具
```

### Q5: 如何降低费用？

```bash
# 1. SAE 使用按量付费
# 2. RDS 使用 Serverless 版本
# 3. 关闭不必要的环境（测试环境）
# 4. 优化代码减少资源消耗
# 5. 使用包年包月（长期使用更优惠）
```

### Q6: 冷启动如何优化？

```bash
# 1. SAE 设置最小实例数为 1
# 2. 使用预热功能
# 3. 优化应用启动速度:
# - 减少不必要的依赖
# - 延迟加载非核心组件
# - 使用 Spring Boot 延迟初始化
```

---

## 附录

### A. 快速部署检查清单

#### 部署前
- [ ] 阿里云账号已注册并实名认证
- [ ] SAE 服务已开通
- [ ] RDS 实例已创建
- [ ] OSS Bucket 已创建
- [ ] 域名已购买（可选）
- [ ] 本地代码已测试通过

#### 部署中
- [ ] 后端 JAR 包已构建
- [ ] SAE 应用已创建
- [ ] 环境变量已配置
- [ ] 应用已部署成功
- [ ] 前端已构建并上传 OSS
- [ ] 数据库已初始化
- [ ] 域名已解析（如使用）

#### 部署后
- [ ] API 接口可正常访问
- [ ] 前端页面可正常访问
- [ ] 数据库连接正常
- [ ] 文件上传功能正常
- [ ] 微信小程序域名已配置
- [ ] 监控告警已配置

### B. 环境变量清单

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| SPRING_PROFILES_ACTIVE | 环境标识 | sae |
| SPRING_DATASOURCE_URL | 数据库连接 | jdbc:mysql://rm-xxx.mysql.rds.aliyuncs.com:3306/course_db |
| SPRING_DATASOURCE_USERNAME | 数据库用户名 | course_user |
| SPRING_DATASOURCE_PASSWORD | 数据库密码 | YourPassword123! |
| JWT_SECRET | JWT 密钥 | your-secret-key-2024 |
| FILE_UPLOAD_PATH | 文件上传路径 | /tmp/uploads |
| OSS_ENDPOINT | OSS Endpoint | https://oss-cn-hangzhou.aliyuncs.com |
| OSS_BUCKET | OSS Bucket | course-uploads |
| OSS_ACCESS_KEY_ID | AccessKey ID | LTAI5t... |
| OSS_ACCESS_KEY_SECRET | AccessKey Secret | xxxxxx |

### C. 端口清单

| 端口 | 服务 | 说明 |
|------|------|------|
| 8082 | Spring Boot | SAE 应用端口 |
| 3306 | MySQL | RDS 内网端口 |

### D. 重要链接

| 资源 | 链接 |
|------|------|
| SAE 控制台 | https://sae.console.aliyun.com/ |
| RDS 控制台 | https://rdsnext.console.aliyun.com/ |
| OSS 控制台 | https://oss.console.aliyun.com/ |
| CDN 控制台 | https://cdn.console.aliyun.com/ |
| SSL 证书 | https://yundun.console.aliyun.com/?p=cas |
| 域名管理 | https://dc.console.aliyun.com/ |
| 备案系统 | https://beian.aliyun.com/ |

---

## 部署时间线

| 阶段 | 任务 | 时间 |
|------|------|------|
| **准备** | 开通服务、构建代码 | 30 分钟 |
| **后端** | 创建 SAE、部署 JAR | 15 分钟 |
| **前端** | 上传 OSS、配置 CDN | 20 分钟 |
| **数据库** | 创建 RDS、导入数据 | 20 分钟 |
| **域名** | 备案、解析、HTTPS | 1-20 天（备案） |
| **测试** | 功能验证、优化 | 30 分钟 |
| **总计** | - | **约 2 小时**（不含备案） |

---

## 总结

### ✅ SAE 部署优势

1. **成本极低**: 月费用仅 ¥40-100
2. **零运维**: 无需管理服务器
3. **快速部署**: 20 分钟上线
4. **自动弹性**: 按需扩缩容
5. **内置监控**: 日志、监控、告警全都有

### 🎯 适用场景

- ✅ 内部管理系统
- ✅ 用户量 < 500
- ✅ 低并发场景
- ✅ 预算有限
- ✅ 无专职运维

### 🚀 快速开始

```bash
# 1. 构建后端
mvn clean package -DskipTests

# 2. SAE 控制台创建应用
# 3. 上传 JAR 包
# 4. 配置环境变量
# 5. 部署

# 6. 构建前端
npm run build

# 7. 上传到 OSS
# 8. 配置域名
# 9. 完成！
```

---

**文档版本**: v1.0  
**最后更新**: 2026-04-14  
**适用产品**: 阿里云 SAE + RDS + OSS
