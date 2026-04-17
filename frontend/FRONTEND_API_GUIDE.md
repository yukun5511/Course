# 前端 API 模块使用指南

## 📚 API 模块清单

### 已完成的 API 模块

| 模块 | 文件 | 说明 |
|------|------|------|
| 认证模块 | `auth.ts` | 登录、Token 管理 |
| 用户管理 | `user.ts` | 用户 CRUD |
| **班级管理** | `class.ts` | 班级 CRUD |
| **课程管理** | `course.ts` | 课程 CRUD |
| **作业管理** | `assignment.ts` | 作业 CRUD |
| **评价管理** | `evaluation.ts` | 评价模板、提交回答 |
| **考勤管理** | `attendance.ts` | 打卡、请假 |

---

## 🚀 快速开始

### 1. 导入 API

```typescript
// 方式一：从 index 统一导入（推荐）
import { 
  getClassList, 
  createClass, 
  getCourseList,
  getAssignmentList 
} from '@/api';

// 方式二：从具体模块导入
import { getClassList } from '@/api/class';
import { getCourseList } from '@/api/course';
```

### 2. 在组件中使用

```typescript
import { useState, useEffect } from 'react';
import { getClassList } from '@/api';
import { ClassInfo } from '@/api/class';

function ClassPage() {
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    setLoading(true);
    try {
      const response = await getClassList({
        page: 1,
        size: 10,
        status: 'active'
      });
      setClasses(response.data.data || []);
    } catch (error) {
      console.error('加载班级列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? <p>加载中...</p> : <ClassList data={classes} />}
    </div>
  );
}
```

---

## 📖 各模块 API 使用示例

### 1. 班级管理 API

```typescript
import { 
  getClassList, 
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass 
} from '@/api/class';

// 获取班级列表（分页）
const classes = await getClassList({
  page: 1,
  size: 10,
  keyword: '2024',
  status: 'active'
});

// 获取所有班级（下拉选择）
const allClasses = await getAllClasses();

// 获取班级详情
const classDetail = await getClassById(1);

// 创建班级
const newClass = await createClass({
  name: '2024春季班',
  description: '春季学期班级',
  status: 'active'
});

// 更新班级
await updateClass(1, {
  name: '2024春季班（修改）',
  status: 'inactive'
});

// 删除班级
await deleteClass(1);
```

---

### 2. 课程管理 API

```typescript
import { 
  getCourseList,
  getCoursesByClassId,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse 
} from '@/api/course';

// 获取课程列表
const courses = await getCourseList({
  page: 1,
  size: 10,
  classId: 1,
  status: 'active'
});

// 获取班级下的所有课程
const classCourses = await getCoursesByClassId(1);

// 创建课程
const newCourse = await createCourse({
  classId: 1,
  className: '2024春季班',
  name: 'Java编程基础',
  teacherName: '张老师',
  location: '教学楼A101',
  totalHours: 40,
  status: 'active'
});

// 更新课程
await updateCourse(1, {
  name: 'Java编程基础（进阶）',
  totalHours: 60
});

// 删除课程
await deleteCourse(1);
```

---

### 3. 作业管理 API

```typescript
import { 
  getAssignmentList,
  getAssignmentsByCourseId,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment 
} from '@/api/assignment';

// 获取作业列表
const assignments = await getAssignmentList({
  page: 1,
  size: 10,
  courseId: 1,
  status: 'published'
});

// 获取课程下的所有作业
const courseAssignments = await getAssignmentsByCourseId(1);

// 创建作业
const newAssignment = await createAssignment({
  courseId: 1,
  courseName: 'Java编程基础',
  title: '第一次作业',
  description: '完成第一章练习题',
  deadline: '2024-12-31T23:59:59',
  totalScore: 100,
  status: 'published'
});

// 更新作业
await updateAssignment(1, {
  title: '第一次作业（修改）',
  deadline: '2025-01-15T23:59:59'
});

// 删除作业
await deleteAssignment(1);
```

---

### 4. 评价管理 API

```typescript
import { 
  getEvaluationList,
  getEvaluationsByCourseId,
  getEvaluationById,
  createEvaluation,
  updateEvaluation,
  deleteEvaluation,
  submitEvaluation 
} from '@/api/evaluation';

// 获取评价列表
const evaluations = await getEvaluationList({
  page: 1,
  size: 10,
  courseId: 1,
  status: 'active'
});

// 创建评价
const newEvaluation = await createEvaluation({
  courseId: 1,
  title: '课程满意度调查',
  questions: JSON.stringify([
    { type: 'rating', question: '课程质量', max: 5 },
    { type: 'text', question: '改进建议' }
  ]),
  startTime: '2024-01-01T00:00:00',
  endTime: '2024-12-31T23:59:59',
  status: 'active'
});

// 提交评价回答
await submitEvaluation(1, {
  answers: JSON.stringify([
    { question: '课程质量', answer: 5 },
    { question: '改进建议', answer: '非常好，内容丰富' }
  ])
});

// 更新评价
await updateEvaluation(1, {
  title: '课程满意度调查（修改）',
  status: 'closed'
});

// 删除评价
await deleteEvaluation(1);
```

