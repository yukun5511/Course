# 后端开发进度总结

## 已完成模块 ✅

### 1. 认证模块 (Auth) ✅
**文件位置:** `backend/src/main/java/com/course/`

- ✅ `entity/User.java` - 用户实体
- ✅ `dto/request/LoginRequest.java` - 登录请求
- ✅ `dto/response/LoginResponse.java` - 登录响应
- ✅ `mapper/UserMapper.java` - 用户Mapper
- ✅ `service/AuthService.java` - 认证Service接口
- ✅ `service/impl/AuthServiceImpl.java` - 认证Service实现
- ✅ `controller/AuthController.java` - 认证Controller

**API 接口:**
- `POST /api/auth/login` - 学员登录
- `POST /api/auth/admin-login` - 管理员登录
- `POST /api/auth/wechat-login` - 微信登录
- `POST /api/auth/refresh` - 刷新Token
- `POST /api/auth/logout` - 退出登录

---

### 2. 用户管理模块 (User) ✅
**文件位置:** `backend/src/main/java/com/course/`

- ✅ `dto/request/CreateUserRequest.java` - 创建用户请求
- ✅ `dto/request/UpdateUserRequest.java` - 更新用户请求
- ✅ `dto/request/ResetPasswordRequest.java` - 重置密码请求
- ✅ `dto/response/UserResponse.java` - 用户响应
- ✅ `service/UserService.java` - 用户Service接口
- ✅ `service/impl/UserServiceImpl.java` - 用户Service实现
- ✅ `controller/UserController.java` - 用户Controller

**API 接口:**
- `POST /api/users` - 创建用户（管理员）
- `PUT /api/users/{id}` - 更新用户（管理员）
- `DELETE /api/users/{id}` - 删除用户（管理员）
- `GET /api/users/{id}` - 获取用户详情
- `GET /api/users` - 分页查询用户列表
- `PUT /api/users/{id}/status` - 更新用户状态
- `PUT /api/users/{id}/points` - 更新用户积分
- `PUT /api/users/{id}/password` - 重置密码
- `GET /api/users/me` - 获取当前用户信息

---

### 3. 班级管理模块 (Class) ✅
**文件位置:** `backend/src/main/java/com/course/`

- ✅ `entity/Class.java` - 班级实体
- ✅ `dto/request/CreateClassRequest.java` - 创建班级请求
- ✅ `dto/request/UpdateClassRequest.java` - 更新班级请求
- ✅ `dto/response/ClassResponse.java` - 班级响应
- ✅ `mapper/ClassMapper.java` - 班级Mapper
- ✅ `service/ClassService.java` - 班级Service接口
- ✅ `service/impl/ClassServiceImpl.java` - 班级Service实现
- ✅ `controller/ClassController.java` - 班级Controller

**API 接口:**
- `POST /api/classes` - 创建班级（管理员）
- `PUT /api/classes/{id}` - 更新班级（管理员）
- `DELETE /api/classes/{id}` - 删除班级（管理员）
- `GET /api/classes/{id}` - 获取班级详情
- `GET /api/classes` - 分页查询班级列表
- `GET /api/classes/all` - 获取所有班级（下拉选择）

**功能特性:**
- 班级名称唯一性校验
- 支持关键词搜索
- 支持按状态筛选
- 软删除支持

---

### 4. 课程管理模块 (Course) ✅
**文件位置:** `backend/src/main/java/com/course/`

- ✅ `entity/Course.java` - 课程实体
- ✅ `dto/request/CreateCourseRequest.java` - 创建课程请求
- ✅ `dto/request/UpdateCourseRequest.java` - 更新课程请求
- ✅ `dto/response/CourseResponse.java` - 课程响应
- ✅ `mapper/CourseMapper.java` - 课程Mapper
- ✅ `service/CourseService.java` - 课程Service接口
- ✅ `service/impl/CourseServiceImpl.java` - 课程Service实现
- ✅ `controller/CourseController.java` - 课程Controller

**API 接口:**
- `POST /api/courses` - 创建课程（管理员）
- `PUT /api/courses/{id}` - 更新课程（管理员）
- `DELETE /api/courses/{id}` - 删除课程（管理员）
- `GET /api/courses/{id}` - 获取课程详情
- `GET /api/courses` - 分页查询课程列表
- `GET /api/courses/class/{classId}` - 获取指定班级的课程

**功能特性:**
- 支持按班级筛选
- 支持关键词搜索
- 支持按状态筛选
- 时间范围管理

---

## 待开发模块 📋

