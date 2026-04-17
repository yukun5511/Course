# 美化的确认对话框使用指南

## 📦 组件位置

`frontend/src/components/ui/ConfirmDialog.tsx`

---

## ✨ 功能特性

- ✅ 三种类型：信息、警告、危险
- ✅ 美观的图标和配色
- ✅ 圆角卡片设计
- ✅ 平滑动画效果
- ✅ 自定义按钮文字
- ✅ 点击遮罩关闭
- ✅ Promise 风格的 API

---

## 🎨 类型说明

| 类型 | 图标 | 颜色 | 使用场景 |
|------|------|------|----------|
| info | ℹ️ 蓝色 | 一般确认 | 普通操作确认 |
| warning | ⚠️ 黄色 | 警告提示 | 需要注意的操作 |
| danger | ❌ 红色 | 危险操作 | 删除、重置等 |

---

## 📖 使用方法

### 1. 导入 confirm 函数

```typescript
import { confirm } from '@/components/ui/ConfirmDialog'
```

### 2. 基本用法

```typescript
// ❌ 旧代码（原生 confirm）
if (!confirm('确定要删除吗？')) {
  return
}

// ✅ 新代码（美化 confirm）
const confirmed = await confirm('确定要删除吗？', {
  title: '删除确认',
  type: 'danger',
  confirmText: '删除',
})

if (!confirmed) return
```

### 3. 完整示例

```typescript
import { confirm } from '@/components/ui/ConfirmDialog'
import { success, error } from '@/components/ui/Toast'

const handleDelete = async (id: number, name: string) => {
  // 显示确认对话框
  const confirmed = await confirm(`确定要删除 "${name}" 吗？`, {
    title: '删除确认',
    type: 'danger',
    confirmText: '删除',
    cancelText: '取消',
  })
  
  // 用户点击取消
  if (!confirmed) return
  
  // 用户确认，执行删除
  try {
    await deleteItem(id)
    success('删除成功！')
  } catch (err) {
    error('删除失败')
  }
}
```

---

## 🎯 配置选项

```typescript
confirm(message: string, options?: {
  title?: string        // 对话框标题，默认 '确认操作'
  type?: 'info' | 'warning' | 'danger'  // 类型，默认 'info'
  confirmText?: string  // 确认按钮文字，默认 '确定'
  cancelText?: string   // 取消按钮文字，默认 '取消'
}): Promise<boolean>
```

---

## 💡 实际应用场景

### 删除操作（danger 类型）

```typescript
// 删除用户
const confirmed = await confirm(`确定要删除用户 "${userName}" 吗？`, {
  title: '删除用户',
  type: 'danger',
  confirmText: '删除',
})

// 删除班级
const confirmed = await confirm(`确定要删除班级 "${className}" 吗？`, {
  title: '删除班级',
  type: 'danger',
  confirmText: '删除',
})

// 删除课程
const confirmed = await confirm(`确定要删除课程 "${courseName}" 吗？`, {
  title: '删除课程',
  type: 'danger',
  confirmText: '删除',
})
```

### 重置密码（warning 类型）

```typescript
const confirmed = await confirm(`确定要重置用户 "${userName}" 的密码吗？`, {
  title: '重置密码',
  type: 'warning',
  confirmText: '重置',
})
```

### 普通确认（info 类型）

```typescript
const confirmed = await confirm('确定要执行此操作吗？', {
  title: '操作确认',
  type: 'info',
})
```

---

## 📋 替换对照表

| 旧代码 | 新代码 |
|--------|--------|
| `confirm('确定删除？')` | `await confirm('确定删除？', { type: 'danger', confirmText: '删除' })` |
| `confirm('确定重置？')` | `await confirm('确定重置？', { type: 'warning', confirmText: '重置' })` |
| `if (!confirm(...)) return` | `const confirmed = await confirm(...); if (!confirmed) return` |

---

## 🎨 样式预览

### 危险操作（删除）

```
┌─────────────────────────────┐
│                        ×    │
│                             │
│    [❌]                     │
│                             │
│    删除用户                  │
│    确定要删除用户 "张三" 吗？ │
│                             │
│              [取消] [删除]   │
└─────────────────────────────┘
```
- 红色图标和按钮
- 清晰的标题和消息
- 醒目的确认按钮

### 警告操作（重置密码）

```
┌─────────────────────────────┐
│                        ×    │
│                             │
│    [⚠️]                     │
│                             │
│    重置密码                  │
│    确定要重置密码吗？         │
│                             │
│              [取消] [重置]   │
└─────────────────────────────┘
```
- 黄色图标和按钮
- 警告提示
- 自定义按钮文字

### 信息提示

```
┌─────────────────────────────┐
│                        ×    │
│                             │
│    [ℹ️]                     │
│                             │
│    操作确认                  │
│    确定要执行此操作吗？       │
│                             │
│              [取消] [确定]   │
└─────────────────────────────┘
```
- 蓝色图标和按钮
- 一般信息提示
- 标准确认按钮

---

## 🔄 已替换的页面

### ✅ 已完成

1. **用户管理** (AdminUsers)
   - 删除用户
   - 重置密码

2. **班级管理** (AdminClasses)
   - 删除班级

3. **课程管理** (AdminSchedule)
   - 删除课程

4. **教学管理** (AdminTeaching)
   - 删除作业

5. **活动管理** (AdminActivity)
   - 删除活动

---

## 💡 最佳实践

### 1. 选择合适的类型

```typescript
// ✅ 好 - 使用 danger 类型
confirm('确定删除？', { type: 'danger' })

// ❌ 不好 - 删除用 info 类型
confirm('确定删除？', { type: 'info' })
```

### 2. 提供清晰的标题

```typescript
// ✅ 好 - 明确的标题
confirm('确定删除？', { title: '删除用户' })

// ❌ 不好 - 默认标题
confirm('确定删除？')
```

### 3. 自定义按钮文字

```typescript
// ✅ 好 - 明确的按钮
confirm('确定删除？', { confirmText: '删除' })

// ❌ 不好 - 通用按钮
confirm('确定删除？') // 显示"确定"
```

### 4. 异步处理

```typescript
// ✅ 好 - 使用 async/await
const confirmed = await confirm('确定删除？')
if (confirmed) {
  // 执行删除
}

// ❌ 不好 - 使用 .then()
confirm('确定删除？').then(confirmed => {
  if (confirmed) {
    // 执行删除
  }
})
```

---

## 📝 注意事项

1. **使用 async/await** - 代码更清晰
2. **选择合适的类型** - danger/warning/info
3. **提供清晰的标题** - 让用户知道是什么操作
4. **自定义按钮文字** - 明确操作意图
5. **处理取消情况** - 用户可能点击取消

---

**最后更新**: 2026-04-15
