-- ============================================
-- 课程管理系统数据库初始化脚本
-- 数据库: MySQL 8.0
-- 字符集: utf8mb4
-- ============================================

-- 设置字符集
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================
-- 1. 删除所有表（按外键依赖逆序）
-- ============================================
DROP TABLE IF EXISTS `operation_logs`;
DROP TABLE IF EXISTS `system_configs`;
DROP TABLE IF EXISTS `menus`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `points_logs`;
DROP TABLE IF EXISTS `checkin_records`;
DROP TABLE IF EXISTS `checkins`;
DROP TABLE IF EXISTS `activity_registrations`;
DROP TABLE IF EXISTS `activities`;
DROP TABLE IF EXISTS `popup_messages`;
DROP TABLE IF EXISTS `exchange_records`;
DROP TABLE IF EXISTS `shop_items`;
DROP TABLE IF EXISTS `leave_records`;
DROP TABLE IF EXISTS `travel_confirmations`;
DROP TABLE IF EXISTS `todos`;
DROP TABLE IF EXISTS `moment_comments`;
DROP TABLE IF EXISTS `class_moments`;
DROP TABLE IF EXISTS `evaluation_responses`;
DROP TABLE IF EXISTS `evaluations`;
DROP TABLE IF EXISTS `assignment_submissions`;
DROP TABLE IF EXISTS `assignments`;
DROP TABLE IF EXISTS `single_course_students`;
DROP TABLE IF EXISTS `single_courses`;
DROP TABLE IF EXISTS `courses`;
DROP TABLE IF EXISTS `classes`;
DROP TABLE IF EXISTS `users`;

-- ============================================
-- 2. 创建所有表
-- ============================================

-- 2.1 用户表
CREATE TABLE `users` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
  `student_id` VARCHAR(50) UNIQUE COMMENT '学号',
  `name` VARCHAR(100) NOT NULL COMMENT '姓名',
  `password` VARCHAR(255) COMMENT '密码（BCrypt加密）',
  `avatar` VARCHAR(500) COMMENT '头像URL',
  `company` VARCHAR(200) COMMENT '公司',
  `position` VARCHAR(100) COMMENT '职位',
  `tags` JSON COMMENT '标签',
  `role` VARCHAR(50) NOT NULL COMMENT '角色：student/academic_director/admin/operator',
  `phone` VARCHAR(20) COMMENT '手机号',
  `email` VARCHAR(100) COMMENT '邮箱',
  `badges` INT DEFAULT 0 COMMENT '徽章数量',
  `points` INT DEFAULT 0 COMMENT '积分',
  `current_period` INT COMMENT '当前期数',
  `class_id` BIGINT COMMENT '班级ID',
  `status` VARCHAR(20) DEFAULT 'active' COMMENT '状态：active/graduated/dropped',
  `enabled` TINYINT DEFAULT 1 COMMENT '是否启用：1启用 0禁用',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX `idx_student_id` (`student_id`),
  INDEX `idx_role` (`role`),
  INDEX `idx_class_id` (`class_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 2.2 班级表
CREATE TABLE `classes` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '班级ID',
  `name` VARCHAR(100) NOT NULL COMMENT '班级名称',
  `director` VARCHAR(100) COMMENT '学术主任姓名',
  `director_id` BIGINT COMMENT '学术主任ID',
  `monitor` VARCHAR(100) COMMENT '班长姓名',
  `monitor_id` BIGINT COMMENT '班长ID',
  `committee` JSON COMMENT '班委信息',
  `status` VARCHAR(20) DEFAULT 'not_started' COMMENT '状态：not_started/ongoing/graduated',
  `period` INT NOT NULL COMMENT '期数',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX `idx_period` (`period`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='班级表';

-- 添加外键约束
ALTER TABLE `users` ADD CONSTRAINT `fk_user_class` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`);

