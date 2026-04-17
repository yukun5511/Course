import { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  type?: 'info' | 'warning' | 'danger'
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
}

const iconMap = {
  info: AlertCircle,
  warning: AlertTriangle,
  danger: XCircle,
}

const colorMap = {
  info: {
    icon: 'text-blue-500',
    bg: 'bg-blue-50',
    confirm: 'bg-blue-600 hover:bg-blue-700',
  },
  warning: {
    icon: 'text-yellow-500',
    bg: 'bg-yellow-50',
    confirm: 'bg-yellow-600 hover:bg-yellow-700',
  },
  danger: {
    icon: 'text-red-500',
    bg: 'bg-red-50',
    confirm: 'bg-red-600 hover:bg-red-700',
  },
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  type = 'info',
  confirmText = '确定',
  cancelText = '取消',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const Icon = iconMap[type]
  const colors = colorMap[type]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 遮罩层 */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* 对话框 */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 fade-in duration-200">
        {/* 关闭按钮 */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <div className="p-6">
          {/* 图标 */}
          <div className={cn('w-12 h-12 rounded-full flex items-center justify-center mb-4', colors.bg)}>
            <Icon className={cn('w-6 h-6', colors.icon)} />
          </div>

          {/* 标题 */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>

          {/* 消息 */}
          <p className="text-gray-600">
            {message}
          </p>
        </div>

        {/* 按钮 */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={cn(
              'px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors',
              colors.confirm
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

// Confirm Hook
let confirmId = 0
const listeners: ((config: any) => void)[] = []
let currentConfig: any = null

function notify(config: any) {
  currentConfig = config
  listeners.forEach((listener) => listener(config))
}

export function confirm(
  message: string,
  options?: {
    title?: string
    type?: 'info' | 'warning' | 'danger'
    confirmText?: string
    cancelText?: string
  }
): Promise<boolean> {
  return new Promise((resolve) => {
    const id = ++confirmId
    const config = {
      id,
      isOpen: true,
      title: options?.title || '确认操作',
      message,
      type: options?.type || 'info',
      confirmText: options?.confirmText || '确定',
      cancelText: options?.cancelText || '取消',
      onConfirm: () => {
        notify({ ...config, isOpen: false })
        resolve(true)
      },
      onCancel: () => {
        notify({ ...config, isOpen: false })
        resolve(false)
      },
    }
    notify(config)
  })
}

// Confirm Provider Component
export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<any>(null)

  useEffect(() => {
    const listener = (newConfig: any) => {
      setConfig(newConfig)
    }
    listeners.push(listener)
    return () => {
      const index = listeners.indexOf(listener)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [])

  return (
    <>
      {children}
      {config && (
        <ConfirmDialog
          isOpen={config.isOpen}
          title={config.title}
          message={config.message}
          type={config.type}
          confirmText={config.confirmText}
          cancelText={config.cancelText}
          onConfirm={config.onConfirm}
          onCancel={config.onCancel}
        />
      )}
    </>
  )
}
