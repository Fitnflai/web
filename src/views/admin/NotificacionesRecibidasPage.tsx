import { useState } from 'react'
import { Bell, Check, Clock } from 'lucide-react'
import { cn } from '@/utils'
import { Badge } from '@/components/ui/Badge'

export function NotificacionesRecibidasPage() {
  const [receivedNotifications, setReceivedNotifications] = useState([
    { id: 1, text: 'Se registró un nuevo profesional en la plataforma: Dr. Alejandro Ríos (Cardiólogo).', type: 'Registro', date: 'Hoy 09:30', unread: true },
    { id: 2, text: 'Suscripción procesada: Pago exitoso de la membresía Elite de Ana Martínez.', type: 'Pago', date: 'Ayer', unread: true },
    { id: 3, text: 'Nueva renovación de membresía por Falcao García.', type: 'Suscripción', date: 'Hace 2 días', unread: false }
  ])

  const markNotificationAsRead = (id: number) => {
    setReceivedNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n))
  }

  const getReceivedNotificationBadgeVariant = (type: string) => {
    switch (type) {
      case 'Registro': return 'blue'
      case 'Pago': return 'green'
      case 'Soporte': return 'orange'
      default: return 'muted'
    }
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-5 gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-bold">Notificaciones Recibidas</h2>
          <p className="text-[12px] text-surface-muted mt-0.5">Alertas y reportes en tiempo real de la plataforma</p>
        </div>
      </div>
      <div className="card-base p-5 bg-surface-card border border-surface-border rounded-xl mt-4">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Bell size={16} className="text-brand-yellow" />
          Centro de Alertas de Alumnos y Profesionales
        </h3>
        {receivedNotifications.length === 0 ? (
          <div className="text-center py-6 text-surface-muted text-[12px]">No hay alertas recientes.</div>
        ) : (
          <div className="space-y-3">
            {receivedNotifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "flex items-start space-x-3 p-3 bg-surface-card2 rounded-lg border border-surface-border transition-all duration-300",
                  notification.unread ? "border-brand-blue/30" : "opacity-50"
                )}
              >
                <div className="flex-1">
                  <div className="flex justify-between items-start md:items-center gap-2 mb-1 flex-wrap md:flex-nowrap">
                    <p className="text-white font-semibold text-[13px] text-left">{notification.text}</p>
                    <Badge variant={getReceivedNotificationBadgeVariant(notification.type) as any} className="shrink-0 mt-0.5">
                      {notification.type}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-surface-muted mt-1.5">
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