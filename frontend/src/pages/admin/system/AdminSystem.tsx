import { useState } from 'react'
import { Shield, Menu, Settings, FileText, Eye, Edit, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { success, warning } from '@/components/ui/Toast'

type TabType = 'roles' | 'menus' | 'settings' | 'logs'

export default function AdminSystem() {
  const [activeTab, setActiveTab] = useState<TabType>('roles')

  // 处理添加角色
  const handleAddRole = () => {
    warning('添加角色功能待开发')
  }

  // 处理查看角色
  const handleViewRole = (roleName: string) => {
    warning(`查看 "${roleName}" 角色详情功能待开发`)
  }

  // 处理编辑角色
  const handleEditRole = (roleName: string) => {
    warning(`编辑 "${roleName}" 角色功能待开发`)
  }

  // 处理删除角色
  const handleDeleteRole = (roleName: string) => {
    warning(`删除 "${roleName}" 角色功能待开发`)
  }

  // 处理添加菜单
  const handleAddMenu = () => {
    warning('添加菜单功能待开发')
  }

  // 处理编辑菜单
  const handleEditMenu = (menuName: string) => {
    warning(`编辑 "${menuName}" 菜单功能待开发`)
  }

  // 处理保存设置
  const handleSaveSettings = () => {
    success('设置保存成功！')
  }

  const tabs: { id: TabType; label: string; icon: typeof Shield }[] = [
    { id: 'roles', label: '角色管理', icon: Shield },
    { id: 'menus', label: '菜单管理', icon: Menu },
    { id: 'settings', label: '参数设置', icon: Settings },
    { id: 'logs', label: '日志管理', icon: FileText }
  ]

  return (
    <div className="space-y-6">
      {/* Tab 切换 */}
      <div className="flex bg-card rounded-xl p-1 shadow-card">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2',
                activeTab === tab.id ? 'bg-primary text-white' : 'text-muted-foreground'
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* 角色管理 */}
      {activeTab === 'roles' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="font-semibold">角色列表</h3>
            <button 
              onClick={handleAddRole}
              className="btn-primary text-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              添加角色
            </button>
          </div>
          <div className="admin-card-body">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>角色名称</th>
                  <th>角色标识</th>
                  <th>描述</th>
                  <th>用户数</th>
                  <th>创建时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-medium">超级管理员</td>
                  <td><code className="bg-muted px-2 py-0.5 rounded text-xs">admin</code></td>
                  <td className="text-muted-foreground">系统超级管理员，拥有所有权限</td>
                  <td>1</td>
                  <td className="text-muted-foreground">2024-01-01</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleViewRole('超级管理员')}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                        title="查看详情"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditRole('超级管理员')}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                        title="编辑"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="font-medium">运营人员</td>
                  <td><code className="bg-muted px-2 py-0.5 rounded text-xs">operator</code></td>
                  <td className="text-muted-foreground">负责日常运营管理</td>
                  <td>3</td>
                  <td className="text-muted-foreground">2024-01-01</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleViewRole('运营人员')}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                        title="查看详情"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditRole('运营人员')}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                        title="编辑"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteRole('运营人员')}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-destructive"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="font-medium">学术主任</td>
                  <td><code className="bg-muted px-2 py-0.5 rounded text-xs">director</code></td>
                  <td className="text-muted-foreground">负责教学管理和班级指导</td>
                  <td>5</td>
                  <td className="text-muted-foreground">2024-01-01</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleViewRole('学术主任')}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                        title="查看详情"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditRole('学术主任')}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                        title="编辑"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteRole('学术主任')}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-destructive"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 菜单管理 */}
      {activeTab === 'menus' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="font-semibold">菜单列表</h3>
            <button 
              onClick={handleAddMenu}
              className="btn-primary text-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              添加菜单
            </button>
          </div>
          <div className="admin-card-body">
            <div className="space-y-2">
              {[
                { name: '数据概览', path: '/admin/dashboard', icon: 'LayoutDashboard' },
                { name: '用户管理', path: '/admin/users', icon: 'Users', children: ['学员管理', '导师管理'] },
                { name: '班级管理', path: '/admin/classes', icon: 'GraduationCap' },
                { name: '排课管理', path: '/admin/schedule', icon: 'CalendarDays', children: ['课表管理', '单课管理'] },
                { name: '教学管理', path: '/admin/teaching', icon: 'BookOpen', children: ['作业管理', '课程评价'] },
                { name: '考勤管理', path: '/admin/attendance', icon: 'ClipboardCheck', children: ['打卡管理', '请假管理', '出勤统计'] },
                { name: '活动管理', path: '/admin/activity', icon: 'Sparkles' },
                { name: '积分商城', path: '/admin/points', icon: 'Gift', children: ['商城管理', '积分管理'] },
                { name: '消息管理', path: '/admin/messages', icon: 'MessageSquare', children: ['弹窗维护', '数据统计'] },
                { name: '系统管理', path: '/admin/system', icon: 'Settings', children: ['角色管理', '菜单管理', '参数设置', '日志管理'] }
              ].map((menu, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-primary text-xs font-bold">{menu.name[0]}</span>
                    </div>
                    <div>
                      <div className="font-medium">{menu.name}</div>
                      <div className="text-xs text-muted-foreground">{menu.path}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {menu.children && (
                      <span className="text-xs text-muted-foreground">{menu.children.length} 子菜单</span>
                    )}
                    <button 
                      onClick={() => handleEditMenu(menu.name)}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                      title="编辑"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 参数设置 */}
      {activeTab === 'settings' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="font-semibold">系统参数设置</h3>
          </div>
          <div className="admin-card-body space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label">系统名称</label>
                <input type="text" className="input-base" defaultValue="课程管理系统" />
              </div>
              <div className="form-group">
                <label className="form-label">打卡半径 (米)</label>
                <input type="number" className="input-base" defaultValue={100} />
              </div>
              <div className="form-group">
                <label className="form-label">作业默认截止时间 (天)</label>
                <input type="number" className="input-base" defaultValue={7} />
              </div>
              <div className="form-group">
                <label className="form-label">签到积分奖励</label>
                <input type="number" className="input-base" defaultValue={5} />
              </div>
              <div className="form-group">
                <label className="form-label">作业提交积分奖励</label>
                <input type="number" className="input-base" defaultValue={10} />
              </div>
              <div className="form-group">
                <label className="form-label">优秀作业额外积分</label>
                <input type="number" className="input-base" defaultValue={20} />
              </div>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={handleSaveSettings}
                className="btn-primary"
              >
                保存设置
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 日志管理 */}
      {activeTab === 'logs' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="font-semibold">操作日志</h3>
          </div>
          <div className="admin-card-body">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>操作人</th>
                  <th>操作类型</th>
                  <th>操作内容</th>
                  <th>IP地址</th>
                  <th>操作时间</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>管理员</td>
                  <td><span className="tag tag-primary">修改</span></td>
                  <td>修改学员张三的积分</td>
                  <td className="text-muted-foreground font-mono">192.168.1.100</td>
                  <td className="text-muted-foreground">2024-03-15 14:30:25</td>
                </tr>
                <tr>
                  <td>管理员</td>
                  <td><span className="tag tag-success">新增</span></td>
                  <td>创建新课程"创新思维与方法"</td>
                  <td className="text-muted-foreground font-mono">192.168.1.100</td>
                  <td className="text-muted-foreground">2024-03-14 10:15:30</td>
                </tr>
                <tr>
                  <td>管理员</td>
                  <td><span className="tag tag-warning">删除</span></td>
                  <td>删除过期弹窗消息</td>
                  <td className="text-muted-foreground font-mono">192.168.1.100</td>
                  <td className="text-muted-foreground">2024-03-13 16:45:12</td>
                </tr>
                <tr>
                  <td>管理员</td>
                  <td><span className="tag tag-muted">登录</span></td>
                  <td>管理员登录系统</td>
                  <td className="text-muted-foreground font-mono">192.168.1.100</td>
                  <td className="text-muted-foreground">2024-03-13 09:00:00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
