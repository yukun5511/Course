# 课程管理系统 - 产品需求文档 (PRD)

## 1. 项目概述

### 1.1 项目背景
面向教育培训机构开发的课程管理系统，支持小程序端（学生/学术主任使用）和管理后台（运营人员使用），实现课程管理、班级管理、考勤管理、积分商城等全流程数字化管理。

### 1.2 目标用户
| 角色 | 终端 | 说明 |
|------|------|------|
| 学员 | 小程序端 | 查看课表、提交作业、课程评价、签到打卡等 |
| 学术主任 | 小程序端 | 查看课表、批改作业、管理班级等 |
| 运营人员 | 管理后台 | 用户管理、班级管理、排课、数据运营等 |
| 系统管理员 | 管理后台 | 角色权限、菜单配置、系统参数设置 |

### 1.3 技术架构
- **前端框架**: React 18 + TypeScript + Vite 6
- **UI 框架**: Tailwind CSS 3 + 自定义设计系统
- **路由**: React Router v7
- **图标库**: Lucide React
- **后端**: Node.js + Express + SQLite
- **认证**: JWT (JSON Web Token)

---

## 2. 功能清单

### 2.1 小程序端（86项需求中的小程序部分）

#### 2.1.1 登录模块
| 编号 | 功能 | 说明 | 角色 |
|------|------|------|------|
| 1 | 学号/密码登录 | 学员使用学号和密码登录 | 学生、学术主任 |
| 2 | 微信一键登录 | 微信授权快速登录 | 学生、学术主任 |

#### 2.1.2 首页模块
| 编号 | 功能 | 说明 | 角色 |
|------|------|------|------|
| 3 | 宣传页 | 展示轮播图文，点击查看详情 | 学生、学术主任 |
| 4 | 弹窗通知 | 登录后显示弹窗，多弹窗可滑动切换，可关闭 | 学生、学术主任 |

#### 2.1.3 课程模块
| 编号 | 功能 | 说明 | 角色 |
|------|------|------|------|
| 5 | 课表查询-学员 | 分期课表展示，学员显示本期及以后的课表 | 学生 |
| 6 | 课表查询-学术主任 | 学术主任可查看所有期课表 | 学术主任 |
| 7 | 课程进度列表 | 区分已结束/进行中/待开始，进行中突出显示 | 学生 |
| 7 | 课程进度详情 | 显示课程名称、开课时间、地点、导师、学分 | 学生 |
| 8 | 学术主任课表 | 学术主任能看到所有期课表 | 学术主任 |
| 9 | 课程评价列表 | 对课程进行评价（表单后台设置） | 学生 |
| 9 | 查看评价结果 | 可查看评价结果统计 | 学生 |
| 9 | 作业提交 | 学员提交课后作业 | 学生 |
| 10 | 作业批改 | 批改课后作业，只显示负责班级 | 学术主任 |

#### 2.1.4 班级模块
| 编号 | 功能 | 说明 | 角色 |
|------|------|------|------|
| 11 | 班级信息 | 显示班级名称、学术主任、班长、班委信息 | 学生、学术主任 |
| 12 | 班级人员列表 | 显示头像、姓名、公司、职位 | 学生、学术主任 |
| 13 | 人员详情 | 查看单个人详细信息 | 学生、学术主任 |
| 14 | 优秀学员展示 | 优秀学员列表（头像、姓名） | 学生、学术主任 |
| 15 | 班级圈发图文 | 发布图文动态 | 学生、学术主任 |
| 16 | 班级圈点赞 | 对动态点赞 | 学生、学术主任 |
| 17 | 班级圈留言 | 对动态评论留言 | 学生、学术主任 |

