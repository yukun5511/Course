import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Eye, FileText, CheckCircle, XCircle, Star, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getAssignmentList, createAssignment, updateAssignment, deleteAssignment } from '@/api/assignment'
import { getEvaluationList, createEvaluation } from '@/api/evaluation'
import { success, error, warning } from '@/components/ui/Toast'
import { confirm } from '@/components/ui/ConfirmDialog'

type TabType = 'assignment' | 'evaluation'

export default function AdminTeaching() {
  const [activeTab, setActiveTab] = useState<TabType>('assignment')
  const [searchTerm, setSearchTerm] = useState('')
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null)
  const [showGradeModal, setShowGradeModal] = useState(false)
  const [gradeForm, setGradeForm] = useState({ score: '', feedback: '' })
  const [loading, setLoading] = useState(false)
  const [assignmentList, setAssignmentList] = useState<any[]>([])
  const [evaluationList, setEvaluationList] = useState<any[]>([])
  const [page, setPage] = useState(1)
  
  // 创建作业表单
  const [assignmentForm, setAssignmentForm] = useState({
    courseId: '',
    courseName: '',
    title: '',
    description: '',
    deadline: '',
  })

  // 加载作业列表
  const loadAssignments = async () => {
    setLoading(true)
    try {
      const response = await getAssignmentList({
        keyword: searchTerm || undefined,
        page,
        size: 20,
      })
      const data = response.data
      setAssignmentList(data?.records || [])
    } catch (error) {
      console.error('加载作业列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 加载评价列表
  const loadEvaluations = async () => {
    setLoading(true)
    try {
      const response = await getEvaluationList({
        page,
        size: 20,
      })
      const data = response.data
      setEvaluationList(data?.records || [])
    } catch (error) {
      console.error('加载评价列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'assignment') {
      loadAssignments()
    } else {
      loadEvaluations()
    }
  }, [activeTab, page])

  // 处理创建作业
  const handleCreateAssignment = async () => {
    if (!assignmentForm.title || !assignmentForm.courseId || !assignmentForm.deadline) {
      error('请填写作业标题、选择课程和截止时间')
      return
    }
    
    setLoading(true)
    try {
      await createAssignment({
        courseId: parseInt(assignmentForm.courseId),
        courseName: assignmentForm.courseName,
        title: assignmentForm.title,
        description: assignmentForm.description,
        deadline: assignmentForm.deadline,
        status: 'published',
      })
      success('发布成功！')
      setShowPublishModal(false)
      setAssignmentForm({ courseId: '', courseName: '', title: '', description: '', deadline: '' })
      loadAssignments()
    } catch (error: any) {
      error(error.message || '发布失败')
    } finally {
      setLoading(false)
    }
  }

  // 处理删除作业
  const handleDeleteAssignment = async (assignmentId: number, assignmentTitle: string) => {
    const confirmed = await confirm(`确定要删除作业 "${assignmentTitle}" 吗？`, {
      title: '删除作业',
      type: 'danger',
      confirmText: '删除',
    })
    
    if (!confirmed) return

    try {
      await deleteAssignment(assignmentId)
      success('删除成功！')
      loadAssignments()
    } catch (error: any) {
      error(error.message || '删除失败')
    }
  }

  return (
    <div className="space-y-6">
      {/* Tab 切换 */}
      <div className="flex bg-card rounded-xl p-1 shadow-card w-fit">
        <button
          onClick={() => setActiveTab('assignment')}
          className={cn(
            'px-6 py-2 text-sm font-medium rounded-lg transition-all',
            activeTab === 'assignment' ? 'bg-primary text-white' : 'text-muted-foreground'
          )}
        >
          作业管理
        </button>
        <button
          onClick={() => setActiveTab('evaluation')}
          className={cn(
            'px-6 py-2 text-sm font-medium rounded-lg transition-all',
            activeTab === 'evaluation' ? 'bg-primary text-white' : 'text-muted-foreground'
          )}
        >
          课程评价
        </button>
      </div>

      {/* 作业管理 */}
      {activeTab === 'assignment' && (
        <>
          {/* 操作栏 */}
          <div className="flex items-center justify-between">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="搜索作业名称、课程..."
                className="input-base pl-10"
              />
            </div>
            <button
              onClick={() => setShowPublishModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              发布作业
            </button>
          </div>

          {/* 作业列表 */}
          <div className="admin-card">
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>作业名称</th>
                    <th>所属课程</th>
                    <th>截止时间</th>
                    <th>提交人数</th>
                    <th>状态</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-muted-foreground">加载中...</td>
                    </tr>
                  ) : assignmentList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-muted-foreground">暂无数据</td>
                    </tr>
                  ) : (
                    assignmentList.map(assignment => (
                    <tr key={assignment.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{assignment.title}</span>
                        </div>
                      </td>
                      <td>{assignment.courseName}</td>
                      <td>{assignment.deadline}</td>
                      <td>
                        <div className="text-sm">
                          {assignment.status === 'graded' ? '28/30' : '15/30'}
                        </div>
                      </td>
                      <td>
                        <span className={cn(
                          'tag',
                          assignment.status === 'pending' ? 'tag-warning' :
                          assignment.status === 'submitted' ? 'tag-primary' : 'tag-success'
                        )}>
                          {assignment.status === 'pending' ? '待提交' :
                           assignment.status === 'submitted' ? '已提交' : '已批改'}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary" title="查看提交">
                            <Eye className="w-4 h-4" />
                          </button>
                          {assignment.status !== 'pending' && (
                            <button
                              onClick={() => { setSelectedAssignment(assignment); setShowGradeModal(true); }}
                              className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                              title="批改作业"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* 课程评价 */}
      {activeTab === 'evaluation' && (
        <>
          {/* 操作栏 */}
          <div className="flex items-center justify-between">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="搜索课程名称..."
                className="input-base pl-10"
              />
            </div>
            <button 
              onClick={() => warning('发布评价问卷功能待开发')}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              发布评价问卷
            </button>
          </div>

          {/* 评价列表 */}
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">加载中...</div>
          ) : evaluationList.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">暂无数据</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {evaluationList.map(evaluation => (
              <div key={evaluation.id} className="admin-card card-hover">
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{evaluation.courseName}</h3>
                    {evaluation.submitted ? (
                      <span className="tag tag-success flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        已完成
                      </span>
                    ) : (
                      <span className="tag tag-warning">收集中</span>
                    )}
                  </div>

                  {evaluation.submitted && evaluation.result ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary">{evaluation.result.averageScore}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Star className="w-3 h-3 text-warning fill-warning" />
                            平均分
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-foreground">{evaluation.result.totalResponses}</div>
                          <div className="text-xs text-muted-foreground">评价人数</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {/* TODO: 评价详情从 API 获取 */}
                        <div className="text-sm text-muted-foreground">评价详情待对接</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p>暂无评价数据</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                    <button className="text-sm text-primary hover:underline flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      查看详情
                    </button>
                    <button className="btn-ghost text-sm flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      导出
                    </button>
                  </div>
                </div>
              </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* 发布作业弹窗 */}
      {showPublishModal && (
        <div className="modal-overlay" onClick={() => setShowPublishModal(false)}>
          <div className="modal-content max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="text-lg font-semibold">发布作业</h3>
              <button onClick={() => setShowPublishModal(false)} className="p-1 hover:bg-muted rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body space-y-4">
              <div className="form-group">
                <label className="form-label">所属课程</label>
                <select className="input-base">
                  <option value="">请选择课程</option>
                  <option value="course1">数字化转型战略</option>
                  <option value="course2">人工智能与商业应用</option>
                  <option value="course3">领导力与组织变革</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">作业标题</label>
                <input type="text" className="input-base" placeholder="请输入作业标题" />
              </div>
              <div className="form-group">
                <label className="form-label">作业内容</label>
                <textarea className="input-base h-32 resize-none" placeholder="请输入作业要求..." />
              </div>
              <div className="form-group">
                <label className="form-label">截止时间</label>
                <input type="datetime-local" className="input-base" />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowPublishModal(false)} className="btn-secondary">取消</button>
              <button className="btn-primary">发布</button>
            </div>
          </div>
        </div>
      )}

      {/* 批改作业弹窗 */}
      {showGradeModal && selectedAssignment && (
        <div className="modal-overlay" onClick={() => setShowGradeModal(false)}>
          <div className="modal-content max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="text-lg font-semibold">批改作业</h3>
              <button onClick={() => setShowGradeModal(false)} className="p-1 hover:bg-muted rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body space-y-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-2">作业内容</div>
                <p className="text-sm">{selectedAssignment.content}</p>
              </div>
              <div className="form-group">
                <label className="form-label">评分 (0-100)</label>
                <input
                  type="number"
                  className="input-base"
                  placeholder="请输入分数"
                  value={gradeForm.score}
                  onChange={e => setGradeForm({ ...gradeForm, score: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">评语反馈</label>
                <textarea
                  className="input-base h-24 resize-none"
                  placeholder="请输入评语..."
                  value={gradeForm.feedback}
                  onChange={e => setGradeForm({ ...gradeForm, feedback: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowGradeModal(false)} className="btn-secondary">取消</button>
              <button className="btn-primary">提交批改</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
