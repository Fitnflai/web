import { cn } from '@/utils'
export function StatCard({ label, value, delta, deltaUp, valueColor, className }: { label: string; value: string|number; delta?: string; deltaUp?: boolean; valueColor?: string; className?: string }) {
  return (
    <div className={cn('stat-card', className)}>
      <div className="text-[10px] text-surface-muted uppercase tracking-[0.7px] mb-1.5">{label}</div>
      <div className="text-[22px] font-bold leading-none" style={valueColor ? {color:valueColor} : undefined}>{value}</div>
      {delta && <div className={cn('text-[11px] mt-1 flex items-center gap-1', deltaUp ? 'text-brand-green' : 'text-surface-muted')}>{delta}</div>}
    </div>
  )
}
