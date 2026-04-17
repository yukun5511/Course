import { useState, useEffect } from 'react'
import { Search, Gift, TrendingUp, Eye, Download, Award, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getShopItemList, getExchangeRecords, updateShopItemAvailable, createShopItem, updateShopItem, deleteShopItem } from '@/api/shop'
import type { ShopItemInfo, ExchangeRecord, CreateShopItemRequest, UpdateShopItemRequest } from '@/api/shop'
import { success, error } from '@/components/ui/Toast'
import { confirm } from '@/components/ui/ConfirmDialog'

type TabType = 'shop' | 'points'

export default function AdminPoints() {
  const [activeTab, setActiveTab] = useState<TabType>('shop')
  const [searchTerm, setSearchTerm] = useState('')
  const [shopItems, setShopItems] = useState<ShopItemInfo[]>([])
  const [exchangeRecords, setExchangeRecords] = useState<ExchangeRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ShopItemInfo | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editForm, setEditForm] = useState<UpdateShopItemRequest>({})
  const [createForm, setCreateForm] = useState<CreateShopItemRequest>({
    name: '',
    type: 'course',
    badgeCost: 0,
    stock: 0,
    description: '',
  })

  // 加载数据
  useEffect(() => {
    if (activeTab === 'shop') {
      loadShopItems()
    } else {
      loadExchangeRecords()
    }
  }, [activeTab])

  const loadShopItems = async () => {
    setLoading(true)
    try {
      const res = await getShopItemList({ page: 1, size: 100 })
      setShopItems(res.data?.records || [])
    } catch (err: any) {
      error(err.message || '加载商品列表失败')
    } finally {
      setLoading(false)
    }
  }

  const loadExchangeRecords = async () => {
    setLoading(true)
    try {
      const res = await getExchangeRecords({ page: 1, size: 100 })
      setExchangeRecords(res.data?.records || [])
    } catch (err: any) {
      error(err.message || '加载兑换记录失败')
    } finally {
      setLoading(false)
    }
  }

  // 处理保存商品
  const handleSaveItem = async () => {
    if (!selectedItem) return
    
    try {
      await updateShopItem(selectedItem.id, editForm)
      success('商品保存成功！')
      setShowEditModal(false)
      loadShopItems()
    } catch (err: any) {
      error(err.message || '保存失败')
    }
  }

  // 处理创建商品
  const handleCreateItem = async () => {
    if (!createForm.name) {
      error('请填写商品名称')
      return
    }
    
    try {
      await createShopItem(createForm)
      success('商品创建成功！')
      setShowCreateModal(false)
      setCreateForm({
        name: '',
        type: 'course',
        badgeCost: 0,
        stock: 0,
        description: '',
      })
      loadShopItems()
    } catch (err: any) {
      error(err.message || '创建失败')
    }
  }

  // 处理删除商品
  const handleDeleteItem = async (item: ShopItemInfo) => {
    const confirmed = await confirm(`确定要删除商品 "${item.name}" 吗？`, {
      title: '删除商品',
      type: 'danger',
      confirmText: '删除',
    })
    
    if (confirmed) {
      try {
        await deleteShopItem(item.id)
        success('商品已删除')
        loadShopItems()
      } catch (err: any) {
        error(err.message || '删除失败')
      }
    }
  }

  // 处理查看兑换记录
  const handleViewExchangeRecords = (item: any) => {
    alert(`查看 "${item.name}" 兑换记录功能待开发`)
  }

  // 处理导出排行
  const handleExportRanking = () => {
    success('排行数据导出成功！')
  }

  // 处理导出日志
  const handleExportLogs = () => {
    success('积分日志导出成功！')
  }

  return (
    <div className="space-y-6">
      {/* Tab 切换 */}
      <div className="flex bg-card rounded-xl p-1 shadow-card w-fit">
        <button
          onClick={() => setActiveTab('shop')}
          className={cn(
            'px-6 py-2 text-sm font-medium rounded-lg transition-all',
            activeTab === 'shop' ? 'bg-primary text-white' : 'text-muted-foreground'
          )}
        >
          商城管理
        </button>
        <button
          onClick={() => setActiveTab('points')}
          className={cn(
            'px-6 py-2 text-sm font-medium rounded-lg transition-all',
            activeTab === 'points' ? 'bg-primary text-white' : 'text-muted-foreground'
          )}
        >
          积分管理
        </button>
      </div>

      {/* 商城管理 */}
      {activeTab === 'shop' && (
        <>
          {/* 统计概览 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="stat-card">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Gift className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="stat-label">商品总数</div>
                  <div className="stat-value">{shopItems.length}</div>
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-success" />
                </div>
                <div>
                  <div className="stat-label">兑换总次数</div>
                  <div className="stat-value">{exchangeRecords.length}</div>
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <div className="stat-label">在售商品</div>
                  <div className="stat-value">{shopItems.filter(item => item.available === 1).length}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 商品列表 */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="font-semibold">商品列表</h3>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                创建商品
              </button>
            </div>
            <div className="admin-card-body">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>商品信息</th>
                    <th>类型</th>
                    <th>徽章消耗</th>
                    <th>库存</th>
                    <th>状态</th>
                    <th>兑换次数</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {shopItems.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=100&h=100&fit=crop'}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover"
                            loading="lazy"
                          />
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-muted-foreground">{item.description}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={cn('tag', item.type === 'course' ? 'tag-primary' : 'tag-accent')}>
                          {item.type === 'course' ? '课程' : '活动'}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1 text-warning">
                          <Gift className="w-4 h-4" />
                          <span className="font-medium">{item.badgeCost}</span>
                        </div>
                      </td>
                      <td>{item.stock}</td>
                      <td>
                        <span className={cn('tag', item.available === 1 ? 'tag-success' : 'tag-muted')}>
                          {item.available === 1 ? '在售' : '已下架'}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={async () => {
                            try {
                              const newAvailable = item.available === 1 ? 0 : 1
                              await updateShopItemAvailable(item.id, newAvailable)
                              success('状态更新成功')
                              loadShopItems()
                            } catch (err: any) {
                              error(err.message || '更新失败')
                            }
                          }}
                          className={cn(
                            'px-2 py-1 text-xs rounded-lg transition-colors',
                            item.available === 1 
                              ? 'bg-warning/10 text-warning hover:bg-warning/20'
                              : 'bg-success/10 text-success hover:bg-success/20'
                          )}
                        >
                          {item.available === 1 ? '下架' : '上架'}
                        </button>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => { 
                              setSelectedItem(item)
                              setEditForm({
                                name: item.name,
                                type: item.type,
                                badgeCost: item.badgeCost,
                                stock: item.stock,
                                description: item.description,
                                image: item.image,
                              })
                              setShowEditModal(true)
                            }}
                            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                            title="编辑"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item)}
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

          {/* 徽章排行 */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="font-semibold">徽章排行</h3>
              <button 
                onClick={handleExportRanking}
                className="btn-secondary text-sm flex items-center gap-1"
              >
                <Download className="w-4 h-4" />
                导出排行
              </button>
            </div>
            <div className="admin-card-body">
              <div className="text-center py-8 text-muted-foreground">
                <p>徽章排行功能开发中...</p>
                <p className="text-sm mt-2">需要后端提供排行榜API</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 积分管理 */}
      {activeTab === 'points' && (
        <>
          {/* 筛选条件 */}
          <div className="flex items-center gap-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="搜索学号、姓名..."
                className="input-base pl-10"
              />
            </div>
            <select className="input-base w-48">
              <option value="">选择班级</option>
              <option>2024春季高管班</option>
              <option>2024秋季精英班</option>
            </select>
            <button 
              onClick={handleExportLogs}
              className="btn-secondary flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              导出日志
            </button>
          </div>

          {/* 积分流水 */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="font-semibold">积分兑换记录</h3>
            </div>
            <div className="admin-card-body">
              {exchangeRecords.length > 0 ? (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>学员</th>
                      <th>兑换商品</th>
                      <th>消耗徽章</th>
                      <th>兑换时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exchangeRecords.map(record => (
                      <tr key={record.id}>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-sm">
                              {record.userName?.[0] || '用'}
                            </div>
                            <div>
                              <div className="font-medium">{record.userName || '未知用户'}</div>
                              <div className="text-xs text-muted-foreground">{record.studentId || '-'}</div>
                            </div>
                          </div>
                        </td>
                        <td>{record.itemName}</td>
                        <td>
                          <span className="text-warning font-medium">-{record.badgeCost}</span>
                        </td>
                        <td className="text-muted-foreground">{new Date(record.exchangedAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>暂无兑换记录</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* 编辑商品弹窗 */}
      {showEditModal && selectedItem && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="text-lg font-semibold">编辑商品</h3>
              <button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-muted rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body space-y-4">
              <div className="form-group">
                <label className="form-label">商品名称</label>
                <input type="text" className="input-base" defaultValue={selectedItem.name} />
              </div>
              <div className="form-group">
                <label className="form-label">徽章数量</label>
                <input type="number" className="input-base" defaultValue={selectedItem.badgeCost} />
              </div>
              <div className="form-group">
                <label className="form-label">库存数量</label>
                <input type="number" className="input-base" defaultValue={selectedItem.stock} />
              </div>
              <div className="form-group">
                <label className="form-label">商品描述</label>
                <textarea className="input-base h-24 resize-none" defaultValue={selectedItem.description} />
              </div>
              <div className="form-group">
                <label className="form-label flex items-center justify-between">
                  <span>商品状态</span>
                  <select className="input-base w-32">
                    <option value="true" selected={Number(selectedItem.available) === 1}>在售</option>
                    <option value="false" selected={Number(selectedItem.available) !== 1}>下架</option>
                  </select>
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowEditModal(false)} className="btn-secondary">取消</button>
              <button onClick={handleSaveItem} className="btn-primary">保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
