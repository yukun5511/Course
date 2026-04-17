import { useState, useEffect } from 'react'
import { Calendar, MapPin, User, Clock, ChevronRight, Star, FileText, CheckCircle } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { mockAssignments, mockEvaluations } from '@/data/mockData'
import type { CourseStatus } from '@/data/types'
import { getStudentCourses, getStudentAssignments, submitAssignment, submitCourseEvaluation, getStudentEvaluations } from '@/api/student'
import { success, error } from '@/components/ui/Toast'

type TabType = 'schedule' | 'progress' | 'evaluation' | 'assignment'

export default function CoursePage() {
  const [activeTab, setActiveTab] = useState<TabType>('schedule')
  const [selectedPeriod, setSelectedPeriod] = useState<number>(2)
  const [courses, setCourses] = useState<any[]>([])
  const [assignments, setAssignments] = useState<any[]>([])
  const [evaluations, setEvaluations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const tabs: { id: TabType; label: string }[] = [
    { id: 'schedule', label: '课表查询' },
    { id: 'progress', label: '课程进度' },
    { id: 'evaluation', label: '课程评价' },
    { id: 'assignment', label: '作业提交' }
  ]

  const periods = [1, 2, 3, 4]

  useEffect(() => {
    console.log('CoursePage mounted, activeTab:', activeTab)
    loadData()
  }, [activeTab])

  const loadData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'schedule' || activeTab === 'progress') {
        const res = await getStudentCourses({ page: 1, size: 20 })
        setCourses(res.data?.records || [])
      } else if (activeTab === 'assignment') {
        const res = await getStudentAssignments({ page: 1, size: 20 })
        setAssignments(res.data?.records || [])
      } else if (activeTab === 'evaluation') {
        const res = await getStudentEvaluations({ page: 1, size: 20 })
        setEvaluations(res.data?.records || [])
      }
    } catch (err) {
      error('加载数据失败')
    } finally {
      setLoading(false)
    }
  }

  // 按状态筛选课程
  const getFilteredCourses = (status?: CourseStatus) => {
    let filtered = courses
    if (status) {
      filtered = filtered.filter(c => c.status === status)
    }
    return filtered
  }

  const statusConfig = {
    ended: { label: '已结束', class: 'tag-muted', dotClass: 'status-dot-ended' },
    ongoing: { label: '进行中', class: 'tag-primary', dotClass: 'status-dot-ongoing' },
    pending: { label: '待开始', class: 'tag-warning', dotClass: 'status-dot-pending' }
  }

  return (
    <div className="min-h-full bg-muted/30">
      {/* 期数选择 */}
      <div className="px-4 pt-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {periods.map(period => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                selectedPeriod === period
                  ? 'bg-primary text-white shadow-elegant'
                  : 'bg-card text-muted-foreground border border-border'
              )}
            >
              第{period}期
            </button>
          ))}
        </div>
      </div>

      {/* Tab 切换 */}
      <div className="px-4 mt-4">
        <div className="flex bg-card rounded-xl p-1 shadow-card">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 py-2 text-sm font-medium rounded-lg transition-all',
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted-foreground'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="px-4 mt-4 pb-6">
        {/* 课表查询 */}
        {activeTab === 'schedule' && (
          <div className="space-y-3">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-card rounded-xl overflow-hidden animate-pulse">
                    <div className="h-32 bg-muted" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : getFilteredCourses().length > 0 ? (
              getFilteredCourses().map(course => (
              <div key={course.id} className="bg-card rounded-xl overflow-hidden shadow-card">
                <div className="relative h-32">
                  <img
                    src={`https://images.unsplash.com/photo-${course.id === 'course1' ? '1523050854058' : course.id === 'course2' ? '1524178232363' : '1427504494785'}?w=400&h=200&fit=crop`}
                    alt={course.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-semibold">{course.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn('tag', statusConfig[course.status as CourseStatus]?.class)}>
                        <span className={cn('status-dot', statusConfig[course.status as CourseStatus]?.dotClass)} />
                        {statusConfig[course.status as CourseStatus]?.label}
                      </span>
                      {course.credits && (
                        <span className="text-white/80 text-xs">{course.credits} 学分</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {course.startDate ? formatDate(course.startDate) : '待定'} - 
                      {course.endDate ? formatDate(course.endDate) : '待定'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{course.location || '待定'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>导师：{course.instructor || course.teacherName || '待定'}</span>
                  </div>
                </div>
              </div>
            ))
            ) : (
              <div className="bg-card rounded-xl p-8 text-center text-muted-foreground">
                暂无课程数据
              </div>
            )}
          </div>
        )}

        {/* 课程进度 */}
        {activeTab === 'progress' && (
          <div className="space-y-4">
            {/* 已结束 */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-status-ended" />
                已结束
              </h4>
              <div className="space-y-2">
                {getFilteredCourses('ended').map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>

            {/* 进行中 - 突出显示 */}
            <div>
              <h4 className="text-sm font-medium text-primary mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-status-ongoing animate-pulse" />
                进行中
              </h4>
              <div className="space-y-2">
                {getFilteredCourses('ongoing').map(course => (
                  <div key={course.id} className="ring-2 ring-primary/20 rounded-xl">
                    <CourseCard course={course} highlighted />
                  </div>
                ))}
              </div>
            </div>

            {/* 待开始 */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-status-pending" />
                待开始
              </h4>
              <div className="space-y-2">
                {getFilteredCourses('pending').map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 课程评价 */}
        {activeTab === 'evaluation' && (
          <div className="space-y-3">
            {mockEvaluations.map(evaluation => (
              <div key={evaluation.id} className="bg-card rounded-xl p-4 shadow-card">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{evaluation.courseName}</h4>
                  {evaluation.submitted ? (
                    <span className="tag tag-success flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      已评价
                    </span>
                  ) : (
                    <span className="tag tag-warning">待评价</span>
                  )}
                </div>
                
                {evaluation.submitted && evaluation.result ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{evaluation.result.averageScore}</div>
                        <div className="text-xs text-muted-foreground">平均分</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">{evaluation.result.totalResponses}</div>
                        <div className="text-xs text-muted-foreground">评价人数</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {evaluation.result.details.map((detail, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{detail.question}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${(detail.average / 5) * 100}%` }}
                              />
                            </div>
                            <span className="text-foreground font-medium">{detail.average}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button className="w-full btn-primary mt-2">
                    去评价
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 作业提交 */}
        {activeTab === 'assignment' && (
          <div className="space-y-3">
            {mockAssignments.map(assignment => (
              <div key={assignment.id} className="bg-card rounded-xl p-4 shadow-card">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{assignment.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{assignment.courseName}</p>
                  </div>
                  <AssignmentStatus status={assignment.status} />
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{assignment.content}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span>截止：{formatDate(assignment.deadline)}</span>
                  </div>
                  {assignment.status === 'pending' && (
                    <button className="btn-primary text-sm py-1.5 px-3">
                      提交作业
                    </button>
                  )}
                  {assignment.status === 'graded' && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-primary">{assignment.score}分</span>
                      <button className="text-xs text-muted-foreground underline">
                        查看反馈
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function CourseCard({ course, highlighted = false }: { course: any; highlighted?: boolean }) {
  const statusConfig = {
    ended: { label: '已结束', class: 'tag-muted', dotClass: 'status-dot-ended' },
    ongoing: { label: '进行中', class: 'tag-primary', dotClass: 'status-dot-ongoing' },
    pending: { label: '待开始', class: 'tag-warning', dotClass: 'status-dot-pending' }
  }

  const config = statusConfig[course.status as CourseStatus]

  return (
    <div className={cn(
      'bg-card rounded-xl p-4 shadow-card',
      highlighted && 'ring-2 ring-primary/30'
    )}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium">{course.name}</h4>
        <span className={cn('tag', config.class)}>
          <span className={cn('status-dot', config.dotClass)} />
          {config.label}
        </span>
      </div>
      <div className="space-y-1.5 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>
            {course.startDate ? formatDate(course.startDate) : '待定'} - 
            {course.endDate ? formatDate(course.endDate) : '待定'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>{course.location || '待定'}</span>
        </div>
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>{course.instructor || course.teacherName || '待定'}</span>
        </div>
      </div>
      {course.credits && (
        <div className="mt-2 pt-2 border-t border-border/50">
          <span className="text-xs text-primary font-medium">{course.credits} 学分</span>
        </div>
      )}
    </div>
  )
}

function AssignmentStatus({ status }: { status: string }) {
  const config = {
    pending: { label: '待提交', class: 'tag-warning' },
    submitted: { label: '已提交', class: 'tag-primary' },
    graded: { label: '已批改', class: 'tag-success' }
  }
  const c = config[status as keyof typeof config]
  return <span className={cn('tag', c.class)}>{c.label}</span>
}
