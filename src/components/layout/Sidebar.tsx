import {
  LayoutDashboard, Users, IdCard,
  Crown, Bell, Settings, HelpCircle, CalendarDays,
  UserCircle, ClipboardList, MessageSquare, DollarSign
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/utils'
import type { NavPage } from '@/types'
import { useTranslation } from '@/i18n/useTranslation'

interface NavItem { id: NavPage; labelKey: string; icon: React.ElementType; badge?: number }

export function Sidebar() {
  const { currentPage, setPage, userRole } = useAppStore()
  const { t } = useTranslation()
  const activeBase = (currentPage as string).replace('-detalle', '') as NavPage

  const adminSections: { title: string; items: NavItem[] }[] = [
    { title: t('sidebar.dashboard'), items: [{ id: 'dashboard', labelKey: 'sidebar.dashboard', icon: LayoutDashboard }] },
    { title: t('sidebar.users'), items: [
      { id: 'usuarios',      labelKey: 'sidebar.users',     icon: Users,       badge: 248 },
      { id: 'profesionales', labelKey: 'sidebar.specialists',icon: IdCard,      badge: 12  },
      { id: 'agenda',        labelKey: 'sidebar.agenda',  icon: CalendarDays },
      { id: 'enviar-notificaciones', labelKey: 'sidebar.sendNotifications', icon: Bell, badge: 3 },
    ]},
    { title: t('sidebar.membership'), items: [
      { id: 'membresias',     labelKey: 'sidebar.membership',     icon: Crown },
      { id: 'transacciones',  labelKey: 'sidebar.transactions',   icon: DollarSign },
    ]},
    { title: t('sidebar.configuration'), items: [{ id: 'notificaciones-recibidas', labelKey: 'sidebar.receivedNotifications', icon: Bell, badge: 2 }, { id: 'configuracion', labelKey: 'sidebar.configuration', icon: Settings }] },
  ]

  const specialistSections: { title: string; items: NavItem[] }[] = [
    { title: t('sidebar.dashboard'), items: [{ id: 'dashboard-especialista', labelKey: 'sidebar.dashboard', icon: LayoutDashboard }] },
    { title: t('sidebar.users'), items: [
      { id: 'mis-pacientes',     labelKey: 'sidebar.patients', icon: ClipboardList },
      { id: 'agenda',            labelKey: 'sidebar.agenda',        icon: CalendarDays },
      { id: 'enviar-notificaciones', labelKey: 'sidebar.sendNotifications', icon: Bell },
    ]},
    { title: t('sidebar.configuration'), items: [
      { id: 'notificaciones-recibidas', labelKey: 'sidebar.receivedNotifications', icon: Bell, badge: 2 },
      { id: 'perfil-especialista', labelKey: 'sidebar.configuration',       icon: UserCircle },
    ]},
  ]

  const sections = userRole === 'admin' ? adminSections : specialistSections

  return (
    <aside className="w-[220px] bg-surface-panel border-r border-surface-border flex flex-col flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
      <div className="p-4 border-b border-surface-border flex items-center gap-2.5">
        <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center text-sm font-extrabold text-white flex-shrink-0">F</div>
        <div>
          <div className="text-sm font-bold">Fitnflai</div>
          <div className="text-[9px] text-brand-orange uppercase tracking-widest">{userRole}</div>
        </div>
      </div>
      <nav className="flex-1 py-2">
        {sections.map((s, idx) => (
          <div key={idx}>
            <div className="px-2 pt-3 pb-1 text-[9px] text-surface-muted uppercase tracking-[1.2px] font-semibold">{s.title}</div>
            {s.items.map((item) => {
              const Icon = item.icon
              const isActive = activeBase === item.id
              return (
                <button key={item.id} onClick={() => setPage(item.id)}
                  className={cn('nav-item w-full text-left', isActive && 'active')}
                  aria-current={isActive ? 'page' : undefined}>
                  <Icon size={16} className="flex-shrink-0" />
                  <span className="truncate">{t(item.labelKey as any)}</span>
                  {item.badge && (
                    <span className={cn('ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-semibold', isActive ? 'bg-white/25 text-white' : 'bg-brand-orange text-white')}>{item.badge}</span>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </nav>
      <div className="p-3 border-t border-surface-border">
        <button className="nav-item w-full text-left"><HelpCircle size={16} /><span>{t('sidebar.support')}</span></button>
      </div>
    </aside>
  )
}
