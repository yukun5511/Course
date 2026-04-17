import { Outlet, useLocation, Navigate } from 'react-router-dom'
import { useState } from 'react'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarDays,
  BookOpen,
  ClipboardCheck,
  Sparkles,
  Gift,
  MessageSquare,
  Settings,
  LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { logout, getCurrentUser } from '@/api/auth'

const useAuth = () => {
  const [isAuthenticated] = useState(
    localStorage.getItem('admin_auth') === 'true'
  )
  const user = getCurrentUser()
  return { isAuthenticated, user }
}

const menuItems = [
  { id: 'dashboard', label: '数据概览', icon: LayoutDashboard, path: '/admin/dashboard' },
  { id: 'users', label: '用户管理', icon: Users, path: '/admin/users' },
  { id: 'classes', label: '班级管理', icon: GraduationCap, path: '/admin/classes' },
  { id: 'schedule', label: '排课管理', icon: CalendarDays, path: '/admin/schedule' },
  { id: 'teaching', label: '教学管理', icon: BookOpen, path: '/admin/teaching' },
  { id: 'attendance', label: '考勤管理', icon: ClipboardCheck, path: '/admin/attendance' },
  { id: 'activity', label: '活动管理', icon: Sparkles, path: '/admin/activity' },
  { id: 'points', label: '积分商城', icon: Gift, path: '/admin/points' },
  { id: 'messages', label: '消息管理', icon: MessageSquare, path: '/admin/messages' },
  { id: 'system', label: '系统管理', icon: Settings, path: '/admin/system' }
]

export function AdminLayout() {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  // 处理退出登录
  const handleLogout = async () => {
    if (!confirm('确定要退出登录吗？')) {
      return
    }
    
    try {
      await logout()
      window.location.href = '/admin/login'
    } catch (error) {
      console.error('退出登录失败:', error)
      // 即使失败也清除本地状态
      localStorage.removeItem('admin_auth')
      localStorage.removeItem('admin_access_token')
      localStorage.removeItem('admin_refresh_token')
      localStorage.removeItem('admin_user_info')
      window.location.href = '/admin/login'
    }
  }

  const currentMenu = menuItems.find(item => location.pathname.includes(item.id))

  return (
    <div className="admin-layout">
      {/* 侧边栏 */}
      <aside className={cn(
        'admin-sidebar transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className="ml-3 text-lg font-semibold text-white whitespace-nowrap">
              课程管理系统
            </span>
          )}
        </div>

        {/* 菜单列表 */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {menuItems.map(item => {
            const isActive = location.pathname.includes(item.id)
            return (
              <a
                key={item.id}
                href={item.path}
                className={cn(
                  'flex items-center px-4 py-3 mx-2 rounded-lg transition-all duration-200',
                  'hover:bg-white/10',
                  isActive ? 'bg-primary text-white' : 'text-sidebar-foreground/70',
                  collapsed ? 'justify-center' : ''
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <span className="ml-3 text-sm whitespace-nowrap">{item.label}</span>
                )}
              </a>
            )
          })}
        </nav>

        {/* 底部操作 */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className={cn(
              'flex items-center w-full px-4 py-3 rounded-lg',
              'text-sidebar-foreground/70 hover:bg-white/10 hover:text-white',
              'transition-all duration-200',
              collapsed ? 'justify-center' : ''
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="ml-3 text-sm">退出登录</span>}
          </button>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="admin-main">
        {/* 顶部栏 */}
        <header className="admin-header">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold">{currentMenu?.label || '管理后台'}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium">
                {user?.name?.charAt(0) || '管'}
              </div>
              <span className="text-sm">{user?.name || '管理员'}</span>
            </div>
          </div>
        </header>

        {/* 内容区 */}
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
