import { cn } from '@/utils'
export function ProgressBar({ value, color='#E8622A', height='h-1.5', className }: { value: number; color?: string; height?: string; className?: string }) {
  return (
    <div className={cn('w-full bg-surface-border rounded-full overflow-hidden', height, className)}>
      <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100,Math.max(0,value))}%`, background: color }} />
    </div>
  )
}