#### 2.1.5 我的模块
| 编号 | 功能 | 说明 | 角色 |
|------|------|------|------|
| 18 | 个人信息查看 | 展示头像、姓名、公司、身份标签 | 学生、学术主任 |
| 19 | 个人信息编辑 | 可修改个人信息 | 学生、学术主任 |
| 20 | 现场签到 | 扫码签到，仅在打卡范围内可成功 | 学生 |
| 21 | 待办事项列表 | 显示待办事项列表 | 学生 |
| 22 | 待办事项详情 | 查看待办事项主要内容 | 学生 |
| 23 | 积分兑换-徽章 | 显示徽章数量 | 学生 |
| 24 | 兑换课程 | 用徽章兑换课程，徽章减少，课程加入课表 | 学生 |
| 25 | 兑换活动 | 用徽章兑换活动，徽章减少 | 学生 |
| 26 | 行程确认列表 | 显示所有行程确认 | 学生 |
| 27 | 填写行程确认 | 是否参加、房间数量、房间号、到达时间、交通工具、车次航班 | 学生 |
| 28 | 请假课程列表 | 按课程进行请假 | 学生 |
| 29 | 请假申请 | 提交请假原因 | 学生 |
| 30 | 请假统计 | 统计本期到课、请假、迟到、缺勤次数 | 学生 |
| 31 | 退出登录 | 退出账号，回到登录页 | 学生、学术主任 |

### 2.2 管理后台（86项需求中的管理后台部分）

#### 2.2.1 登录
| 编号 | 功能 | 说明 | 角色 |
|------|------|------|------|
| 32 | 账号密码登录 | 运营人员登录管理后台 | 运营人员 |

#### 2.2.2 用户管理
| 编号 | 功能 | 说明 | 角色 |
|------|------|------|------|
| 33 | 学员信息维护 | 学员基本信息（姓名、公司、标签），积分修改 | 运营人员 |
| 34 | 学习记录 | 考勤记录、作业记录 | 运营人员 |
| 35 | 学员状态 | 在读 / 结业 / 退学 | 运营人员 |
| 36 | 账号管理 | 启用/禁用账号、重置密码 | 运营人员 |
| 37 | 导师信息维护 | 导师基本信息维护 | 运营人员 |
| 38 | 导师账号管理 | 启用/禁用账号、重置密码 | 运营人员 |

#### 2.2.3 班级管理
| 编号 | 功能 | 说明 | 角色 |
|------|------|------|------|
| 39 | 班级列表 | 查看所有班级信息，支持按名称/班主任筛选，导出Excel | 运营人员 |
| 40 | 创建班级 | 维护班级基础信息、分配班主任、班级状态 | 运营人员 |
| 41 | 班级学员管理 | 批量添加/批量删除/批量分班 | 运营人员 |
| 42 | 班级学习概览 | 出勤率、作业完成率、到课率、积分排行 | 运营人员 |

#### 2.2.4 排课管理
| 编号 | 功能 | 说明 | 角色 |
|------|------|------|------|
| 43 | 创建课表 | 课程名称、开课时间、导师、绑定班级、课代表 | 运营人员 |
| 44 | 定时发送行程确认 | 给学员定时发送行程确认通知 | 运营人员 |
| 45 | 单课管理 | 选择单课程，维护学员名单 | 运营人员 |

#### 2.2.5 预约统计
| 编号 | 功能 | 说明 | 角色 |
|------|------|------|------|
| 46 | 预约记录 | 查看课程预约记录和学员行程安排 | 运营人员 |

#### 2.2.6 教学管理
| 编号 | 功能 | 说明 | 角色 |
|------|------|------|------|
| 47 | 发布作业 | 按照课表发布作业内容 | 运营人员 |
| 48 | 提交记录 | 按作业列表查看学员提交信息 | 运营人员 |
| 49 | 批改作业 | 对作业进行打分和评语 | 运营人员 |
| 50 | 发布评价问卷 | 按课程/导师发布评价问卷 | 运营人员 |
| 51 | 评价详情 | 查看评价详情、统计、导出 | 运营人员 |

