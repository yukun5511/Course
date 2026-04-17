import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, Eye, Users, FileDown, MoreHorizontal } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { getClassList, createClass, updateClass } from '@/api/class'
import { UserInfo } from '@/api/auth'
import { success, error, warning } from '@/components/ui/Toast'
import { confirm } from '@/components/ui/ConfirmDialog'

export default function AdminClasses() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClass, setSelectedClass] = useState<any>(null)
  const [showClassDetail, setShowClassDetail] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showStudentsModal, setShowStudentsModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [classList, setClassList] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  
  // 创建班级表单
  const [createForm, setCreateForm] = useState({
    name: '',
    teacherId: '',
    teacherName: '',
    directorId: '',
    directorName: '',
  })
  
  // 编辑班级表单
  const [editForm, setEditForm] = useState({
    id: 0,
    name: '',
    teacherId: '',
    teacherName: '',
    directorId: '',
    directorName: '',
    status: '',
  })

  const statusConfig = {
    not_started: { label: '未开班', class: 'tag-muted' },
    ongoing: { label: '进行中', class: 'tag-primary' },
    graduated: { label: '已结业', class: 'tag-success' }
  }

  // 加载班级列表
  const loadClasses = async () => {
    setLoading(true)
    try {
      const response = await getClassList({
        keyword: searchTerm || undefined,
        page,
        size: 20,
      })
      const data = response.data
      setClassList(data?.records || [])
      setTotal(data?.total || 0)
    } catch (error) {
      console.error('加载班级列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 处理创建班级
  const handleCreateClass = async () => {
    if (!createForm.name) {
      error('请填写班级名称')
      return
    }
    
    setLoading(true)
    try {
      await createClass({
        name: createForm.name,
        teacherId: createForm.teacherId || undefined,
        teacherName: createForm.teacherName || undefined,
        academicDirectorId: createForm.directorId || undefined,
        academicDirectorName: createForm.directorName || undefined,
        status: 'not_started',
      })
      success('创建成功！')
      setShowCreateModal(false)
      setCreateForm({ name: '', teacherId: '', teacherName: '', directorId: '', directorName: '' })
      loadClasses()
    } catch (error: any) {
      error(error.message || '创建失败')
    } finally {
      setLoading(false)
    }
  }

  // 处理删除班级
  const handleDeleteClass = async (classId: number, className: string) => {
    const confirmed = await confirm(`确定要删除班级 "${className}" 吗？`, {
      title: '删除班级',
      type: 'danger',
      confirmText: '删除',
    })
    
    if (!confirmed) return

    try {
      // TODO: 添加 deleteClass API
      warning('删除功能待后端 API 支持')
      // await deleteClass(classId)
      // loadClasses()
    } catch (error: any) {
      error(error.message || '删除失败')
    }
  }

  // 处理打开编辑弹窗
  const handleOpenEdit = (classItem: any) => {
    setSelectedClass(classItem)
    setEditForm({
      id: classItem.id || 0,
      name: classItem.name || '',
      teacherId: classItem.teacherId?.toString() || '',
      teacherName: classItem.teacherName || classItem.director || '',
      directorId: classItem.academicDirectorId?.toString() || '',
      directorName: classItem.academicDirectorName || '',
      status: classItem.status || 'not_started',
    })
    setShowEditModal(true)
  }

  // 处理保存编辑
  const handleSaveEdit = async () => {
    if (!editForm.name) {
      error('请填写班级名称')
      return
    }

    setLoading(true)
    try {
      await updateClass(editForm.id, {
        name: editForm.name,
        teacherId: editForm.teacherId || undefined,
        teacherName: editForm.teacherName || undefined,
        academicDirectorId: editForm.directorId || undefined,
        academicDirectorName: editForm.directorName || undefined,
        status: editForm.status || undefined,
      })
      success('更新成功！')
      setShowEditModal(false)
      loadClasses()
    } catch (error: any) {
      error(error.message || '更新失败')
    } finally {
      setLoading(false)
    }
  }

  // 处理打开学员管理
  const handleOpenStudents = (classItem: any) => {
    setSelectedClass(classItem)
    setShowStudentsModal(true)
  }

  useEffect(() => {
    loadClasses()
  }, [page])

  return (
    <div className="space-y-6">
      {/* 操作栏 */}
      <div className="flex items-center justify-between">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="搜索班级名称、班主任..."
            className="input-base pl-10"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <FileDown className="w-4 h-4" />
            导出Excel
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            创建班级
          </button>
        </div>
      </div>

      {/* 班级列表 */}
      {loading ? (
        <div className="text-center py-8 text-muted-foreground">加载中...</div>
      ) : classList.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">暂无数据</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classList.map(classItem => {
          const status = statusConfig[classItem.status as keyof typeof statusConfig] || statusConfig.not_started
          return (
            <div key={classItem.id} className="admin-card card-hover">
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{classItem.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">第{classItem.period || 1}期</p>
                  </div>
                  <span className={cn('tag', status.class)}>{status.label}</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">班主任</span>
                    <span className="font-medium">{classItem.director || '未设置'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">班长</span>
                    <span className="font-medium">{classItem.monitor || '未设置'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">学员人数</span>
                    <span className="font-medium">{classItem.students?.length || 0} 人</span>
                  </div>
                </div>

                <div className="divider" />

                {/* 学习概览 */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-lg font-bold text-success">94%</div>
                    <div className="text-xs text-muted-foreground">出勤率</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-primary">87%</div>
                    <div className="text-xs text-muted-foreground">作业完成</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-accent">96%</div>
                    <div className="text-xs text-muted-foreground">到课率</div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                  <button
                    onClick={() => { setSelectedClass(classItem); setShowClassDetail(true); }}
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    查看详情
                  </button>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleOpenEdit(classItem)}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                      title="编辑"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleOpenStudents(classItem)}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                      title="学员管理"
                    >
                      <Users className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteClass(classItem.id, classItem.name)}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-destructive"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        </div>
      )}

      {/* 班级详情弹窗 */}
      {showClassDetail && selectedClass && (
        <div className="modal-overlay" onClick={() => setShowClassDetail(false)}>
          <div className="modal-content max-w-2xl" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="text-lg font-semibold">{selectedClass.name}</h3>
              <button onClick={() => setShowClassDetail(false)} className="p-1 hover:bg-muted rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              {/* 班级信息 */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-xs text-muted-foreground">班主任</div>
                  <div className="font-medium">{selectedClass.director}</div>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-xs text-muted-foreground">班长</div>
                  <div className="font-medium">{selectedClass.monitor}</div>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-xs text-muted-foreground">期数</div>
                  <div className="font-medium">第{selectedClass.period}期</div>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-xs text-muted-foreground">状态</div>
                  <div className="font-medium">{statusConfig[selectedClass.status as keyof typeof statusConfig]?.label || '-'}</div>
                </div>
              </div>

              {/* 班委 */}
              {selectedClass.committee.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium mb-3">班委成员</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedClass.committee.map((member: any, index: number) => (
                      <span key={index} className="tag tag-primary">
                        {member.name} - {member.role}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 学员列表 */}
              <div>
                <h4 className="font-medium mb-3">学员列表 ({selectedClass.students.length})</h4>
                <div className="space-y-2 max-h-60 overflow-auto">
                  {selectedClass.students.map((student: any) => (
                    <div key={student.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-white text-sm">
                        {student.name[0]}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{student.name}</div>
                        <div className="text-xs text-muted-foreground">{student.company} · {student.position}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowClassDetail(false)} className="btn-secondary">关闭</button>
              <button onClick={() => { setShowClassDetail(false); handleOpenEdit(selectedClass); }} className="btn-primary">编辑班级</button>
            </div>
          </div>
        </div>
      )}

      {/* 编辑班级弹窗 */}
      {showEditModal && selectedClass && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="text-lg font-semibold">编辑班级</h3>
              <button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-muted rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">班级名称 *</label>
                <input
                  type="text"
                  className="input-base"
                  value={editForm.name}
                  onChange={e => setEditForm({...editForm, name: e.target.value})}
                  placeholder="请输入班级名称"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">班主任 ID</label>
                  <input
                    type="text"
                    className="input-base"
                    value={editForm.directorId}
                    onChange={e => setEditForm({...editForm, directorId: e.target.value})}
                    placeholder="选填"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">班主任姓名</label>
                  <input
                    type="text"
                    className="input-base"
                    value={editForm.directorName}
                    onChange={e => setEditForm({...editForm, directorName: e.target.value})}
                    placeholder="选填"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">班长 ID</label>
                  <input
                    type="text"
                    className="input-base"
                    value={editForm.teacherId}
                    onChange={e => setEditForm({...editForm, teacherId: e.target.value})}
                    placeholder="选填"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">班长姓名</label>
                  <input
                    type="text"
                    className="input-base"
                    value={editForm.teacherName}
                    onChange={e => setEditForm({...editForm, teacherName: e.target.value})}
                    placeholder="选填"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">班级状态</label>
                <select
                  className="input-base"
                  value={editForm.status}
                  onChange={e => setEditForm({...editForm, status: e.target.value})}
                >
                  <option value="not_started">未开班</option>
                  <option value="ongoing">进行中</option>
                  <option value="graduated">已结业</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowEditModal(false)} className="btn-secondary">取消</button>
              <button 
                onClick={handleSaveEdit}
                disabled={loading || !editForm.name}
                className="btn-primary"
              >
                {loading ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 学员管理弹窗 */}
      {showStudentsModal && selectedClass && (
        <div className="modal-overlay" onClick={() => setShowStudentsModal(false)}>
          <div className="modal-content max-w-2xl" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="text-lg font-semibold">{selectedClass.name} - 学员管理</h3>
              <button onClick={() => setShowStudentsModal(false)} className="p-1 hover:bg-muted rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>学员管理功能开发中...</p>
                <p className="text-sm mt-2">支持批量添加、删除、分班等操作</p>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowStudentsModal(false)} className="btn-secondary">关闭</button>
            </div>
          </div>
        </div>
      )}

      {/* 创建班级弹窗 */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="text-lg font-semibold">创建班级</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-muted rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body space-y-4">
              <div className="form-group">
                <label className="form-label">班级名称 *</label>
                <input 
                  type="text" 
                  className="input-base" 
                  placeholder="请输入班级名称"
                  value={createForm.name}
                  onChange={e => setCreateForm({...createForm, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">导师 ID</label>
                <input 
                  type="text" 
                  className="input-base" 
                  placeholder="请输入导师 ID"
                  value={createForm.teacherId}
                  onChange={e => setCreateForm({...createForm, teacherId: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">导师姓名</label>
                <input 
                  type="text" 
                  className="input-base" 
                  placeholder="请输入导师姓名"
                  value={createForm.teacherName}
                  onChange={e => setCreateForm({...createForm, teacherName: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">学术主任 ID</label>
                <input 
                  type="text" 
                  className="input-base" 
                  placeholder="请输入学术主任 ID"
                  value={createForm.directorId}
                  onChange={e => setCreateForm({...createForm, directorId: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">学术主任姓名</label>
                <input 
                  type="text" 
                  className="input-base" 
                  placeholder="请输入学术主任姓名"
                  value={createForm.directorName}
                  onChange={e => setCreateForm({...createForm, directorName: e.target.value})}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowCreateModal(false)} className="btn-secondary">取消</button>
              <button 
                onClick={handleCreateClass}
                disabled={loading || !createForm.name}
                className="btn-primary"
              >
                {loading ? '创建中...' : '创建'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
