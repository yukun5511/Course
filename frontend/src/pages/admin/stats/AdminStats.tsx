import { useState, useEffect } from 'react'
import { TrendingUp, Users, Award, BookOpen, Calendar } from 'lucide-react'
import { getDashboardStats, getAttendanceRateStats, getAssignmentCompletionStats, getCourseOccupancyStats } from '@/api/stats'
import { error } from '@/components/ui/Toast'

export default function AdminStats() {
  const [dashboardStats, setDashboardStats] = useState<any>(null)
  const [attendanceStats, setAttendanceStats] = useState<any>(null)
  const [assignmentStats, setAssignmentStats] = useState<any>(null)
  const [occupancyStats, setOccupancyStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    setLoading(true)
    try {
      const [dashboard, attendance, assignment, occupancy] = await Promise.all([
        getDashboardStats(),
        getAttendanceRateStats(),
        getAssignmentCompletionStats(),
        getCourseOccupancyStats(),
      ])
      
      setDashboardStats(dashboard.data)
      setAttendanceStats(attendance.data)
      setAssignmentStats(assignment.data)
      setOccupancyStats(occupancy.data)
    } catch (err: any) {
      error(err.message || '加载统计数据失败')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 概览统计 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <div>
              <div className="stat-label">平均出勤率</div>
              <div className="stat-value">{dashboardStats?.attendanceRate || 0}%</div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="stat-label">作业完成率</div>
              <div className="stat-value">{dashboardStats?.assignmentCompletion || 0}%</div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <div>
              <div className="stat-label">课程上座率</div>
              <div className="stat-value">{dashboardStats?.occupancyRate || 0}%</div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <Award className="w-6 h-6 text-warning" />
            </div>
            <div>
              <div className="stat-label">平均评分</div>
              <div className="stat-value">{dashboardStats?.avgRating || 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 出勤率统计 */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="font-semibold">出勤率统计</h3>
        </div>
        <div className="admin-card-body">
          {attendanceStats ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">总体出勤率</span>
                <span className="text-2xl font-bold text-success">{attendanceStats.rate}%</span>
              </div>
              <div className="progress-bar h-4">
                <div className="progress-bar-fill bg-success" style={{ width: `${attendanceStats.rate}%` }} />
              </div>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="text-2xl font-bold text-success">{attendanceStats.normal}</div>
                  <div className="text-sm text-muted-foreground">正常</div>
                </div>
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="text-2xl font-bold text-warning">{attendanceStats.late}</div>
                  <div className="text-sm text-muted-foreground">迟到</div>
                </div>
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="text-2xl font-bold text-destructive">{attendanceStats.absent}</div>
                  <div className="text-sm text-muted-foreground">缺勤</div>
                </div>
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="text-2xl font-bold text-muted-foreground">{attendanceStats.leave}</div>
                  <div className="text-sm text-muted-foreground">请假</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">暂无数据</div>
          )}
        </div>
      </div>

      {/* 作业完成率统计 */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="font-semibold">作业完成率统计</h3>
        </div>
        <div className="admin-card-body">
          {assignmentStats ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">总体完成率</span>
                <span className="text-2xl font-bold text-primary">{assignmentStats.completionRate}%</span>
              </div>
              <div className="progress-bar h-4">
                <div className="progress-bar-fill" style={{ width: `${assignmentStats.completionRate}%` }} />
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="text-2xl font-bold text-success">{assignmentStats.submitted}</div>
                  <div className="text-sm text-muted-foreground">已提交</div>
                </div>
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="text-2xl font-bold text-warning">{assignmentStats.pending}</div>
                  <div className="text-sm text-muted-foreground">待提交</div>
                </div>
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="text-2xl font-bold text-destructive">{assignmentStats.overdue}</div>
                  <div className="text-sm text-muted-foreground">已逾期</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">暂无数据</div>
          )}
        </div>
      </div>

      {/* 课程上座率统计 */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="font-semibold">课程上座率统计</h3>
        </div>
        <div className="admin-card-body">
          {occupancyStats ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">平均上座率</span>
                <span className="text-2xl font-bold text-accent">{occupancyStats.avgOccupancy}%</span>
              </div>
              <div className="progress-bar h-4">
                <div className="progress-bar-fill bg-accent" style={{ width: `${occupancyStats.avgOccupancy}%` }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="text-sm text-muted-foreground mb-1">最高上座率</div>
                  <div className="text-xl font-bold text-accent">{occupancyStats.maxOccupancy}%</div>
                </div>
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="text-sm text-muted-foreground mb-1">最低上座率</div>
                  <div className="text-xl font-bold text-muted-foreground">{occupancyStats.minOccupancy}%</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">暂无数据</div>
          )}
        </div>
      </div>

      {/* 数据更新时间 */}
      <div className="text-center text-sm text-muted-foreground">
        <Calendar className="w-4 h-4 inline mr-1" />
        数据更新时间：{new Date().toLocaleString()}
      </div>
    </div>
  )
}
