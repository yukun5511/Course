import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, Eye, MoreHorizontal, UserCheck, UserX, RotateCcw, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { mockClasses } from '@/data/mockData'
import { getUserList, createUser, updateUser, deleteUser, updateUserStatus, resetPassword } from '@/api/user'
import { getClassList } from '@/api/class'
import { UserInfo } from '@/api/auth'
import { success, error, warning } from '@/components/ui/Toast'
import { confirm } from '@/components/ui/ConfirmDialog'

type TabType = 'students' | 'instructors'

export default function AdminUsers() {
  const [activeTab, setActiveTab] = useState<TabType>('students')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null)
  const [showUserDetail, setShowUserDetail] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userList, setUserList] = useState<UserInfo[]>([])
  const [classList, setClassList] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  
  // 添加学员表单
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    phone: '',
    email: '',
    company: '',
    position: '',
    classId: '',
    password: '123456', // 默认密码
  })
  
  // 编辑表单
  const [editForm, setEditForm] = useState({
    id: 0,
    studentId: '',
    name: '',
    phone: '',
    email: '',
    company: '',
    position: '',
    classId: '',
    status: '',
  })

  // 加载用户列表
  const loadUsers = async () => {
    setLoading(true)
    try {
      const response = await getUserList({
        name: searchTerm || undefined,
        role: activeTab === 'students' ? 'student' : 'instructor',
        page,
        size: 20,
      })
      const data = response.data
      setUserList(data?.records || [])
      setTotal(data?.total || 0)
    } catch (error) {
      console.error('加载用户列表失败:', error)
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
    loadUsers()
  }, [activeTab, page])

  useEffect(() => {
    loadClasses()
  }, [])

  // 处理添加学员
  const handleAddUser = async () => {
    if (!formData.studentId || !formData.name) {
      error('请填写学号和姓名')
      return
    }

    setLoading(true)
    try {
      await createUser({
        studentId: formData.studentId,
        name: formData.name,
        password: formData.password,
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        company: formData.company || undefined,
        position: formData.position || undefined,
        classId: formData.classId ? parseInt(formData.classId) : undefined,
        role: activeTab === 'students' ? 'student' : 'instructor',
        status: 'active',
      })
      
      success('添加成功！')
      
      // 重置表单
      setFormData({
        studentId: '',
        name: '',
        phone: '',
        email: '',
        company: '',
        position: '',
        classId: '',
        password: '123456',
      })
      setShowAddModal(false)
      
      // 刷新用户列表
      loadUsers()
    } catch (error: any) {
      error(error.message || '添加失败')
    } finally {
      setLoading(false)
    }
  }

  // 处理删除用户
  const handleDeleteUser = async (userId: number, userName: string) => {
    const confirmed = await confirm(`确定要删除用户 "${userName}" 吗？`, {
      title: '删除用户',
      type: 'danger',
      confirmText: '删除',
    })
    
    if (!confirmed) return

    try {
      await deleteUser(userId)
      success('删除成功！')
      loadUsers()
    } catch (error: any) {
      error(error.message || '删除失败')
    }
  }

  // 处理状态切换
  const handleToggleStatus = async (userId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'disabled' : 'active'
    try {
      await updateUserStatus(userId, newStatus)
      success('状态更新成功！')
      loadUsers()
    } catch (error: any) {
      error(error.message || '状态更新失败')
    }
  }

  // 处理密码重置
  const handleResetPassword = async (userId: number, userName: string) => {
    const confirmed = await confirm(`确定要重置用户 "${userName}" 的密码吗？`, {
      title: '重置密码',
      type: 'warning',
      confirmText: '重置',
    })
    
    if (!confirmed) return

    try {
      await resetPassword(userId, '123456')
      success('密码重置成功！新密码：123456')
    } catch (error: any) {
      error(error.message || '密码重置失败')
    }
  }

  // 处理打开编辑弹窗
  const handleOpenEdit = (user: UserInfo) => {
    setSelectedUser(user)
    setEditForm({
      id: user.id || 0,
      studentId: user.studentId || '',
      name: user.name || '',
      phone: user.phone || '',
      email: user.email || '',
      company: user.company || '',
      position: user.position || '',
      classId: user.classId?.toString() || '',
      status: user.status || 'active',
    })
    setShowEditModal(true)
  }

  // 处理保存编辑
  const handleSaveEdit = async () => {
    if (!editForm.name) {
      error('请填写姓名')
      return
    }

    setLoading(true)
    try {
      await updateUser(editForm.id, {
        name: editForm.name,
        phone: editForm.phone || undefined,
        email: editForm.email || undefined,
        company: editForm.company || undefined,
        position: editForm.position || undefined,
        classId: editForm.classId ? parseInt(editForm.classId) : undefined,
        status: editForm.status || undefined,
      })
      success('更新成功！')
      setShowEditModal(false)
      loadUsers()
    } catch (error: any) {
      error(error.message || '更新失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Tab 切换 */}
      <div className="flex items-center justify-between">
        <div className="flex bg-card rounded-xl p-1 shadow-card">
          <button
            onClick={() => setActiveTab('students')}
            className={cn(
              'px-6 py-2 text-sm font-medium rounded-lg transition-all',
              activeTab === 'students' ? 'bg-primary text-white' : 'text-muted-foreground'
            )}
          >
            学员管理
          </button>
          <button
            onClick={() => setActiveTab('instructors')}
            className={cn(
              'px-6 py-2 text-sm font-medium rounded-lg transition-all',
              activeTab === 'instructors' ? 'bg-primary text-white' : 'text-muted-foreground'
            )}
          >
            导师管理
          </button>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          添加{activeTab === 'students' ? '学员' : '导师'}
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
              placeholder="搜索姓名、公司、学号..."
              className="input-base pl-10"
            />
          </div>
        </div>
      </div>

      {/* 数据表格 */}
      <div className="admin-card">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>学员信息</th>
                <th>公司/职位</th>
                <th>班级</th>
                <th>积分/徽章</th>
                <th>状态</th>
                <th>账号状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-muted-foreground">
                    加载中...
                  </td>
                </tr>
              ) : userList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-muted-foreground">
                    暂无数据
                  </td>
                </tr>
              ) : (
                userList.map(user => (
                  <tr key={user.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-medium">
                        {user.name[0]}
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.studentId || '-'}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm">{user.company}</div>
                    <div className="text-xs text-muted-foreground">{user.position}</div>
                  </td>
                  <td>
                    {user.classId ? (
                      <span className="tag tag-primary">
                        {classList.find(c => c.id === user.classId)?.name || '-'}
                      </span>
                    ) : '-'}
                  </td>
                  <td>
                    <div className="text-sm">{user.points} 分</div>
                    <div className="text-xs text-muted-foreground">{user.badges} 徽章</div>
                  </td>
                  <td>
                    <span className={cn(
                      'tag',
                      user.status === 'active' ? 'tag-success' :
                      user.status === 'graduated' ? 'tag-muted' : 'tag-warning'
                    )}>
                      {user.status === 'active' ? '在读' :
                       user.status === 'graduated' ? '结业' : '退学'}
                    </span>
                  </td>
                  <td>
                    <span className={cn(
                      'flex items-center gap-1 text-sm',
                      user.role === 'student' ? 'text-success' : 'text-muted-foreground'
                    )}>
                      {user.role === 'student' ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                      {user.role === 'student' ? '启用' : '禁用'}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { setSelectedUser(user); setShowUserDetail(true); }}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                        title="查看详情"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(user)}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                        title="编辑"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleToggleStatus(user.id!, user.status || 'active')}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-destructive" 
                        title={user.status === 'active' ? '禁用' : '启用'}
                      >
                        {user.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => handleResetPassword(user.id!, user.name)}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary" 
                        title="重置密码"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id!, user.name)}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-destructive" 
                        title="删除"
                      >
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

      {/* 添加学员弹窗 */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="text-lg font-semibold">添加{activeTab === 'students' ? '学员' : '导师'}</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="modal-body space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">学号 *</label>
                  <input
                    type="text"
                    value={formData.studentId}
                    onChange={e => setFormData({...formData, studentId: e.target.value})}
                    placeholder="请输入学号"
                    className="input-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">姓名 *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="请输入姓名"
                    className="input-base"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">手机号</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    placeholder="请输入手机号"
                    className="input-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">邮箱</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="请输入邮箱"
                    className="input-base"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">公司</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={e => setFormData({...formData, company: e.target.value})}
                    placeholder="请输入公司"
                    className="input-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">职位</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={e => setFormData({...formData, position: e.target.value})}
                    placeholder="请输入职位"
                    className="input-base"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">班级</label>
                <select
                  value={formData.classId}
                  onChange={e => setFormData({...formData, classId: e.target.value})}
                  className="input-base"
                >
                  <option value="">请选择班级</option>
                  {classList.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>提示：</strong>默认密码为 <code className="bg-blue-100 px-2 py-0.5 rounded">123456</code>，学员首次登录后请提醒修改密码。
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowAddModal(false)} className="btn-secondary">取消</button>
              <button 
                onClick={handleAddUser}
                disabled={loading || !formData.studentId || !formData.name}
                className="btn-primary"
              >
                {loading ? '添加中...' : '确认添加'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 编辑用户弹窗 */}
      {showEditModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="text-lg font-semibold">编辑{activeTab === 'students' ? '学员' : '导师'}</h3>
              <button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="modal-body space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">学号</label>
                  <input
                    type="text"
                    className="input-base"
                    value={editForm.studentId}
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">姓名 *</label>
                  <input
                    type="text"
                    className="input-base"
                    value={editForm.name}
                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">手机号</label>
                  <input
                    type="text"
                    className="input-base"
                    value={editForm.phone}
                    onChange={e => setEditForm({...editForm, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">邮箱</label>
                  <input
                    type="email"
                    className="input-base"
                    value={editForm.email}
                    onChange={e => setEditForm({...editForm, email: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">公司</label>
                  <input
                    type="text"
                    className="input-base"
                    value={editForm.company}
                    onChange={e => setEditForm({...editForm, company: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">职位</label>
                  <input
                    type="text"
                    className="input-base"
                    value={editForm.position}
                    onChange={e => setEditForm({...editForm, position: e.target.value})}
                  />
                </div>
              </div>
              
              {activeTab === 'students' && (
                <div>
                  <label className="block text-sm font-medium mb-1">班级</label>
                  <select
                    className="input-base"
                    value={editForm.classId}
                    onChange={e => setEditForm({...editForm, classId: e.target.value})}
                  >
                    <option value="">不分配</option>
                    {classList.map(cls => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-1">状态</label>
                <select
                  className="input-base"
                  value={editForm.status}
                  onChange={e => setEditForm({...editForm, status: e.target.value})}
                >
                  <option value="active">在读</option>
                  <option value="graduated">结业</option>
                  <option value="dropped">退学</option>
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
      
      {/* 用户详情弹窗 */}
      {showUserDetail && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowUserDetail(false)}>
          <div className="modal-content max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="text-lg font-semibold">学员详情</h3>
              <button onClick={() => setShowUserDetail(false)} className="p-1 hover:bg-muted rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-2xl font-bold">
                  {selectedUser.name[0]}
                </div>
                <div>
                  <h4 className="text-lg font-semibold">{selectedUser.name}</h4>
                  <p className="text-muted-foreground">{selectedUser.company} · {selectedUser.position}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-xs text-muted-foreground">学号</div>
                  <div className="font-medium">{selectedUser.studentId || '-'}</div>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-xs text-muted-foreground">手机号</div>
                  <div className="font-medium">{selectedUser.phone || '-'}</div>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-xs text-muted-foreground">积分</div>
                  <div className="font-medium">{selectedUser.points}</div>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-xs text-muted-foreground">徽章</div>
                  <div className="font-medium">{selectedUser.badges}</div>
                </div>
              </div>

              <div className="mt-4">
                <h5 className="font-medium mb-2">身份标签</h5>
                <div className="flex flex-wrap gap-2">
                  {typeof selectedUser.tags === 'string' ? (
                    <span className="tag tag-primary">{selectedUser.tags}</span>
                  ) : Array.isArray(selectedUser.tags) ? (
                    (selectedUser.tags as string[]).map((tag: string, index: number) => (
                      <span key={index} className="tag tag-primary">{tag}</span>
                    ))
                  ) : null}
                </div>
              </div>

              <div className="mt-4">
                <h5 className="font-medium mb-2">学习记录</h5>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">考勤记录</span>
                    <span className="font-medium">95%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">作业完成率</span>
                    <span className="font-medium">88%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowUserDetail(false)} className="btn-secondary">关闭</button>
              <button className="btn-primary">编辑信息</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
