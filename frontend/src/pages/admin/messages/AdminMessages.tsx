import { useState, useEffect } from 'react'
import { Search, Plus, Eye, Send, Archive, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getPopupList, createPopup, updatePopup, deletePopup, publishPopup, revokePopup } from '@/api/popup'
import type { PopupMessage } from '@/api/popup'
import { success, error } from '@/components/ui/Toast'
import { confirm } from '@/components/ui/ConfirmDialog'

type TabType = 'popups' | 'stats'

export default function AdminMessages() {
  const [activeTab, setActiveTab] = useState<TabType>('popups')
  const [searchTerm, setSearchTerm] = useState('')
  const [popups, setPopups] = useState<PopupMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createForm, setCreateForm] = useState({
    title: '',
    content: '',
    image: '',
  })

  const tabs: { id: TabType; label: string }[] = [
    { id: 'popups', label: '弹窗维护' },
    { id: 'stats', label: '数据统计' }
  ]

  // 加载弹窗列表
  useEffect(() => {
    if (activeTab === 'popups') {
      loadPopups()
    }
  }, [activeTab])

  const loadPopups = async () => {
    setLoading(true)
    try {
      const res = await getPopupList({ page: 1, size: 100 })
      setPopups(res.data?.records || [])
    } catch (err: any) {
      error(err.message || '加载弹窗列表失败')
    } finally {
      setLoading(false)
    }
  }

  // 处理预览弹窗
  const handlePreview = (popup: PopupMessage) => {
    success(`预览 "${popup.title}"`)
  }

  // 处理发布/撤销弹窗
  const handleTogglePublish = async (popup: PopupMessage) => {
    const action = popup.published === 1 ? '撤销' : '发布'
    const confirmed = await confirm(`确定要${action}弹窗 "${popup.title}" 吗？`, {
      title: `${action}弹窗`,
      type: 'warning',
      confirmText: action,
    })
    
    if (confirmed) {
      try {
        if (popup.published === 1) {
          await revokePopup(popup.id)
        } else {
          await publishPopup(popup.id, 1) // userId暂时传1
        }
        success(`弹窗已${action}！`)
        loadPopups()
      } catch (err: any) {
        error(err.message || `${action}失败`)
      }
    }
  }

  // 处理删除弹窗
  const handleDelete = async (popup: PopupMessage) => {
    const confirmed = await confirm(`确定要删除弹窗 "${popup.title}" 吗？`, {
      title: '删除弹窗',
      type: 'danger',
      confirmText: '删除',
    })
    
    if (confirmed) {
      try {
        await deletePopup(popup.id)
        success('弹窗已删除！')
        loadPopups()
      } catch (err: any) {
        error(err.message || '删除失败')
      }
    }
  }

  // 处理创建弹窗
  const handleCreatePopup = () => {
    setShowCreateModal(true)
  }

  // 处理保存弹窗
  const handleSavePopup = async () => {
    if (!createForm.title || !createForm.content) {
      error('请填写标题和内容')
      return
    }
    
    try {
      await createPopup({
        title: createForm.title,
        content: createForm.content,
        image: createForm.image || undefined,
      })
      success('弹窗创建成功！')
      setShowCreateModal(false)
      setCreateForm({ title: '', content: '', image: '' })
      loadPopups()
    } catch (err: any) {
      error(err.message || '创建失败')
    }
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

      {/* 弹窗维护 */}
      {activeTab === 'popups' && (
        <>
          <div className="flex items-center justify-between">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="搜索弹窗标题..."
                className="input-base pl-10"
              />
            </div>
            <button
              onClick={handleCreatePopup}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              创建弹窗
            </button>
          </div>

          <div className="admin-card">
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>弹窗标题</th>
                    <th>内容摘要</th>
                    <th>创建时间</th>
                    <th>状态</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {popups.map(popup => (
                    <tr key={popup.id}>
                      <td className="font-medium">{popup.title}</td>
                      <td className="max-w-xs truncate text-muted-foreground">{popup.content}</td>
                      <td className="text-muted-foreground">{new Date(popup.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={cn('tag', popup.published === 1 ? 'tag-success' : 'tag-muted')}>
                          {popup.published === 1 ? '已发布' : '未发布'}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => handlePreview(popup)}
                            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary" 
                            title="预览"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {popup.published ? (
                            <button 
                              onClick={() => handleTogglePublish(popup)}
                              className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-warning" 
                              title="撤销"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleTogglePublish(popup)}
                              className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-success" 
                              title="发布"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(popup)}
                            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-destructive" 
                            title="删除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* 数据统计 */}
      {activeTab === 'stats' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="font-semibold">数据统计</h3>
          </div>
          <div className="admin-card-body">
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg mb-2">数据统计功能已移至独立页面</p>
              <p className="text-sm">请使用左侧菜单中的“数据统计”查看详细数据</p>
            </div>
          </div>
        </div>
      )}

      {/* 创建弹窗 */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="text-lg font-semibold">创建弹窗</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-muted rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body space-y-4">
              <div className="form-group">
                <label className="form-label">弹窗标题</label>
                <input type="text" className="input-base" placeholder="请输入弹窗标题" />
              </div>
              <div className="form-group">
                <label className="form-label">弹窗内容</label>
                <textarea className="input-base h-32 resize-none" placeholder="请输入弹窗内容..." />
              </div>
              <div className="form-group">
                <label className="form-label">弹窗图片 (可选)</label>
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <svg className="w-8 h-8 text-muted-foreground mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-muted-foreground">点击上传图片</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowCreateModal(false)} className="btn-secondary">取消</button>
              <button onClick={handleSavePopup} className="btn-primary">创建</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
