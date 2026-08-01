import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search, X } from 'lucide-react'
import { cn } from '@/utils'

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select an option...',
  disabled = false,
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (val: string) => {
    onChange(val)
    setIsOpen(false)
    setSearch('')
  }

  return (
    <div className={cn('flex flex-col gap-1 w-full relative', className)} ref={containerRef}>
      {label && (
        <label className="text-[11px] font-bold text-surface-muted uppercase tracking-wider">
          {label}
        </label>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-[12px] bg-surface-card border border-surface-border rounded-lg px-3 py-1.5 text-left text-white focus:outline-none focus:ring-1 focus:ring-brand-orange focus:border-brand-orange disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className={cn('truncate', !selectedOption && 'text-surface-muted')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={14} className="text-surface-muted shrink-0 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute top-[100%] left-0 w-full mt-1 bg-surface-panel border border-surface-border rounded-lg shadow-lg z-[100] flex flex-col p-1.5 max-h-[220px] overflow-hidden">
          <div className="flex items-center gap-1.5 px-2 py-1.5 bg-surface-card border border-surface-border rounded-md mb-1 text-[11px]">
            <Search size={12} className="text-surface-muted shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="bg-transparent border-0 outline-none text-white text-[11px] w-full"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="text-surface-muted hover:text-white"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto pr-0.5">
            {filteredOptions.length === 0 ? (
              <div className="text-[11px] text-surface-muted p-2 text-center">No results</div>
            ) : (
              filteredOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={cn(
                    'w-full text-left text-[11px] px-2 py-1.5 rounded hover:bg-brand-orange hover:text-white transition-colors cursor-pointer text-white',
                    opt.value === value && 'bg-brand-orange/20 text-brand-orange'
                  )}
                >
                  {opt.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
