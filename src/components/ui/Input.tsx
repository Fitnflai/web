import { cn } from '@/utils'
import type { InputHTMLAttributes, ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  iconPrefix?: ReactNode;
  iconSuffix?: ReactNode;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  iconPrefix,
  iconSuffix,
  className,
  containerClassName,
  ...props
}: InputProps) {
  return (
    <div className={cn('flex flex-col gap-1 w-full', containerClassName)}>
      {label && (
        <label className="text-[11px] font-bold text-surface-muted uppercase tracking-wider dark:text-surface-muted">
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        {iconPrefix && (
          <div className="absolute left-3 flex items-center justify-center text-surface-muted">
            {iconPrefix}
          </div>
        )}
        <input
          className={cn(
            'form-input w-full text-[12px] bg-surface-card border border-surface-border rounded-lg py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-orange focus:border-brand-orange disabled:opacity-50 dark:bg-surface-card dark:border-surface-border dark:text-white',
            iconPrefix ? 'pl-9' : 'px-3',
            iconSuffix ? 'pr-9' : 'px-3',
            error ? 'border-brand-red focus:ring-brand-red focus:border-brand-red' : 'border-surface-border',
            className
          )}
          {...props}
        />
        {iconSuffix && (
          <div className="absolute right-3 flex items-center justify-center text-surface-muted">
            {iconSuffix}
          </div>
        )}
      </div>
      {error && (
        <span className="text-[10px] font-semibold text-brand-red dark:text-brand-red/90 pl-1">
          {error}
        </span>
      )}
    </div>
  )
}
