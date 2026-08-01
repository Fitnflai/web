import { createPortal } from 'react-dom'
import { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/utils'
import type { ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
  depth?: number; // Handles nesting z-index
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  depth = 0,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open')
    }
    return () => {
      const activeModals = document.querySelectorAll('.nested-modal-container')
      if (activeModals.length <= 1) {
        document.body.classList.remove('modal-open')
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const zIndexOverlay = 50 + depth * 10
  const zIndexContent = 51 + depth * 10

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-4 nested-modal-container"
      style={{ zIndex: zIndexOverlay }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className={cn(
          'relative bg-surface-panel border border-surface-border rounded-2xl p-5 w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl transition-all dark:bg-surface-panel dark:border-surface-border dark:text-white',
          className
        )}
        style={{ zIndex: zIndexContent }}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-[14px] font-bold">{title}</span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-surface-card border border-surface-border flex items-center justify-center text-surface-muted hover:text-white cursor-pointer transition-colors"
          >
            <X size={14} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  )
}