#### 2.2.7 考勤管理
| 编号 | 功能 | 说明 | 角色 |
|------|------|------|------|
| 52 | 创建打卡 | 选择班级、课程创建打卡任务 | 运营人员 |
| 53 | 设定打卡位置 | 设置打卡范围，此范围内才可打卡 | 运营人员 |
| 54 | 生成二维码 | 生成签到二维码 | 运营人员 |
| 55 | 请假查看 | 查看请假申请和记录 | 运营人员 |
| 56 | 出勤记录 | 查看课程出勤情况（正常/迟到/缺勤/请假） | 运营人员 |
| 57 | 修改考勤状态 | 手动修改学员考勤状态 | 运营人员 |
| 58 | 出勤统计 | 按班级、课程、学员统计出勤 | 运营人员 |

#### 2.2.8 活动管理
| 编号 | 功能 | 说明 | 角色 |
|------|------|------|------|
| 59 | 发布活动 | 编辑文案、添加图片、设定是否上轮播图 | 运营人员 |
| 60 | 报名管理 | 查看报名信息列表 | 运营人员 |
| 61 | 名单导出 | 导出报名名单 | 运营人员 |

#### 2.2.9 积分商城管理
| 编号 | 功能 | 说明 | 角色 |
|------|------|------|------|
| 62 | 商品列表 | 默认展示报名中的课表和活动 | 运营人员 |
| 63 | 设置商品信息 | 编辑兑换所需徽章数量及库存上限 | 运营人员 |
| 64 | 徽章查看 | 查看所有学员徽章数量、排行 | 运营人员 |
| 65 | 编辑商品状态 | 编辑商品课程是否提前下架 | 运营人员 |
| 66 | 兑换列表 | 查看兑换记录 | 运营人员 |
| 67 | 积分获取流水 | 查看所有积分获取情况，支持筛选 | 运营人员 |
| 68 | 积分兑换记录 | 查看所有积分兑换情况，支持筛选 | 运营人员 |

#### 2.2.10 消息管理
| 编号 | 功能 | 说明 | 角色 |
|------|------|------|------|
| 69 | 弹窗列表 | 查看历史弹窗内容 | 运营人员 |
| 70 | 创建新弹窗 | 创建新的弹窗消息 | 运营人员 |
| 71 | 发布弹窗 | 对弹窗进行发布 | 运营人员 |
| 72 | 撤销弹窗 | 撤下已发布的弹窗 | 运营人员 |
| 73 | 删除弹窗 | 删除弹窗内容 | 运营人员 |
| 79 | 出勤率统计 | 查看整体出勤率数据 | 运营人员 |
| 80 | 作业完成率统计 | 查看作业完成率数据 | 运营人员 |
| 81 | 课程上座率统计 | 查看课程上座率数据 | 运营人员 |
| 82 | 导师数据统计 | 查看导师评价数据 | 运营人员 |

#### 2.2.11 系统管理
| 编号 | 功能 | 说明 | 角色 |
|------|------|------|------|
| 83 | 角色管理 | 管理系统角色和权限 | 管理员 |
| 84 | 菜单管理 | 管理系统菜单结构 | 管理员 |
| 85 | 参数设置 | 设置系统运行参数 | 管理员 |
| 86 | 日志管理 | 查看系统操作日志 | 管理员 |

---

## 3. 数据库设计

### 3.1 用户表 (users)
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  student_id TEXT UNIQUE,
  name TEXT NOT NULL,
  password TEXT,
  avatar TEXT,
  company TEXT,
  position TEXT,
  tags TEXT,
  role TEXT NOT NULL CHECK(role IN ('student', 'academic_director', 'admin', 'operator')),
  phone TEXT,
  email TEXT,
  badges INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  current_period INTEGER,
  class_id TEXT REFERENCES classes(id),
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'graduated', 'dropped')),
  enabled INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 3.2 班级表 (classes)
