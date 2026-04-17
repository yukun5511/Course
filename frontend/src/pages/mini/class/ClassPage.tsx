import { useState, useEffect } from 'react'
import { Users, User, Award, MessageSquare, Heart, Send, ChevronRight, Star, MapPin, Briefcase } from 'lucide-react'
import { cn, formatRelativeTime, getInitials, formatDate } from '@/lib/utils'
import { getStudentClass, getClassMembers, getClassMoments, likeMoment } from '@/api/student'
import { success, error } from '@/components/ui/Toast'
import { mockMoments } from '@/data/mockData'

type TabType = 'info' | 'members' | 'excellent' | 'moments'

export default function ClassPage() {
  const [activeTab, setActiveTab] = useState<TabType>('info')
  const [classInfo, setClassInfo] = useState<any>(null)
  const [classMembers, setClassMembers] = useState<any[]>([])
  const [excellentStudents, setExcellentStudents] = useState<any[]>([])
  const [moments, setMoments] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const [likedMoments, setLikedMoments] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadClassData()
  }, [activeTab])

  const loadClassData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'info') {
        const res = await getStudentClass()
        setClassInfo(res.data)
      } else if (activeTab === 'members') {
        const res = await getClassMembers(1, { page: 1, size: 50 })
        setClassMembers(res.data?.records || [])
      } else if (activeTab === 'excellent') {
        // TODO: 添加优秀学员API
        setExcellentStudents([])
      } else if (activeTab === 'moments') {
        const res = await getClassMoments(1, { page: 1, size: 20 })
        setMoments(res.data?.records || [])
      }
    } catch (err) {
      error('加载数据失败')
    } finally {
      setLoading(false)
    }
  }

  const tabs: { id: TabType; label: string; icon: typeof Users }[] = [
    { id: 'info', label: '班级信息', icon: Users },
    { id: 'members', label: '班级人员', icon: User },
    { id: 'excellent', label: '优秀学员', icon: Award },
    { id: 'moments', label: '班级圈', icon: MessageSquare }
  ]

  const toggleLike = async (momentId: string) => {
    try {
      await likeMoment(momentId)
      setLikedMoments(prev => {
        const next = new Set(prev)
        if (next.has(momentId)) {
          next.delete(momentId)
        } else {
          next.add(momentId)
        }
        return next
      })
      success('已点赞')
    } catch (err) {
      error('操作失败')
    }
  }

  return (
    <div className="min-h-full bg-muted/30">
      {/* 班级头部卡片 */}
      <div className="mx-4 mt-4 bg-gradient-primary rounded-2xl p-5 text-white shadow-elegant">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold">{classInfo?.name || '班级信息'}</h2>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
            第{classInfo?.period || '-'}期
          </span>
        </div>
        <div className="flex items-center gap-6 text-white/80 text-sm">
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            <span>{classInfo?.memberCount || 0} 人</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span>{classInfo?.director || '-'}</span>
          </div>
        </div>
      </div>

      {/* Tab 切换 */}
      <div className="px-4 mt-4">
        <div className="flex bg-card rounded-xl p-1 shadow-card">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-1',
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted-foreground'
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="px-4 mt-4 pb-6">
        {/* 班级信息 */}
        {activeTab === 'info' && (
          <div className="space-y-4">
            {/* 学术主任 */}
            <div className="bg-card rounded-xl p-4 shadow-card">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">学术主任</h4>
              <div className="flex items-center gap-3">
                <div className="avatar avatar-lg bg-gradient-to-br from-primary to-primary-dark">
                  {getInitials(classInfo?.director || '-')}
                </div>
                <div>
                  <div className="font-medium">{classInfo?.director || '-'}</div>
                  <div className="text-sm text-muted-foreground">{classInfo?.status === 'ongoing' ? '在任' : '已卸任'}</div>
                </div>
              </div>
            </div>

            {/* 班长 */}
            <div className="bg-card rounded-xl p-4 shadow-card">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">班长</h4>
              <div className="flex items-center gap-3">
                <div className="avatar avatar-lg bg-gradient-to-br from-success to-success-light text-success-foreground">
                  {getInitials(classInfo?.monitor || '-')}
                </div>
                <div>
                  <div className="font-medium">{classInfo?.monitor || '-'}</div>
                  <div className="text-sm text-muted-foreground">负责班级日常管理</div>
                </div>
              </div>
            </div>

            {/* 班委 */}
            <div className="bg-card rounded-xl p-4 shadow-card">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">班委成员</h4>
              <div className="space-y-3">
                {(classInfo?.committee || []).map((member: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="avatar bg-gradient-to-br from-accent to-accent-light">
                        {getInitials(member.name)}
                      </div>
                      <span>{member.name}</span>
                    </div>
                    <span className="tag tag-primary">{member.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 班级人员 */}
        {activeTab === 'members' && (
          <div className="space-y-2">
            {(classMembers || []).map(student => (
              <div
                key={student.id}
                className="bg-card rounded-xl p-4 shadow-card flex items-center gap-3"
              >
                <div className="avatar bg-gradient-to-br from-primary/80 to-primary">
                  {getInitials(student.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{student.name}</span>
                    {student.isExcellent && (
                      <Star className="w-4 h-4 text-warning fill-warning" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span className="truncate">{student.company} · {student.position}</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            ))}
          </div>
        )}

        {/* 优秀学员 */}
        {activeTab === 'excellent' && (
          <div className="grid grid-cols-3 gap-3">
            {(classMembers || []).filter(s => s.isExcellent).map(student => (
              <div key={student.id} className="bg-card rounded-xl p-4 shadow-card text-center">
                <div className="avatar avatar-lg mx-auto bg-gradient-to-br from-warning to-warning-light">
                  {getInitials(student.name)}
                </div>
                <div className="mt-2 font-medium text-sm">{student.name}</div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Star className="w-3 h-3 text-warning fill-warning" />
                  <span className="text-xs text-muted-foreground">优秀学员</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 班级圈 */}
        {activeTab === 'moments' && (
          <div className="space-y-4">
            {/* 发布框 */}
            <div className="bg-card rounded-xl p-4 shadow-card">
              <div className="flex items-center gap-3">
                <div className="avatar bg-gradient-to-br from-primary to-primary-dark">
                  张
                </div>
                <input
                  type="text"
                  placeholder="分享你的学习心得..."
                  className="flex-1 bg-muted rounded-lg px-4 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* 动态列表 */}
            {mockMoments.map((moment: any) => {
              const isLiked = likedMoments.has(moment.id) || moment.likes.includes('1')
              return (
                <div key={moment.id} className="bg-card rounded-xl p-4 shadow-card">
                  {/* 作者信息 */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="avatar bg-gradient-to-br from-primary/80 to-primary">
                      {getInitials(moment.author.name)}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{moment.author.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatRelativeTime(moment.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* 内容 */}
                  <p className="text-sm text-foreground mb-3">{moment.content}</p>

                  {/* 图片 */}
                  {moment.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {moment.images.map((img: any, index: number) => (
                        <div key={index} className="aspect-square rounded-lg bg-muted overflow-hidden">
                          <img
                            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=200&h=200&fit=crop"
                            alt=""
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 操作栏 */}
                  <div className="flex items-center gap-4 pt-3 border-t border-border/50">
                    <button
                      onClick={() => toggleLike(moment.id)}
                      className={cn(
                        'flex items-center gap-1.5 text-sm transition-colors',
                        isLiked ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'
                      )}
                    >
                      <Heart className={cn('w-4 h-4', isLiked && 'fill-current')} />
                      <span>{moment.likes.length + (isLiked && !moment.likes.includes('1') ? 1 : 0)}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <MessageSquare className="w-4 h-4" />
                      <span>{moment.comments.length}</span>
                    </button>
                  </div>

                  {/* 评论 */}
                  {moment.comments.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
                      {moment.comments.map((comment: any) => (
                        <div key={comment.id} className="flex items-start gap-2">
                          <div className="avatar avatar-sm bg-gradient-to-br from-accent/80 to-accent flex-shrink-0">
                            {getInitials(comment.author.name)}
                          </div>
                          <div className="flex-1">
                            <div className="bg-muted rounded-lg px-3 py-2">
                              <span className="font-medium text-sm">{comment.author.name}</span>
                              <span className="text-sm text-muted-foreground ml-2">{comment.content}</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {formatRelativeTime(comment.createdAt)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 评论输入 */}
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      placeholder="写下你的评论..."
                      className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
