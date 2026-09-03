import { useState } from 'react'
import { Bell, Check, Clock } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Badge } from '@/components/ui/Badge'
import { specialistsService, SpecialistReceivedNotification } from '@/services/endpoints/specialists'

export function NotificacionesRecibidasPage() {
  const [readIds, setReadIds] = useState<string[]>([])

  const { data: receivedNotifications, isLoading, isError, error } = useQuery<SpecialistReceivedNotification[]>(
    { queryKey: ['specialistReceivedNotifications'],
      queryFn: specialistsService.getSpecialistReceivedNotifications,
    }
  )

  const markNotificationAsRead = (id: string) => {
    setReadIds(prev => [...prev, id])
  }

  const getReceivedNotificationBadgeVariant = (type: string) => {
    switch (type.toLowerCase()) {
      case 'alerta':
        return 'red'
      case 'cumplimiento':
        return 'green'
      case 'onboarding':
        return 'blue'
      case 'info':
        return 'orange'
      case 'warning':
        return 'yellow'
      default:
        return 'muted'
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between mb-5 gap-3 flex-wrap text-left">
        <div>
          <h2 className="text-lg font-bold">Notificaciones Recibidas</h2>
          <p className="text-[12px] text-surface-muted mt-0.5">Alertas y reportes en tiempo real de tus alumnos asignados</p>
        </div>
      </div>

      <div className="card-base p-5 bg-surface-card border border-surface-border rounded-xl text-left">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Bell size={16} className="text-brand-yellow" />
          Centro de Alertas de Alumnos
        </h3>
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start space-x-3 p-3 bg-surface-card2 rounded-lg border border-surface-border animate-pulse h-20"></div>
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center py-6 text-red-400 text-[12px]">Error cargando notificaciones: {(error as any)?.message}</div>
        )}

        {!isLoading && !isError && receivedNotifications?.length === 0 ? (
          <div className="text-center py-6 text-surface-muted text-[12px]">No hay alertas recientes.</div>
        ) : (
          <div className="space-y-3">
            {receivedNotifications?.map((notification) => {
              const isRead = notification.leido || readIds.includes(notification.id_notificacion);
              return (
                <div
                  key={notification.id_notificacion}
                  className={`flex items-start space-x-3 p-3 bg-surface-card2 rounded-lg border border-surface-border transition-all duration-300 ${isRead ? 'opacity-50' : 'border-brand-blue/30'}`}
                >
                  <div className="flex-1">
                    <div className="flex justify-between items-start md:items-center gap-2 mb-1 flex-wrap md:flex-nowrap">
                      <p className="text-white font-semibold text-[13px] text-left">{notification.mensaje}</p>
                      <Badge variant={getReceivedNotificationBadgeVariant(notification.tipo) as any} className="shrink-0 mt-0.5">
                        {notification.tipo}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-surface-muted mt-1.5">
                      <span>Campaña: {notification.id_campania}</span>
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {notification.tiempo_transcurrido}
                      </span>
                    </div>
                  </div>
                  {!isRead && (
                    <button
                      onClick={() => markNotificationAsRead(notification.id_notificacion)}
                      className="flex-shrink-0 text-brand-blue hover:text-brand-blue/80 text-[11px] font-medium flex items-center gap-1 bg-transparent border-0 cursor-pointer p-0"
                    >
                      <Check size={12} /> Marcar como leída
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  )
}
