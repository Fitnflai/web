import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '@/utils'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export interface ToastData {
  message: string;
  variant?: ToastVariant;
}

let toastListeners: Array<(toast: ToastData | null) => void> = []

export const toast = {
  show: (message: string, variant: ToastVariant = 'success') => {
    toastListeners.forEach((l) => l({ message, variant }))
  },
  hide: () => {
    toastListeners.forEach((l) => l(null))
  },
}

const variantStyles: Record<ToastVariant, { container: string; icon: any }> = {
  success: { container: 'bg-brand-green/10 border-brand-green/20 text-brand-green', icon: CheckCircle },
  error: { container: 'bg-brand-red/10 border-brand-red/20 text-brand-red', icon: AlertCircle },
  warning: { container: 'bg-brand-orange/10 border-brand-orange/20 text-brand-orange', icon: AlertCircle },
  info: { container: 'bg-brand-purple/10 border-brand-purple/20 text-brand-purple', icon: Info },
}

export function Toast() {
  const [data, setData] = useState<ToastData | null>(null)

  useEffect(() => {
    const handleEvent = (toastData: ToastData | null) => {
      setData(toastData)
    }
    toastListeners.push(handleEvent)
    return () => {
      toastListeners = toastListeners.filter((l) => l !== handleEvent)
    }
  }, [])

  useEffect(() => {
    if (data) {
      const timer = setTimeout(() => setData(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [data])

  if (!data) return null

  const { message, variant = 'success' } = data
  const style = variantStyles[variant]
  const Icon = style.icon

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-[999] flex items-center gap-2.5 px-4 py-2.5 rounded-lg border text-[12px] font-medium shadow-lg transition-all duration-300 animate-slide-in',
        style.container
      )}
    >
      <Icon size={14} className="shrink-0" />
      <span className="truncate max-w-[240px]">{message}</span>
      <button
        onClick={() => setData(null)}
        className="ml-1 text-current opacity-60 hover:opacity-100 cursor-pointer shrink-0"
      >
        <X size={12} />
      </button>
    </div>
  )
}
