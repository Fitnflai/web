import { useState } from 'react'
import { Bell, Check, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

export function NotificacionesRecibidasPage() {
  const [receivedNotifications, setReceivedNotifications] = useState([
    { id: 1, text: 'Falcao García reportó dolor leve en la rodilla derecha en su entrenamiento de cuestas.', patient: 'Falcao García', type: 'Alerta', date: 'Hoy 10:45', unread: true },
    { id: 2, text: 'Luisa Peña completó el 100% de la hidratación programada hoy.', patient: 'Luisa Peña', type: 'Cumplimiento', date: 'Hoy 09:15', unread: true },
    { id: 3, text: 'Miguel Torres completó el registro de Onboarding básico.', patient: 'Miguel Torres', type: 'Onboarding', date: 'Ayer', unread: false }
  ])

  const markNotificationAsRead = (id: number) => {
    setReceivedNotifications(prevNotifications =>
      prevNotifications.map(notif =>
        notif.id === id ? { ...notif, unread: false } : notif
      )
    )
  }

  const getReceivedNotificationBadgeVariant = (type: string) => {
    switch (type) {
      case 'Alerta':
        return 'red'
      case 'Cumplimiento':
        return 'green'
      case 'Onboarding':
        return 'blue'
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
        {receivedNotifications.length === 0 ? (
          <div className="text-center py-6 text-surface-muted text-[12px]">No hay alertas recientes.</div>
        ) : (
          <div className="space-y-3">
            {receivedNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start space-x-3 p-3 bg-surface-card2 rounded-lg border border-surface-border transition-all duration-300 ${notification.unread ? 'border-brand-blue/30' : 'opacity-50'}`}
              >
                <div className="flex-1">
                  <div className="flex justify-between items-start md:items-center gap-2 mb-1 flex-wrap md:flex-nowrap">
                    <p className="text-white font-semibold text-[13px] text-left">{notification.text}</p>
                    <Badge variant={getReceivedNotificationBadgeVariant(notification.type) as any} className="shrink-0 mt-0.5">
                      {notification.type}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-surface-muted mt-1.5">
                    <span>Paciente: {notification.patient}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {notification.date}
                    </span>
                  </div>
                </div>
                {notification.unread && (
                  <button
                    onClick={() => markNotificationAsRead(notification.id)}
                    className="flex-shrink-0 text-brand-blue hover:text-brand-blue/80 text-[11px] font-medium flex items-center gap-1 bg-transparent border-0 cursor-pointer p-0"
                  >
                    <Check size={12} /> Marcar como leída
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