---

### 5. 考勤管理 API

```typescript
import { 
  getCheckinList,
  getCheckinById,
  createCheckin,
  updateCheckin,
  deleteCheckin,
  doCheckin,
  getLeaveRecords,
  applyLeave,
  approveLeave 
} from '@/api/attendance';

// 获取打卡任务列表
const checkins = await getCheckinList({
  page: 1,
  size: 10,
  courseId: 1,
  status: 'active'
});

// 创建打卡任务
const newCheckin = await createCheckin({
  courseId: 1,
  title: '早课打卡',
  location: '教学楼A101',
  startTime: '2024-01-15T08:00:00',
  endTime: '2024-01-15T08:30:00',
  status: 'active'
});

// 执行打卡
await doCheckin(1, {
  location: '教学楼A101',
  imageUrl: 'https://example.com/photo.jpg',
  remark: '准时到课'
});

// 获取请假记录
const leaves = await getLeaveRecords({
  page: 1,
  size: 10,
  status: 'pending'
});

// 提交请假申请
const leave = await applyLeave({
  reason: '身体不适',
  startTime: '2024-01-16T08:00:00',
  endTime: '2024-01-16T17:00:00',
  attachmentUrl: 'https://example.com/medical.pdf'
});

// 审批请假（管理员）
await approveLeave(1, {
  status: 'approved'
});

// 拒绝请假
await approveLeave(2, {
  status: 'rejected',
  rejectReason: '请假理由不充分'
});
```

---

## 💡 完整页面示例

### 班级管理页面

```typescript
import { useState, useEffect } from 'react';
import { getClassList, createClass, deleteClass } from '@/api/class';
import { ClassInfo, CreateClassRequest } from '@/api/class';

function ClassManagement() {
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadClasses();
  }, [page]);

  const loadClasses = async () => {
    setLoading(true);
    try {
      const response = await getClassList({
        page,
        size: 10
      });
      setClasses(response.data.data || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      alert('加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: CreateClassRequest) => {
    try {
      await createClass(data);
      alert('创建成功');
      loadClasses();
    } catch (error) {
      alert('创建失败');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除吗？')) return;
    try {
      await deleteClass(id);
      alert('删除成功');
      loadClasses();
    } catch (error) {
      alert('删除失败');
    }
  };

  return (
    <div>
      <h1>班级管理</h1>
      
      {/* 创建按钮 */}
      <button onClick={() => handleCreate({
        name: '新班级',
        status: 'active'
      })}>
        创建班级
      </button>

      {/* 列表 */}
      {loading ? (
        <p>加载中...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>名称</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {classes.map(c => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.status}</td>
                <td>
                  <button onClick={() => handleDelete(c.id)}>删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 分页 */}
      <div>
        <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>
          上一页
        </button>
        <span>{page} / {Math.ceil(total / 10)}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={page * 10 >= total}>
          下一页
        </button>
      </div>
    </div>
  );
}

export default ClassManagement;
```

---

## ⚠️ 注意事项

### 1. 错误处理

所有 API 调用都应该使用 try-catch 包裹：

```typescript
try {
  const response = await getClassList({ page: 1, size: 10 });
  // 处理成功响应
} catch (error: any) {
  // 处理错误
  console.error('请求失败:', error.message);
  alert(error.message || '请求失败');
}
```

### 2. 响应数据结构

API 返回的数据结构：

```typescript
{
  code: 200,
  message: '成功',
  data: {
    // 具体数据
    // 如果是分页，包含：
    records: [],    // 数据列表
    total: 100,     // 总数
    page: 1,        // 当前页
    size: 10        // 每页大小
  }
}
```

### 3. Token 自动管理

- Access Token 自动携带（请求拦截器处理）
- Token 过期自动刷新（响应拦截器处理）
- 无需手动管理 Token

### 4. 类型安全

所有 API 都有完整的 TypeScript 类型定义：

```typescript
import { ClassInfo } from '@/api/class';

const classInfo: ClassInfo = {
  id: 1,
  name: '班级名称',
  status: 'active',
  // ... 其他字段
};
```

---

## 🎯 下一步

### 前端页面对接

1. **管理后台页面**
   - 班级管理页面 → 使用 `class.ts` API
   - 课程管理页面 → 使用 `course.ts` API
   - 作业管理页面 → 使用 `assignment.ts` API
   - 评价管理页面 → 使用 `evaluation.ts` API
   - 考勤管理页面 → 使用 `attendance.ts` API

2. **小程序端页面**
   - 课表查询 → 使用 `course.ts` API
   - 作业提交 → 使用 `assignment.ts` API
   - 课程评价 → 使用 `evaluation.ts` API
   - 现场签到 → 使用 `attendance.ts` API
   - 请假申请 → 使用 `attendance.ts` API

---

## 📚 相关文档

- **API 配置说明:** [FRONTEND_API_SETUP.md](./FRONTEND_API_SETUP.md)
- **后端文档:** [backend/README.md](../backend/README.md)
- **项目总文档:** [README.md](../README.md)

---

**最后更新:** 2026-04-14  
**状态:** 已完成 ✅
