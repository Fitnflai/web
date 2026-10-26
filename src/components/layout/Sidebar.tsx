import {
  LayoutDashboard, Users, IdCard,
  Crown, Bell, Settings, HelpCircle, CalendarDays,
  UserCircle, ClipboardList, MessageSquare, DollarSign, LogOut, BookOpen, Newspaper
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/utils'
import type { NavPage } from '@/types'
import { useTranslation } from '@/i18n/useTranslation'
import { useQuery } from '@tanstack/react-query'
import { usersService } from '@/services/endpoints/users'
import { notificationsService } from '@/services/endpoints/notifications'
import { specialistsService } from '@/services/endpoints/specialists'

interface NavItem { id: NavPage; labelKey: string; icon: React.ElementType; badge?: number }

export function Sidebar() {
  const navigate = useNavigate()
  const { currentPage, setPage, userRole } = useAppStore()

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('fitnflai_user_role')
    localStorage.removeItem('fitnflai_current_page')
    navigate('/login', { replace: true })
  }
  const { t } = useTranslation()
  const activeBase = (currentPage as string).replace('-detalle', '') as NavPage

  const { data: usersData } = useQuery({
    queryKey: ['adminUsersCount'],
    queryFn: () => usersService.getAdminUsers(1, 1, 'todos', ''),
    enabled: userRole === 'admin',
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
  const usersCount = usersData?.total

  const { data: profStats } = useQuery({
    queryKey: ['adminProfStatsCount'],
    queryFn: usersService.getProfessionalStats,
    enabled: userRole === 'admin',
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
  const specialistsCount = profStats?.total

  const { data: receivedNotifications } = useQuery({
    queryKey: ['receivedNotificationsCount', userRole],
    queryFn: () => {
      if (userRole === 'admin') {
        return notificationsService.getReceivedNotifications()
      }
      return specialistsService.getSpecialistReceivedNotifications()
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const unreadCount = receivedNotifications ? receivedNotifications.filter((n: any) => !n.leido).length : 0

  const adminSections: { title: string; items: NavItem[] }[] = [
    { title: t('sidebar.dashboard'), items: [{ id: 'dashboard', labelKey: 'sidebar.dashboard', icon: LayoutDashboard }] },
    { title: t('sidebar.users'), items: [
      { id: 'usuarios',      labelKey: 'sidebar.users',     icon: Users, badge: usersCount },
      { id: 'profesionales', labelKey: 'sidebar.specialists',icon: IdCard, badge: specialistsCount },

      { id: 'enviar-notificaciones', labelKey: 'sidebar.sendNotifications', icon: Bell,  },
    ]},
    { title: t('sidebar.membership'), items: [
      { id: 'membresias',     labelKey: 'sidebar.membership',     icon: Crown },
      { id: 'transacciones',  labelKey: 'sidebar.transactions',   icon: DollarSign },
    ]},
    { title: t('sidebar.content' as any) || 'Contenido', items: [
      { id: 'glosario', labelKey: 'sidebar.glossary', icon: BookOpen },
      { id: 'blog',     labelKey: 'sidebar.blog',     icon: Newspaper },
    ]},
    { title: t('sidebar.configuration'), items: [      { id: 'notificaciones-recibidas', labelKey: 'sidebar.receivedNotifications', icon: Bell, badge: unreadCount }, { id: 'configuracion', labelKey: 'sidebar.configuration', icon: Settings }] },
  ]

  const specialistSections: { title: string; items: NavItem[] }[] = [
    { title: t('sidebar.dashboard'), items: [{ id: 'dashboard-especialista', labelKey: 'sidebar.dashboard', icon: LayoutDashboard }] },
    { title: t('sidebar.users'), items: [
      { id: 'mis-pacientes',     labelKey: 'sidebar.patients', icon: ClipboardList },
      { id: 'agenda',            labelKey: 'sidebar.agenda',        icon: CalendarDays },
      { id: 'enviar-notificaciones', labelKey: 'sidebar.sendNotifications', icon: Bell },
    ]},
    { title: t('sidebar.configuration'), items: [
      { id: 'notificaciones-recibidas', labelKey: 'sidebar.receivedNotifications', icon: Bell, badge: unreadCount },
      { id: 'perfil-especialista', labelKey: 'sidebar.configuration',       icon: UserCircle },
    ]},
  ]

  const sections = userRole === 'admin' ? adminSections : specialistSections

  return (
    <aside className="w-[220px] bg-surface-panel border-r border-surface-border flex flex-col flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
      <div className="p-4 border-b border-surface-border flex flex-col gap-1.5">
        <div
          onClick={() => setPage(userRole === 'admin' ? 'dashboard' : 'dashboard-especialista')}
          className="flex items-center cursor-pointer select-none group"
        >
          <img
            src="/images/logo.png"
            alt="Fitnflai Logo"
            className="h-7 w-auto object-contain transform group-hover:scale-105 transition-transform duration-200"
          />
        </div>
        <div className="text-[9px] text-brand-orange uppercase tracking-widest font-bold pl-0.5">
          {userRole}
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
      <div className="p-3 border-t border-surface-border space-y-1">
        <button className="nav-item w-full text-left"><HelpCircle size={16} /><span>{t('sidebar.support')}</span></button>
        <button
          onClick={handleLogout}
          className="nav-item w-full text-left text-brand-red hover:text-brand-red hover:bg-brand-red/10 transition-colors"
        >
          <LogOut size={16} className="text-brand-red flex-shrink-0" />
          <span>{t('sidebar.logout' as any) || 'Cerrar Sesión'}</span>
        </button>
      </div>
    </aside>
  )
}
