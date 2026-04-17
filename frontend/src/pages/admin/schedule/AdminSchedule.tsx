import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, Eye, Calendar, Clock, MapPin, User, Send, MoreHorizontal } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { getCourseList, createCourse, updateCourse, deleteCourse } from '@/api/course'
import { getClassList } from '@/api/class'
import { success, error } from '@/components/ui/Toast'
import { confirm } from '@/components/ui/ConfirmDialog'

type TabType = 'schedule' | 'singleCourse'

export default function AdminSchedule() {
  const [activeTab, setActiveTab] = useState<TabType>('schedule')
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<any>(null)
  const [showCourseDetail, setShowCourseDetail] = useState(false)
  const [loading, setLoading] = useState(false)
  const [courseList, setCourseList] = useState<any[]>([])
  const [classList, setClassList] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  
  // 创建课程表单
  const [createForm, setCreateForm] = useState({
    name: '',
    instructor: '',
    instructorId: '',
    location: '',
    startDate: '',
    endDate: '',
    classId: '',
  })

  // 加载课程列表
  const loadCourses = async () => {
    setLoading(true)
    try {
      const response = await getCourseList({
        keyword: searchTerm || undefined,
        page,
        size: 20,
      })
      const data = response.data
      setCourseList(data?.records || [])
      setTotal(data?.total || 0)
    } catch (error) {
      console.error('加载课程列表失败:', error)
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
    loadCourses()
  }, [page])

  useEffect(() => {
    loadClasses()
  }, [])

  // 处理创建课程
  const handleCreateCourse = async () => {
    if (!createForm.name || !createForm.classId) {
      error('请填写课程名称和选择班级')
      return
    }
    
    setLoading(true)
    try {
      await createCourse({
        name: createForm.name,
        teacherName: createForm.instructor,
        teacherId: createForm.instructorId || undefined,
        location: createForm.location || undefined,
        startTime: createForm.startDate || undefined,
        endTime: createForm.endDate || undefined,
        classId: parseInt(createForm.classId),
        status: 'ongoing',
      })
      success('创建成功！')
      setShowCreateModal(false)
      setCreateForm({ name: '', instructor: '', instructorId: '', location: '', startDate: '', endDate: '', classId: '' })
      loadCourses()
    } catch (error: any) {
      error(error.message || '创建失败')
    } finally {
      setLoading(false)
    }
  }

  // 处理删除课程
  const handleDeleteCourse = async (courseId: number, courseName: string) => {
    const confirmed = await confirm(`确定要删除课程 "${courseName}" 吗？`, {
      title: '删除课程',
      type: 'danger',
      confirmText: '删除',
    })
    
    if (!confirmed) return

    try {
      await deleteCourse(courseId)
      success('删除成功！')
      loadCourses()
    } catch (error: any) {
      error(error.message || '删除失败')
    }
  }

  return (
    <div className="space-y-6">
      {/* Tab 切换 */}
      <div className="flex items-center justify-between">
        <div className="flex bg-card rounded-xl p-1 shadow-card">
          <button
            onClick={() => setActiveTab('schedule')}
            className={cn(
              'px-6 py-2 text-sm font-medium rounded-lg transition-all',
              activeTab === 'schedule' ? 'bg-primary text-white' : 'text-muted-foreground'
            )}
          >
            课表管理
          </button>
          <button
            onClick={() => setActiveTab('singleCourse')}
            className={cn(
              'px-6 py-2 text-sm font-medium rounded-lg transition-all',
              activeTab === 'singleCourse' ? 'bg-primary text-white' : 'text-muted-foreground'
            )}
          >
            单课管理
          </button>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          创建课表
        </button>
      </div>

      {/* 搜索栏 */}
      <div className="admin-card">
        <div className="admin-card-body">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="搜索课程名称、导师..."
              className="input-base pl-10"
            />
          </div>
        </div>
      </div>

      {/* 课表管理 */}
      {activeTab === 'schedule' && (
        <div className="admin-card">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>课程名称</th>
                  <th>期数</th>
                  <th>时间</th>
                  <th>地点</th>
                  <th>导师</th>
                  <th>绑定班级</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-muted-foreground">加载中...</td>
                  </tr>
                ) : courseList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-muted-foreground">暂无数据</td>
                  </tr>
                ) : (
                  courseList.map(course => (
                    <tr key={course.id}>
                    <td>
                      <div className="font-medium">{course.name}</div>
                      {course.credits && (
                        <div className="text-xs text-muted-foreground">{course.credits} 学分</div>
                      )}
                    </td>
                    <td>
                      <span className="tag tag-primary">第{course.period || 1}期</span>
                    </td>
                    <td>
                      <div className="text-sm">{course.startDate ? formatDate(course.startDate) : '-'}</div>
                      <div className="text-xs text-muted-foreground">{course.endDate ? `至 ${formatDate(course.endDate)}` : ''}</div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                        {course.location || '-'}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 text-sm">
                        <User className="w-3.5 h-3.5 text-muted-foreground" />
                        {course.instructor || course.teacherName || '-'}
                      </div>
                    </td>
                    <td>
                      {course.classId ? (
                        <span className="text-sm">
                          {classList.find(c => c.id === course.classId)?.name || '-'}
                        </span>
                      ) : '-'}
                    </td>
                    <td>
                      <span className={cn(
                        'tag',
                        course.status === 'ongoing' ? 'tag-primary' :
                        course.status === 'ended' ? 'tag-muted' : 'tag-warning'
                      )}>
                        {course.status === 'ongoing' ? '进行中' :
                         course.status === 'ended' ? '已结束' : '待开始'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { setSelectedCourse(course); setShowCourseDetail(true); }}
                          className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                          title="查看详情"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary" title="编辑">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary" title="发送行程确认">
                          <Send className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-destructive" title="删除">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 单课管理 */}
      {activeTab === 'singleCourse' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="font-semibold">单课列表</h3>
            <button className="btn-primary text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" />
              添加单课
            </button>
          </div>
          <div className="admin-card-body">
            <div className="space-y-3">
              {/* TODO: 单课列表从 API 加载 */}
              <div className="text-center py-8 text-muted-foreground">单课管理功能开发中...</div>
            </div>
          </div>
        </div>
      )}

      {/* 创建课表弹窗 */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="text-lg font-semibold">创建课表</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-muted rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body space-y-4">
              <div className="form-group">
                <label className="form-label">课程名称</label>
                <input 
                  type="text" 
                  className="input-base" 
                  placeholder="请输入课程名称" 
                  value={createForm.name}
                  onChange={e => setCreateForm({...createForm, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">开课时间</label>
                  <input 
                    type="date" 
                    className="input-base" 
                    value={createForm.startDate}
                    onChange={e => setCreateForm({...createForm, startDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">结课时间</label>
                  <input 
                    type="date" 
                    className="input-base" 
                    value={createForm.endDate}
                    onChange={e => setCreateForm({...createForm, endDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">开课地点</label>
                <input 
                  type="text" 
                  className="input-base" 
                  placeholder="请输入开课地点" 
                  value={createForm.location}
                  onChange={e => setCreateForm({...createForm, location: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">导师</label>
                <input 
                  type="text" 
                  className="input-base" 
                  placeholder="请输入导师姓名" 
                  value={createForm.instructor}
                  onChange={e => setCreateForm({...createForm, instructor: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">绑定班级</label>
                <select 
                  className="input-base"
                  value={createForm.classId}
                  onChange={e => setCreateForm({...createForm, classId: e.target.value})}
                >
                  <option value="">请选择班级</option>
                  {classList.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowCreateModal(false)} className="btn-secondary">取消</button>
              <button onClick={handleCreateCourse} className="btn-primary" disabled={loading}>
                {loading ? '创建中...' : '创建'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
