# 前端 API 配置说明

## 配置完成 ✅

前端已经成功配置了后端 API 调用，包括：

### 1. 已安装的依赖
- ✅ `axios` - HTTP 客户端

### 2. 创建的文件

#### API 配置和客户端
- `src/api/config.ts` - API 基础配置、类型定义
- `src/api/client.ts` - Axios 实例、请求/响应拦截器
- `src/api/index.ts` - 统一导出

#### API 模块
- `src/api/auth.ts` - 认证相关接口
  - `login()` - 学员/学术主任登录
  - `adminLogin()` - 管理员登录
  - `wechatLogin()` - 微信登录
  - `refreshToken()` - 刷新 Token
  - `logout()` - 退出登录
  - `getCurrentUser()` - 获取当前用户
  - `isAuthenticated()` - 检查登录状态

- `src/api/user.ts` - 用户管理接口
  - `getUserList()` - 获取用户列表（分页）
  - `getUserById()` - 获取用户详情
  - `createUser()` - 创建用户
  - `updateUser()` - 更新用户
  - `deleteUser()` - 删除用户
  - `updateUserStatus()` - 更新用户状态
  - `updateUserPoints()` - 修改用户积分
  - `updateUserEnabled()` - 启用/禁用账号
  - `resetPassword()` - 重置密码

#### 环境配置
- `.env.development` - 开发环境变量
- `.env.production` - 生产环境变量

### 3. 修改的文件

#### Vite 配置
- `vite.config.ts` - 添加了代理配置
  ```typescript
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
    },
  }
  ```

#### 登录页面
- `src/pages/mini/login/LoginPage.tsx` - 接入真实登录 API
- `src/pages/admin/login/AdminLoginPage.tsx` - 接入真实管理员登录 API

## 启动指南

### 1. 启动后端服务
```bash
cd backend
mvn spring-boot:run
```
后端服务运行在: `http://localhost:8080`

### 2. 启动前端服务
```bash
npm run dev
```
前端服务运行在: `http://localhost:3000`

### 3. 测试登录

#### 小程序端登录
- 地址: http://localhost:3000/mini/login
- 测试账号: 需要先在后端创建学员账号

#### 管理后台登录
- 地址: http://localhost:3000/admin/login
- 测试账号: 
  - 学号: `ADMIN001`
  - 密码: `admin123`

## 工作流程

### 请求流程
1. 前端发起请求 → `http://localhost:3000/api/xxx`
2. Vite 代理转发 → `http://localhost:8080/api/xxx`
3. 后端处理请求 → 返回 JSON 响应
4. 响应拦截器处理 → 返回 `data` 字段

### Token 管理
1. 登录成功后，Token 保存到 `localStorage`
   - `access_token` - 访问令牌（2小时有效）
   - `refresh_token` - 刷新令牌（7天有效）
   - `user_info` - 用户信息

2. 每次请求自动携带 Token
   ```
   Authorization: Bearer {access_token}
   ```

3. Token 过期自动刷新
   - 检测到 401 错误
   - 使用 refresh_token 获取新的 access_token
   - 重试原请求
   - 刷新失败则跳转登录页

## API 调用示例

### 基础用法
```typescript
import { login, adminLogin, getUserList } from '@/api';

// 学员登录
const result = await login({
  studentId: 'S001',
  password: '123456'
});

// 管理员登录
const result = await adminLogin({
  studentId: 'ADMIN001',
  password: 'admin123'
});

// 获取用户列表
const { data } = await getUserList({
  page: 1,
  size: 10,
  role: 'student'
});
```

### 错误处理
```typescript
try {
  await login({ studentId, password });
} catch (error: any) {
  console.error('登录失败:', error.message);
  // 显示错误提示
}
```

## 后续开发

### 需要继续创建的 API 模块
按照后端接口，还需要创建以下模块：

- `src/api/class.ts` - 班级管理
- `src/api/course.ts` - 课程管理
- `src/api/assignment.ts` - 作业管理
- `src/api/evaluation.ts` - 评价管理
- `src/api/attendance.ts` - 考勤管理
- `src/api/leave.ts` - 请假管理
- `src/api/activity.ts` - 活动管理
- `src/api/shop.ts` - 积分商城
- `src/api/travel.ts` - 行程确认
- `src/api/popup.ts` - 消息管理
- `src/api/moment.ts` - 班级圈
- `src/api/todo.ts` - 待办事项
- `src/api/stats.ts` - 统计接口

### 需要修改的页面
将使用 Mock 数据的页面改为调用真实 API：
- 首页
- 课程页面
- 班级页面
- 个人中心
- 管理后台各页面

## 注意事项

1. **跨域问题**: 开发环境使用 Vite 代理，生产环境需要配置 CORS 或使用同域名

2. **环境变量**: 
   - 开发环境: `VITE_API_BASE_URL=/api`
   - 生产环境: `VITE_API_BASE_URL=http://your-api-domain.com/api`

3. **Token 安全**: 
   - Token 存储在 localStorage（生产环境建议加密）
   - 敏感操作需要二次验证

4. **错误提示**: 
   - 所有 API 错误都会在响应拦截器中统一处理
   - 可以在页面中捕获并显示自定义错误信息

## 测试清单

- [x] 安装 axios 依赖
- [x] 创建 API 客户端配置
- [x] 配置请求/响应拦截器
- [x] 创建认证 API 模块
- [x] 创建用户管理 API 模块
- [x] 配置 Vite 代理
- [x] 修改小程序登录页面
- [x] 修改管理后台登录页面
- [ ] 测试学员登录
- [ ] 测试管理员登录
- [ ] 测试 Token 自动刷新
- [ ] 测试其他 API 接口

## 常见问题

### 1. 请求 404
检查：
- 后端服务是否启动
- 代理配置是否正确
- API 路径是否匹配

### 2. 跨域错误
检查：
- Vite 代理是否配置
- 后端 CORS 配置是否正确

### 3. Token 无效
检查：
- 是否成功登录
- Token 是否过期
- 请求头是否携带 Token

### 4. 登录失败
检查：
- 后端数据库是否初始化
- 账号密码是否正确
- 账号是否启用
