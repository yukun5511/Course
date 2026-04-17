import { useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { Eye, EyeOff, Lock, User, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { login as apiLogin, wechatLogin as apiWechatLogin } from '@/api/auth'

interface LoginContext {
  login: () => void
}

export default function LoginPage() {
  const { login } = useOutletContext<LoginContext>()
  const navigate = useNavigate()
  const [loginType, setLoginType] = useState<'student' | 'wechat'>('student')
  const [showPassword, setShowPassword] = useState(false)
  const [studentId, setStudentId] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!studentId || !password) {
      setError('请输入学号和密码')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      // 调用真实 API
      await apiLogin({ studentId, password })
      login()
      navigate('/mini/home', { replace: true })
    } catch (err: any) {
      setError(err.message || '登录失败，请检查学号和密码')
    } finally {
      setLoading(false)
    }
  }

  const handleWechatLogin = async () => {
    setLoading(true)
    setError('')
    
    try {
      // TODO: 需要先实现微信授权获取 code 的逻辑
      // const code = await getWechatCode()
      // await apiWechatLogin(code)
      setError('微信登录功能暂未实现')
    } catch (err: any) {
      setError(err.message || '微信登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-primary/5 to-background flex flex-col">
      {/* 顶部装饰区域 */}
      <div className="px-6 pt-16 pb-8">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground">课程管理系统</h1>
          <p className="text-sm text-muted-foreground mt-1">学习成长，从这里开始</p>
        </div>
      </div>

      {/* 登录方式切换 */}
      <div className="px-6 mb-6">
        <div className="flex bg-muted rounded-xl p-1">
          <button
            onClick={() => setLoginType('student')}
            className={cn(
              'flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
              loginType === 'student'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground'
            )}
          >
            学号登录
          </button>
          <button
            onClick={() => setLoginType('wechat')}
            className={cn(
              'flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
              loginType === 'wechat'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground'
            )}
          >
            微信登录
          </button>
        </div>
      </div>

      {/* 登录表单 */}
      {loginType === 'student' ? (
        <div className="px-6 space-y-4">
          {/* 错误提示 */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* 学号输入 */}
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={studentId}
              onChange={e => setStudentId(e.target.value)}
              placeholder="请输入学号"
              className="input-base pl-12"
            />
          </div>

          {/* 密码输入 */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="请输入密码"
              className="input-base pl-12 pr-12"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* 记住我 & 忘记密码 */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
              />
              记住我
            </label>
            <button className="text-primary hover:underline">
              忘记密码？
            </button>
          </div>

          {/* 登录按钮 */}
          <button
            onClick={handleLogin}
            disabled={loading || !studentId || !password}
            className={cn(
              'w-full py-3.5 rounded-xl font-medium text-white transition-all duration-200',
              'flex items-center justify-center gap-2',
              loading || !studentId || !password
                ? 'bg-muted-foreground/20 cursor-not-allowed'
                : 'bg-gradient-primary shadow-elegant hover:shadow-glow active:scale-[0.98]'
            )}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                登 录
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      ) : (
        /* 微信登录 */
        <div className="px-6">
          <div className="bg-card rounded-2xl p-8 text-center border shadow-card">
            <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-[#07C160]/10 flex items-center justify-center">
              <svg className="w-12 h-12 text-[#07C160]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm3.132 4.008c-3.946 0-7.148 2.693-7.148 6.018 0 3.325 3.202 6.018 7.148 6.018a8.56 8.56 0 002.386-.338.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.047c.133 0 .241-.111.241-.247 0-.06-.024-.12-.04-.178l-.327-1.233a.49.49 0 01.177-.554C21.134 19.482 22.18 17.907 22.18 16.017c0-3.325-3.202-6.018-7.148-6.018h-.302zm-2.33 3.257c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.66 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">微信一键登录</h3>
            <p className="text-sm text-muted-foreground mb-6">
              使用微信授权快速登录系统
            </p>
            <button
              onClick={handleWechatLogin}
              disabled={loading}
              className={cn(
                'w-full py-3.5 rounded-xl font-medium text-white transition-all duration-200',
                'flex items-center justify-center gap-2',
                loading
                  ? 'bg-muted-foreground/20 cursor-not-allowed'
                  : 'bg-[#07C160] hover:bg-[#06AD56] active:scale-[0.98]'
              )}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348z" />
                  </svg>
                  微信授权登录
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 底部信息 */}
      <div className="mt-auto px-6 pb-8 text-center">
        <p className="text-xs text-muted-foreground">
          登录即表示同意《用户服务协议》和《隐私政策》
        </p>
      </div>
    </div>
  )
}
