import { Navigate, useLocation } from 'react-router-dom'
import { TOKEN_KEYS } from '@/api/config'

interface ProtectedRouteProps {
  children: React.ReactNode
}

/**
 * 小程序端路由守卫
 * 检查用户是否已登录，未登录则跳转到登录页
 */
export function MiniAppProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation()
  
  // 检查是否有 access token（小程序使用与后台相同的token机制）
  const accessToken = localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN)
  
  // 如果没有 token，跳转到登录页
  if (!accessToken) {
    return (
      <Navigate 
        to="/mini/login" 
        state={{ from: location }} 
        replace 
      />
    )
  }
  
  return <>{children}</>
}
