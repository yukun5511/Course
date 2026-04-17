# Toast 通知组件使用指南

## 📦 组件位置

`frontend/src/components/ui/Toast.tsx`

---

## ✨ 功能特性

- ✅ 4 种类型：成功、错误、警告、信息
- ✅ 自动消失（3秒）
- ✅ 优雅的动画效果
- ✅ 可手动关闭
- ✅ 支持多个通知堆叠
- ✅ 美观的配色方案

---

## 🎨 类型说明

| 类型 | 颜色 | 图标 | 使用场景 |
|------|------|------|----------|
| success | 绿色 | ✓ | 操作成功 |
| error | 红色 | ✕ | 操作失败 |
| warning | 黄色 | ⚠ | 警告提示 |
| info | 蓝色 | ℹ | 一般信息 |

---

## 📖 使用方法

### 1. 导入 Toast 函数

```typescript
import { success, error, warning, info } from '@/components/ui/Toast'
```

### 2. 替换 alert

```typescript
// ❌ 旧代码
alert('添加成功！')
alert('操作失败！')

// ✅ 新代码
success('添加成功！')
error('操作失败！')
```

### 3. 完整示例

```typescript
import { success, error } from '@/components/ui/Toast'

const handleSave = async () => {
  try {
    await saveData()
    success('保存成功！')
  } catch (err: any) {
    error(err.message || '保存失败')
  }
}
```

---

## 🎯 实际应用场景

### 用户管理页面

```typescript
// 添加用户
success('添加成功！')

// 删除用户
success('删除成功！')

// 更新用户
success('更新成功！')

// 状态切换
success('状态更新成功！')

// 密码重置
success('密码重置成功！新密码：123456')

// 错误提示
error('请填写学号和姓名')
error(error.message || '操作失败')
```

---

## 🎨 样式定制

在 `Toast.tsx` 的 `colorMap` 中修改颜色：

```typescript
const colorMap = {
  success: {
    bg: 'bg-green-50',        // 背景色
    border: 'border-green-200', // 边框色
    icon: 'text-green-500',    // 图标颜色
    text: 'text-green-800',    // 文字颜色
  },
  // ... 其他类型
}
```

---

## ⏱️ 时间配置

修改自动消失时间（默认 3 秒）：

```typescript
// Toast.tsx 第 64 行
const timer = setTimeout(() => {
  onRemove(toast.id)
}, 3000) // 修改这里，单位：毫秒
```

---

## 📍 位置配置

修改显示位置（默认右上角）：

```typescript
// Toast.tsx 第 54 行
<div className="fixed top-4 right-4 z-50 space-y-2">
  {/* top-4 right-4 = 右上角 */}
  {/* top-4 left-4 = 左上角 */}
  {/* bottom-4 right-4 = 右下角 */}
  {/* bottom-4 left-4 = 左下角 */}
</div>
```

---

## 🔄 迁移指南

### 批量替换 alert

1. **搜索所有 alert 调用**
```bash
grep -r "alert(" src/pages/
```

2. **替换模式**
```typescript
// 成功提示
alert('xxx成功！') → success('xxx成功！')

// 失败提示
alert(error.message || 'xxx失败') → error(error.message || 'xxx失败')

// 警告提示
alert('xxx') → warning('xxx')

// 信息提示
alert('xxx') → info('xxx')
```

3. **保留 confirm**
```typescript
// confirm 对话框保持不变
if (!confirm('确定删除？')) {
  return
}
```

---

## 💡 最佳实践

### 1. 选择合适的类型

```typescript
// 成功操作
success('保存成功')
success('删除成功')

// 失败操作
error('保存失败')
error('网络错误')

// 警告
warning('该操作不可撤销')
warning('数据即将过期')

// 信息
info('系统维护中')
info('新功能上线')
```

### 2. 简洁明了

```typescript
// ✅ 好
success('保存成功')

// ❌ 不好
success('您的数据已经成功保存到服务器，您可以继续其他操作')
```

### 3. 提供有用信息

```typescript
// ✅ 好
success('密码重置成功！新密码：123456')

// ❌ 不好
success('密码重置成功')
```

---

## 🎉 效果预览

**成功提示**:
```
┌─────────────────────────┐
│ ✓  添加成功！          │ × │
└─────────────────────────┘
```
- 绿色背景
- 对勾图标
- 3秒自动消失

**错误提示**:
```
┌─────────────────────────┐
│   操作失败！          │ × │
└─────────────────────────┘
```
- 红色背景
- 叉号图标
- 3秒自动消失

**警告提示**:
```
┌─────────────────────────┐
│ ⚠  请注意！            │ × │
└─────────────────────────┘
```
- 黄色背景
- 警告图标
- 3秒自动消失

**信息提示**:
```
┌─────────────────────────┐
│ ℹ  系统提示            │ × │
└─────────────────────────┘
```
- 蓝色背景
- 信息图标
- 3秒自动消失

---

## 📝 注意事项

1. **不要过度使用** - 只在重要操作时使用
2. **保持一致** - 同类操作使用相同类型
3. **提供反馈** - 每个用户操作都应有反馈
4. **简洁文字** - 提示信息要简短明了

---

**最后更新**: 2026-04-15
