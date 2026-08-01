import { cn } from '@/utils'
const S = { sm: 'w-7 h-7 text-[10px]', md: 'w-8 h-8 text-[11px]', lg: 'w-14 h-14 text-xl' }
export function Avatar({ initials, color='#E8622A', size='md', className }: { initials: string; color?: string; size?: 'sm'|'md'|'lg'; className?: string }) {
  return <div className={cn('rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0', S[size], className)} style={{ background: color }}>{initials}</div>
}
