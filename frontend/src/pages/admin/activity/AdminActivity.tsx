import { useState, useEffect } from 'react'
import { Search, Plus, Eye, Edit, Trash2, Download, Image as ImageIcon, ToggleLeft, ToggleRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getActivityList, createActivity, updateActivity, deleteActivity, exportRegistrations } from '@/api/activity'
import type { ActivityInfo } from '@/api/activity'
import { success, error, warning } from '@/components/ui/Toast'
import { confirm } from '@/components/ui/ConfirmDialog'

export default function AdminActivity() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activities, setActivities] = useState<ActivityInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<ActivityInfo | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  
  // 发布/编辑表单
  const [activityForm, setActivityForm] = useState({
    title: '',
    content: '',
    onCarousel: false,
  })

  // 加载活动列表
  useEffect(() => {
    loadActivities()
  }, [])

  const loadActivities = async () => {
    setLoading(true)
    try {
      const res = await getActivityList({ page: 1, size: 100 })
      setActivities(res.data?.records || [])
    } catch (err: any) {
      error(err.message || '加载活动列表失败')
    } finally {
      setLoading(false)
    }
  }

  const filteredActivities = activities.filter(a =>
    a.title.includes(searchTerm)
  )

  // 处理发布活动
  const handlePublishActivity = async () => {
    if (!activityForm.title) {
      error('请填写活动标题')
      return
    }
    
    try {
      await createActivity({
        title: activityForm.title,
        content: activityForm.content,
        onCarousel: activityForm.onCarousel ? 1 : 0,
      })
      success('活动发布成功！')
      setShowPublishModal(false)
      setActivityForm({ title: '', content: '', onCarousel: false })
      loadActivities()
    } catch (err: any) {
      error(err.message || '发布失败')
    }
  }

  // 处理编辑活动
  const handleEditActivity = (activity: any) => {
    setSelectedActivity(activity)
    setActivityForm({
      title: activity.title,
      content: activity.content,
      onCarousel: activity.onCarousel,
    })
    setShowEditModal(true)
  }

  // 处理保存编辑
  const handleSaveEdit = async () => {
    if (!activityForm.title) {
      error('请填写活动标题')
      return
    }
    
    if (!selectedActivity) return
    
    try {
      await updateActivity(selectedActivity.id, {
        title: activityForm.title,
        content: activityForm.content,
        onCarousel: activityForm.onCarousel ? 1 : 0,
      })
      success('活动更新成功！')
      setShowEditModal(false)
      loadActivities()
    } catch (err: any) {
      error(err.message || '更新失败')
    }
  }

  // 处理删除活动
  const handleDeleteActivity = (activity: ActivityInfo) => {
    confirm(`确定要删除活动 "${activity.title}" 吗？`, {
      title: '删除活动',
      type: 'danger',
      confirmText: '删除',
    }).then(async confirmed => {
      if (confirmed) {
        try {
          await deleteActivity(activity.id)
          success('删除成功')
          loadActivities()
        } catch (err: any) {
          error(err.message || '删除失败')
        }
      }
    })
  }

  // 处理导出名单
  const handleExportRegistrations = async (activity: ActivityInfo) => {
    try {
      const res = await exportRegistrations(activity.id)
      success(`正在导出 "${activity.title}" 的报名名单，共 ${res.data?.length || 0} 人...`)
      // TODO: 实现Excel下载功能
    } catch (err: any) {
      error(err.message || '导出失败')
    }
  }

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
            placeholder="搜索活动名称..."
            className="input-base pl-10"
          />
        </div>
        <button
          onClick={() => setShowPublishModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          发布活动
        </button>
      </div>

      {/* 活动列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredActivities.map(activity => (
          <div key={activity.id} className="admin-card card-hover overflow-hidden">
            <div className="relative h-40">
              <img
                src={activity.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop'}
                alt={activity.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {activity.onCarousel && (
                <div className="absolute top-3 left-3">
                  <span className="bg-primary text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    轮播图
                  </span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">{activity.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{activity.content}</p>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  报名 {activity.registrationCount || 0} 人
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => { setSelectedActivity(activity); setShowDetailModal(true); }}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                    title="查看报名"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleEditActivity(activity)}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary" 
                    title="编辑"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleExportRegistrations(activity)}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary" 
                    title="导出名单"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteActivity(activity)}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-destructive" 
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 发布活动弹窗 */}
      {showPublishModal && (
        <div className="modal-overlay" onClick={() => setShowPublishModal(false)}>
          <div className="modal-content max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="text-lg font-semibold">发布活动</h3>
              <button onClick={() => setShowPublishModal(false)} className="p-1 hover:bg-muted rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body space-y-4">
              <div className="form-group">
                <label className="form-label">活动标题</label>
                <input 
                  type="text" 
                  className="input-base" 
                  placeholder="请输入活动标题" 
                  value={activityForm.title}
                  onChange={e => setActivityForm({...activityForm, title: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">活动文案</label>
                <textarea 
                  className="input-base h-24 resize-none" 
                  placeholder="请输入活动详情..." 
                  value={activityForm.content}
                  onChange={e => setActivityForm({...activityForm, content: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">活动图片</label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">点击或拖拽上传图片</p>
                  <p className="text-xs text-muted-foreground/50 mt-1">支持 JPG、PNG 格式</p>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label flex items-center justify-between">
                  <span>显示在轮播图</span>
                  <button 
                    onClick={() => setActivityForm({...activityForm, onCarousel: !activityForm.onCarousel})}
                    className="text-primary"
                  >
                    {activityForm.onCarousel ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                  </button>
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowPublishModal(false)} className="btn-secondary">取消</button>
              <button onClick={handlePublishActivity} className="btn-primary">发布</button>
            </div>
          </div>
        </div>
      )}

      {/* 编辑活动弹窗 */}
      {showEditModal && selectedActivity && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="text-lg font-semibold">编辑活动</h3>
              <button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-muted rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body space-y-4">
              <div className="form-group">
                <label className="form-label">活动标题</label>
                <input 
                  type="text" 
                  className="input-base" 
                  value={activityForm.title}
                  onChange={e => setActivityForm({...activityForm, title: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">活动文案</label>
                <textarea 
                  className="input-base h-24 resize-none" 
                  value={activityForm.content}
                  onChange={e => setActivityForm({...activityForm, content: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label flex items-center justify-between">
                  <span>显示在轮播图</span>
                  <button 
                    onClick={() => setActivityForm({...activityForm, onCarousel: !activityForm.onCarousel})}
                    className="text-primary"
                  >
                    {activityForm.onCarousel ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                  </button>
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowEditModal(false)} className="btn-secondary">取消</button>
              <button onClick={handleSaveEdit} className="btn-primary">保存</button>
            </div>
          </div>
        </div>
      )}

      {/* 报名详情弹窗 */}
      {showDetailModal && selectedActivity && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="text-lg font-semibold">报名管理 - {selectedActivity.title}</h3>
              <button onClick={() => setShowDetailModal(false)} className="p-1 hover:bg-muted rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground">共 {selectedActivity.registrationCount || 0} 人报名</span>
                <button 
                  onClick={() => handleExportRegistrations(selectedActivity)}
                  className="btn-secondary text-sm flex items-center gap-1"
                >
                  <Download className="w-4 h-4" />
                  导出名单
                </button>
              </div>
              <div className="text-center py-8 text-muted-foreground">
                <p>报名列表功能开发中...</p>
                <p className="text-sm mt-2">可使用"导出名单"功能查看完整报名信息</p>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowDetailModal(false)} className="btn-secondary">关闭</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
