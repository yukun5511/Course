import { useState, useEffect } from 'react'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { getStudentCourses } from '@/api/student'
import { error } from '@/components/ui/Toast'

export default function SchedulePage() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date())

  useEffect(() => {
    loadSchedule()
  }, [])

  const loadSchedule = async () => {
    setLoading(true)
    try {
      const response = await getStudentCourses({ page: 1, size: 50 })
      setCourses(response.data?.records || [])
    } catch (err) {
      error('加载课表失败')
    } finally {
      setLoading(false)
    }
  }

  // 按日期分组课程
  const groupCoursesByDate = () => {
    const grouped: { [key: string]: any[] } = {}
    courses.forEach(course => {
      if (course.startTime) {
        const dateKey = formatDate(course.startTime, 'YYYY-MM-DD')
        if (!grouped[dateKey]) {
          grouped[dateKey] = []
        }
        grouped[dateKey].push(course)
      }
    })
    return grouped
  }

  const groupedCourses = groupCoursesByDate()
  const dates = Object.keys(groupedCourses).sort()

  return (
    <div className="min-h-full bg-muted/30">
      {/* 日期选择器 */}
      <div className="bg-card shadow-card">
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                const newDate = new Date(selectedDate)
                newDate.setDate(newDate.getDate() - 1)
                setSelectedDate(newDate)
              }}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <span className="text-lg">‹</span>
            </button>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="font-semibold">
                {formatDate(selectedDate, 'YYYY年MM月DD日')}
              </span>
            </div>
            <button
              onClick={() => {
                const newDate = new Date(selectedDate)
                newDate.setDate(newDate.getDate() + 1)
                setSelectedDate(newDate)
              }}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <span className="text-lg">›</span>
            </button>
          </div>
        </div>

        {/* 本周日期快速选择 */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-border">
          {Array.from({ length: 7 }).map((_, i) => {
            const date = new Date(selectedDate)
            date.setDate(date.getDate() - date.getDay() + i)
            const isSelected = formatDate(date, 'YYYY-MM-DD') === formatDate(selectedDate, 'YYYY-MM-DD')
            const isToday = formatDate(date, 'YYYY-MM-DD') === formatDate(new Date(), 'YYYY-MM-DD')
            
            return (
              <button
                key={i}
                onClick={() => setSelectedDate(date)}
                className={cn(
                  'flex flex-col items-center gap-1 p-2 rounded-lg transition-colors',
                  isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted',
                  isToday && !isSelected && 'text-primary font-semibold'
                )}
              >
                <span className="text-xs">
                  {['日', '一', '二', '三', '四', '五', '六'][date.getDay()]}
                </span>
                <span className="text-sm font-medium">
                  {date.getDate()}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 课程列表 */}
      <div className="px-4 mt-4 pb-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-card rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : dates.length > 0 ? (
          <div className="space-y-4">
            {dates.map(date => {
              const dateCourses = groupedCourses[date]
              const dateObj = new Date(date + 'T00:00:00')
              
              return (
                <div key={date}>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                    {formatDate(dateObj, 'MM月DD日')}{' '}
                    {['周日', '周一', '周二', '周三', '周四', '周五', '周六'][dateObj.getDay()]}
                  </h3>
                  <div className="space-y-2">
                    {dateCourses.map((course, index) => (
                      <div
                        key={course.id}
                        className="bg-card rounded-xl p-4 shadow-card"
                      >
                        <div className="flex items-start gap-3">
                          {/* 时间线 */}
                          <div className="flex flex-col items-center">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            {index < dateCourses.length - 1 && (
                              <div className="w-0.5 flex-1 bg-border mt-1" />
                            )}
                          </div>

                          {/* 课程信息 */}
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">
                              {course.name}
                            </h4>
                            <div className="mt-2 space-y-1.5">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {course.startTime ? formatDate(course.startTime, 'HH:mm') : '--:--'} - {' '}
                                  {course.endTime ? formatDate(course.endTime, 'HH:mm') : '--:--'}
                                </span>
                              </div>
                              {course.location && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <MapPin className="w-4 h-4" />
                                  <span>{course.location}</span>
                                </div>
                              )}
                            </div>
                            
                            {/* 课程状态 */}
                            <div className="mt-3">
                              <span className={cn(
                                'tag text-xs',
                                course.status === 'completed' && 'tag-muted',
                                course.status === 'ongoing' && 'tag-success',
                                course.status === 'upcoming' && 'tag-warning'
                              )}>
                                {course.status === 'completed' ? '已结束' : 
                                 course.status === 'ongoing' ? '进行中' : '即将开始'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-card rounded-xl p-12 text-center">
            <Calendar className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">当天没有课程安排</p>
            <p className="text-xs text-muted-foreground mt-2">
              选择其他日期查看课表
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
