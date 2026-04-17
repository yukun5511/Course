import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  User, Edit3, QrCode, ClipboardList, Gift, Plane,
  CalendarOff, BarChart3, LogOut, ChevronRight,
  MapPin, Clock, CheckCircle, XCircle, AlertCircle
} from 'lucide-react'
import { cn, getInitials, formatDate } from '@/lib/utils'
import { getStudentLeaveRecords, getStudentTodos, getTravelConfirmations } from '@/api/student'
import { checkin, getCheckinRecords, getAttendanceStats, applyStudentLeave, updateTodoStatus, submitTravelConfirmation } from '@/api/student'
import { success, error } from '@/components/ui/Toast'

interface MiniAppContext {
  logout: () => void
}

type SectionType = 'profile' | 'checkin' | 'todos' | 'points' | 'travel' | 'leave'

export default function ProfilePage() {
  const { logout } = useOutletContext<MiniAppContext>()
  const [currentUser, setCurrentUser] = useState<any>({
    id: 'user1',
    name: '张明',
    avatar: '',
    company: '华为技术有限公司',
    position: '产品总监',
    tags: ['AI探索者', '数字化先锋'],
    badges: 12,
    points: 2580,
    courses: 8
  })
  const [activeSection, setActiveSection] = useState<SectionType | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [attendanceStats, setAttendanceStats] = useState<any>(null)
  const [todos, setTodos] = useState<any[]>([])
  const [travelConfirmations, setTravelConfirmations] = useState<any[]>([])
  const [leaveRecords, setLeaveRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editForm, setEditForm] = useState({
    name: '',
    company: '',
    position: '',
    tags: ''
  })

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    setLoading(true)
    try {
      // 并行加载所有数据
      const [statsRes, todosRes, travelRes, leaveRes] = await Promise.allSettled([
        getAttendanceStats(),
        getStudentTodos({ page: 1, size: 20 }),
        getTravelConfirmations(),
        getStudentLeaveRecords({ page: 1, size: 20 })
      ])
      
      if (statsRes.status === 'fulfilled') {
        setAttendanceStats(statsRes.value.data)
      }
      
      if (todosRes.status === 'fulfilled') {
        setTodos(todosRes.value.data?.records || [])
      }
      
      if (travelRes.status === 'fulfilled') {
        setTravelConfirmations(travelRes.value.data || [])
      }
      
      if (leaveRes.status === 'fulfilled') {
        setLeaveRecords(leaveRes.value.data?.records || [])
      }
      
      // 设置用户信息
      setCurrentUser({
        id: 'user1',
        name: '张明',
        avatar: '',
        company: '华为技术有限公司',
        position: '产品总监',
        tags: ['AI探索者', '数字化先锋'],
        badges: 12,
        points: 2580,
        courses: 8
      })
    } catch (err) {
      console.error('加载用户数据失败', err)
      error('加载数据失败')
    } finally {
      setLoading(false)
    }
  }

  // 初始化编辑表单
  useEffect(() => {
    if (currentUser) {
      setEditForm({
        name: currentUser.name || '',
        company: currentUser.company || '',
        position: currentUser.position || '',
        tags: currentUser.tags?.join(', ') || ''
      })
    }
  }, [currentUser])

  const menuItems = [
    { id: 'checkin' as SectionType, icon: QrCode, label: '现场签到', desc: '扫码签到', color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'todos' as SectionType, icon: ClipboardList, label: '待办事项', desc: `${todos.filter(t => !t.completed).length} 项待办`, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'points' as SectionType, icon: Gift, label: '积分兑换', desc: `${currentUser?.badges || 0} 枚徽章`, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'travel' as SectionType, icon: Plane, label: '行程确认', desc: `${travelConfirmations.filter(t => !t.submitted).length} 项待确认`, color: 'text-green-500', bg: 'bg-green-50' },
    { id: 'leave' as SectionType, icon: CalendarOff, label: '请假管理', desc: `${leaveRecords.length} 条记录`, color: 'text-red-500', bg: 'bg-red-50' },
  ]

  const handleSaveProfile = () => {
    setIsEditing(false)
    // 这里可以添加保存逻辑
  }

  const handleLogout = () => {
    logout()
  }

  // 返回按钮
  if (activeSection) {
    return (
      <div className="min-h-full bg-muted/30">
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => setActiveSection(null)}
            className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold">
            {menuItems.find(m => m.id === activeSection)?.label}
          </h2>
        </div>

        <div className="px-4 pb-6">
          {activeSection === 'checkin' && <CheckInSection />}
          {activeSection === 'todos' && <TodosSection todos={todos} />}
          {activeSection === 'points' && <PointsSection user={currentUser} />}
          {activeSection === 'travel' && <TravelSection confirmations={travelConfirmations} />}
          {activeSection === 'leave' && <LeaveSection records={leaveRecords} stats={attendanceStats} />}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-muted/30">
      {/* 个人信息卡片 */}
      <div className="mx-4 mt-4 bg-gradient-primary rounded-2xl p-5 text-white shadow-elegant">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold backdrop-blur-sm">
            {getInitials(currentUser.name)}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{currentUser.name}</h2>
            <p className="text-white/80 text-sm mt-0.5">{currentUser.company} · {currentUser.position}</p>
            <div className="flex items-center gap-2 mt-2">
              {currentUser.tags.map((tag, index) => (
                <span key={index} className="bg-white/20 px-2 py-0.5 rounded text-xs backdrop-blur-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <Edit3 className="w-5 h-5" />
          </button>
        </div>

        {/* 徽章和积分 */}
        <div className="flex items-center gap-6 mt-5 pt-5 border-t border-white/20">
          <div className="text-center">
            <div className="text-2xl font-bold">{currentUser.badges}</div>
            <div className="text-xs text-white/70">徽章</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{currentUser.points}</div>
            <div className="text-xs text-white/70">积分</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">第{2}期</div>
            <div className="text-xs text-white/70">在读</div>
          </div>
        </div>
      </div>

      {/* 编辑信息表单 */}
      {isEditing && (
        <div className="mx-4 mt-4 bg-card rounded-xl p-4 shadow-card animate-fade-in">
          <h3 className="font-medium mb-4">编辑个人信息</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">姓名</label>
              <input
                type="text"
                value={editForm.name}
                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                className="input-base"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">公司</label>
              <input
                type="text"
                value={editForm.company}
                onChange={e => setEditForm({ ...editForm, company: e.target.value })}
                className="input-base"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">职位</label>
              <input
                type="text"
                value={editForm.position}
                onChange={e => setEditForm({ ...editForm, position: e.target.value })}
                className="input-base"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">身份标签</label>
              <input
                type="text"
                value={editForm.tags}
                onChange={e => setEditForm({ ...editForm, tags: e.target.value })}
                className="input-base"
                placeholder="用逗号分隔"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setIsEditing(false)} className="flex-1 btn-secondary">
                取消
              </button>
              <button onClick={handleSaveProfile} className="flex-1 btn-primary">
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 功能菜单 */}
      <div className="px-4 mt-4">
        <div className="bg-card rounded-xl overflow-hidden shadow-card">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  'w-full flex items-center gap-4 p-4 text-left transition-colors',
                  index !== menuItems.length - 1 && 'border-b border-border/50',
                  'hover:bg-muted/50'
                )}
              >
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', item.bg, item.color)}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-foreground">{item.label}</div>
                  <div className="text-sm text-muted-foreground">{item.desc}</div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            )
          })}
        </div>
      </div>

      {/* 退出登录 */}
      <div className="px-4 mt-6 mb-8">
        <button
          onClick={handleLogout}
          className="w-full py-3.5 rounded-xl border border-destructive/20 text-destructive font-medium hover:bg-destructive/5 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          退出登录
        </button>
      </div>
    </div>
  )
}

