import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, ChevronRight, X, Image } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { getStudentInfo, getStudentCourses, getAnnouncements, getPopups } from '@/api/student'
import { success, error } from '@/components/ui/Toast'

export default function HomePage() {
  const navigate = useNavigate()
  const [showPopup, setShowPopup] = useState(false)
  const [currentPopupIndex, setCurrentPopupIndex] = useState(0)
  const [popupList, setPopupList] = useState<any[]>([])
  const [studentInfo, setStudentInfo] = useState<any>(null)
  const [recentCourses, setRecentCourses] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('HomePage mounted')
    loadPageData()
  }, [])

  const loadPageData = async () => {
    setLoading(true)
    try {
      // 并行加载所有数据
      const [studentRes, coursesRes, announcementsRes, popupsRes] = await Promise.allSettled([
        getStudentInfo(),
        getStudentCourses({ page: 1, size: 2 }),
        getAnnouncements({ page: 1, size: 3 }),
        getPopups()
      ])

      // 处理学员信息
      if (studentRes.status === 'fulfilled') {
        setStudentInfo(studentRes.value.data)
      }

      // 处理近期课程
      if (coursesRes.status === 'fulfilled') {
        setRecentCourses(coursesRes.value.data?.records || [])
      }

      // 处理通知公告
      if (announcementsRes.status === 'fulfilled') {
        setAnnouncements(announcementsRes.value.data?.records || [])
      }

      // 处理弹窗消息
      if (popupsRes.status === 'fulfilled') {
        const popups = popupsRes.value.data || []
        setPopupList(popups)
        if (popups.length > 0) {
          setShowPopup(true)
        }
      }
    } catch (err) {
      error('加载数据失败')
    } finally {
      setLoading(false)
    }
  }

  const closePopup = () => {
    setShowPopup(false)
  }

  const nextPopup = () => {
    if (currentPopupIndex < popupList.length - 1) {
      setCurrentPopupIndex(currentPopupIndex + 1)
    }
  }

  const prevPopup = () => {
    if (currentPopupIndex > 0) {
      setCurrentPopupIndex(currentPopupIndex - 1)
    }
  }

  // 快捷操作路由
  const quickActions = [
    { icon: '📚', label: '我的课表', color: 'bg-blue-500', path: '/mini/schedule' },
    { icon: '📝', label: '作业提交', color: 'bg-green-500', path: '/mini/course' },
    { icon: '⭐', label: '课程评价', color: 'bg-yellow-500', path: '/mini/course' },
    { icon: '📊', label: '学习统计', color: 'bg-purple-500', path: '/mini/profile' },
  ]

  const handleQuickAction = (path: string) => {
    navigate(path)
  }

  const bannerImages = [
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=400&fit=crop'
  ]

  return (
    <div className="min-h-full bg-muted/30">
      {/* 轮播图 */}
      <div className="px-4 pt-4">
        <div className="relative rounded-2xl overflow-hidden aspect-[2/1]">
          <img
            src={bannerImages[0]}
            alt="宣传横幅"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-white font-semibold text-lg">数字化转型领袖课程</h3>
            <p className="text-white/80 text-sm mt-1">助力企业数字化转型，培养新时代领袖</p>
          </div>
          <div className="absolute top-4 right-4">
            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
              热门课程
            </span>
          </div>
        </div>
      </div>

      {/* 快捷操作 */}
      <div className="px-4 mt-6">
        <div className="bg-card rounded-2xl p-4 shadow-card">
          <div className="grid grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action.path)}
                className="flex flex-col items-center gap-2 group"
              >
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center text-xl',
                  action.color,
                  'group-active:scale-95 transition-transform'
                )}>
                  {action.icon}
                </div>
                <span className="text-xs text-muted-foreground">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 通知公告 */}
      <div className="px-4 mt-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">通知公告</h3>
          <button className="text-sm text-muted-foreground flex items-center gap-1">
            查看全部
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-card rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : announcements.length > 0 ? (
          <div className="space-y-2">
            {announcements.map((item, index) => (
              <div
                key={item.id}
                className="bg-card rounded-xl p-4 shadow-card flex items-center justify-between active:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {index === 0 && (
                      <span className="bg-destructive text-white text-[10px] px-1.5 py-0.5 rounded">
                        新
                      </span>
                    )}
                    <p className="text-sm text-foreground truncate">{item.title}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(item.createdAt, 'relative')}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-xl p-8 text-center text-muted-foreground">
            暂无通知公告
          </div>
        )}
      </div>

      {/* 近期课程 */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">近期课程</h3>
          <button 
            onClick={() => navigate('/mini/course')}
            className="text-sm text-muted-foreground flex items-center gap-1"
          >
            查看全部
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        {loading ? (
          <div className="bg-card rounded-2xl p-8 text-center">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          </div>
        ) : recentCourses.length > 0 ? (
          <div className="bg-card rounded-2xl overflow-hidden shadow-card">
            {recentCourses.map((course, index) => (
              <div 
                key={course.id} 
                className={cn('p-4', index > 0 && 'border-t border-border/50')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">{course.name.substring(0, 2)}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{course.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {course.startTime ? formatDate(course.startTime, 'MM月DD日') : '待定'}
                    </p>
                  </div>
                  <span className={cn(
                    'tag',
                    course.status === 'ongoing' ? 'tag-success' : 'tag-muted'
                  )}>
                    {course.status === 'ongoing' ? '进行中' : '待开始'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-2xl p-8 text-center text-muted-foreground">
            暂无近期课程
          </div>
        )}
      </div>

      {/* 弹窗 */}
      {showPopup && popupList.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-2xl w-full max-w-sm overflow-hidden animate-fade-in">
            {/* 弹窗头部 */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold">{popupList[currentPopupIndex].title}</h3>
              <button
                onClick={closePopup}
                className="p-1 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* 弹窗内容 */}
            <div className="p-4">
              {popupList[currentPopupIndex].image && (
                <img
                  src={popupList[currentPopupIndex].image}
                  alt=""
                  className="w-full rounded-lg mb-3"
                  loading="lazy"
                />
              )}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {popupList[currentPopupIndex].content}
              </p>
            </div>

            {/* 弹窗底部 */}
            <div className="flex items-center justify-between p-4 border-t border-border">
              <div className="flex items-center gap-1">
                {popupList.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      'w-2 h-2 rounded-full transition-colors',
                      index === currentPopupIndex ? 'bg-primary' : 'bg-muted'
                    )}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                {currentPopupIndex > 0 && (
                  <button
                    onClick={prevPopup}
                    className="btn-ghost text-sm"
                  >
                    上一条
                  </button>
                )}
                {currentPopupIndex < popupList.length - 1 ? (
                  <button
                    onClick={nextPopup}
                    className="btn-primary text-sm"
                  >
                    下一条
                  </button>
                ) : (
                  <button
                    onClick={closePopup}
                    className="btn-primary text-sm"
                  >
                    我知道了
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
