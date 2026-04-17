import { Users, GraduationCap, BookOpen, TrendingUp, TrendingDown, Star, Award } from 'lucide-react'
import { mockDashboardStats, mockPointsLogs, mockBadgeRankings } from '@/data/mockData'
import { cn } from '@/lib/utils'

export default function AdminDashboard() {
  const stats = mockDashboardStats

  const statCards = [
    {
      label: '学员总数',
      value: stats.totalStudents,
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      change: '+12%',
      trend: 'up'
    },
    {
      label: '班级数量',
      value: stats.totalClasses,
      icon: GraduationCap,
      color: 'text-green-500',
      bg: 'bg-green-50',
      change: '+2',
      trend: 'up'
    },
    {
      label: '课程总数',
      value: stats.totalCourses,
      icon: BookOpen,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
      change: '+5',
      trend: 'up'
    },
    {
      label: '出勤率',
      value: `${stats.attendanceRate}%`,
      icon: Award,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
      change: '+2.3%',
      trend: 'up'
    }
  ]

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div key={index} className="stat-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="stat-label">{card.label}</p>
                  <p className="stat-value mt-1">{card.value}</p>
                  <div className={cn('stat-change flex items-center gap-1', card.trend === 'up' ? 'stat-change-up' : 'stat-change-down')}>
                    {card.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{card.change}</span>
                  </div>
                </div>
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', card.bg, card.color)}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 教学数据概览 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 出勤率 */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="font-semibold">教学数据概览</h3>
          </div>
          <div className="admin-card-body space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">出勤率</span>
                <span className="text-sm font-medium">{stats.attendanceRate}%</span>
              </div>
              <div className="progress-bar h-3">
                <div className="progress-bar-fill bg-success" style={{ width: `${stats.attendanceRate}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">作业完成率</span>
                <span className="text-sm font-medium">{stats.assignmentCompletionRate}%</span>
              </div>
              <div className="progress-bar h-3">
                <div className="progress-bar-fill" style={{ width: `${stats.assignmentCompletionRate}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">课程上座率</span>
                <span className="text-sm font-medium">{stats.courseOccupancyRate}%</span>
              </div>
              <div className="progress-bar h-3">
                <div className="progress-bar-fill bg-accent" style={{ width: `${stats.courseOccupancyRate}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* 导师数据 */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="font-semibold">导师数据</h3>
          </div>
          <div className="admin-card-body">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>导师</th>
                  <th>评分</th>
                  <th>课程数</th>
                </tr>
              </thead>
              <tbody>
                {stats.instructorData.map((instructor, index) => (
                  <tr key={index}>
                    <td className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
                        {instructor.name[0]}
                      </div>
                      <span>{instructor.name}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-warning fill-warning" />
                        <span>{instructor.rating}</span>
                      </div>
                    </td>
                    <td>{instructor.courses} 门</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 积分排行 & 近期积分日志 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 徽章排行 */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="font-semibold">徽章排行</h3>
          </div>
          <div className="admin-card-body">
            <div className="space-y-3">
              {mockBadgeRankings.slice(0, 5).map((user, index) => (
                <div key={user.userId} className="flex items-center gap-3">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                    index === 0 ? 'bg-warning text-white' :
                    index === 1 ? 'bg-muted-foreground/20 text-muted-foreground' :
                    index === 2 ? 'bg-orange-200 text-orange-700' :
                    'bg-muted text-muted-foreground'
                  )}>
                    {user.rank}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-sm font-medium">
                    {user.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{user.name}</div>
                  </div>
                  <div className="flex items-center gap-1 text-warning">
                    <Award className="w-4 h-4" />
                    <span className="font-medium">{user.badges}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 近期积分日志 */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="font-semibold">近期积分日志</h3>
          </div>
          <div className="admin-card-body">
            <div className="space-y-3">
              {mockPointsLogs.slice(0, 5).map(log => (
                <div key={log.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div>
                    <div className="font-medium text-sm">{log.userName}</div>
                    <div className="text-xs text-muted-foreground">{log.reason}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-success">+{log.points}</div>
                    <div className="text-xs text-muted-foreground">{log.createdAt}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
