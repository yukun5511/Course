import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastProps {
  toasts: Toast[]
  removeToast: (id: number) => void
}

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
}

const colorMap = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'text-green-500',
    text: 'text-green-800',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'text-red-500',
    text: 'text-red-800',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: 'text-yellow-500',
    text: 'text-yellow-800',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-500',
    text: 'text-blue-800',
  },
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast()
  
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: number) => void }) {
  const Icon = iconMap[toast.type]
  const colors = colorMap[toast.type]

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id)
    }, 3000)
    return () => clearTimeout(timer)
  }, [toast.id, onRemove])

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border',
        'animate-in slide-in-from-right fade-in duration-300',
        colors.bg,
        colors.border
      )}
    >
      <Icon className={cn('w-5 h-5 flex-shrink-0', colors.icon)} />
      <span className={cn('text-sm font-medium', colors.text)}>{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className={cn('ml-2 p-1 rounded hover:bg-white/50 transition-colors', colors.icon)}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

// Toast 管理器
let toastId = 0
const listeners: ((toasts: Toast[]) => void)[] = []
let currentToasts: Toast[] = []

function notify(toasts: Toast[]) {
  currentToasts = toasts
  listeners.forEach((listener) => listener(toasts))
}

export function toast(message: string, type: ToastType = 'info') {
  const id = ++toastId
  const newToast: Toast = { id, message, type }
  notify([...currentToasts, newToast])
  return id
}

export function success(message: string) {
  return toast(message, 'success')
}

export function error(message: string) {
  return toast(message, 'error')
}

export function warning(message: string) {
  return toast(message, 'warning')
}

export function info(message: string) {
  return toast(message, 'info')
}

export function removeToast(id: number) {
  notify(currentToasts.filter((t) => t.id !== id))
}

// Toast Hook
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const listener = (newToasts: Toast[]) => {
      setToasts(newToasts)
    }
    listeners.push(listener)
    return () => {
      const index = listeners.indexOf(listener)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [])

  return {
    toasts,
    removeToast,
    success,
    error,
    warning,
    info,
  }
}
