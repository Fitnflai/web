import { useEffect, useState, useRef } from 'react'
import { Bell, RefreshCw, Sun, Moon, Globe, ChevronDown } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '@/store/useAppStore'
import { profileService } from '@/services/endpoints/users'
import { specialistsService } from '@/services/endpoints/specialists'

declare global {
  interface Window {
    google: any
  }
}

const LANGUAGES = [
  { code: '', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
]

function changeGoogleTranslateLanguage(langCode: string) {
  if (!langCode) {
    // Revert to original: clear googtrans cookie and reload
    const domain = window.location.hostname
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain};`
    window.location.reload()
    return
  }

  const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null
  if (select) {
    select.value = langCode
    select.dispatchEvent(new Event('change'))
  }
}

export function Topbar() {
  const { userRole, isDarkMode, toggleDarkMode } = useAppStore()
  const [langOpen, setLangOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState(LANGUAGES[0])
  const [imgError, setImgError] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)

  const { data: adminProfile } = useQuery({
    queryKey: ['adminProfile'],
    queryFn: () => profileService.getAdminProfile(),
    enabled: userRole === 'admin',
    staleTime: 1000 * 60 * 10,
  })

  const { data: specialistProfile } = useQuery({
    queryKey: ['specialistProfile'],
    queryFn: specialistsService.getSpecialistProfile,
    enabled: userRole === 'specialist',
    staleTime: 1000 * 60 * 10,
  })

  const userName =
    (userRole === 'admin' ? adminProfile?.admin?.nombre : specialistProfile?.nombre) ||
    localStorage.getItem('fitnflai_user_name') ||
    (userRole === 'admin' ? 'Administrador' : 'Especialista')

  const avatarUrl =
    userRole === 'admin'
      ? adminProfile?.admin?.avatar_url
      : (specialistProfile?.avatar_url || localStorage.getItem('fitnflai_specialist_avatar'))

  const initials = userName
    ? userName
        .trim()
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0].toUpperCase())
        .join('')
    : 'U'

  // Initialize Google Translate (hidden)
  useEffect(() => {
    const initTranslate = () => {
      const el = document.getElementById('google_translate_element')
      if (window.google?.translate?.TranslateElement && el && !el.hasChildNodes()) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'es',
            includedLanguages: 'en,es,pt,fr,de,it',
            autoDisplay: false,
          },
          'google_translate_element'
        )
      }
    }

    initTranslate()
    const interval = setInterval(() => {
      if (window.google?.translate?.TranslateElement) {
        initTranslate()
        clearInterval(interval)
      }
    }, 500)

    return () => clearInterval(interval)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const selectLanguage = (lang: typeof LANGUAGES[number]) => {
    setCurrentLang(lang)
    changeGoogleTranslateLanguage(lang.code)
    setLangOpen(false)
  }

  return (
    <header className="h-[50px] bg-surface-panel border-b border-surface-border flex items-center px-5 gap-3 sticky top-0 z-20 flex-shrink-0 dark:bg-surface-panel dark:border-surface-border">
      {/* Avatar y Nombre del Usuario conectado a la izquierda */}
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        {avatarUrl && !imgError ? (
          <img
            src={avatarUrl}
            alt={userName}
            onError={() => setImgError(true)}
            className="w-8 h-8 rounded-full object-cover border border-surface-border flex-shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 shadow-sm">
            {initials}
          </div>
        )}
        <span className="text-sm font-semibold truncate text-current dark:text-white">
          {userName}
        </span>
      </div>

      {/* Selector de Idioma Custom (Google Translate) */}
      <div ref={langRef} className="relative">
        <button
          onClick={() => setLangOpen(!langOpen)}
          className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] bg-surface-card border border-surface-border rounded-lg hover:border-brand-orange cursor-pointer transition-colors text-current dark:text-white dark:bg-surface-card dark:border-surface-border"
        >
          <Globe size={12} />
          <span>{currentLang.flag} {currentLang.label}</span>
          <ChevronDown size={10} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
        </button>

        {langOpen && (
          <div className="absolute top-full right-0 mt-1 bg-surface-card border border-surface-border rounded-lg shadow-lg overflow-hidden z-50 min-w-[140px] dark:bg-surface-card dark:border-surface-border">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => selectLanguage(lang)}
                className={`w-full text-left px-3 py-1.5 text-[11px] flex items-center gap-2 hover:bg-brand-orange/10 transition-colors cursor-pointer ${
                  currentLang.code === lang.code
                    ? 'text-brand-orange font-semibold'
                    : 'text-current dark:text-white'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Widget Google Translate oculto */}
      <div id="google_translate_element" className="!absolute !opacity-0 !pointer-events-none !h-0 !overflow-hidden"></div>

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
    </header>
  )
}