// 现场签到组件
function CheckInSection() {
  const [scanResult, setScanResult] = useState<'success' | 'fail' | null>(null)
  const [scanning, setScanning] = useState(false)
  const [checkinRecords, setCheckinRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCheckinRecords()
  }, [])

  const loadCheckinRecords = async () => {
    try {
      const res = await getCheckinRecords({ page: 1, size: 10 })
      setCheckinRecords(res.data?.records || [])
    } catch (err) {
      console.error('加载签到记录失败', err)
    }
  }

  const handleCheckin = async () => {
    setScanning(true)
    setScanResult(null)
    
    try {
      // 获取当前位置
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        })
      })

      // TODO: 需要传入checkinId，这里先模拟
      // 实际应该从扫码或课程信息中获取
      await checkin({
        courseId: 1, // 示例值
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        location: '当前位置'
      })

      setScanResult('success')
      success('签到成功！')
      loadCheckinRecords()
    } catch (err: any) {
      setScanResult('fail')
      error(err.response?.data?.message || '签到失败')
    } finally {
      setScanning(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-xl p-6 text-center shadow-card">
        <div className="w-24 h-24 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <QrCode className="w-12 h-12 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">扫码签到</h3>
        <p className="text-sm text-muted-foreground mb-6">
          请在打卡范围内扫描二维码完成签到
        </p>
        <button
          onClick={handleCheckin}
          disabled={scanning}
          className={cn(
            'w-full py-3 rounded-xl font-medium text-white transition-all',
            scanning ? 'bg-muted-foreground/20' : 'bg-gradient-primary hover:shadow-elegant'
          )}
        >
          {scanning ? '签到中...' : '开始签到'}
        </button>
      </div>

      {scanResult === 'success' && (
        <div className="bg-success/10 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <CheckCircle className="w-6 h-6 text-success" />
          <div>
            <div className="font-medium text-success">签到成功</div>
            <div className="text-sm text-muted-foreground">{formatDate(new Date(), 'YYYY-MM-DD HH:mm')}</div>
          </div>
        </div>
      )}

      {scanResult === 'fail' && (
        <div className="bg-destructive/10 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <XCircle className="w-6 h-6 text-destructive" />
          <div>
            <div className="font-medium text-destructive">签到失败</div>
            <div className="text-sm text-muted-foreground">不在打卡范围内，请靠近签到点</div>
          </div>
        </div>
      )}

      {/* 签到记录 */}
      {checkinRecords.length > 0 && (
        <div className="bg-card rounded-xl p-4 shadow-card">
          <h4 className="font-medium mb-3">最近签到记录</h4>
          <div className="space-y-2">
            {checkinRecords.slice(0, 5).map(record => (
              <div key={record.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    'w-2 h-2 rounded-full',
                    record.status === 'success' ? 'bg-success' : 'bg-destructive'
                  )} />
                  <span>{record.checkinTime ? formatDate(record.checkinTime, 'MM-DD HH:mm') : '待定'}</span>
                </div>
                <span className={cn(
                  'tag',
                  record.status === 'success' ? 'tag-success' : 'tag-destructive'
                )}>
                  {record.status === 'success' ? '成功' : '失败'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// 待办事项组件
function TodosSection({ todos }: { todos: any[] }) {
  const [localTodos, setLocalTodos] = useState(todos)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLocalTodos(todos)
  }, [todos])

  const toggleTodo = async (id: string, currentStatus: boolean) => {
    setLoading(true)
    try {
      // 乐观更新
      setLocalTodos(prev =>
        prev.map(t => t.id === id ? { ...t, completed: !currentStatus } : t)
      )
      
      // 调用API
      await updateTodoStatus(id, !currentStatus)
      success('状态已更新')
    } catch (err) {
      // 回滚
      setLocalTodos(todos)
      error('更新失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      {localTodos.map(todo => (
        <div
          key={todo.id}
          className={cn(
            'bg-card rounded-xl p-4 shadow-card flex items-center gap-3 transition-all',
            todo.completed && 'opacity-60'
          )}
        >
          <button
            onClick={() => toggleTodo(todo.id, todo.completed)}
            disabled={loading}
            className={cn(
              'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors',
              todo.completed
                ? 'bg-primary border-primary'
                : 'border-muted-foreground/30'
            )}
          >
            {todo.completed && <CheckCircle className="w-4 h-4 text-white" />}
          </button>
          <div className="flex-1 min-w-0">
            <div className={cn('font-medium', todo.completed && 'line-through text-muted-foreground')}>
              {todo.title}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{todo.dueDate}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// 积分兑换组件
function PointsSection({ user }: { user: any }) {
  const exchangeItems = [
    { id: '1', name: '数字化转型战略（二期）', type: 'course', badges: 50, image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=200&h=200&fit=crop' },
    { id: '2', name: '年度论坛VIP席位', type: 'activity', badges: 100, image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&h=200&fit=crop' },
    { id: '3', name: '导师一对一咨询', type: 'activity', badges: 80, image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop' },
  ]

  return (
    <div className="space-y-4">
      {/* 徽章展示 */}
      <div className="bg-card rounded-xl p-4 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">我的徽章</h3>
          <span className="text-2xl font-bold text-primary">{user.badges}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
            <Gift className="w-6 h-6 text-warning" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-muted-foreground">可用于兑换课程和活动</div>
            <div className="progress-bar mt-2">
              <div className="progress-bar-fill" style={{ width: '65%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* 兑换商品 */}
      <h3 className="font-medium">可兑换商品</h3>
      <div className="space-y-3">
        {exchangeItems.map(item => (
          <div key={item.id} className="bg-card rounded-xl overflow-hidden shadow-card">
            <div className="flex items-center gap-3 p-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-lg object-cover"
                loading="lazy"
              />
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {item.type === 'course' ? '课程' : '活动'}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-warning">
                  <Gift className="w-4 h-4" />
                  <span className="font-bold">{item.badges}</span>
                </div>
                <button
                  disabled={user.badges < item.badges}
                  className={cn(
                    'mt-1 text-xs px-3 py-1 rounded-full',
                    user.badges >= item.badges
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  )}
                >
                  {user.badges >= item.badges ? '兑换' : '徽章不足'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 行程确认组件
function TravelSection({ confirmations }: { confirmations: any[] }) {
  const [submitting, setSubmitting] = useState<string | null>(null)

  const handleSubmit = async (travelId: string) => {
    setSubmitting(travelId)
    try {
      // TODO: 应该弹出表单让用户填写详细信息
      await submitTravelConfirmation(parseInt(travelId), {
        notes: '确认参加'
      })
      success('行程确认已提交')
    } catch (err: any) {
      error(err.response?.data?.message || '提交失败')
    } finally {
      setSubmitting(null)
    }
  }

  return (
    <div className="space-y-3">
      {confirmations.map(item => (
        <div key={item.id} className="bg-card rounded-xl p-4 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">{item.courseName}</h4>
            {item.submitted ? (
              <span className="tag tag-success">已确认</span>
            ) : (
              <span className="tag tag-warning">待确认</span>
            )}
          </div>
          
          {item.submitted ? (
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>确认参加</span>
              </div>
              {item.roomNumber && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>房间号：{item.roomNumber}</span>
                </div>
              )}
              {item.arrivalTime && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>到达时间：{item.arrivalTime}</span>
                </div>
              )}
              {item.tripNumber && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Plane className="w-4 h-4" />
                  <span>航班/车次：{item.tripNumber}</span>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => handleSubmit(item.id)}
              disabled={submitting === item.id}
              className="w-full btn-primary text-sm mt-2 disabled:opacity-50"
            >
              {submitting === item.id ? '提交中...' : '填写行程确认'}
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

// 请假管理组件
function LeaveSection({ records, stats }: { records: any[]; stats: any }) {
  const [showApplyForm, setShowApplyForm] = useState(false)
  const [applying, setApplying] = useState(false)
  const [leaveForm, setLeaveForm] = useState({
    courseId: '',
    reason: '',
    startDate: '',
    endDate: ''
  })

  const handleApplyLeave = async () => {
    if (!leaveForm.courseId || !leaveForm.reason) {
      error('请填写完整信息')
      return
    }

    setApplying(true)
    try {
      await applyStudentLeave({
        courseId: parseInt(leaveForm.courseId),
        reason: leaveForm.reason,
        startDate: leaveForm.startDate,
        endDate: leaveForm.endDate
      })
      success('请假申请已提交')
      setShowApplyForm(false)
      setLeaveForm({ courseId: '', reason: '', startDate: '', endDate: '' })
    } catch (err: any) {
      error(err.response?.data?.message || '提交失败')
    } finally {
      setApplying(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* 请假统计 */}
      <div className="bg-card rounded-xl p-4 shadow-card">
        <h3 className="font-medium mb-4">出勤统计</h3>
        <div className="grid grid-cols-4 gap-3 text-center">
          <div>
            <div className="text-xl font-bold text-foreground">{stats.totalCourses}</div>
            <div className="text-xs text-muted-foreground">总课程</div>
          </div>
          <div>
            <div className="text-xl font-bold text-success">{stats.attended}</div>
            <div className="text-xs text-muted-foreground">到课</div>
          </div>
          <div>
            <div className="text-xl font-bold text-warning">{stats.leave}</div>
            <div className="text-xs text-muted-foreground">请假</div>
          </div>
          <div>
            <div className="text-xl font-bold text-destructive">{stats.absent}</div>
            <div className="text-xs text-muted-foreground">缺勤</div>
          </div>
        </div>
      </div>

      {/* 申请请假按钮 */}
      <button 
        onClick={() => setShowApplyForm(!showApplyForm)}
        className="w-full btn-primary"
      >
        {showApplyForm ? '取消申请' : '申请请假'}
      </button>

      {/* 请假申请表单 */}
      {showApplyForm && (
        <div className="bg-card rounded-xl p-4 shadow-card space-y-3">
          <div>
            <label className="text-sm font-medium mb-1 block">课程ID</label>
            <input
              type="number"
              value={leaveForm.courseId}
              onChange={e => setLeaveForm({...leaveForm, courseId: e.target.value})}
              className="input"
              placeholder="请输入课程ID"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">请假原因</label>
            <textarea
              value={leaveForm.reason}
              onChange={e => setLeaveForm({...leaveForm, reason: e.target.value})}
              className="input min-h-[80px]"
              placeholder="请输入请假原因"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">开始日期</label>
              <input
                type="date"
                value={leaveForm.startDate}
                onChange={e => setLeaveForm({...leaveForm, startDate: e.target.value})}
                className="input"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">结束日期</label>
              <input
                type="date"
                value={leaveForm.endDate}
                onChange={e => setLeaveForm({...leaveForm, endDate: e.target.value})}
                className="input"
              />
            </div>
          </div>
          <button
            onClick={handleApplyLeave}
            disabled={applying}
            className="w-full btn-primary disabled:opacity-50"
          >
            {applying ? '提交中...' : '提交申请'}
          </button>
        </div>
      )}

      {/* 请假记录 */}
      <h3 className="font-medium">请假记录</h3>
      {records.length > 0 ? (
        <div className="space-y-2">
          {records.map(record => (
            <div key={record.id} className="bg-card rounded-xl p-4 shadow-card">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{record.courseName}</h4>
                <span className={cn(
                  'tag',
                  record.status === 'approved' ? 'tag-success' :
                  record.status === 'rejected' ? 'tag-muted' : 'tag-warning'
                )}>
                  {record.status === 'approved' ? '已批准' :
                   record.status === 'rejected' ? '已拒绝' : '待审批'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{record.reason}</p>
              <div className="text-xs text-muted-foreground mt-2">{record.submittedAt}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <AlertCircle className="empty-state-icon" />
          <p className="empty-state-text">暂无请假记录</p>
          <button className="btn-primary mt-4">申请请假</button>
        </div>
      )}

      {records.length > 0 && (
        <button className="w-full btn-primary">
          申请请假
        </button>
      )}
    </div>
  )
}
