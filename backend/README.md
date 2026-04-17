# 课程管理系统后端

基于 Spring Boot 3.x + MyBatis-Plus + MySQL 8.0 的课程管理系统后端服务。

## 技术栈

- **Java**: 17
- **Spring Boot**: 3.2.4
- **MyBatis-Plus**: 3.5.5
- **MySQL**: 8.0
- **JWT**: jjwt 0.12.5
- **API 文档**: SpringDoc OpenAPI (Swagger)
- **Excel 导出**: EasyExcel
- **二维码生成**: ZXing

## 项目结构

```
backend/
├── src/main/java/com/course/
│   ├── CourseApplication.java          # Spring Boot 启动类
│   ├── config/                         # 配置类
│   │   ├── MyBatisConfig.java          # MyBatis 配置
│   │   ├── SecurityConfig.java         # Spring Security 配置
│   │   ├── WebConfig.java              # Web MVC 配置
│   │   └── JwtConfig.java              # JWT 配置
│   ├── common/                         # 公共组件
│   │   ├── Result.java                 # 统一响应对象
│   │   ├── PageResult.java             # 分页响应对象
│   │   ├── exception/                  # 异常处理
│   │   └── annotation/                 # 自定义注解
│   ├── entity/                         # 实体类
│   ├── mapper/                         # MyBatis Mapper
│   ├── service/                        # 业务逻辑层
│   │   └── impl/                       # 实现类
│   ├── controller/                     # 控制器层
│   ├── dto/                            # 数据传输对象
│   │   ├── request/                    # 请求 DTO
│   │   └── response/                   # 响应 DTO
│   ├── interceptor/                    # 拦截器
│   │   ├── JwtInterceptor.java         # JWT 认证拦截器
│   │   └── RoleInterceptor.java        # 角色权限拦截器
│   └── utils/                          # 工具类
│       ├── JwtUtil.java                # JWT 工具
│       └── PasswordUtil.java           # 密码加密工具
└── src/main/resources/
    ├── application.yml                 # 应用配置
    ├── application-dev.yml             # 开发环境配置
    ├── application-prod.yml            # 生产环境配置
    ├── db/
    │   └── init.sql                    # 数据库初始化脚本
    └── mapper/                         # MyBatis XML 映射文件
```

## 快速开始

### 1. 环境要求

- JDK 17+
- Maven 3.6+
- MySQL 8.0+

### 2. 数据库初始化

1. 创建数据库：
```sql
CREATE DATABASE course_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. 执行初始化脚本：
```bash
mysql -u root -p course_db < src/main/resources/db/init.sql
```

或者在 MySQL 客户端中执行：
```sql
USE course_db;
SOURCE src/main/resources/db/init.sql;
```

### 3. 配置修改

编辑 `src/main/resources/application-dev.yml`，修改数据库连接信息：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/course_db?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai
    username: root
    password: your_password
```

### 4. 编译项目

```bash
mvn clean install
```

### 5. 启动项目

```bash
mvn spring-boot:run
```

或者直接运行主类：`com.course.CourseApplication`

### 6. 访问服务

- **应用地址**: http://localhost:8080
- **API 文档**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api-docs

## 默认账号

### 管理员账号
- **学号**: ADMIN001
- **密码**: admin123
- **角色**: admin

## API 接口说明

### 认证接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| POST | `/api/auth/login` | 学号密码登录（学员/学术主任） | 公开 |
| POST | `/api/auth/admin-login` | 管理员登录 | 公开 |
| POST | `/api/auth/refresh` | 刷新 Token | 需要 Refresh Token |
| POST | `/api/auth/logout` | 退出登录 | 需要 Token |

### 用户管理接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/api/users` | 获取用户列表 | admin, operator |
| GET | `/api/users/:id` | 获取用户详情 | admin, operator |
| POST | `/api/users` | 创建用户 | admin, operator |
| PUT | `/api/users/:id` | 更新用户信息 | admin, operator |
| DELETE | `/api/users/:id` | 删除用户 | admin, operator |
| PATCH | `/api/users/:id/status` | 更新用户状态 | admin, operator |
| PATCH | `/api/users/:id/points` | 修改用户积分 | admin, operator |
| PATCH | `/api/users/:id/enabled` | 启用/禁用账号 | admin, operator |
| POST | `/api/users/:id/reset-password` | 重置密码 | admin, operator |

## 认证说明

### JWT Token 认证

所有需要认证的接口需要在请求头中携带 Token：

```
Authorization: Bearer {access_token}
```

### Token 类型

1. **Access Token**: 有效期 2 小时，用于接口访问
2. **Refresh Token**: 有效期 7 天，用于刷新 Access Token

### 角色权限

系统使用 `@RequireRole` 注解进行角色权限控制：

- `admin`: 系统管理员
- `operator`: 运营人员
- `academic_director`: 学术主任
- `student`: 学员

## 开发指南

### 添加新模块

1. 在 `entity/` 创建实体类
2. 在 `mapper/` 创建 Mapper 接口
3. 在 `service/` 创建 Service 接口和实现类
4. 在 `controller/` 创建 Controller
5. 在 `dto/` 创建请求和响应 DTO

### 统一响应格式

所有接口返回统一的 `Result<T>` 格式：

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {}
}
```

### 分页查询

使用 `PageResult<T>` 进行分页：

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "records": [],
    "total": 100,
    "page": 1,
    "size": 10,
    "pages": 10
  }
}
```

## 数据库说明

### 初始化脚本

`src/main/resources/db/init.sql` 包含：
- 所有表的 DROP 和 CREATE 语句
- 初始数据（管理员账号、角色、配置等）
- 示例数据（班级、课程等）

### 表结构

详细表结构请参考 PRD 文档的数据库设计部分。

## 部署说明

### 生产环境配置

1. 修改 `application-prod.yml` 中的数据库连接信息
2. 设置环境变量：
   - `DB_PASSWORD`: 数据库密码
   - `JWT_SECRET`: JWT 密钥
   - `FILE_UPLOAD_PATH`: 文件上传路径

3. 打包：
```bash
mvn clean package -DskipTests
```

4. 运行：
```bash
java -jar target/course-management-1.0.0.jar --spring.profiles.active=prod
```

## 后续开发计划

根据 PRD 文档，还需要开发以下模块：

- [x] 认证模块
- [x] 用户管理模块
- [ ] 班级管理模块
- [ ] 课程管理模块
- [ ] 作业管理模块
- [ ] 评价管理模块
- [ ] 考勤管理模块
- [ ] 请假管理模块
- [ ] 活动管理模块
- [ ] 积分商城模块
- [ ] 行程确认模块
- [ ] 消息管理模块
- [ ] 班级圈模块
- [ ] 待办事项模块
- [ ] 系统管理模块
- [ ] 统计模块

## 常见问题

### 1. 包路径错误

IDE 显示 "The declared package does not match the expected package" 错误是 IDE 配置问题，不影响编译和运行。

解决方法：
- Maven 项目需要正确标记 `src/main/java` 为 Sources Root
- 重新导入 Maven 项目

### 2. 数据库连接失败

检查：
- MySQL 服务是否启动
- 数据库是否创建
- 用户名密码是否正确
- 时区配置是否正确

### 3. Token 无效

检查：
- JWT Secret 是否配置
- Token 是否过期
- Token 格式是否正确（Bearer {token}）

## 联系方式

如有问题，请联系开发团队。

## 许可证

MIT License
