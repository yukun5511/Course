import { Outlet, useLocation, Navigate, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Home, BookOpen, Users, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TabBar } from '@/components/common/TabBar'
import { NavBar } from '@/components/common/NavBar'
import { TOKEN_KEYS } from '@/api/config'

// 模拟登录状态
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('mini_auth') === 'true' || 
    !!localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN)
  )

  const login = () => {
    localStorage.setItem('mini_auth', 'true')
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('mini_auth')
    localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(TOKEN_KEYS.USER_INFO)
    setIsAuthenticated(false)
  }

  return { isAuthenticated, login, logout }
}

export function MiniAppLayout() {
  const { isAuthenticated, login, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [currentTab, setCurrentTab] = useState('home')

  const tabs = [
    { id: 'home', label: '首页', icon: Home, path: '/mini/home' },
    { id: 'course', label: '课程', icon: BookOpen, path: '/mini/course' },
    { id: 'class', label: '班级', icon: Users, path: '/mini/class' },
    { id: 'profile', label: '我的', icon: User, path: '/mini/profile' }
  ]

  // 根据路径设置当前标签
  useEffect(() => {
    const path = location.pathname
    if (path.includes('/home')) setCurrentTab('home')
    else if (path.includes('/course')) setCurrentTab('course')
    else if (path.includes('/class')) setCurrentTab('class')
    else if (path.includes('/profile')) setCurrentTab('profile')
  }, [location.pathname])

  // 未登录时重定向到登录页
  if (!isAuthenticated && !location.pathname.includes('/login')) {
    return <Navigate to="/mini/login" replace />
  }

  // 已登录时访问登录页重定向到首页
  if (isAuthenticated && location.pathname.includes('/login')) {
    return <Navigate to="/mini/home" replace />
  }

  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId)
    const targetTab = tabs.find(t => t.id === tabId)
    if (targetTab) {
      navigate(targetTab.path)
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="mini-app-container">
        {/* 导航栏 - 登录页不显示 */}
        {!location.pathname.includes('/login') && (
          <>
            <NavBar title="课程管理系统" showBack={false} />
            <div className="h-[calc(100%-60px)] overflow-auto pb-[80px]">
              <Outlet context={{ logout }} />
            </div>
            <TabBar tabs={tabs} currentTab={currentTab} onTabChange={handleTabChange} />
          </>
        )}
        
        {/* 登录页全屏显示 */}
        {location.pathname.includes('/login') && (
          <div className="h-full overflow-auto">
            <Outlet context={{ login }} />
          </div>
        )}
      </div>
    </div>
  )
}
