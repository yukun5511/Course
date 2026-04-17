# 班级管理 API 修复总结

## 📋 问题描述

**现象**: GET /api/classes 返回 500 Internal Server Error

**影响**: 班级管理页面无法正常显示数据

---

## 🔍 根本原因分析

通过对比数据库表结构和 Java 实体类，发现以下不匹配问题：

### 数据库表结构 (classes)
```sql
CREATE TABLE `classes` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `director` VARCHAR(100),           -- 学术主任姓名
  `director_id` BIGINT,              -- 学术主任ID
  `monitor` VARCHAR(100),            -- 班长姓名
  `monitor_id` BIGINT,               -- 班长ID
  `committee` JSON,                  -- 班委信息
  `status` VARCHAR(20),
  `period` INT NOT NULL,             -- 期数
  `created_at` DATETIME,
  `updated_at` DATETIME
);
```

### 原实体类 (Class.java)
```java
@Data
@TableName("classes")
public class Class {
    private Long id;
    private String name;
    private String description;          // ❌ 数据库中不存在
    private String teacherId;            // ❌ 应该是 director_id
    private String teacherName;          // ❌ 应该是 director
    private String academicDirectorId;   // ❌ 应该是 monitor_id
    private String academicDirectorName; // ❌ 应该是 monitor
    private String coverImage;           // ❌ 数据库中不存在
    private Integer studentCount;        // ❌ 数据库中不存在
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    @TableLogic
    private Integer deleted;             // ❌ 数据库中不存在
}
```

---

## ✅ 修复方案

### 1. 更新 Class.java 实体类

**修改内容**:
- ✅ 移除不存在的字段：`description`, `teacherId`, `teacherName`, `academicDirectorId`, `academicDirectorName`, `coverImage`, `studentCount`, `deleted`
- ✅ 添加缺失字段：`director`, `directorId`, `monitor`, `monitorId`, `committee`, `period`
- ✅ 移除 `@TableLogic` 注解（数据库无 deleted 字段）
- ✅ 添加 `@TableName(value = "classes", autoResultMap = true)` 支持 JSON 类型处理
- ✅ 添加 `JacksonTypeHandler` 处理 `committee` JSON 字段

**修改后**:
```java
@Data
@TableName(value = "classes", autoResultMap = true)
public class Class {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String name;
    private String director;              // ✅ 学术主任姓名
    private Long directorId;              // ✅ 学术主任ID
    private String monitor;               // ✅ 班长姓名
    private Long monitorId;               // ✅ 班长ID
    
    @TableField(typeHandler = JacksonTypeHandler.class)
    private Map<String, Object> committee; // ✅ 班委信息（JSON）
    
    private String status;
    private Integer period;               // ✅ 期数
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
```

### 2. 更新 ClassServiceImpl.java

**修改内容**:
- ✅ `createClass()`: 映射字段到新的实体类结构
- ✅ `updateClass()`: 更新字段映射逻辑
- ✅ `getAllClasses()`: 修改状态过滤条件从 "active" 改为 "ongoing"
- ✅ `convertToResponse()`: 更新字段转换逻辑

**关键代码变更**:
```java
// 创建班级
Class clazz = new Class();
clazz.setName(request.getName());
clazz.setDirector(request.getTeacherName());  // director = teacherName
clazz.setDirectorId(request.getTeacherId() != null ? Long.valueOf(request.getTeacherId()) : null);
clazz.setMonitor(request.getAcademicDirectorName());  // monitor = academicDirectorName
clazz.setMonitorId(request.getAcademicDirectorId() != null ? Long.valueOf(request.getAcademicDirectorId()) : null);
clazz.setPeriod(1);  // 默认期数
clazz.setStatus(request.getStatus());

// 状态过滤
queryWrapper.eq(Class::getStatus, "ongoing");  // 改为 ongoing
```

### 3. 更新 ClassResponse.java

**修改内容**:
- ✅ 更新字段以匹配新实体类
- ✅ 添加兼容方法，保持向后兼容

**兼容方法**:
```java
// 兼容旧代码
public String getTeacherName() {
    return director;
}

public void setTeacherName(String name) {
    this.director = name;
}

// 其他兼容方法类似...
```

---

## 🧪 测试验证

### 测试命令
```powershell
$loginBody = @{studentId='ADMIN001';password='admin123'} | ConvertTo-Json
$login = Invoke-RestMethod -Uri 'http://localhost:8081/api/auth/admin-login' `
  -Method POST -Body $loginBody -ContentType 'application/json'
$token = $login.data.accessToken
$classes = Invoke-RestMethod -Uri 'http://localhost:8081/api/classes' `
  -Method GET -Headers @{Authorization="Bearer $token"}
```

### 测试结果
```
状态码: 200
班级数: 2

班级列表:
  - ID: 1, 名称: 2024年秋季一班, 状态: ongoing
  - ID: 2, 名称: 2024年秋季二班, 状态: ongoing
```

✅ **测试通过** - 班级 API 正常工作！

---

## 📝 经验总结

### 关键教训
1. **数据库表结构必须与实体类严格对应**
   - 字段名称要一致（或使用 `@TableField` 映射）
   - 字段类型要匹配
   - 不存在的字段不要在实体类中定义

2. **逻辑删除需要数据库支持**
   - 使用 `@TableLogic` 前，确保数据库表有 `deleted` 字段
   - 如果数据库没有，不能使用逻辑删除

3. **JSON 字段需要特殊处理**
   - 使用 `@TableField(typeHandler = JacksonTypeHandler.class)`
   - 实体类需要添加 `autoResultMap = true`

4. **字段命名规范**
   - 数据库：下划线命名（director_id）
   - Java：驼峰命名（directorId）
   - MyBatis-Plus 会自动转换，但字段名要对应

### 修复流程
1. 查看数据库表结构（`DESCRIBE table_name`）
2. 对比实体类字段
3. 识别不匹配的字段
4. 更新实体类
5. 更新 Service 层的字段映射
6. 更新 DTO 的字段映射
7. 重新编译并测试

---

## 🔗 相关文件

- `backend/src/main/java/com/course/entity/Class.java`
- `backend/src/main/java/com/course/service/impl/ClassServiceImpl.java`
- `backend/src/main/java/com/course/dto/response/ClassResponse.java`
- `backend/src/main/resources/db/init.sql`

---

**修复日期**: 2026-04-14  
**修复人员**: AI Assistant  
**测试状态**: ✅ 通过
