import { useState } from 'react'
import { Send } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useAppStore } from '@/store/useAppStore'
import { notificationsService } from '@/services/endpoints/notifications'

const RECIPIENT_LABELS: Record<string, string> = {
  todos_los_usuarios: 'Todos los usuarios',
  solo_pacientes: 'Solo pacientes',
  pro_elite: 'Pro + Elite',
  inactivos_7_dias: 'Inactivos +7 días',
  sin_checkin_hoy: 'Sin check-in hoy',
  onboarding_incompleto: 'Onboarding incompleto',
}

export function NotificacionesPage() {
  const { showToast } = useAppStore()
  const queryClient = useQueryClient()
  const [titulo, setTitulo] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [dest, setDest] = useState('todos_los_usuarios')

  const staleTime = 5 * 60 * 1000 // 5 minutes

  const { data: stats, isLoading: isLoadingStats, isError: isErrorStats, error: errorStats } = useQuery({
    queryKey: ['adminNotificationStats'],
    queryFn: notificationsService.getStats,
    staleTime,
  })

  const { data: recipientCounts, isLoading: isLoadingCounts, isError: isErrorCounts } = useQuery({
    queryKey: ['adminRecipientCounts'],
    queryFn: notificationsService.getCounts,
    staleTime,
  })

  const { data: recentCampaigns, isLoading: isLoadingRecent, isError: isErrorRecent, error: errorRecent } = useQuery({
    queryKey: ['adminRecentCampaigns'],
    queryFn: notificationsService.getRecent,
    staleTime,
  })

  const sendNotificationMutation = useMutation({
    mutationFn: notificationsService.send,
    onSuccess: () => {
      // Invalidate stats and recent campaigns to trigger automatic UI refreshes
      queryClient.invalidateQueries({ queryKey: ['adminRecentCampaigns'] });
      queryClient.invalidateQueries({ queryKey: ['adminNotificationStats'] });
      
      // Clear form fields
      setTitulo('');
      setMensaje('');
      
      showToast('Notificación enviada con éxito');
    },
    onError: (error: any) => {
      showToast(`Error al enviar notificación: ${error.message || error}`);
    }
  });

  return (
    <div>
      <div className="flex items-start justify-between mb-5 gap-3 flex-wrap">
        <div><h2 className="text-lg font-bold">Notificaciones</h2><p className="text-[12px] text-surface-muted mt-0.5">Envío de mensajes push</p></div>
        <Button variant="primary" className="gap-1.5"><Send size={13}/>Nueva</Button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="card-base">
          <div className="text-[13px] font-semibold mb-4">Enviar notificación</div>
          <div className="mb-3"><div className="form-label">Título</div><input className="form-input" type="text" placeholder="¡Tu sesión de hoy te espera!" value={titulo} onChange={e => setTitulo(e.target.value)} /></div>
          <div className="mb-3"><div className="form-label">Mensaje</div><textarea className="form-input resize-y" rows={3} placeholder="Texto del push..." value={mensaje} onChange={e => setMensaje(e.target.value)} /></div>
          <div className="mb-4"><div className="form-label">Destinatarios</div>
            <select className="form-input" value={dest} onChange={e=>setDest(e.target.value)} disabled={isLoadingCounts}>
              {isLoadingCounts && <option value="">Cargando destinatarios...</option>}
              {!isLoadingCounts && !isErrorCounts && recipientCounts && (
                <>{Object.keys(recipientCounts).map(key => (
                  <option key={key} value={key}>{`${RECIPIENT_LABELS[key] || key} (${(recipientCounts as any)[key]?.toLocaleString() ?? '0'})`}</option>
                ))}</>
              )}
            </select>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" className="flex-1 py-2 text-[12px]">Vista previa</Button>
            <Button
              onClick={() => {
                if (titulo.trim() === '' || mensaje.trim() === '') {
                  showToast('Por favor, completa el título y el mensaje');
                  return;
                }
                sendNotificationMutation.mutate({
                  titulo: titulo.trim(),
                  mensaje: mensaje.trim(),
                  destinatarios_filtro: dest as any,
                  fecha_programada: null
                });
              }}
              variant="primary"
              className="flex-1 py-2 text-[12px] gap-1.5"
              disabled={sendNotificationMutation.isPending}
            >
              {sendNotificationMutation.isPending ? 'Enviando...' : <><Send size={13}/>Enviar</>}
            </Button>
          </div>
        </div>
        <div className="card-base">
          <div className="text-[13px] font-semibold mb-4">Estadísticas</div>
          <div className="grid grid-cols-2 gap-2">
            {isLoadingStats && (
              <>{
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-surface-card2 rounded-xl p-3 text-center animate-pulse h-16"></div>
                ))
              }</>
            )}

              {isErrorStats && (
                <div className="col-span-2 text-center text-red-400 bg-red-950/10 border border-red-900/20 rounded-xl p-3 text-[11px] font-mono leading-relaxed">
                  Error estadísticas: {(errorStats as any)?.response?.status ? `[HTTP ${(errorStats as any).response.status}] ` : ''}
                  {(errorStats as any)?.response?.data?.message || (errorStats as any)?.message || 'Error de conexión'}
                </div>
              )}

            {!isLoadingStats && !isErrorStats && stats && (
              <>
                <div className="bg-surface-card2 rounded-xl p-3 text-center"><div className="text-[20px] font-bold" style={{ color: '#E8622A' }}>{stats.enviadas_hoy?.toLocaleString() ?? '0'}</div><div className="text-[10px] text-surface-muted mt-0.5">Enviados hoy</div></div>
                <div className="bg-surface-card2 rounded-xl p-3 text-center"><div className="text-[20px] font-bold" style={{ color: '#4CAF82' }}>{(stats.apertura_promedio ?? 0) + '%'}</div><div className="text-[10px] text-surface-muted mt-0.5">Apertura</div></div>
                <div className="bg-surface-card2 rounded-xl p-3 text-center"><div className="text-[20px] font-bold" style={{ color: '#4A7CC7' }}>{stats.total_promedio?.toLocaleString() ?? '0'}</div><div className="text-[10px] text-surface-muted mt-0.5">Total promedio</div></div>
                <div className="bg-surface-card2 rounded-xl p-3 text-center"><div className="text-[20px] font-bold">{stats.mas_popular || '—'}</div><div className="text-[10px] text-surface-muted mt-0.5">Más popular</div></div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="text-[10px] text-surface-muted uppercase tracking-[0.8px] font-semibold mb-3">Enviadas recientemente</div>
      {isLoadingRecent && (
        <>{Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-surface-border bg-surface-card mb-2.5 animate-pulse h-20"></div>
        ))}</>
      )}

      {isErrorRecent && (
        <div className="p-4 rounded-xl border border-red-900/20 bg-red-950/10 text-red-400 text-center text-[11px] font-mono mb-2.5">
          Error campañas: {(errorRecent as any)?.response?.status ? `[HTTP ${(errorRecent as any).response.status}] ` : ''}
          {(errorRecent as any)?.response?.data?.message || (errorRecent as any)?.message || 'Error de conexión'}
        </div>
      )}

      {!isLoadingRecent && !isErrorRecent && recentCampaigns && (
        <>{recentCampaigns.map((r: any, i: number) => {
          const isSent = r.estado === 'enviada'
          const icon = isSent ? '🏋️' : '⏰'
          const color = isSent ? '#E8622A' : '#4A7CC7'
          const badgeVariant = isSent ? 'green' : 'blue'
          const badgeText = isSent ? 'Enviada' : 'Programada'

          const subtitleText = `${RECIPIENT_LABELS[r.destinatarios_filtro] || r.destinatarios_filtro} · ${r.tiempo_transcurrido || r.fecha_programada || ''} ${r.porcentaje_apertura !== undefined ? `· ${r.porcentaje_apertura}% apertura` : ''}`

          return (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-surface-border bg-surface-card mb-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-base" style={{ background: `${color}22` }}>{icon}</div>
              <div className="flex-1">
                <div className="text-[12px] font-medium">{r.titulo}</div>
                <div className="text-[11px] text-surface-muted mt-0.5">{subtitleText}</div>
              </div>
              <Badge variant={badgeVariant}>{badgeText}</Badge>
            </div>
          )
        })}</>
      )}
    </div>
  )
}