-- 2.3 课程表
CREATE TABLE `courses` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '课程ID',
  `name` VARCHAR(200) NOT NULL COMMENT '课程名称',
  `period` INT NOT NULL COMMENT '期数',
  `start_date` DATE NOT NULL COMMENT '开始日期',
  `end_date` DATE NOT NULL COMMENT '结束日期',
  `location` VARCHAR(200) COMMENT '地点',
  `instructor` VARCHAR(100) COMMENT '导师姓名',
  `instructor_id` BIGINT COMMENT '导师ID',
  `credits` INT COMMENT '学分',
  `status` VARCHAR(20) DEFAULT 'pending' COMMENT '状态：ended/ongoing/pending',
  `description` TEXT COMMENT '课程描述',
  `image` VARCHAR(500) COMMENT '课程图片',
  `class_id` BIGINT COMMENT '班级ID',
  `representative` VARCHAR(100) COMMENT '课代表',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX `idx_period` (`period`),
  INDEX `idx_status` (`status`),
  INDEX `idx_class_id` (`class_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='课程表';

-- 2.4 单课表
CREATE TABLE `single_courses` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '单课ID',
  `course_id` BIGINT NOT NULL COMMENT '课程ID',
  `course_name` VARCHAR(200) NOT NULL COMMENT '课程名称',
  `date` DATE NOT NULL COMMENT '上课日期',
  `start_time` VARCHAR(10) NOT NULL COMMENT '开始时间',
  `end_time` VARCHAR(10) NOT NULL COMMENT '结束时间',
  `location` VARCHAR(200) COMMENT '地点',
  `instructor` VARCHAR(100) COMMENT '导师',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX `idx_course_id` (`course_id`),
  INDEX `idx_date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='单课表';

-- 2.5 单课学员表
CREATE TABLE `single_course_students` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID',
  `single_course_id` BIGINT NOT NULL COMMENT '单课ID',
  `student_id` BIGINT NOT NULL COMMENT '学员ID',
  `attendance` VARCHAR(20) DEFAULT 'present' COMMENT '出勤状态：present/late/absent/leave',
  UNIQUE KEY `uk_course_student` (`single_course_id`, `student_id`),
  INDEX `idx_single_course_id` (`single_course_id`),
  INDEX `idx_student_id` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='单课学员表';

-- 2.6 作业表
CREATE TABLE `assignments` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '作业ID',
  `course_id` BIGINT NOT NULL COMMENT '课程ID',
  `course_name` VARCHAR(200) NOT NULL COMMENT '课程名称',
  `title` VARCHAR(200) NOT NULL COMMENT '作业标题',
  `content` TEXT COMMENT '作业内容',
  `deadline` DATETIME NOT NULL COMMENT '截止时间',
  `created_by` BIGINT COMMENT '创建人ID',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX `idx_course_id` (`course_id`),
  INDEX `idx_deadline` (`deadline`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='作业表';

-- 2.7 作业提交表
CREATE TABLE `assignment_submissions` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '提交ID',
  `assignment_id` BIGINT NOT NULL COMMENT '作业ID',
  `student_id` BIGINT NOT NULL COMMENT '学员ID',
  `content` TEXT COMMENT '提交内容',
  `attachment` VARCHAR(500) COMMENT '附件URL',
  `status` VARCHAR(20) DEFAULT 'pending' COMMENT '状态：pending/submitted/graded',
  `score` INT COMMENT '分数',
  `feedback` TEXT COMMENT '评语',
  `submitted_at` DATETIME COMMENT '提交时间',
  `graded_at` DATETIME COMMENT '批改时间',
  `graded_by` BIGINT COMMENT '批改人ID',
  UNIQUE KEY `uk_assignment_student` (`assignment_id`, `student_id`),
  INDEX `idx_assignment_id` (`assignment_id`),
  INDEX `idx_student_id` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='作业提交表';

-- 2.8 课程评价表
CREATE TABLE `evaluations` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '评价ID',
  `course_id` BIGINT NOT NULL COMMENT '课程ID',
  `course_name` VARCHAR(200) NOT NULL COMMENT '课程名称',
  `questions` JSON NOT NULL COMMENT '问题列表',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX `idx_course_id` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='课程评价表';

-- 2.9 评价回答表
CREATE TABLE `evaluation_responses` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '回答ID',
  `evaluation_id` BIGINT NOT NULL COMMENT '评价ID',
  `student_id` BIGINT NOT NULL COMMENT '学员ID',
  `answers` JSON NOT NULL COMMENT '答案',
  `submitted_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '提交时间',
  UNIQUE KEY `uk_evaluation_student` (`evaluation_id`, `student_id`),
  INDEX `idx_evaluation_id` (`evaluation_id`),
  INDEX `idx_student_id` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评价回答表';

-- 2.10 班级动态表
CREATE TABLE `class_moments` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '动态ID',
  `class_id` BIGINT NOT NULL COMMENT '班级ID',
  `author_id` BIGINT NOT NULL COMMENT '作者ID',
  `content` TEXT COMMENT '内容',
  `images` JSON COMMENT '图片列表',
  `likes` JSON COMMENT '点赞用户ID列表',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX `idx_class_id` (`class_id`),
  INDEX `idx_author_id` (`author_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='班级动态表';

-- 2.11 动态评论表
CREATE TABLE `moment_comments` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '评论ID',
  `moment_id` BIGINT NOT NULL COMMENT '动态ID',
  `author_id` BIGINT NOT NULL COMMENT '作者ID',
  `content` TEXT NOT NULL COMMENT '评论内容',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX `idx_moment_id` (`moment_id`),
  INDEX `idx_author_id` (`author_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='动态评论表';

-- 2.12 待办事项表
CREATE TABLE `todos` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '待办ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `title` VARCHAR(200) NOT NULL COMMENT '标题',
  `description` TEXT COMMENT '描述',
  `due_date` DATE NOT NULL COMMENT '截止日期',
  `completed` TINYINT DEFAULT 0 COMMENT '是否完成：0未完成 1已完成',
  `type` VARCHAR(20) COMMENT '类型：course/assignment/evaluation/other',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_due_date` (`due_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='待办事项表';

-- 2.13 行程确认表
CREATE TABLE `travel_confirmations` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID',
  `course_id` BIGINT NOT NULL COMMENT '课程ID',
  `course_name` VARCHAR(200) NOT NULL COMMENT '课程名称',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `attending` TINYINT DEFAULT 1 COMMENT '是否参加：1参加 0不参加',
  `room_count` INT COMMENT '房间数量',
  `room_number` VARCHAR(50) COMMENT '房间号',
  `arrival_time` DATETIME COMMENT '到达时间',
  `transport` VARCHAR(20) COMMENT '交通工具：plane/train/car/other',
  `trip_number` VARCHAR(50) COMMENT '车次航班',
  `submitted` TINYINT DEFAULT 0 COMMENT '是否已提交：0未提交 1已提交',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  UNIQUE KEY `uk_course_user` (`course_id`, `user_id`),
  INDEX `idx_course_id` (`course_id`),
  INDEX `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='行程确认表';

-- 2.14 请假记录表
CREATE TABLE `leave_records` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '请假ID',
  `course_id` BIGINT NOT NULL COMMENT '课程ID',
  `course_name` VARCHAR(200) NOT NULL COMMENT '课程名称',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `reason` TEXT NOT NULL COMMENT '请假原因',
  `status` VARCHAR(20) DEFAULT 'pending' COMMENT '状态：pending/approved/rejected',
  `submitted_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '提交时间',
  `reviewed_at` DATETIME COMMENT '审批时间',
  `reviewed_by` BIGINT COMMENT '审批人ID',
  INDEX `idx_course_id` (`course_id`),
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='请假记录表';

-- 2.15 积分商城商品表
CREATE TABLE `shop_items` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '商品ID',
  `name` VARCHAR(200) NOT NULL COMMENT '商品名称',
  `type` VARCHAR(20) NOT NULL COMMENT '类型：course/activity',
  `image` VARCHAR(500) COMMENT '图片URL',
  `badge_cost` INT NOT NULL COMMENT '所需徽章数量',
  `stock` INT NOT NULL COMMENT '库存',
  `available` TINYINT DEFAULT 1 COMMENT '是否可用：1可用 0不可用',
  `description` TEXT COMMENT '描述',
  `course_id` BIGINT COMMENT '关联课程ID',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX `idx_type` (`type`),
  INDEX `idx_available` (`available`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='积分商城商品表';

-- 2.16 兑换记录表
CREATE TABLE `exchange_records` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '兑换ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `item_id` BIGINT NOT NULL COMMENT '商品ID',
  `item_name` VARCHAR(200) NOT NULL COMMENT '商品名称',
  `badge_cost` INT NOT NULL COMMENT '消耗徽章数量',
  `exchanged_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '兑换时间',
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_item_id` (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='兑换记录表';

-- 2.17 弹窗消息表
CREATE TABLE `popup_messages` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '消息ID',
  `title` VARCHAR(200) NOT NULL COMMENT '标题',
  `content` TEXT NOT NULL COMMENT '内容',
  `image` VARCHAR(500) COMMENT '图片URL',
  `published` TINYINT DEFAULT 0 COMMENT '是否已发布：0未发布 1已发布',
  `created_by` BIGINT COMMENT '创建人ID',
  `published_by` BIGINT COMMENT '发布人ID',
  `published_at` DATETIME COMMENT '发布时间',
  `revoked_at` DATETIME COMMENT '撤销时间',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX `idx_published` (`published`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='弹窗消息表';

-- 2.18 活动表
CREATE TABLE `activities` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '活动ID',
  `title` VARCHAR(200) NOT NULL COMMENT '活动标题',
  `content` TEXT COMMENT '活动内容',
  `image` VARCHAR(500) COMMENT '图片URL',
  `on_carousel` TINYINT DEFAULT 0 COMMENT '是否在轮播图：0否 1是',
  `created_by` BIGINT COMMENT '创建人ID',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX `idx_on_carousel` (`on_carousel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='活动表';

-- 2.19 活动报名表
CREATE TABLE `activity_registrations` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '报名ID',
  `activity_id` BIGINT NOT NULL COMMENT '活动ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `registered_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '报名时间',
  UNIQUE KEY `uk_activity_user` (`activity_id`, `user_id`),
  INDEX `idx_activity_id` (`activity_id`),
  INDEX `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='活动报名表';

-- 2.20 打卡任务表
CREATE TABLE `checkins` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '打卡任务ID',
  `class_id` BIGINT NOT NULL COMMENT '班级ID',
  `class_name` VARCHAR(100) NOT NULL COMMENT '班级名称',
  `course_id` BIGINT NOT NULL COMMENT '课程ID',
  `course_name` VARCHAR(200) NOT NULL COMMENT '课程名称',
  `location_name` VARCHAR(200) COMMENT '打卡地点名称',
  `latitude` DOUBLE COMMENT '纬度',
  `longitude` DOUBLE COMMENT '经度',
  `radius` INT DEFAULT 100 COMMENT '打卡半径（米）',
  `qr_code` VARCHAR(500) COMMENT '二维码URL',
  `created_by` BIGINT COMMENT '创建人ID',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `expires_at` DATETIME COMMENT '过期时间',
  INDEX `idx_class_id` (`class_id`),
  INDEX `idx_course_id` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='打卡任务表';

-- 2.21 打卡记录表
CREATE TABLE `checkin_records` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '打卡记录ID',
  `checkin_id` BIGINT NOT NULL COMMENT '打卡任务ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `checkin_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '打卡时间',
  `status` VARCHAR(30) DEFAULT 'success' COMMENT '状态：success/fail_out_of_range',
  `location_lat` DOUBLE COMMENT '打卡纬度',
  `location_lng` DOUBLE COMMENT '打卡经度',
  INDEX `idx_checkin_id` (`checkin_id`),
  INDEX `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='打卡记录表';

-- 2.22 积分日志表
CREATE TABLE `points_logs` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '日志ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `user_name` VARCHAR(100) NOT NULL COMMENT '用户姓名',
  `class_id` BIGINT COMMENT '班级ID',
  `class_name` VARCHAR(100) COMMENT '班级名称',
  `points` INT NOT NULL COMMENT '积分变化（正数增加，负数减少）',
  `reason` VARCHAR(200) NOT NULL COMMENT '原因',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_class_id` (`class_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='积分日志表';

-- 2.23 系统配置表
CREATE TABLE `system_configs` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '配置ID',
  `key` VARCHAR(100) UNIQUE NOT NULL COMMENT '配置键',
  `value` TEXT NOT NULL COMMENT '配置值',
  `description` VARCHAR(200) COMMENT '描述',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统配置表';

-- 2.24 操作日志表
CREATE TABLE `operation_logs` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '日志ID',
  `user_id` BIGINT COMMENT '用户ID',
  `user_name` VARCHAR(100) NOT NULL COMMENT '用户姓名',
  `action` VARCHAR(200) NOT NULL COMMENT '操作动作',
  `target_type` VARCHAR(50) COMMENT '目标类型',
  `target_id` BIGINT COMMENT '目标ID',
  `ip_address` VARCHAR(50) COMMENT 'IP地址',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='操作日志表';

-- 2.25 角色表
CREATE TABLE `roles` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '角色ID',
  `name` VARCHAR(100) UNIQUE NOT NULL COMMENT '角色名称',
  `code` VARCHAR(50) UNIQUE NOT NULL COMMENT '角色编码',
  `description` VARCHAR(200) COMMENT '描述',
  `permissions` JSON COMMENT '权限列表',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色表';

-- 2.26 菜单表
CREATE TABLE `menus` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '菜单ID',
  `parent_id` BIGINT COMMENT '父菜单ID',
  `name` VARCHAR(100) NOT NULL COMMENT '菜单名称',
  `path` VARCHAR(200) COMMENT '路径',
  `icon` VARCHAR(50) COMMENT '图标',
  `sort_order` INT DEFAULT 0 COMMENT '排序',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='菜单表';

-- ============================================
-- 3. 插入初始数据
-- ============================================

-- 3.1 插入默认管理员账号 (密码: admin123, BCrypt加密)
INSERT INTO `users` (`student_id`, `name`, `password`, `role`, `status`, `enabled`) 
VALUES ('ADMIN001', '系统管理员', '$2a$10$/baxOle6ngEapYSNSF/eSOokhgLccac.YHziiy04k/5MRZskf9ave', 'admin', 'active', 1);

-- 3.2 插入默认角色
INSERT INTO `roles` (`name`, `code`, `description`, `permissions`) VALUES
('系统管理员', 'admin', '系统管理员，拥有所有权限', '["*"]'),
('运营人员', 'operator', '运营人员，负责日常运营', '["user:manage", "class:manage", "course:manage", "assignment:manage", "attendance:manage", "activity:manage", "shop:manage", "message:manage"]'),
('学术主任', 'academic_director', '学术主任，负责教学管理', '["class:view", "course:view", "assignment:grade", "attendance:view"]'),
('学员', 'student', '学员，查看和学习', '["course:view", "assignment:submit", "attendance:checkin", "shop:exchange"]');

-- 3.3 插入系统配置
INSERT INTO `system_configs` (`key`, `value`, `description`) VALUES
('system.name', '课程管理系统', '系统名称'),
('system.version', '1.0.0', '系统版本'),
('checkin.default_radius', '100', '默认打卡半径（米）'),
('jwt.access_token_expiration', '7200000', 'Access Token有效期（毫秒）'),
('jwt.refresh_token_expiration', '604800000', 'Refresh Token有效期（毫秒）');

-- 3.4 插入示例班级
INSERT INTO `classes` (`name`, `director`, `director_id`, `status`, `period`) VALUES
('2024年春季一班', '张教授', NULL, 'ongoing', 1),
('2024年春季二班', '李教授', NULL, 'ongoing', 1);

-- 3.5 插入示例课程
INSERT INTO `courses` (`name`, `period`, `start_date`, `end_date`, `location`, `instructor`, `instructor_id`, `credits`, `status`, `description`, `class_id`) VALUES
('Java高级编程', 1, '2024-03-01', '2024-06-30', '教学楼A101', '张教授', NULL, 4, 'ongoing', '学习Java高级特性', 1),
('数据库原理', 1, '2024-03-01', '2024-06-30', '教学楼A102', '李教授', NULL, 3, 'ongoing', '学习数据库基础知识', 2);

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- 初始化完成
-- ============================================
