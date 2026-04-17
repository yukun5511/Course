import { useState, useEffect } from 'react'

export default function TestPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    console.log('TestPage mounted')
  }, [])

  return (
    <div className="min-h-full bg-muted/30 p-4">
      <h1 className="text-2xl font-bold mb-4">测试页面</h1>
      <p className="mb-2">挂载状态: {mounted ? '已挂载' : '未挂载'}</p>
      <p className="mb-2">当前时间: {new Date().toLocaleString()}</p>
      <div className="mt-4 p-4 bg-white rounded-lg">
        <p>如果您能看到这个页面，说明路由和渲染都正常工作</p>
      </div>
    </div>
  )
}
