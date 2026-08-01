import { cn } from '@/utils'
import type { BadgeVariant } from '@/types'

const variants: Record<BadgeVariant, string> = {
  green: 'badge-green', orange: 'badge-orange', blue: 'badge-blue',
  yellow: 'badge-yellow', red: 'badge-red', purple: 'badge-purple', muted: 'badge-muted',
}

export function Badge({ variant = 'muted', children, className }: { variant?: BadgeVariant; children: React.ReactNode; className?: string }) {
  return <span className={cn('badge', variants[variant], className)}>{children}</span>
}
