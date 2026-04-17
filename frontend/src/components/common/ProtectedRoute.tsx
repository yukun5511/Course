import { Navigate, useLocation } from 'react-router-dom'
import { TOKEN_KEYS } from '@/api/config'

interface ProtectedRouteProps {
  children: React.ReactNode
}

/**
 * 管理后台路由守卫
 * 检查用户是否已登录，未登录则跳转到登录页
 */
export function AdminProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation()
  
  // 检查是否有 access token
  const accessToken = localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN)
  const adminAuth = localStorage.getItem('admin_auth')
  
  // 如果没有 token 或 admin_auth 标志，跳转到登录页
  if (!accessToken || !adminAuth) {
    return (
      <Navigate 
        to="/admin/login" 
        state={{ from: location }} 
        replace 
      />
    )
  }
  
  return <>{children}</>
}