### 5. 作业管理模块 (Assignment) ⏳
**计划文件:**
- `entity/Assignment.java`
- `dto/request/CreateAssignmentRequest.java`
- `dto/request/UpdateAssignmentRequest.java`
- `dto/request/SubmitAssignmentRequest.java`
- `dto/response/AssignmentResponse.java`
- `mapper/AssignmentMapper.java`
- `service/AssignmentService.java`
- `service/impl/AssignmentServiceImpl.java`
- `controller/AssignmentController.java`

**计划 API:**
- `POST /api/assignments` - 发布作业
- `PUT /api/assignments/{id}` - 更新作业
- `DELETE /api/assignments/{id}` - 删除作业
- `GET /api/assignments/{id}` - 获取作业详情
- `GET /api/assignments` - 查询作业列表
- `POST /api/assignments/{id}/submit` - 提交作业
- `PUT /api/assignments/{id}/grade` - 批改作业

---

### 6. 评价管理模块 (Evaluation) ⏳
**计划功能:**
- 创建评价模板
- 提交评价
- 查看评价结果
- 评价统计分析

---

### 7. 考勤管理模块 (Attendance) ⏳
**计划功能:**
- 打卡任务管理
- 打卡记录
- 请假申请
- 考勤统计

---

### 8. 活动管理模块 (Activity) ⏳
**计划功能:**
- 活动发布
- 活动报名
- 活动管理
- 活动统计

---

### 9. 积分商城模块 (Points Shop) ⏳
**计划功能:**
- 商品管理
- 兑换管理
- 积分日志
- 库存管理

---

### 10. 其他模块 ⏳
- 班级圈模块 (Class Moment)
- 消息管理模块 (Message)
- 待办事项模块 (Todo)
- 行程确认模块 (Travel Confirmation)
- 系统管理模块 (System)

---

## 技术架构

### 分层架构
```
Controller 层 (控制器)
    ↓
Service 层 (业务逻辑)
    ↓
Mapper 层 (数据访问)
    ↓
Entity 层 (实体类)
```

### 通用组件
- ✅ `common/Result.java` - 统一响应格式
- ✅ `common/PageResult.java` - 分页响应格式
- ✅ `common/BusinessException.java` - 业务异常
- ✅ `common/GlobalExceptionHandler.java` - 全局异常处理
- ✅ `interceptor/JwtInterceptor.java` - JWT认证拦截器
- ✅ `interceptor/RoleInterceptor.java` - 角色权限拦截器
- ✅ `interceptor/RequireRole.java` - 角色注解
- ✅ `utils/JwtUtil.java` - JWT工具类
- ✅ `utils/PasswordUtil.java` - 密码工具类

### 配置类
- ✅ `config/WebConfig.java` - Web配置（CORS）
- ✅ `config/SecurityConfig.java` - 安全配置
- ✅ `config/JwtConfig.java` - JWT配置
- ✅ `config/MyBatisConfig.java` - MyBatis配置

---

## 数据库表

已创建 26 张表：
- users - 用户表
- classes - 班级表
- courses - 课程表
- assignments - 作业表
- evaluations - 评价表
- checkins - 打卡任务表
- activities - 活动表
- shop_items - 商品表
- 等等...

详见: `backend/src/main/resources/db/init.sql`

---

## 下一步计划

### 短期（本周）
1. 完成作业管理模块
2. 完成评价管理模块
3. 完成考勤管理模块

### 中期（本月）
4. 完成活动管理模块
5. 完成积分商城模块
6. 完成消息管理模块

### 长期
7. 完成剩余业务模块
8. 前端页面对接
9. 集成测试
10. 性能优化

---

## 注意事项

### IDE 配置问题
当前 IDE 显示包路径错误（如 `main.java.com.course`），这是 IDE 配置问题，不影响实际编译和运行。

**解决方法：**
在 IDE 中将 `src/main/java` 标记为 Sources Root。

### 编译运行
```bash
cd backend
mvn clean compile  # 编译
mvn spring-boot:run  # 运行
```

---

## 开发规范

### 命名规范
- 实体类: 名词，如 `User`, `Class`, `Course`
- DTO: 动词+名词，如 `CreateUserRequest`, `UserResponse`
- Service: 接口 + Impl 实现
- Controller: 名词+Controller，如 `UserController`

### 代码风格
- 使用 Lombok 简化代码
- 使用 MyBatis-Plus 简化 CRUD
- 统一异常处理
- 统一响应格式
- 参数校验使用 `@Validated`

### API 设计
- RESTful 风格
- 统一路径前缀 `/api`
- 使用 HTTP 状态码
- 分页查询支持

---

## 文档更新

- 后端文档: `backend/README.md`
- 前端文档: `frontend/FRONTEND_API_SETUP.md`
- 项目总文档: `README.md`
- 产品需求: `PRD.md`

---

**最后更新:** 2026-04-14
**开发状态:** 进行中 🚀
