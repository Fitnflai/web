import { cn } from '@/utils'
import type { ButtonHTMLAttributes } from 'react'

export type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'purple'
export type ButtonSize = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-brand-orange text-white hover:opacity-90 dark:bg-brand-orange dark:hover:opacity-95',
  ghost: 'bg-surface-card text-surface-muted border border-surface-border hover:bg-surface-card2 hover:text-white dark:bg-surface-card dark:border-surface-border dark:hover:bg-surface-card2',
  danger: 'bg-brand-red/10 text-brand-red border border-brand-red/20 hover:bg-brand-red/25',
  purple: 'bg-brand-purple text-white hover:opacity-90 dark:bg-brand-purple dark:hover:opacity-95',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'px-2.5 py-1 text-[11px]',
  md: 'px-3.5 py-[7px] text-[12px]',
}

export function Button({
  variant = 'ghost',
  size = 'md',
  className,
  children,
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-all cursor-pointer border-0 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-brand-orange/50 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin h-3 w-3 text-current shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  )
}