```sql
CREATE TABLE classes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  director TEXT,
  director_id TEXT REFERENCES users(id),
  monitor TEXT,
  monitor_id TEXT REFERENCES users(id),
  committee TEXT,
  status TEXT DEFAULT 'not_started' CHECK(status IN ('not_started', 'ongoing', 'graduated')),
  period INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 3.3 课程表 (courses)
```sql
CREATE TABLE courses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  period INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  location TEXT,
  instructor TEXT,
  instructor_id TEXT REFERENCES users(id),
  credits INTEGER,
  status TEXT DEFAULT 'pending' CHECK(status IN ('ended', 'ongoing', 'pending')),
  description TEXT,
  image TEXT,
  class_id TEXT REFERENCES classes(id),
  representative TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 3.4 单课表 (single_courses)
```sql
CREATE TABLE single_courses (
  id TEXT PRIMARY KEY,
  course_id TEXT REFERENCES courses(id),
  course_name TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  location TEXT,
  instructor TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 3.5 单课学员表 (single_course_students)
```sql
CREATE TABLE single_course_students (
  id TEXT PRIMARY KEY,
  single_course_id TEXT REFERENCES single_courses(id),
  student_id TEXT REFERENCES users(id),
  attendance TEXT DEFAULT 'present' CHECK(attendance IN ('present', 'late', 'absent', 'leave')),
  UNIQUE(single_course_id, student_id)
);
```

### 3.6 作业表 (assignments)
```sql
CREATE TABLE assignments (
  id TEXT PRIMARY KEY,
  course_id TEXT REFERENCES courses(id),
  course_name TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  deadline DATETIME NOT NULL,
  created_by TEXT REFERENCES users(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 3.7 作业提交表 (assignment_submissions)
```sql
CREATE TABLE assignment_submissions (
  id TEXT PRIMARY KEY,
  assignment_id TEXT REFERENCES assignments(id),
  student_id TEXT REFERENCES users(id),
  content TEXT,
  attachment TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'submitted', 'graded')),
  score INTEGER,
  feedback TEXT,
  submitted_at DATETIME,
  graded_at DATETIME,
  graded_by TEXT REFERENCES users(id),
  UNIQUE(assignment_id, student_id)
);
```

### 3.8 课程评价表 (evaluations)
```sql
CREATE TABLE evaluations (
  id TEXT PRIMARY KEY,
  course_id TEXT REFERENCES courses(id),
  course_name TEXT NOT NULL,
  questions TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 3.9 评价回答表 (evaluation_responses)
```sql
CREATE TABLE evaluation_responses (
  id TEXT PRIMARY KEY,
  evaluation_id TEXT REFERENCES evaluations(id),
  student_id TEXT REFERENCES users(id),
  answers TEXT NOT NULL,
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(evaluation_id, student_id)
);
```

### 3.10 班级动态表 (class_moments)
```sql
CREATE TABLE class_moments (
  id TEXT PRIMARY KEY,
  class_id TEXT REFERENCES classes(id),
  author_id TEXT REFERENCES users(id),
  content TEXT,
  images TEXT,
  likes TEXT DEFAULT '[]',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 3.11 动态评论表 (moment_comments)
```sql
CREATE TABLE moment_comments (
  id TEXT PRIMARY KEY,
  moment_id TEXT REFERENCES class_moments(id),
  author_id TEXT REFERENCES users(id),
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 3.12 待办事项表 (todos)
```sql
CREATE TABLE todos (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  completed INTEGER DEFAULT 0,
  type TEXT CHECK(type IN ('course', 'assignment', 'evaluation', 'other')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 3.13 行程确认表 (travel_confirmations)
```sql
CREATE TABLE travel_confirmations (
  id TEXT PRIMARY KEY,
  course_id TEXT REFERENCES courses(id),
  course_name TEXT NOT NULL,
  user_id TEXT REFERENCES users(id),
  attending INTEGER DEFAULT 1,
  room_count INTEGER,
  room_number TEXT,
  arrival_time DATETIME,
  transport TEXT CHECK(transport IN ('plane', 'train', 'car', 'other')),
  trip_number TEXT,
  submitted INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(course_id, user_id)
);
```

### 3.14 请假记录表 (leave_records)
```sql
CREATE TABLE leave_records (
  id TEXT PRIMARY KEY,
  course_id TEXT REFERENCES courses(id),
  course_name TEXT NOT NULL,
  user_id TEXT REFERENCES users(id),
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  reviewed_at DATETIME,
  reviewed_by TEXT REFERENCES users(id)
);
```

### 3.15 积分商城商品表 (shop_items)
```sql
CREATE TABLE shop_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('course', 'activity')),
  image TEXT,
  badge_cost INTEGER NOT NULL,
  stock INTEGER NOT NULL,
  available INTEGER DEFAULT 1,
  description TEXT,
  course_id TEXT REFERENCES courses(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 3.16 兑换记录表 (exchange_records)
```sql
CREATE TABLE exchange_records (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  item_id TEXT REFERENCES shop_items(id),
  item_name TEXT NOT NULL,
  badge_cost INTEGER NOT NULL,
  exchanged_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 3.17 弹窗消息表 (popup_messages)
```sql
CREATE TABLE popup_messages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image TEXT,
  published INTEGER DEFAULT 0,
  created_by TEXT REFERENCES users(id),
  published_by TEXT REFERENCES users(id),
  published_at DATETIME,
  revoked_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 3.18 活动表 (activities)
```sql
CREATE TABLE activities (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  image TEXT,
  on_carousel INTEGER DEFAULT 0,
  created_by TEXT REFERENCES users(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 3.19 活动报名表 (activity_registrations)
```sql
CREATE TABLE activity_registrations (
  id TEXT PRIMARY KEY,
  activity_id TEXT REFERENCES activities(id),
  user_id TEXT REFERENCES users(id),
  registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(activity_id, user_id)
);
```

### 3.20 打卡任务表 (checkins)
```sql
CREATE TABLE checkins (
  id TEXT PRIMARY KEY,
  class_id TEXT REFERENCES classes(id),
  class_name TEXT NOT NULL,
  course_id TEXT REFERENCES courses(id),
  course_name TEXT NOT NULL,
  location_name TEXT,
  latitude REAL,
  longitude REAL,
  radius INTEGER DEFAULT 100,
  qr_code TEXT,
  created_by TEXT REFERENCES users(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME
);
```

### 3.21 打卡记录表 (checkin_records)
```sql
CREATE TABLE checkin_records (
  id TEXT PRIMARY KEY,
  checkin_id TEXT REFERENCES checkins(id),
  user_id TEXT REFERENCES users(id),
  checkin_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'success' CHECK(status IN ('success', 'fail_out_of_range')),
  location_lat REAL,
  location_lng REAL
);
```

### 3.22 积分日志表 (points_logs)
```sql
CREATE TABLE points_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  user_name TEXT NOT NULL,
  class_id TEXT REFERENCES classes(id),
  class_name TEXT,
  points INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 3.23 系统配置表 (system_configs)
```sql
CREATE TABLE system_configs (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 3.24 操作日志表 (operation_logs)
```sql
CREATE TABLE operation_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  user_name TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  ip_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 3.25 角色表 (roles)
```sql
CREATE TABLE roles (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  permissions TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 3.26 菜单表 (menus)
```sql
CREATE TABLE menus (
  id TEXT PRIMARY KEY,
  parent_id TEXT REFERENCES menus(id),
  name TEXT NOT NULL,
  path TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. API 接口设计

### 4.1 认证接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| POST | `/api/auth/login` | 学号密码登录 | 公开 |
| POST | `/api/auth/wechat-login` | 微信登录 | 公开 |
| POST | `/api/auth/admin-login` | 管理员登录 | 公开 |
| POST | `/api/auth/refresh` | 刷新Token | 需要RefreshToken |
| POST | `/api/auth/logout` | 退出登录 | 需要Token |

### 4.2 用户接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/api/users` | 获取用户列表 | 运营人员 |
| GET | `/api/users/:id` | 获取用户详情 | 运营人员 |
| POST | `/api/users` | 创建用户 | 运营人员 |
| PUT | `/api/users/:id` | 更新用户信息 | 运营人员 |
| DELETE | `/api/users/:id` | 删除用户 | 运营人员 |
| PATCH | `/api/users/:id/status` | 更新用户状态 | 运营人员 |
| PATCH | `/api/users/:id/points` | 修改用户积分 | 运营人员 |
| PATCH | `/api/users/:id/enabled` | 启用/禁用账号 | 运营人员 |
| POST | `/api/users/:id/reset-password` | 重置密码 | 运营人员 |
| GET | `/api/users/:id/learning-records` | 获取学习记录 | 运营人员 |
| GET | `/api/users/:id/badge-ranking` | 获取徽章排行 | 运营人员 |

### 4.3 班级接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/api/classes` | 获取班级列表 | 运营人员 |
| GET | `/api/classes/:id` | 获取班级详情 | 运营人员 |
| POST | `/api/classes` | 创建班级 | 运营人员 |
| PUT | `/api/classes/:id` | 更新班级信息 | 运营人员 |
| DELETE | `/api/classes/:id` | 删除班级 | 运营人员 |
| POST | `/api/classes/:id/students` | 批量添加学员 | 运营人员 |
| DELETE | `/api/classes/:id/students` | 批量移除学员 | 运营人员 |
| POST | `/api/classes/:id/assign` | 批量分班 | 运营人员 |
| GET | `/api/classes/:id/overview` | 班级学习概览 | 运营人员 |
| GET | `/api/classes/:id/excel` | 导出班级Excel | 运营人员 |

### 4.4 课程接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/api/courses` | 获取课程列表 | 公开 |
| GET | `/api/courses/:id` | 获取课程详情 | 公开 |
| POST | `/api/courses` | 创建课程 | 运营人员 |
| PUT | `/api/courses/:id` | 更新课程信息 | 运营人员 |
| DELETE | `/api/courses/:id` | 删除课程 | 运营人员 |
| GET | `/api/courses/:id/schedule` | 获取课程课表 | 公开 |
| GET | `/api/courses/:id/single-courses` | 获取单课列表 | 公开 |
| POST | `/api/courses/:id/single-courses` | 添加单课 | 运营人员 |
| PUT | `/api/single-courses/:id/students` | 维护单课学员 | 运营人员 |

### 4.5 作业接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/api/assignments` | 获取作业列表 | 公开 |
| GET | `/api/assignments/:id` | 获取作业详情 | 公开 |
| POST | `/api/assignments` | 发布作业 | 运营人员 |
| PUT | `/api/assignments/:id` | 更新作业 | 运营人员 |
| DELETE | `/api/assignments/:id` | 删除作业 | 运营人员 |
| POST | `/api/assignments/:id/submit` | 提交作业 | 学生 |
| GET | `/api/assignments/:id/submissions` | 获取提交记录 | 运营人员 |
| PATCH | `/api/assignments/:id/submissions/:sid` | 批改作业 | 运营人员/学术主任 |

### 4.6 评价接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/api/evaluations` | 获取评价列表 | 公开 |
| GET | `/api/evaluations/:id` | 获取评价详情 | 公开 |
| POST | `/api/evaluations` | 发布评价问卷 | 运营人员 |
| POST | `/api/evaluations/:id/respond` | 提交评价 | 学生 |
| GET | `/api/evaluations/:id/results` | 获取评价统计 | 公开 |
| GET | `/api/evaluations/:id/export` | 导出评价数据 | 运营人员 |

### 4.7 考勤接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/api/checkins` | 获取打卡任务列表 | 运营人员 |
| POST | `/api/checkins` | 创建打卡任务 | 运营人员 |
| PUT | `/api/checkins/:id` | 更新打卡任务 | 运营人员 |
| DELETE | `/api/checkins/:id` | 删除打卡任务 | 运营人员 |
| POST | `/api/checkins/:id/qr` | 生成二维码 | 运营人员 |
| POST | `/api/checkins/:id/record` | 提交打卡记录 | 学生 |
| GET | `/api/checkins/:id/records` | 获取打卡记录 | 运营人员 |
| GET | `/api/attendance/records` | 获取出勤记录 | 运营人员 |
| PATCH | `/api/attendance/records/:id` | 修改考勤状态 | 运营人员 |
| GET | `/api/attendance/stats` | 获取出勤统计 | 运营人员 |

### 4.8 请假接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/api/leaves` | 获取请假列表 | 运营人员 |
| POST | `/api/leaves` | 提交请假申请 | 学生 |
| PATCH | `/api/leaves/:id` | 审批请假 | 运营人员/学术主任 |
| GET | `/api/leaves/stats` | 获取请假统计 | 学生 |

### 4.9 活动接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/api/activities` | 获取活动列表 | 公开 |
| GET | `/api/activities/:id` | 获取活动详情 | 公开 |
| POST | `/api/activities` | 发布活动 | 运营人员 |
| PUT | `/api/activities/:id` | 更新活动 | 运营人员 |
| DELETE | `/api/activities/:id` | 删除活动 | 运营人员 |
| POST | `/api/activities/:id/register` | 报名活动 | 学生 |
| GET | `/api/activities/:id/registrations` | 获取报名列表 | 运营人员 |
| GET | `/api/activities/:id/export` | 导出报名名单 | 运营人员 |

### 4.10 积分商城接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/api/shop/items` | 获取商品列表 | 公开 |
| POST | `/api/shop/items` | 创建商品 | 运营人员 |
| PUT | `/api/shop/items/:id` | 更新商品 | 运营人员 |
| DELETE | `/api/shop/items/:id` | 删除商品 | 运营人员 |
| PATCH | `/api/shop/items/:id/available` | 上架/下架 | 运营人员 |
| POST | `/api/shop/exchange` | 兑换商品 | 学生 |
| GET | `/api/shop/exchanges` | 获取兑换记录 | 运营人员 |
| GET | `/api/points/logs` | 获取积分流水 | 运营人员 |

### 4.11 行程确认接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/api/travel-confirmations` | 获取行程确认列表 | 学生 |
| POST | `/api/travel-confirmations` | 提交行程确认 | 学生 |
| PUT | `/api/travel-confirmations/:id` | 更新行程确认 | 学生 |
| POST | `/api/courses/:id/send-travel-confirm` | 定时发送行程确认 | 运营人员 |

### 4.12 消息接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/api/popups` | 获取弹窗列表 | 运营人员 |
| POST | `/api/popups` | 创建弹窗 | 运营人员 |
| POST | `/api/popups/:id/publish` | 发布弹窗 | 运营人员 |
| POST | `/api/popups/:id/revoke` | 撤销弹窗 | 运营人员 |
| DELETE | `/api/popups/:id` | 删除弹窗 | 运营人员 |
| GET | `/api/popups/unread` | 获取未读弹窗 | 学生 |

### 4.13 班级圈接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/api/moments` | 获取班级动态列表 | 学生/学术主任 |
| POST | `/api/moments` | 发布动态 | 学生/学术主任 |
| POST | `/api/moments/:id/like` | 点赞动态 | 学生/学术主任 |
| DELETE | `/api/moments/:id/like` | 取消点赞 | 学生/学术主任 |
| POST | `/api/moments/:id/comments` | 发表评论 | 学生/学术主任 |
| DELETE | `/api/moments/:id/comments/:cid` | 删除评论 | 学生/学术主任 |

### 4.14 待办事项接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/api/todos` | 获取待办列表 | 学生 |
| POST | `/api/todos` | 创建待办 | 系统/运营人员 |
| PATCH | `/api/todos/:id` | 更新待办状态 | 系统 |
| DELETE | `/api/todos/:id` | 删除待办 | 系统 |

### 4.15 系统管理接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/api/roles` | 获取角色列表 | 管理员 |
| POST | `/api/roles` | 创建角色 | 管理员 |
| PUT | `/api/roles/:id` | 更新角色 | 管理员 |
| DELETE | `/api/roles/:id` | 删除角色 | 管理员 |
| GET | `/api/menus` | 获取菜单列表 | 管理员 |
| POST | `/api/menus` | 创建菜单 | 管理员 |
| PUT | `/api/menus/:id` | 更新菜单 | 管理员 |
| DELETE | `/api/menus/:id` | 删除菜单 | 管理员 |
| GET | `/api/configs` | 获取系统配置 | 管理员 |
| PUT | `/api/configs/:key` | 更新系统配置 | 管理员 |
| GET | `/api/logs` | 获取操作日志 | 管理员 |

### 4.16 统计接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/api/stats/dashboard` | 获取仪表盘数据 | 运营人员 |
| GET | `/api/stats/attendance-rate` | 获取出勤率统计 | 运营人员 |
| GET | `/api/stats/assignment-completion` | 获取作业完成率 | 运营人员 |
| GET | `/api/stats/course-occupancy` | 获取课程上座率 | 运营人员 |
| GET | `/api/stats/instructor-data` | 获取导师数据 | 运营人员 |

---

## 5. 业务流程

### 5.1 学员学习流程
```
学员登录 → 查看课表 → 收到行程确认 → 确认行程 → 现场签到 → 上课 → 提交作业 → 课程评价 → 获得积分/徽章
```

### 5.2 请假流程
```
学员申请请假 → 学术主任/运营人员审批 → 更新考勤状态 → 更新请假统计
```

### 5.3 积分兑换流程
```
学员查看商城 → 选择商品 → 确认兑换 → 扣除徽章 → (课程类)加入课表 / (活动类)完成报名
```

### 5.4 排课流程
```
运营人员创建课程 → 添加单课 → 绑定班级 → 添加学员 → 创建打卡任务 → 发送行程确认
```

### 5.5 作业批改流程
```
运营人员发布作业 → 学员提交作业 → 学术主任批改打分 → 学员查看成绩和反馈
```

---

## 6. 安全设计

### 6.1 认证安全
- JWT Token 认证，Access Token 有效期 2 小时
- Refresh Token 有效期 7 天
- 密码使用 bcrypt 加密存储
- 登录失败次数限制（5次/小时）

### 6.2 接口安全
- 所有 API 需要携带 Authorization header
- 基于角色的权限控制 (RBAC)
- 接口限流：100次/分钟/IP
- 敏感操作记录日志

### 6.3 数据安全
- 数据库定期备份
- 敏感信息脱敏显示
- 操作日志不可删除

---

## 7. 性能要求

| 指标 | 要求 |
|------|------|
| 页面加载时间 | < 2秒 |
| API响应时间 | < 500ms |
| 并发用户数 | 支持 1000+ 并发 |
| 数据库查询 | 复杂查询 < 1秒 |

---

## 8. 项目结构

```
Course/
├── src/                        # 前端源码
│   ├── components/             # 公共组件
│   │   ├── common/             # TabBar, NavBar
│   │   ├── layout/             # 布局组件
│   │   └── ui/                 # UI组件
│   ├── data/                   # 数据层
│   │   ├── types.ts            # TypeScript类型
│   │   └── mockData.ts         # 模拟数据
│   ├── pages/                  # 页面组件
│   │   ├── mini/               # 小程序端页面
│   │   └── admin/              # 管理后台页面
│   ├── lib/                    # 工具库
│   ├── App.tsx                 # 路由配置
│   ├── main.tsx                # 入口文件
│   └── index.css               # 全局样式
├── server/                     # 后端源码（待开发）
│   ├── config/                 # 配置文件
│   ├── middleware/             # 中间件
│   ├── models/                 # 数据模型
│   ├── routes/                 # 路由定义
│   ├── utils/                  # 工具函数
│   └── index.js                # 服务入口
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 9. 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2024-04-14 | 初始版本，完成前端UI开发 |

---

*文档生成时间: 2024-04-14*
