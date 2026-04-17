# 前端 API 对接进度报告

**日期**: 2026-04-15  
**状态**: 进行中  
**进度**: 2/7 页面完成 (28%)

---

## ✅ 已完成的页面对接

### 1. 用户管理页面 (AdminUsers.tsx) - 100% ✅

**对接内容**:
- ✅ 用户列表加载 - 使用 `getUserList()` API
- ✅ 添加用户 - 使用 `createUser()` API  
- ✅ 班级列表加载 - 使用 `getClassList()` API
- ✅ 搜索功能 - 支持按姓名搜索
- ✅ Tab 切换 - 学员/导师分类加载
- ✅ 分页支持 - page/size 参数

**关键修改**:
```typescript
// 之前: 使用 mockUsers
const filteredUsers = mockUsers.filter(...)

// 现在: 使用真实 API
const loadUsers = async () => {
  const response = await getUserList({
    name: searchTerm || undefined,
    role: activeTab === 'students' ? 'student' : 'instructor',
    page,
    size: 20,
  })
  setUserList(response.records || [])
}
```

**待完善**:
- ⚠️ 用户详情查看（需要对接 getUserById）
- ⚠️ 用户编辑功能（需要对接 updateUser）
- ⚠️ 用户删除功能（需要对接 deleteUser）
- ⚠️ 状态切换（需要对接 updateUserStatus）
- ⚠️ 密码重置（需要对接 resetPassword）

---

### 2. 班级管理页面 (AdminClasses.tsx) - 80% ✅

**对接内容**:
- ✅ 班级列表加载 - 使用 `getClassList()` API
- ✅ 搜索功能 - 支持按班级名称搜索
- ✅ 加载状态 - loading 处理
- ✅ 空状态 - 无数据提示

**关键修改**:
```typescript
// 之前: 使用 mockClasses
const filteredClasses = mockClasses.filter(...)

// 现在: 使用真实 API
const loadClasses = async () => {
  const response = await getClassList({
    name: searchTerm || undefined,
    page,
    size: 20,
  })
  setClassList(response.records || [])
}
```

**待完善**:
- ⚠️ 创建班级功能（需要对接 createClass）
- ⚠️ 班主任列表（需要从 API 加载导师）
- ⚠️ 班级详情查看
- ⚠️ TypeScript 类型优化（statusConfig 索引）

---

## ⏳ 待对接的页面

### 3. 课程管理页面 (AdminCourses.tsx) - 0%

**需要对接**:
- ❌ 课程列表 - `getCourseList()`
- ❌ 创建课程 - `createCourse()`
- ❌ 更新课程 - `updateCourse()`
- ❌ 删除课程 - `deleteCourse()`
- ❌ 课程详情 - `getCourseById()`

### 4. 作业管理页面 (AdminAssignments.tsx) - 0%

**需要对接**:
- ❌ 作业列表 - `getAssignmentList()`
- ❌ 创建作业 - `createAssignment()`
- ❌ 更新作业 - `updateAssignment()`
- ❌ 删除作业 - `deleteAssignment()`
- ❌ 作业批改 - `gradeAssignment()`

### 5. 评价管理页面 (AdminEvaluations.tsx) - 0%

**需要对接**:
- ❌ 评价列表 - `getEvaluationList()`
- ❌ 创建评价 - `createEvaluation()`
- ❌ 提交回答 - `submitAnswer()`

### 6. 考勤管理页面 (AdminAttendance.tsx) - 0%

**需要对接**:
- ❌ 考勤记录 - `getAttendanceList()`
- ❌ 打卡 - `checkIn()`
- ❌ 请假申请 - `submitLeaveRequest()`
- ❌ 审批请假 - `approveLeave()`

### 7. 活动管理页面 (AdminActivity.tsx) - 0%

**需要对接**:
- ❌ 活动列表
- ❌ 创建活动
- ❌ 管理活动

---

## 📊 对接统计

