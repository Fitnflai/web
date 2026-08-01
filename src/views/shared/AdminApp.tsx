import { useAppStore } from '@/store/useAppStore'
import { DashboardPage }       from '@/views/admin/DashboardPage'
import { UsuariosPage }        from '@/views/admin/UsuariosPage'
import { UserDetailPage }      from '@/views/admin/UserDetailPage'
import { ProfesionalesPage }   from '@/views/admin/ProfesionalesPage'
import { MembresíasPage }      from '@/views/admin/MembresíasPage'
import { NotificacionesPage }  from '@/views/admin/NotificacionesPage'
import { ConfiguracionPage }   from '@/views/admin/ConfiguracionPage'
import { TransaccionesPage }   from '@/views/admin/TransaccionesPage'
import { NotificacionesRecibidasPage as AdminNotificacionesRecibidasPage } from '@/views/admin/NotificacionesRecibidasPage'
import { AgendaPage }          from '@/views/shared/AgendaPage'
import { LandingPage }         from '@/views/LandingPage'
import { PoliticaPrivacidadPage } from '@/views/PoliticaPrivacidadPage'
import { TerminosCondicionesPage } from '@/views/TerminosCondicionesPage'

import { DashboardEspecialista } from '@/views/specialist/DashboardEspecialista'
import { MisPacientesPage }      from '@/views/specialist/MisPacientesPage'
import { PerfilEspecialista }    from '@/views/specialist/PerfilEspecialista'
import { UserDetailPage as SpecialistUserDetailPage } from '@/views/specialist/UserDetailPage'
import { NotificacionesRecibidasPage } from '@/views/specialist/NotificacionesRecibidasPage'

export function AdminApp() {
  const { currentPage, userRole } = useAppStore()

  if (userRole === 'specialist') {
    switch (currentPage) {
      case 'dashboard-especialista': return <DashboardEspecialista />
      case 'mis-pacientes':          return <MisPacientesPage />
      case 'usuarios':               return <MisPacientesPage />
      case 'pacientes':              return <MisPacientesPage />
      case 'usuario-detalle':
      case 'paciente-detalle':       return <SpecialistUserDetailPage />
      case 'agenda':                 return <AgendaPage />
      case 'enviar-notificaciones':  return <NotificacionesPage />
      case 'notificaciones-recibidas': return <NotificacionesRecibidasPage />
      case 'perfil-especialista':    return <PerfilEspecialista />
      default:                       return <DashboardEspecialista />
    }
  }

  // Vista Admin
  switch (currentPage) {
    case 'dashboard':       return <DashboardPage />
    case 'usuarios':        return <UsuariosPage />
    case 'usuario-detalle': return <UserDetailPage />
    case 'profesionales':
    case 'prof-detalle':    return <ProfesionalesPage />
    case 'membresias':      return <MembresíasPage />
    case 'enviar-notificaciones':  return <NotificacionesPage />
    case 'notificaciones-recibidas': return <AdminNotificacionesRecibidasPage />
    case 'configuracion':   return <ConfiguracionPage />
    case 'agenda':          return <AgendaPage />
    case 'transacciones':   return <TransaccionesPage />

    case 'landing':         return <LandingPage />
    case 'politica-privacidad': return <PoliticaPrivacidadPage />
    case 'terminos-condiciones': return <TerminosCondicionesPage />
    default:                return <DashboardPage />
  }
}
