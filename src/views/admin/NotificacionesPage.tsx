import { useState } from 'react'
import { Send } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useAppStore } from '@/store/useAppStore'

export function NotificacionesPage() {
  const { showToast } = useAppStore()
  const [titulo, setTitulo] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [dest, setDest] = useState('Todos los usuarios (2,481)')

  const recientes = [
    { icon:'🏋️', color:'#E8622A', title:'¡Tu sesión de hoy te espera!', sub:'Todos · hace 2h · 68% apertura', est:'Enviada', estV:'green' as const },
    { icon:'👑', color:'#F5C842', title:'Desbloquea tu plan con Pro', sub:'Essential inactivos · hace 1 día · 42%', est:'Enviada', estV:'green' as const },
    { icon:'⏰', color:'#4A7CC7', title:'Recordatorio semanal de progreso', sub:'Todos · Mañana 8:00 AM', est:'Programada', estV:'blue' as const },
  ]

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
            <select className="form-input" value={dest} onChange={e=>setDest(e.target.value)}>
              {['Todos los usuarios (2,481)','Solo pacientes (87)','Pro + Elite (723)','Inactivos +7 días','Sin check-in hoy','Onboarding incompleto'].map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" className="flex-1 py-2 text-[12px]">Vista previa</Button>
            <Button onClick={() => { showToast(`Notificación enviada a ${dest}`); setTitulo(''); setMensaje('') }} variant="primary" className="flex-1 py-2 text-[12px] gap-1.5"><Send size={13}/>Enviar</Button>
          </div>
        </div>
        <div className="card-base">
          <div className="text-[13px] font-semibold mb-4">Estadísticas</div>
          <div className="grid grid-cols-2 gap-2">
            {[['2,481','Enviados hoy','#E8622A'],['68%','Apertura','#4CAF82'],['34%','Clic','#4A7CC7'],['12','Campañas','']].map(([v,l,c])=>(
              <div key={l} className="bg-surface-card2 rounded-xl p-3 text-center"><div className="text-[20px] font-bold" style={c?{color:c}:undefined}>{v}</div><div className="text-[10px] text-surface-muted mt-0.5">{l}</div></div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-[10px] text-surface-muted uppercase tracking-[0.8px] font-semibold mb-3">Enviadas recientemente</div>
      {recientes.map((r,i) => (
        <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-surface-border bg-surface-card mb-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-base" style={{background:`${r.color}22`}}>{r.icon}</div>
          <div className="flex-1">
            <div className="text-[12px] font-medium">{r.title}</div>
            <div className="text-[11px] text-surface-muted mt-0.5">{r.sub}</div>
          </div>
          <Badge variant={r.estV}>{r.est}</Badge>
        </div>
      ))}
    </div>
  )
}