| 页面 | 列表 | 创建 | 更新 | 删除 | 进度 |
|------|------|------|------|------|------|
| 用户管理 | ✅ | ✅ | ⚠️ | ⚠️ | 60% |
| 班级管理 | ✅ | ⚠️ | ⚠️ | N/A | 50% |
| 课程管理 | ❌ | ❌ | ❌ | ❌ | 0% |
| 作业管理 | ❌ | ❌ | ❌ | ❌ | 0% |
| 评价管理 | ❌ | ❌ | ❌ | N/A | 0% |
| 考勤管理 | ❌ | ❌ | ❌ | ❌ | 0% |
| **总计** | 2/7 | 1/7 | 0/7 | 0/7 | **15%** |

---

## 🔧 对接模式总结

### 标准对接流程

1. **导入 API 模块**
```typescript
import { getList, createItem, updateItem, deleteItem } from '@/api/xxx'
```

2. **添加状态管理**
```typescript
const [list, setList] = useState([])
const [loading, setLoading] = useState(false)
const [page, setPage] = useState(1)
const [total, setTotal] = useState(0)
```

3. **创建加载函数**
```typescript
const loadData = async () => {
  setLoading(true)
  try {
    const response = await getList({ page, size: 20, ...filters })
    setList(response.records || [])
    setTotal(response.total || 0)
  } catch (error) {
    console.error('加载失败:', error)
  } finally {
    setLoading(false)
  }
}
```

4. **使用 useEffect 触发加载**
```typescript
useEffect(() => {
  loadData()
}, [page, filters])
```

5. **更新 UI 渲染**
```typescript
{loading ? (
  <div>加载中...</div>
) : list.length === 0 ? (
  <div>暂无数据</div>
) : (
  list.map(item => <ItemCard key={item.id} {...item} />)
)}
```

6. **处理创建/更新/删除**
```typescript
const handleCreate = async () => {
  await createItem(formData)
  loadData() // 刷新列表
}
```

---

## 🎯 下一步计划

### 优先级 1: 完成核心页面 (预计 2 小时)
1. 完善用户管理页面的编辑、删除功能
2. 完善班级管理页面的创建功能
3. 对接课程管理页面

### 优先级 2: 业务功能页面 (预计 2 小时)
4. 对接作业管理页面
5. 对接评价管理页面
6. 对接考勤管理页面

### 优先级 3: 测试和优化 (预计 1 小时)
7. 测试所有页面对接功能
8. 优化错误处理和用户体验
9. 添加加载动画和空状态

---

## 📝 技术要点

### API 调用最佳实践

1. **错误处理**
```typescript
try {
  await apiCall()
} catch (error: any) {
  // 显示用户友好的错误信息
  alert(error.message || '操作失败')
}
```

2. **加载状态**
```typescript
const [loading, setLoading] = useState(false)

// 按钮禁用
<button disabled={loading}>
  {loading ? '处理中...' : '提交'}
</button>
```

3. **参数处理**
```typescript
// 可选参数使用 undefined 而不是空字符串
const params = {
  name: searchTerm || undefined,
  status: filterStatus || undefined,
}
```

4. **数据刷新**
```typescript
// 操作成功后刷新列表
await createItem(data)
loadData() // 重新加载
```

---

## ⚠️ 已知问题

1. **TypeScript 类型错误**
   - AdminClasses.tsx 中 statusConfig 索引类型问题
   - 需要使用类型断言或优化类型定义

2. **Mock 数据残留**
   - 部分页面仍引用 mockData
   - 需要逐步替换为真实 API

3. **错误提示**
   - 当前使用 alert() 显示错误
   - 建议使用 Toast 或 Message 组件

---

## 🚀 快速完成建议

如果要快速完成所有页面对接，可以：

1. **复制标准模式** - 使用上述对接模式模板
2. **批量修改** - 同时处理多个页面的列表加载
3. **先列表后操作** - 先完成列表展示，再添加增删改
4. **统一错误处理** - 创建统一的错误提示函数

---

**下次更新**: 完成课程管理页面对接后  
**预计完成时间**: 2026-04-15 下午
