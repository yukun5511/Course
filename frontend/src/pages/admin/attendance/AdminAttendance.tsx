import { useState, useEffect } from 'react'
import { Search, Plus, MapPin, QrCode, Eye, Edit, CheckCircle, XCircle, AlertCircle, Clock, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getCheckinList, getLeaveRecords } from '@/api/attendance'
import { getClassList } from '@/api/class'
import { success, warning } from '@/components/ui/Toast'

type TabType = 'checkin' | 'leave' | 'records' | 'stats'

export default function AdminAttendance() {
  const [activeTab, setActiveTab] = useState<TabType>('checkin')
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [attendanceList, setAttendanceList] = useState<any[]>([])
  const [checkInList, setCheckInList] = useState<any[]>([])
  const [leaveList, setLeaveList] = useState<any[]>([])
  const [classList, setClassList] = useState<any[]>([])
  const [page, setPage] = useState(1)

  const tabs: { id: TabType; label: string }[] = [
    { id: 'checkin', label: '打卡管理' },
    { id: 'leave', label: '请假管理' },
    { id: 'records', label: '出勤记录' },
    { id: 'stats', label: '出勤统计' }
  ]

  // 加载考勤数据
  const loadAttendanceData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'checkin' || activeTab === 'records') {
        const response = await getCheckinList({ page, size: 20 })
        const data = response.data
        setAttendanceList(data?.records || [])
      } else if (activeTab === 'leave') {
        const response = await getLeaveRecords({ page, size: 20 })
        const data = response.data
        setLeaveList(data?.records || [])
      }
    } catch (error) {
      console.error('加载考勤数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 加载班级列表
  const loadClasses = async () => {
    try {
      const response = await getClassList({ page: 1, size: 100 })
      const data = response.data
      setClassList(data?.records || [])
    } catch (error) {
      console.error('加载班级列表失败:', error)
    }
  }

  useEffect(() => {
    loadAttendanceData()
  }, [activeTab, page])

  useEffect(() => {
    loadClasses()
  }, [])

  // 处理创建打卡
  const handleCreateCheckin = () => {
    setShowCreateModal(true)
  }

  // 处理保存打卡
  const handleSaveCheckin = () => {
    success('打卡任务创建成功！')
    setShowCreateModal(false)
  }

  // 处理查看打卡详情
  const handleViewCheckin = (task: any) => {
    warning('查看打卡详情功能待开发')
  }

  // 处理编辑打卡
  const handleEditCheckin = (task: any) => {
    warning('编辑打卡任务功能待开发')
  }

  // 处理查看详情
  const handleViewDetail = (record: any) => {
    warning('查看详情功能待开发')
  }

  // 处理修改状态
  const handleModifyStatus = (record: any) => {
    warning('修改出勤状态功能待开发')
  }

  // 处理导出记录
  const handleExportRecords = () => {
    success('出勤记录导出成功！')
  }

  return (
    <div className="space-y-6">
      {/* Tab 切换 */}
      <div className="flex bg-card rounded-xl p-1 shadow-card w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-6 py-2 text-sm font-medium rounded-lg transition-all',
              activeTab === tab.id ? 'bg-primary text-white' : 'text-muted-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 打卡管理 */}
      {activeTab === 'checkin' && (
        <>
          <div className="flex items-center justify-between">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="搜索班级、课程..."
                className="input-base pl-10"
              />
            </div>
            <button
              onClick={handleCreateCheckin}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              创建打卡
            </button>
          </div>

          <div className="admin-card">
            <div className="admin-card-body">
              <div className="space-y-4">
                {/* 打卡任务示例 */}
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <QrCode className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">人工智能与商业应用 - 上午场</div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          上海·浦东 A301
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          09:00-12:00
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="tag tag-success">进行中</span>
                    <button 
                      onClick={() => handleViewCheckin({})}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                      title="查看详情"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleEditCheckin({})}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                      title="编辑"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 请假管理 */}
      {activeTab === 'leave' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="font-semibold">请假申请</h3>
          </div>
          <div className="admin-card-body">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>学员</th>
                  <th>课程</th>
                  <th>请假原因</th>
                  <th>申请时间</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-sm">
                        张
                      </div>
                      <span>张三</span>
                    </div>
                  </td>
                  <td>人工智能与商业应用</td>
                  <td>临时有重要会议冲突</td>
                  <td>2024-03-08</td>
                  <td>
                    <span className="tag tag-success">已批准</span>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleViewDetail({})}
                      className="text-sm text-primary hover:underline"
                    >
                      查看详情
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 出勤记录 */}
      {activeTab === 'records' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="font-semibold">出勤记录</h3>
            <button 
              onClick={handleExportRecords}
              className="btn-secondary text-sm flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              导出记录
            </button>
          </div>
          <div className="admin-card-body">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>学员</th>
                  <th>课程</th>
                  <th>日期</th>
                  <th>打卡时间</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-sm">
                        张
                      </div>
                      <span>张三</span>
                    </div>
                  </td>
                  <td>人工智能与商业应用</td>
                  <td>2024-03-10</td>
                  <td>08:55</td>
                  <td>
                    <span className="flex items-center gap-1 text-success">
                      <CheckCircle className="w-4 h-4" />
                      正常
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleModifyStatus({})}
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      修改状态
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-white text-sm">
                        李
                      </div>
                      <span>李四</span>
                    </div>
                  </td>
                  <td>人工智能与商业应用</td>
                  <td>2024-03-10</td>
                  <td>09:15</td>
                  <td>
                    <span className="flex items-center gap-1 text-warning">
                      <Clock className="w-4 h-4" />
                      迟到
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleModifyStatus({})}
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      修改状态
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-warning to-warning-light flex items-center justify-center text-white text-sm">
                        赵
                      </div>
                      <span>赵六</span>
                    </div>
                  </td>
                  <td>人工智能与商业应用</td>
                  <td>2024-03-10</td>
                  <td>-</td>
                  <td>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <AlertCircle className="w-4 h-4" />
                      请假
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleModifyStatus({})}
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      修改状态
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 出勤统计 */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          {/* 筛选条件 */}
          <div className="flex items-center gap-4">
            <select className="input-base w-48">
              <option value="">选择班级</option>
              {classList.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select className="input-base w-48">
              <option value="">选择课程</option>
              <option>人工智能与商业应用</option>
              <option>数字化转型战略</option>
            </select>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="stat-card text-center">
              <div className="stat-value text-success">10</div>
              <div className="stat-label">正常出勤</div>
            </div>
            <div className="stat-card text-center">
              <div className="stat-value text-warning">1</div>
              <div className="stat-label">迟到</div>
            </div>
            <div className="stat-card text-center">
              <div className="stat-value text-muted-foreground">1</div>
              <div className="stat-label">请假</div>
            </div>
            <div className="stat-card text-center">
              <div className="stat-value text-destructive">0</div>
              <div className="stat-label">缺勤</div>
            </div>
          </div>

          {/* 学员出勤详情 */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="font-semibold">学员出勤详情</h3>
            </div>
            <div className="admin-card-body">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>学员</th>
                    <th>总课程</th>
                    <th>出勤</th>
                    <th>迟到</th>
                    <th>请假</th>
                    <th>缺勤</th>
                    <th>出勤率</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-sm">
                          张
                        </div>
                        <span>张三</span>
                      </div>
                    </td>
                    <td>12</td>
                    <td className="text-success">10</td>
                    <td className="text-warning">1</td>
                    <td className="text-muted-foreground">1</td>
                    <td className="text-destructive">0</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-success rounded-full" style={{ width: '92%' }} />
                        </div>
                        <span className="text-sm">92%</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 创建打卡弹窗 */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="text-lg font-semibold">创建打卡</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-muted rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body space-y-4">
              <div className="form-group">
                <label className="form-label">选择班级</label>
                <select className="input-base">
                  <option value="">请选择班级</option>
                  {classList.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">选择课程</label>
                <select className="input-base">
                  <option value="">请选择课程</option>
                  <option>人工智能与商业应用</option>
                  <option>数字化转型战略</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">打卡位置</label>
                <input type="text" className="input-base" placeholder="请输入打卡地点名称" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">纬度</label>
                  <input type="number" step="0.000001" className="input-base" placeholder="31.230416" />
                </div>
                <div className="form-group">
                  <label className="form-label">经度</label>
                  <input type="number" step="0.000001" className="input-base" placeholder="121.473701" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">打卡半径 (米)</label>
                <input type="number" className="input-base" placeholder="100" defaultValue={100} />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowCreateModal(false)} className="btn-secondary">取消</button>
              <button onClick={handleSaveCheckin} className="btn-primary">创建并生成二维码</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
