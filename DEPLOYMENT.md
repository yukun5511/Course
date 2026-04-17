001# 课程管理系统 - 阿里云部署计划

> **项目名称**: Course Management System  
> **版本**: v1.0.0  
> **文档版本**: v1.0  
> **更新日期**: 2026-04-14

---

## 📋 目录

- [一、项目概述](#一项目概述)
- [二、技术栈清单](#二技术栈清单)
- [三、阿里云产品选型](#三阿里云产品选型)
- [四、服务器配置方案](#四服务器配置方案)
- [五、部署架构设计](#五部署架构设计)
- [六、环境准备清单](#六环境准备清单)
- [七、详细部署步骤](#七详细部署步骤)
- [八、域名与SSL配置](#八域名与ssl配置)
- [九、数据库部署](#九数据库部署)
- [十、安全配置](#十安全配置)
- [十一、监控与运维](#十一监控与运维)
- [十二、备份策略](#十二备份策略)
- [十三、成本估算](#十三成本估算)
- [十四、常见问题](#十四常见问题)

---

## 一、项目概述

### 1.1 系统架构

```
┌─────────────────────────────────────────────────┐
│                   用户端                         │
│  ┌──────────────┐      ┌──────────────┐        │
│  │  微信小程序   │      │  管理后台Web  │        │
│  └──────────────┘      └──────────────┘        │
└──────────────────┬──────────────────────────────┘
                   │ HTTPS
┌──────────────────▼──────────────────────────────┐
│              阿里云 ECS (Nginx)                  │
│  ┌──────────────────────────────────────────┐  │
│  │  Nginx 反向代理 + 静态资源服务            │  │
│  │  - 管理后台: /admin/*                    │  │
│  │  - 小程序端: /mini/*                     │  │
│  └──────────────────────────────────────────┘  │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│          Spring Boot 后端 (端口 8082)            │
│  ┌──────────────────────────────────────────┐  │
│  │  - RESTful API                           │  │
│  │  - JWT 认证                              │  │
│  │  - 文件上传                              │  │
│  │  - 二维码生成                            │  │
│  └──────────────────────────────────────────┘  │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│          MySQL 8.0 数据库                       │
│  ┌──────────────────────────────────────────┐  │
│  │  Database: course_db                     │  │
│  │  Tables: 26张                            │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### 1.2 项目结构

```
Course/
├── frontend/              # 前端项目 (React 18 + Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── admin/    # 管理后台页面
│   │   │   └── mini/     # 小程序端页面
│   │   ├── api/          # API 接口
│   │   └── components/   # 组件
│   └── package.json
├── backend/               # 后端项目 (Spring Boot 3.2.4)
│   ├── src/main/java/
│   │   └── com/course/
│   │       ├── controller/
│   │       ├── service/
│   │       ├── entity/
│   │       └── mapper/
│   └── pom.xml
└── DEPLOYMENT.md          # 本部署文档
```

---

## 二、技术栈清单

### 2.1 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.3.1 | UI 框架 |
| TypeScript | 6.0.2 | 类型安全 |
| Vite | 8.0.8 | 构建工具 |
| React Router | 7.1.1 | 路由管理 |
| Tailwind CSS | 3.4.17 | 样式框架 |
| Axios | 1.15.0 | HTTP 客户端 |
| Lucide React | 0.468.0 | 图标库 |

### 2.2 后端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Spring Boot | 3.2.4 | 后端框架 |
| Java | 17 | 编程语言 |
| MyBatis-Plus | 3.5.5 | ORM 框架 |
| MySQL | 8.0 | 数据库 |
| JWT (jjwt) | 0.12.5 | 认证授权 |
| Spring Security | - | 密码加密 |
| EasyExcel | 3.3.4 | Excel 导入导出 |
| ZXing | 3.5.3 | 二维码生成 |
| SpringDoc | 2.5.0 | API 文档 |

### 2.3 运行环境要求

| 组件 | 最低版本 | 推荐版本 |
|------|---------|---------|
| Node.js | 18.x | 20.x LTS |
| Java | 17 | 17 LTS |
| Maven | 3.8 | 3.9.x |
| MySQL | 8.0 | 8.0.35+ |
| Nginx | 1.20 | 1.24+ |

---

## 三、阿里云产品选型

### 3.1 核心产品清单

| 产品 | 规格 | 用途 | 必要性 |
|------|------|------|--------|
| **ECS 云服务器** | 见第四章 | 部署后端和前端 | ⭐⭐⭐⭐⭐ |
| **RDS MySQL** | 见第九章 | 数据库服务 | ⭐⭐⭐⭐⭐ |
| **域名** | .com/.cn | 网站访问 | ⭐⭐⭐⭐⭐ |
| **SSL 证书** | 免费/付费 | HTTPS 加密 | ⭐⭐⭐⭐⭐ |
| **OSS 对象存储** | 标准存储 | 文件上传存储 | ⭐⭐⭐⭐ |
| **CDN** | 全站加速 | 静态资源加速 | ⭐⭐⭐ |
| **云监控** | 基础版 | 系统监控 | ⭐⭐⭐⭐ |
| **云备份** | 按需 | 数据备份 | ⭐⭐⭐⭐ |

### 3.2 推荐配置方案

#### 方案 A：经济型（适合初期/测试）

| 组件 | 配置 | 月费用 |
|------|------|--------|
| ECS | 2核4G 3Mbps | ¥165 |
| RDS MySQL | 1核2G 40GB | ¥65 |
| 域名 | .com | ¥6 |
| SSL | 免费证书 | ¥0 |
| OSS | 40GB | ¥6 |
| **合计** | - | **约 ¥242/月** |

#### 方案 B：标准型（推荐生产环境）

| 组件 | 配置 | 月费用 |
|------|------|--------|
| ECS | 2核8G 5Mbps | ¥288 |
| RDS MySQL | 2核4G 100GB | ¥168 |
| 域名 | .com | ¥6 |
| SSL | 付费证书 | ¥33 |
| OSS | 100GB + CDN | ¥25 |
| **合计** | - | **约 ¥520/月** |

#### 方案 C：高性能型（适合高并发）

| 组件 | 配置 | 月费用 |
|------|------|--------|
| ECS | 4核16G 10Mbps | ¥678 |
| RDS MySQL | 4核16G 500GB | ¥668 |
| 域名 | .com | ¥6 |
| SSL | 付费证书 | ¥33 |
| OSS + CDN | 500GB | ¥95 |
| SLB 负载均衡 | 按需 | ¥50 |
| **合计** | - | **约 ¥1,530/月** |

---

## 四、服务器配置方案

### 4.1 ECS 云服务器推荐配置

#### 最低配置（开发测试）

```
实例规格: ecs.t6-c1m2.large
CPU: 2核
内存: 4GB
带宽: 3Mbps (按固定带宽)
系统盘: 40GB SSD
操作系统: Alibaba Cloud Linux 3.2104 LTS 或 Ubuntu 22.04 LTS
```

#### 推荐配置（生产环境）⭐

```
实例规格: ecs.c7.large 或 ecs.g7.large
CPU: 2核
内存: 8GB
带宽: 5Mbps (按固定带宽)
系统盘: 100GB ESSD云盘
数据盘: 100GB (可选，用于文件存储)
操作系统: Alibaba Cloud Linux 3.2104 LTS
```

#### 高性能配置（高并发场景）

```
实例规格: ecs.c7.xlarge
CPU: 4核
内存: 16GB
带宽: 10Mbps 或按量付费
系统盘: 100GB ESSD云盘
数据盘: 200GB ESSD云盘
操作系统: Alibaba Cloud Linux 3.2104 LTS
```

### 4.2 购买建议

1. **地域选择**: 选择离目标用户最近的地域
   - 华东用户: 华东1（杭州）或 华东2（上海）
   - 华南用户: 华南1（深圳）
   - 华北用户: 华北2（北京）
   - 全国用户: 华东1（杭州）

2. **网络类型**: VPC（专有网络）

3. **付费方式**:
   - 测试环境: 按量付费
   - 生产环境: 包年包月（更优惠）

4. **安全组配置**:
   ```
   入站规则:
   - TCP 22 (SSH) - 仅限管理员IP
   - TCP 80 (HTTP) - 0.0.0.0/0
   - TCP 443 (HTTPS) - 0.0.0.0/0
   - TCP 8082 (后端API) - 仅本地访问
   ```

---

## 五、部署架构设计

### 5.1 单服务器架构（推荐初期使用）

```
用户访问
   ↓
[阿里云 DNS]
   ↓
[Nginx: 80/443]  ← 反向代理 + 静态资源
   ↓
[Spring Boot: 8082]  ← 后端API
   ↓
[MySQL: 3306]  ← 数据库（本地或RDS）
```

### 5.2 分离架构（推荐生产环境）

```
用户访问
   ↓
[阿里云 DNS]
   ↓
[Nginx: 80/443]  ← ECS 1
   ↓
[Spring Boot: 8082]  ← ECS 1
   ↓
[RDS MySQL]  ← 阿里云 RDS (独立)
   ↓
[OSS]  ← 文件存储 (独立)
```

### 5.3 目录结构规划

```
/opt/course-system/
├── backend/                    # 后端应用
│   ├── course-management.jar   # Spring Boot 打包文件
│   ├── application-prod.yml    # 生产环境配置
│   ├── uploads/                # 文件上传目录
│   └── logs/                   # 日志目录
├── frontend/                   # 前端应用
│   ├── admin/                  # 管理后台静态文件
│   │   ├── index.html
│   │   └── assets/
│   └── mini/                   # 小程序端静态文件
│       ├── index.html
│       └── assets/
├── nginx/
│   └── conf.d/
│       └── course-system.conf  # Nginx 配置
└── scripts/
    ├── start.sh                # 启动脚本
    ├── stop.sh                 # 停止脚本
    └── backup.sh               # 备份脚本
```

---

## 六、环境准备清单

### 6.1 阿里云账号准备

- [ ] 注册阿里云账号并完成实名认证
- [ ] 开通 ECS、RDS、OSS 等服务
- [ ] 创建 AccessKey（用于 API 调用）
- [ ] 配置 RAM 子账号（推荐，不要使用主账号）

### 6.2 域名准备

- [ ] 购买域名（推荐 .com 或 .cn）
- [ ] 完成域名备案（中国大陆服务器必需）
  - 个人备案: 7-20 个工作日
  - 企业备案: 7-20 个工作日
- [ ] 配置域名解析

### 6.3 SSL 证书准备

**方案 1: 免费证书（推荐初期）**
- 阿里云提供 1 年免费 SSL 证书
- 适合个人项目和测试环境

**方案 2: 付费证书（生产环境）**
- DV 域名型证书: ¥33/年起
- 支持通配符域名

### 6.4 本地开发环境

```bash
# 1. 安装 JDK 17
java -version

# 2. 安装 Node.js 18+
node -v
npm -v

# 3. 安装 Maven
mvn -version

# 4. 安装 MySQL 8.0 (本地测试用)
mysql --version

# 5. 安装 Git
git --version
```

---

## 七、详细部署步骤

### 7.1 服务器初始化

#### Step 1: 连接服务器

```bash
# 使用 SSH 连接
ssh root@<服务器公网IP>

# 或使用阿里云控制台 VNC 登录
```

#### Step 2: 系统更新

```bash
# Alibaba Cloud Linux / CentOS
sudo yum update -y
sudo yum upgrade -y

# Ubuntu
sudo apt update
sudo apt upgrade -y
```

#### Step 3: 安装基础软件

```bash
# 安装 JDK 17
sudo yum install java-17-openjdk-devel -y
java -version

# 安装 Nginx
sudo yum install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx

# 安装 MySQL (如果使用本地数据库)
sudo yum install mysql-server -y
sudo systemctl enable mysqld
sudo systemctl start mysqld

# 安装 Git
sudo yum install git -y

# 安装 Maven
sudo yum install maven -y
mvn -version

# 安装 Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install nodejs -y
node -v
npm -v
```

#### Step 4: 创建部署用户（安全最佳实践）

```bash
# 创建用户
sudo useradd -m -s /bin/bash course-admin
sudo passwd course-admin

# 添加 sudo 权限
sudo usermod -aG wheel course-admin

# 切换用户
su - course-admin
```

#### Step 5: 创建目录结构

```bash
# 创建应用目录
sudo mkdir -p /opt/course-system/{backend,frontend,nginx/conf.d,scripts,logs}
sudo chown -R course-admin:course-admin /opt/course-system
sudo chmod -R 755 /opt/course-system

# 创建上传目录
mkdir -p /opt/course-system/backend/uploads
mkdir -p /opt/course-system/backend/logs
```

### 7.2 数据库部署

#### 方案 A: 使用本地 MySQL

```bash
# 1. 启动 MySQL
sudo systemctl start mysqld
sudo systemctl enable mysqld

# 2. 获取初始密码
sudo grep 'temporary password' /var/log/mysqld.log

# 3. 安全配置
sudo mysql_secure_installation

# 4. 登录 MySQL
mysql -u root -p

# 5. 创建数据库和用户
CREATE DATABASE course_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'course_user'@'localhost' IDENTIFIED BY 'YourStrongPassword123!';
GRANT ALL PRIVILEGES ON course_db.* TO 'course_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# 6. 导入数据库结构
mysql -u course_user -p course_db < /path/to/schema.sql
```

#### 方案 B: 使用阿里云 RDS（推荐）

1. **创建 RDS 实例**
   - 登录阿里云控制台
   - 选择 RDS MySQL
   - 创建实例（选择与 ECS 相同地域和 VPC）
   - 配置白名单（添加 ECS 内网 IP）

2. **创建数据库和账号**
   ```
   数据库名称: course_db
   字符集: utf8mb4
   账号: course_user
   权限: 读写
   ```

3. **导入数据**
   ```bash
   # 从 ECS 连接 RDS
   mysql -h <RDS内网地址> -P 3306 -u course_user -p course_db < schema.sql
   ```

### 7.3 后端部署

#### Step 1: 上传代码

```bash
# 方式 1: Git 拉取（推荐）
cd /opt/course-system/backend
git clone <your-git-repo> .

# 方式 2: SCP 上传
scp -r ./backend/* course-admin@<服务器IP>:/opt/course-system/backend/

# 方式 3: 使用阿里云代码托管
```

#### Step 2: 配置生产环境

创建生产环境配置文件：

```bash
nano /opt/course-system/backend/application-prod.yml
```

```yaml
server:
  port: 8082

spring:
  application:
    name: course-management
  datasource:
    url: jdbc:mysql://<数据库地址>:3306/course_db?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai&useSSL=true&allowPublicKeyRetrieval=true
    username: course_user
    password: YourStrongPassword123!
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
    log-impl: org.apache.ibatis.logging.nologging.NoLoggingImpl  # 生产环境关闭SQL日志
  global-config:
    db-config:
      id-type: auto
      logic-delete-field: deleted
      logic-delete-value: 1
      logic-not-delete-value: 0

jwt:
  secret: YourJWTSecretKeyMustBeVeryLongAndSecure2024!  # ⚠️ 修改为强密码
  access-token-expiration: 7200000
  refresh-token-expiration: 604800000

file:
  upload-path: /opt/course-system/backend/uploads

springdoc:
  api-docs:
    path: /api-docs
  swagger-ui:
    path: /swagger-ui.html
    enabled: false  # 生产环境关闭 Swagger

logging:
  level:
    com.course: info
    org.springframework.security: warn
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
  file:
    name: /opt/course-system/backend/logs/application.log
```

#### Step 3: 编译打包

```bash
cd /opt/course-system/backend

# Maven 打包
mvn clean package -DskipTests

# 检查打包结果
ls -lh target/*.jar
```

#### Step 4: 创建启动脚本

```bash
nano /opt/course-system/scripts/start.sh
```

```bash
#!/bin/bash

APP_NAME="course-management"
APP_DIR="/opt/course-system/backend"
JAR_FILE="${APP_DIR}/target/course-management-1.0.0.jar"
PID_FILE="${APP_DIR}/${APP_NAME}.pid"
LOG_FILE="${APP_DIR}/logs/application.log"

# 检查是否已运行
if [ -f "$PID_FILE" ]; then
    PID=$(cat $PID_FILE)
    if ps -p $PID > /dev/null 2>&1; then
        echo "Application is already running (PID: $PID)"
        exit 1
    else
        echo "Removing stale PID file"
        rm -f $PID_FILE
    fi
fi

# 启动应用
echo "Starting $APP_NAME..."
nohup java -jar \
    -Dspring.profiles.active=prod \
    -Xms512m \
    -Xmx1024m \
    -XX:+UseG1GC \
    -XX:MaxGCPauseMillis=200 \
    $JAR_FILE \
    > $LOG_FILE 2>&1 &

echo $! > $PID_FILE
echo "Application started successfully (PID: $!)"
echo "Log file: $LOG_FILE"
```

```bash
nano /opt/course-system/scripts/stop.sh
```

```bash
#!/bin/bash

APP_DIR="/opt/course-system/backend"
PID_FILE="${APP_DIR}/course-management.pid"

if [ ! -f "$PID_FILE" ]; then
    echo "Application is not running"
    exit 1
fi

PID=$(cat $PID_FILE)
echo "Stopping application (PID: $PID)..."

kill $PID

# 等待进程结束
for i in {1..10}; do
    if ! ps -p $PID > /dev/null 2>&1; then
        echo "Application stopped successfully"
        rm -f $PID_FILE
        exit 0
    fi
    sleep 1
done

# 强制结束
echo "Force stopping..."
kill -9 $PID
rm -f $PID_FILE
echo "Application force stopped"
```

```bash
# 添加执行权限
chmod +x /opt/course-system/scripts/*.sh
```

#### Step 5: 启动后端服务

```bash
# 启动
/opt/course-system/scripts/start.sh

# 查看日志
tail -f /opt/course-system/backend/logs/application.log

# 检查服务
curl http://localhost:8082/api/health

# 停止
/opt/course-system/scripts/stop.sh
```

#### Step 6: 配置 Systemd 服务（开机自启）

```bash
sudo nano /etc/systemd/system/course-management.service
```

```ini
[Unit]
Description=Course Management System Backend
After=syslog.target network.target mysql.service

[Service]
Type=simple
User=course-admin
Group=course-admin
WorkingDirectory=/opt/course-system/backend
ExecStart=/usr/bin/java -jar -Dspring.profiles.active=prod -Xms512m -Xmx1024m target/course-management-1.0.0.jar
ExecStop=/bin/kill -TERM $MAINPID
Restart=always
RestartSec=10
SuccessExitStatus=143

StandardOutput=append:/opt/course-system/backend/logs/application.log
StandardError=append:/opt/course-system/backend/logs/error.log

[Install]
WantedBy=multi-user.target
```

```bash
# 重载配置
sudo systemctl daemon-reload

# 启用服务
sudo systemctl enable course-management

# 启动服务
sudo systemctl start course-management

# 查看状态
sudo systemctl status course-management

# 查看日志
sudo journalctl -u course-management -f
```

### 7.4 前端部署

#### Step 1: 本地构建

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 创建生产环境配置
cat > .env.production << EOF
VITE_API_BASE_URL=https://your-domain.com/api
EOF

# 构建管理后台
npm run build

# 检查构建结果
ls -la dist/
```

#### Step 2: 上传到服务器

```bash
# 方式 1: SCP 上传
scp -r dist/* course-admin@<服务器IP>:/opt/course-system/frontend/

# 方式 2: 使用 rsync
rsync -avz dist/ course-admin@<服务器IP>:/opt/course-system/frontend/
```

#### Step 3: 配置 Nginx

```bash
sudo nano /etc/nginx/conf.d/course-system.conf
```

```nginx
# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS 配置
server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL 证书配置
    ssl_certificate /etc/nginx/ssl/your-domain.com.pem;
    ssl_certificate_key /etc/nginx/ssl/your-domain.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # 日志配置
    access_log /var/log/nginx/course-system.access.log;
    error_log /var/log/nginx/course-system.error.log;

    # 前端静态资源 - 管理后台
    location /admin {
        alias /opt/course-system/frontend/admin;
        try_files $uri $uri/ /admin/index.html;
        
        # 缓存策略
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 30d;
            add_header Cache-Control "public, immutable";
        }
    }

    # 前端静态资源 - 小程序端
    location /mini {
        alias /opt/course-system/frontend/mini;
        try_files $uri $uri/ /mini/index.html;
        
        # 缓存策略
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 30d;
            add_header Cache-Control "public, immutable";
        }
    }

    # 后端 API 代理
    location /api {
        proxy_pass http://127.0.0.1:8082;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 超时配置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # 文件大小限制
        client_max_body_size 10m;
    }

    # 文件上传访问
    location /uploads {
        alias /opt/course-system/backend/uploads;
        expires 7d;
        add_header Cache-Control "public";
    }

    # 默认首页
    location = / {
        return 302 /mini;
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
```

#### Step 4: 测试并重启 Nginx

```bash
# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx

# 查看状态
sudo systemctl status nginx
```

### 7.5 微信小程序配置

#### Step 1: 配置服务器域名

登录 [微信小程序后台](https://mp.weixin.qq.com/)

```
开发管理 -> 开发设置 -> 服务器域名

request合法域名:
https://your-domain.com

uploadFile合法域名:
https://your-domain.com

downloadFile合法域名:
https://your-domain.com
```

#### Step 2: 配置业务域名（如需要）

```
开发管理 -> 开发设置 -> 业务域名

下载校验文件
上传到服务器根目录: /opt/course-system/frontend/mini/
```

---

## 八、域名与SSL配置

### 8.1 域名备案

1. **登录阿里云控制台**
2. **ICP 代备案管理系统**
3. **填写备案信息**
   - 主体信息（个人/企业）
   - 网站信息
   - 负责人信息
4. **上传资料**
   - 身份证正反面
   - 网站负责人照片
   - 网站备案真实性核验单
5. **等待审核**（7-20个工作日）

### 8.2 域名解析

```
登录阿里云控制台 -> 域名 -> 解析

添加记录:
类型: A
主机记录: @ (或 www)
记录值: <ECS公网IP>
TTL: 10分钟
```

### 8.3 SSL 证书申请

#### 免费证书

```bash
# 1. 登录阿里云控制台
# 2. SSL 证书服务
# 3. 免费证书 -> 购买证书
# 4. 申请证书 -> 填写域名
# 5. 验证域名所有权（DNS 验证）
# 6. 下载证书（选择 Nginx 格式）

# 7. 上传到服务器
scp your-domain.com.pem course-admin@<服务器IP>:/tmp/
scp your-domain.com.key course-admin@<服务器IP>:/tmp/

# 8. 移动到 Nginx 目录
sudo mkdir -p /etc/nginx/ssl
sudo mv /tmp/your-domain.com.* /etc/nginx/ssl/
sudo chmod 644 /etc/nginx/ssl/*.pem
sudo chmod 600 /etc/nginx/ssl/*.key
```

---

## 九、数据库部署

### 9.1 数据初始化

创建数据库初始化脚本：

```bash
nano /opt/course-system/scripts/init-db.sql
```

```sql
-- 创建数据库
CREATE DATABASE IF NOT EXISTS course_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE course_db;

-- 导入表结构（执行项目中的 SQL 文件）
SOURCE /opt/course-system/backend/src/main/resources/db/schema.sql;

-- 导入初始数据
SOURCE /opt/course-system/backend/src/main/resources/db/data.sql;

-- 创建管理员账号（密码: admin123）
INSERT INTO sys_user (username, password, real_name, role, status, created_at) 
VALUES ('ADMIN001', '$2a$10$YourEncryptedPassword', '系统管理员', 'admin', 1, NOW());
```

```bash
# 执行初始化
mysql -u course_user -p course_db < /opt/course-system/scripts/init-db.sql
```

### 9.2 数据库优化配置

```bash
sudo nano /etc/my.cnf
```

```ini
[mysqld]
# 字符集
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_ci

# 连接数
max_connections=200
max_connect_errors=1000

# 缓存
innodb_buffer_pool_size=1G
innodb_log_file_size=256M
query_cache_size=64M

# 日志
slow_query_log=1
slow_query_log_file=/var/log/mysql/slow.log
long_query_time=2

# 其他
sql_mode=STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION
```

---

## 十、安全配置

### 10.1 防火墙配置

```bash
# 使用 firewalld (CentOS/Alibaba Cloud Linux)
sudo systemctl enable firewalld
sudo systemctl start firewalld

# 开放必要端口
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload

# 查看规则
sudo firewall-cmd --list-all
```

### 10.2 阿里云安全组

```
入站规则:
✅ TCP 22 (SSH) - 仅限管理员IP
✅ TCP 80 (HTTP) - 0.0.0.0/0
✅ TCP 443 (HTTPS) - 0.0.0.0/0
❌ TCP 3306 (MySQL) - 禁止公网访问
❌ TCP 8082 (Backend) - 禁止公网访问

出站规则:
✅ 全部允许
```

### 10.3 SSH 安全加固

```bash
sudo nano /etc/ssh/sshd_config

# 修改配置
PermitRootLogin no              # 禁止 root 登录
PasswordAuthentication no       # 禁用密码登录（使用密钥）
Port 2222                       # 修改默认端口
MaxAuthTries 3                  # 最大尝试次数
AllowUsers course-admin         # 允许的用户

# 重启 SSH
sudo systemctl restart sshd
```

### 10.4 配置 SSH 密钥登录

```bash
# 本地生成密钥
ssh-keygen -t rsa -b 4096

# 上传公钥
ssh-copy-id -p 2222 course-admin@<服务器IP>

# 测试登录
ssh -p 2222 course-admin@<服务器IP>
```

### 10.5 应用安全配置

```yaml
# application-prod.yml
# 已包含:
# - 关闭 Swagger
# - 关闭 SQL 日志
# - 使用强密码
# - 启用 SSL 数据库连接
```

---

## 十一、监控与运维

### 11.1 阿里云云监控

1. **安装监控插件**
   ```bash
   sudo bash <(curl -s https://cms-agent-<region>.oss-<region>.aliyuncs.com/install.sh)
   ```

2. **配置告警规则**
   - CPU 使用率 > 80% 持续 5 分钟
   - 内存使用率 > 85% 持续 5 分钟
   - 磁盘使用率 > 90%
   - 网络流入/流出异常

3. **设置通知方式**
   - 短信
   - 邮件
   - 钉钉机器人

### 11.2 应用监控

```bash
# 创建监控脚本
nano /opt/course-system/scripts/monitor.sh
```

```bash
#!/bin/bash

LOG_FILE="/opt/course-system/logs/monitor.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

# 检查后端服务
if ! curl -s http://localhost:8082/api/health > /dev/null; then
    echo "[$DATE] Backend service is down!" >> $LOG_FILE
    # 重启服务
    sudo systemctl restart course-management
    echo "[$DATE] Backend service restarted" >> $LOG_FILE
fi

# 检查 Nginx
if ! systemctl is-active --quiet nginx; then
    echo "[$DATE] Nginx is down!" >> $LOG_FILE
    sudo systemctl restart nginx
    echo "[$DATE] Nginx restarted" >> $LOG_FILE
fi

# 检查磁盘空间
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 90 ]; then
    echo "[$DATE] Disk usage is ${DISK_USAGE}%!" >> $LOG_FILE
fi

# 检查日志文件大小
LOG_SIZE=$(du -m /opt/course-system/backend/logs/application.log | cut -f1)
if [ $LOG_SIZE -gt 100 ]; then
    echo "[$DATE] Log file is ${LOG_SIZE}MB, rotating..." >> $LOG_FILE
    # 日志轮转
    mv /opt/course-system/backend/logs/application.log /opt/course-system/backend/logs/application.log.$(date +%Y%m%d)
    sudo systemctl restart course-management
fi
```

```bash
chmod +x /opt/course-system/scripts/monitor.sh

# 添加到 crontab（每 5 分钟执行）
crontab -e
*/5 * * * * /opt/course-system/scripts/monitor.sh
```

### 11.3 日志管理

```bash
# 安装 logrotate
sudo yum install logrotate -y

# 配置日志轮转
sudo nano /etc/logrotate.d/course-management
```

```
/opt/course-system/backend/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 0644 course-admin course-admin
    sharedscripts
    postrotate
        sudo systemctl reload course-management > /dev/null 2>&1 || true
    endscript
}
```

---

## 十二、备份策略

### 12.1 数据库备份

```bash
nano /opt/course-system/scripts/backup-db.sh
```

```bash
#!/bin/bash

BACKUP_DIR="/opt/course-system/backups/db"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/course_db_${DATE}.sql.gz"
RETENTION_DAYS=30

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份数据库
mysqldump -u course_user -p'YourPassword' \
    --single-transaction \
    --routines \
    --triggers \
    course_db | gzip > $BACKUP_FILE

# 检查备份是否成功
if [ $? -eq 0 ]; then
    echo "[$(date)] Database backup successful: $BACKUP_FILE"
    
    # 删除过期备份
    find $BACKUP_DIR -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
else
    echo "[$(date)] Database backup failed!"
    # 发送告警通知
fi
```

```bash
chmod +x /opt/course-system/scripts/backup-db.sh

# 每天凌晨 2 点备份
crontab -e
0 2 * * * /opt/course-system/scripts/backup-db.sh
```

### 12.2 文件备份

```bash
nano /opt/course-system/scripts/backup-files.sh
```

```bash
#!/bin/bash

BACKUP_DIR="/opt/course-system/backups/files"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/uploads_${DATE}.tar.gz"

mkdir -p $BACKUP_DIR

# 备份上传文件
tar -czf $BACKUP_FILE -C /opt/course-system/backend uploads/

echo "[$(date)] Files backup completed: $BACKUP_FILE"
```

### 12.3 备份到 OSS（推荐）

```bash
# 安装 ossutil
curl -o ossutil https://gosspublic.alicdn.com/ossutil/1.7.16/ossutil-v1.7.16-linux-amd64.zip
unzip ossutil
chmod 755 ossutil-v1.7.16-linux-amd64/ossutil64
sudo mv ossutil-v1.7.16-linux-amd64/ossutil64 /usr/local/bin/ossutil

# 配置
ossutil config

# 上传备份到 OSS
ossutil cp /opt/course-system/backups/ oss://your-backet-name/backups/ -r
```

---

## 十三、成本估算

### 13.1 初期方案（经济型）

| 项目 | 配置 | 月费用 | 年费用 |
|------|------|--------|--------|
| ECS | 2核4G 3Mbps | ¥165 | ¥1,980 |
| RDS MySQL | 1核2G 40GB | ¥65 | ¥780 |
| 域名 | .com | ¥6 | ¥72 |
| SSL | 免费 | ¥0 | ¥0 |
| OSS | 40GB | ¥6 | ¥72 |
| **合计** | - | **¥242** | **¥2,904** |

### 13.2 生产方案（标准型）

| 项目 | 配置 | 月费用 | 年费用 |
|------|------|--------|--------|
| ECS | 2核8G 5Mbps | ¥288 | ¥3,456 |
| RDS MySQL | 2核4G 100GB | ¥168 | ¥2,016 |
| 域名 | .com | ¥6 | ¥72 |
| SSL | DV证书 | ¥33 | ¥396 |
| OSS + CDN | 100GB | ¥25 | ¥300 |
| **合计** | - | **¥520** | **¥6,240** |

### 13.3 优惠活动

- **新用户优惠**: 首年 ECS 低至 ¥99/年
- **双11/618**: 最高优惠 70%
- **包年包月**: 比按量付费节省 30-50%
- **学生优惠**: 凭学生证可享特价

---

## 十四、常见问题

### Q1: 如何查看后端日志？

```bash
# 实时查看
tail -f /opt/course-system/backend/logs/application.log

# 查看最近 100 行
tail -n 100 /opt/course-system/backend/logs/application.log

# 搜索错误日志
grep "ERROR" /opt/course-system/backend/logs/application.log
```

### Q2: 如何重启服务？

```bash
# 重启后端
sudo systemctl restart course-management

# 重启 Nginx
sudo systemctl restart nginx

# 重启 MySQL
sudo systemctl restart mysqld
```

### Q3: 数据库连接失败怎么办？

```bash
# 1. 检查 MySQL 是否运行
sudo systemctl status mysqld

# 2. 检查端口是否监听
netstat -tlnp | grep 3306

# 3. 测试连接
mysql -h <数据库地址> -u course_user -p

# 4. 检查防火墙
sudo firewall-cmd --list-all

# 5. 检查 RDS 白名单（如使用 RDS）
```

### Q4: 前端页面访问 404？

```bash
# 1. 检查 Nginx 配置
sudo nginx -t

# 2. 检查文件是否存在
ls -la /opt/course-system/frontend/admin/

# 3. 检查 Nginx 错误日志
tail -f /var/log/nginx/course-system.error.log

# 4. 重新加载配置
sudo nginx -s reload
```

### Q5: 文件上传失败？

```bash
# 1. 检查目录权限
ls -la /opt/course-system/backend/uploads/
sudo chown -R course-admin:course-admin /opt/course-system/backend/uploads/

# 2. 检查磁盘空间
df -h

# 3. 检查 Nginx 配置
client_max_body_size 10m;

# 4. 检查后端日志
tail -f /opt/course-system/backend/logs/application.log
```

### Q6: 如何更新应用？

```bash
# 1. 停止服务
sudo systemctl stop course-management

# 2. 备份当前版本
cp /opt/course-system/backend/target/course-management-1.0.0.jar /opt/course-system/backups/

# 3. 上传新版本
scp target/course-management-1.0.0.jar course-admin@<IP>:/opt/course-system/backend/target/

# 4. 启动服务
sudo systemctl start course-management

# 5. 验证
curl http://localhost:8082/api/health
```

### Q7: HTTPS 证书过期怎么办？

```bash
# 1. 申请新证书
# 登录阿里云控制台 -> SSL 证书服务

# 2. 下载新证书
# 选择 Nginx 格式

# 3. 替换旧证书
sudo cp your-domain.com.pem /etc/nginx/ssl/
sudo cp your-domain.com.key /etc/nginx/ssl/

# 4. 重启 Nginx
sudo systemctl restart nginx
```

---

## 附录

### A. 常用命令速查

```bash
# 服务管理
sudo systemctl start|stop|restart|status course-management
sudo systemctl start|stop|restart|status nginx
sudo systemctl start|stop|restart|status mysqld

# 日志查看
tail -f /opt/course-system/backend/logs/application.log
tail -f /var/log/nginx/course-system.error.log
sudo journalctl -u course-management -f

# 进程管理
ps aux | grep java
ps aux | grep nginx

# 端口查看
netstat -tlnp | grep 8082
netstat -tlnp | grep 80
netstat -tlnp | grep 443

# 磁盘查看
df -h
du -sh /opt/course-system/*

# 内存查看
free -h
top
```

### B. 环境变量清单

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| DB_PASSWORD | 数据库密码 | YourStrongPassword123! |
| JWT_SECRET | JWT 密钥 | YourJWTSecretKey2024 |
| FILE_UPLOAD_PATH | 文件上传路径 | /opt/course-system/backend/uploads |
| VITE_API_BASE_URL | 前端 API 地址 | https://your-domain.com/api |

### C. 端口清单

| 端口 | 服务 | 访问方式 |
|------|------|---------|
| 22 | SSH | 仅管理员IP |
| 80 | HTTP (Nginx) | 公开 |
| 443 | HTTPS (Nginx) | 公开 |
| 8082 | Spring Boot | 仅本地 |
| 3306 | MySQL | 仅本地/内网 |

### D. 重要文件路径

| 路径 | 说明 |
|------|------|
| /opt/course-system/backend/ | 后端应用目录 |
| /opt/course-system/frontend/ | 前端静态文件 |
| /opt/course-system/backend/uploads/ | 文件上传目录 |
| /opt/course-system/backend/logs/ | 应用日志 |
| /etc/nginx/conf.d/course-system.conf | Nginx 配置 |
| /etc/systemd/system/course-management.service | Systemd 服务配置 |
| /opt/course-system/scripts/ | 运维脚本 |
| /opt/course-system/backups/ | 备份文件 |

---

## 部署检查清单

### 部署前

- [ ] 阿里云账号已注册并实名认证
- [ ] ECS 实例已创建并配置安全组
- [ ] RDS 实例已创建（如使用）
- [ ] 域名已购买并完成备案
- [ ] SSL 证书已申请
- [ ] 本地代码已测试通过
- [ ] 数据库初始化脚本已准备

### 部署中

- [ ] 服务器已初始化（系统更新、软件安装）
- [ ] 部署用户已创建
- [ ] 目录结构已创建
- [ ] 数据库已初始化
- [ ] 后端已编译并启动
- [ ] 前端已构建并上传
- [ ] Nginx 已配置并重启
- [ ] SSL 证书已安装
- [ ] 域名解析已配置

### 部署后

- [ ] HTTPS 访问正常
- [ ] 管理后台可访问
- [ ] 小程序端可访问
- [ ] API 接口正常
- [ ] 文件上传功能正常
- [ ] 数据库连接正常
- [ ] 日志记录正常
- [ ] 监控告警已配置
- [ ] 备份脚本已配置
- [ ] 微信小程序域名已配置

---

## 联系与支持

- **项目文档**: 查看 README.md
- **API 文档**: https://your-domain.com/swagger-ui.html (开发环境)
- **阿里云控制台**: https://console.aliyun.com
- **技术支持**: 提交 Issue 或联系开发团队

---

**文档版本**: v1.0  
**最后更新**: 2026-04-14  
**维护者**: 开发团队
