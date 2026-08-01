import { Bell, RefreshCw, UserCircle, Sun, Moon, Globe } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { NAV_TITLES } from '@/constants'
import { useTranslation } from '@/i18n/useTranslation'

export function Topbar() {
  const { currentPage, userRole, setUserRole, setPage, language, setLanguage, isDarkMode, toggleDarkMode } = useAppStore()
  const { t } = useTranslation()
  const title = NAV_TITLES[currentPage] ?? 'Fitnflai Admin'

  const toggleRole = () => {
    const nextRole = userRole === 'admin' ? 'specialist' : 'admin'
    setUserRole(nextRole)
    setPage(nextRole === 'admin' ? 'dashboard' : 'dashboard-especialista')
  }

  const toggleLang = () => {
    setLanguage(language === 'ES' ? 'EN' : 'ES')
  }

  return (
    <header className="h-[50px] bg-surface-panel border-b border-surface-border flex items-center px-5 gap-3 sticky top-0 z-20 flex-shrink-0 dark:bg-surface-panel dark:border-surface-border">
      <h1 className="text-sm font-semibold flex-1 truncate dark:text-white">{title}</h1>
      
      {/* Role Toggle */}
      <button 
        onClick={toggleRole}
        className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] bg-surface-card border border-surface-border rounded-lg hover:border-brand-orange cursor-pointer transition-colors text-current dark:text-white dark:bg-surface-card dark:border-surface-border"
      >
        <UserCircle size={12} />
        <span>{userRole === 'admin' ? 'Admin' : 'Especialista'}</span>
      </button>

      {/* Language Toggle */}
      <button 
        onClick={toggleLang}
        className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] bg-surface-card border border-surface-border rounded-lg hover:border-brand-orange cursor-pointer transition-colors text-current dark:text-white dark:bg-surface-card dark:border-surface-border"
        title="Toggle Language / Cambiar Idioma"
      >
        <Globe size={12} />
        <span>{language}</span>
      </button>

      {/* Theme Toggle */}
      <button 
        onClick={toggleDarkMode}
        className="flex items-center justify-center w-7 h-7 bg-surface-card border border-surface-border rounded-lg hover:border-brand-orange cursor-pointer transition-colors dark:bg-surface-card dark:border-surface-border"
        title="Toggle Theme / Cambiar Tema"
      >
        {isDarkMode ? <Sun size={12} className="text-yellow-400" /> : <Moon size={12} className="text-surface-muted" />}
      </button>

      {/* Search Input */}
      <div className="flex items-center gap-2 bg-surface-card border border-surface-border rounded-lg px-2.5 py-1.5 flex-1 max-w-[220px] dark:bg-surface-card dark:border-surface-border">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-surface-muted shrink-0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input type="search" placeholder="Buscar..." aria-label="Buscar" className="bg-transparent border-0 outline-none text-[12px] text-current dark:text-white w-full placeholder:text-surface-muted" />
      </div>

      {/* Notifications */}
      <button aria-label="Notificaciones" className="w-8 h-8 bg-surface-card border border-surface-border rounded-lg flex items-center justify-center text-surface-muted hover:text-white relative cursor-pointer dark:bg-surface-card dark:border-surface-border">
        <Bell size={15} />
        <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-brand-orange rounded-full border-2 border-surface-panel" />
      </button>

      {/* Refresh */}
      <button aria-label="Actualizar" className="w-8 h-8 bg-surface-card border border-surface-border rounded-lg flex items-center justify-center text-surface-muted hover:text-white cursor-pointer dark:bg-surface-card dark:border-surface-border">
        <RefreshCw size={15} />
      </button>

      {/* Profile */}
      <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center text-[11px] font-bold text-white">AD</div>
    </header>
  )
}
