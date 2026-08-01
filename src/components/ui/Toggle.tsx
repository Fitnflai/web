import { cn } from '@/utils'
export function Toggle({ checked, onChange, className, disabled = false }: { checked: boolean; onChange: (v: boolean) => void; className?: string; disabled?: boolean }) {
  return (
    <button role="switch" aria-checked={checked} onClick={() => !disabled && onChange(!checked)} disabled={disabled}
      className={cn('relative w-8 h-[18px] rounded-full transition-colors border-0', checked ? 'bg-brand-orange' : 'bg-surface-border', disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer', className)}>
      <span className={cn('absolute top-[3px] w-3 h-3 bg-white rounded-full transition-all', checked ? 'left-[17px]' : 'left-[3px]')} />
    </button>
  )
}
