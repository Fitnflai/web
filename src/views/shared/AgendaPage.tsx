import { useState, useMemo } from 'react'
import {
  ChevronLeft, ChevronRight, Plus, Video, Clock,
  CheckCircle, XCircle, AlertCircle, Calendar,
  User, Stethoscope, X, Check,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Toggle } from '@/components/ui/Toggle'
import { Modal } from '@/components/ui/Modal'
import { StatCard } from '@/components/ui/StatCard'
import { useAppStore } from '@/store/useAppStore'
import { MOCK_APPOINTMENTS, MOCK_AVAILABILITY } from '@/services/mocks/agenda.mock'
import { MOCK_PROFESSIONALS } from '@/services/mocks/professionals.mock'
import { cn } from '@/utils'
import type { Appointment, AppointmentStatus, AvailabilitySlot } from '@/types'

// ─── Constants ────────────────────────────────────────────────────
const WEEK_DAYS = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'] as const
const HOURS = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00']
const TYPE_META: Record<string, { label:string; color:string; bg:string }> = {
  consulta:    { label:'Consulta',    color:'#4A7CC7', bg:'rgba(74,124,199,.15)' },
  seguimiento: { label:'Seguimiento', color:'#4CAF82', bg:'rgba(76,175,130,.15)' },
  evaluacion:  { label:'Evaluación',  color:'#F5C842', bg:'rgba(245,200,66,.15)' },
  emergencia:  { label:'Emergencia',  color:'#E24B4A', bg:'rgba(226,75,74,.15)' },
}
const STATUS_META: Record<AppointmentStatus, { label:string; variant:'green'|'orange'|'red'|'muted'|'blue' }> = {
  confirmada:  { label:'Confirmada',  variant:'green'  },
  pendiente:   { label:'Pendiente',   variant:'orange' },
  cancelada:   { label:'Cancelada',   variant:'red'    },
  completada:  { label:'Completada',  variant:'muted'  },
}

// ─── Helpers ──────────────────────────────────────────────────────
function getWeekDates(offset: number): Date[] {
  const today = new Date('2026-06-08')
  const monday = new Date(today)
  monday.setDate(today.getDate() - today.getDay() + 1 + offset * 7)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

function toISODate(d: Date): string {
  return d.toISOString().split('T')[0]
}

function formatWeekRange(dates: Date[]): string {
  const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']
  const first = dates[0], last = dates[6]
  return `${first.getDate()} ${months[first.getMonth()]} – ${last.getDate()} ${months[last.getMonth()]} ${last.getFullYear()}`
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

// ─── AppointmentCard ──────────────────────────────────────────────
function AppointmentCard({ apt, compact = false, onClick }: {
  apt: Appointment; compact?: boolean; onClick?: () => void
}) {
  const tm = TYPE_META[apt.tipo]
  const sm = STATUS_META[apt.estado]

  if (compact) {
    return (
      <button
        onClick={onClick}
        className="w-full text-left rounded-lg px-2 py-1.5 mb-1 text-[11px] font-medium border cursor-pointer transition-all hover:opacity-90 truncate"
        style={{ background: tm.bg, borderColor: tm.color + '40', color: tm.color }}
      >
        {apt.hora_inicio} · {apt.paciente.apodo}
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className="w-full text-left card-base mb-3 hover:border-brand-orange/50 transition-all cursor-pointer group"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-base" style={{ background: tm.bg }}>
          {apt.tipo === 'emergencia' ? '🚨' : apt.tipo === 'evaluacion' ? '📋' : apt.tipo === 'seguimiento' ? '📊' : '🩺'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[13px] font-semibold">{apt.motivo.slice(0, 55)}{apt.motivo.length > 55 ? '…' : ''}</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap text-[11px] text-surface-muted">
            <span className="flex items-center gap-1"><Clock size={11}/>{apt.hora_inicio} – {apt.hora_fin}</span>
            <span className="flex items-center gap-1"><User size={11}/>{apt.paciente.apodo}</span>
            <span className="flex items-center gap-1"><Stethoscope size={11}/>{apt.profesional.nombre}</span>
          </div>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: tm.bg, color: tm.color }}>{tm.label}</span>
            <Badge variant={sm.variant}>{sm.label}</Badge>
          </div>
        </div>
        <Video size={14} className="text-surface-muted group-hover:text-brand-orange flex-shrink-0 mt-1" />
      </div>
    </button>
  )
}

// ─── AppointmentDetailPanel ───────────────────────────────────────
function AppointmentDetailPanel({ apt, onClose, onStatusChange }: {
  apt: Appointment
  onClose: () => void
  onStatusChange: (id: string, status: AppointmentStatus) => void
}) {
  const { showToast } = useAppStore()
  const tm = TYPE_META[apt.tipo]
  const sm = STATUS_META[apt.estado]

  return (
    <div className="fixed inset-y-0 right-0 w-[400px] bg-surface-panel border-l border-surface-border z-30 flex flex-col shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base" style={{ background: tm.bg }}>{apt.tipo === 'emergencia' ? '🚨' : apt.tipo === 'evaluacion' ? '📋' : apt.tipo === 'seguimiento' ? '📊' : '🩺'}</div>
          <div>
            <div className="text-[13px] font-bold">Detalle de cita</div>
            <div className="text-[11px] text-surface-muted">{apt.id}</div>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg bg-surface-card border border-surface-border flex items-center justify-center text-surface-muted hover:text-white cursor-pointer border-0" style={{background:'var(--surface-card)'}}>
          <X size={14} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Status + type */}
        <div className="flex gap-2 flex-wrap">
          <span className="text-[11px] px-2.5 py-1 rounded-full font-medium" style={{ background: tm.bg, color: tm.color }}>{tm.label}</span>
          <Badge variant={sm.variant}>{sm.label}</Badge>
          {apt.estado === 'confirmada' && (
            <a href={apt.link_videollamada} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-brand-blue/15 text-brand-blue font-medium hover:opacity-80 no-underline">
              <Video size={11} /> Unirse a videollamada
            </a>
          )}
        </div>

        {/* Time */}
        <div className="card-base">
          <div className="text-[11px] text-surface-muted uppercase tracking-[0.6px] font-semibold mb-3">Fecha y hora</div>
          <div className="flex items-center gap-2 text-[13px]">
            <Calendar size={14} className="text-brand-orange" />
            <span className="font-semibold">{new Date(apt.fecha + 'T12:00:00').toLocaleDateString('es-CO',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</span>
          </div>
          <div className="flex items-center gap-2 text-[13px] mt-2">
            <Clock size={14} className="text-brand-orange" />
            <span>{apt.hora_inicio} – {apt.hora_fin}</span>
            <span className="text-[11px] text-surface-muted">
              ({timeToMinutes(apt.hora_fin) - timeToMinutes(apt.hora_inicio)} min)
            </span>
          </div>
        </div>

        {/* Participants */}
        <div className="card-base">
          <div className="text-[11px] text-surface-muted uppercase tracking-[0.6px] font-semibold mb-3">Participantes</div>
          <div className="flex items-center gap-3 pb-3 border-b border-surface-border mb-3">
            <Avatar initials={apt.profesional.initials} color={apt.profesional.color} size="md" />
            <div>
              <div className="text-[12px] font-semibold">{apt.profesional.nombre}</div>
              <div className="text-[11px] text-surface-muted">{apt.profesional.especialidad}</div>
              <Badge variant="purple" className="mt-1">Profesional</Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Avatar initials={apt.paciente.initials} color={apt.paciente.color} size="md" />
            <div>
              <div className="text-[12px] font-semibold">{apt.paciente.nombre}</div>
              <div className="text-[11px] text-surface-muted">{apt.paciente.apodo} · {apt.paciente.disciplina}</div>
              <Badge variant="muted" className="mt-1">Paciente</Badge>
            </div>
          </div>
        </div>

        {/* Motivo */}
        <div className="card-base">
          <div className="text-[11px] text-surface-muted uppercase tracking-[0.6px] font-semibold mb-2">Motivo de la cita</div>
          <p className="text-[12px] leading-relaxed">{apt.motivo}</p>
        </div>

        {/* Notas */}
        <div className="card-base">
          <div className="text-[11px] text-surface-muted uppercase tracking-[0.6px] font-semibold mb-2">Notas clínicas</div>
          {apt.notas ? (
            <p className="text-[12px] text-surface-muted leading-relaxed">{apt.notas}</p>
          ) : (
            <p className="text-[11px] text-surface-muted italic">Sin notas registradas</p>
          )}
          <textarea
            placeholder="Agregar nota clínica..."
            className="form-input mt-2 resize-none text-[11px]"
            rows={3}
          />
        </div>

        {/* Link */}
        <div className="card-base">
          <div className="text-[11px] text-surface-muted uppercase tracking-[0.6px] font-semibold mb-2">Videollamada</div>
          <div className="flex items-center gap-2">
            <input defaultValue={apt.link_videollamada} className="form-input text-[11px] flex-1" readOnly />
            <button onClick={() => { navigator.clipboard.writeText(apt.link_videollamada); showToast('Link copiado') }}
              className="px-2.5 py-1.5 text-[11px] rounded-lg bg-surface-card border border-surface-border text-white whitespace-nowrap cursor-pointer">Copiar</button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-surface-border space-y-2">
        <div className="text-[11px] text-surface-muted uppercase tracking-[0.6px] font-semibold mb-2">Cambiar estado</div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => { onStatusChange(apt.id, 'confirmada'); showToast('Cita confirmada') }}
            className="flex items-center justify-center gap-1.5 py-2 text-[11px] rounded-lg bg-brand-green/15 text-brand-green border border-brand-green/30 cursor-pointer font-medium">
            <CheckCircle size={13}/> Confirmar
          </button>
          <button onClick={() => { onStatusChange(apt.id, 'completada'); showToast('Cita marcada como completada') }}
            className="flex items-center justify-center gap-1.5 py-2 text-[11px] rounded-lg bg-surface-muted/10 text-surface-muted border border-surface-border cursor-pointer font-medium">
            <Check size={13}/> Completar
          </button>
          <button onClick={() => { onStatusChange(apt.id, 'cancelada'); showToast('Cita cancelada') }}
            className="flex items-center justify-center gap-1.5 py-2 text-[11px] rounded-lg bg-brand-red/10 text-brand-red border border-brand-red/20 cursor-pointer font-medium">
            <XCircle size={13}/> Cancelar
          </button>
          <button onClick={() => showToast('Recordatorio enviado al paciente y profesional')}
            className="flex items-center justify-center gap-1.5 py-2 text-[11px] rounded-lg bg-brand-blue/10 text-brand-blue border border-brand-blue/20 cursor-pointer font-medium">
            <AlertCircle size={13}/> Recordar
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Calendar Week View ───────────────────────────────────────────
function CalendarWeekView({
  dates, appointments, onSelectApt,
}: { dates: Date[]; appointments: Appointment[]; onSelectApt: (a: Appointment) => void }) {
  const aptsByDate = useMemo(() => {
    const map: Record<string, Appointment[]> = {}
    appointments.forEach(a => {
      if (!map[a.fecha]) map[a.fecha] = []
      map[a.fecha].push(a)
    })
    return map
  }, [appointments])

  const today = '2026-06-08'

  return (
    <div className="card-base p-0 overflow-hidden">
      {/* Header row */}
      <div className="grid border-b border-surface-border" style={{ gridTemplateColumns: '56px repeat(7, 1fr)' }}>
        <div className="p-2 border-r border-surface-border" />
        {dates.map((d, i) => {
          const iso = toISODate(d)
          const isToday = iso === today
          const dayNames = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom']
          return (
            <div key={i} className={cn('p-2 text-center border-r border-surface-border last:border-0', isToday && 'bg-brand-orange/5')}>
              <div className={cn('text-[10px] text-surface-muted uppercase tracking-wide', isToday && 'text-brand-orange font-semibold')}>{dayNames[i]}</div>
              <div className={cn('text-[16px] font-bold mt-0.5 leading-none', isToday ? 'text-brand-orange' : 'text-white')}>{d.getDate()}</div>
              {aptsByDate[iso]?.length > 0 && (
                <div className="flex justify-center gap-0.5 mt-1">
                  {aptsByDate[iso].slice(0, 3).map((a, j) => (
                    <div key={j} className="w-1.5 h-1.5 rounded-full" style={{ background: TYPE_META[a.tipo].color }} />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Time slots */}
      <div className="overflow-y-auto" style={{ maxHeight: 480 }}>
        {HOURS.map((hour) => (
          <div key={hour} className="grid border-b border-surface-border last:border-0" style={{ gridTemplateColumns: '56px repeat(7, 1fr)', minHeight: 56 }}>
            <div className="p-2 border-r border-surface-border text-[10px] text-surface-muted text-right pr-2 pt-1.5 flex-shrink-0">{hour}</div>
            {dates.map((d, i) => {
              const iso = toISODate(d)
              const isToday = iso === today
              const colApts = (aptsByDate[iso] || []).filter(a => a.hora_inicio.startsWith(hour.split(':')[0]))
              return (
                <div key={i} className={cn('border-r border-surface-border last:border-0 p-1 relative', isToday && 'bg-brand-orange/[0.03]')}>
                  {colApts.map(apt => {
                    const tm = TYPE_META[apt.tipo]
                    return (
                      <button key={apt.id} onClick={() => onSelectApt(apt)}
                        className="flex flex-col gap-0.5 text-left w-full rounded-lg px-2 py-1.5 mb-1 text-[10px] font-medium border cursor-pointer transition-all hover:opacity-90"
                        style={{ background: tm.bg, borderColor: tm.color + '60', color: tm.color }}>
                        <div className="whitespace-normal break-words font-semibold">{apt.paciente.apodo || apt.paciente.nombre}</div>
                        <div className="whitespace-normal break-words opacity-75">{apt.profesional.nombre}</div>
                      </button>
                    )
                  })}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Availability Manager ─────────────────────────────────────────
function AvailabilityManager() {
  const [selectedProf, setSelectedProf] = useState('pro-001')
  const [availability, setAvailability] = useState(() => {
    const map: Record<string, Record<string, boolean>> = {}
    MOCK_AVAILABILITY.forEach(pa => {
      map[pa.profesional_id] = {}
      pa.slots.forEach(s => {
        map[pa.profesional_id][`${s.dia}-${s.hora_inicio}`] = s.disponible
      })
    })
    return map
  })
  const { showToast } = useAppStore()

  const prof = MOCK_PROFESSIONALS.find(p => p.id === selectedProf)
  const slots = MOCK_AVAILABILITY.find(a => a.profesional_id === selectedProf)?.slots ?? []

  const toggleSlot = (dia: string, hora: string) => {
    setAvailability(prev => ({
      ...prev,
      [selectedProf]: {
        ...prev[selectedProf],
        [`${dia}-${hora}`]: !prev[selectedProf]?.[`${dia}-${hora}`],
      },
    }))
  }

  // Group by day
  const byDay = useMemo(() => {
    const map: Record<string, AvailabilitySlot[]> = {}
    slots.forEach(s => {
      if (!map[s.dia]) map[s.dia] = []
      map[s.dia].push(s)
    })
    return map
  }, [slots])

  const days = Object.keys(byDay)
  const uniqueHours = [...new Set(slots.map(s => s.hora_inicio))].sort()

  return (
    <div>
      {/* Prof selector */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <span className="text-[12px] text-surface-muted">Profesional:</span>
        <div className="flex gap-2 flex-wrap">
          {MOCK_PROFESSIONALS.slice(0, 3).map(p => (
            <button key={p.id} onClick={() => setSelectedProf(p.id)}
              className={cn('flex items-center gap-2 px-3 py-1.5 rounded-xl text-[12px] border cursor-pointer transition-all', selectedProf === p.id ? 'border-brand-purple text-white' : 'border-surface-border text-surface-muted hover:border-surface-muted')}
              style={selectedProf === p.id ? { background: 'rgba(155,89,182,.15)' } : { background: 'var(--surface-card)' }}>
              <Avatar initials={p.initials} color={p.color} size="sm" />
              {p.nombre}
            </button>
          ))}
        </div>
      </div>

      {prof && (
        <div className="flex items-center gap-3 p-3 rounded-xl mb-5" style={{ background: 'rgba(155,89,182,.07)', border: '1px solid rgba(155,89,182,.2)' }}>
          <Avatar initials={prof.initials} color={prof.color} size="md" />
          <div>
            <div className="text-[13px] font-semibold">{prof.nombre}</div>
            <div className="text-[11px] text-surface-muted">{prof.especialidad} · Semana del 8 al 14 jun 2026</div>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="card-base p-0 overflow-hidden mb-5">
        <div className="p-3 border-b border-surface-border flex items-center justify-between">
          <span className="text-[13px] font-semibold">Disponibilidad semanal</span>
          <div className="flex items-center gap-3 text-[11px] text-surface-muted">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-brand-green/20 border border-brand-green/40 inline-block" />Disponible</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-surface-card2 border border-surface-border inline-block" />No disponible</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-brand-orange/20 border border-brand-orange/40 inline-block" />Con cita</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[11px]">
            <thead>
              <tr>
                <th className="text-left p-2.5 text-[10px] text-surface-muted uppercase border-b border-surface-border font-medium min-w-20">Hora</th>
                {days.map(d => (
                  <th key={d} className="text-center p-2.5 text-[10px] text-surface-muted uppercase border-b border-surface-border font-medium min-w-24">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {uniqueHours.map(hora => (
                <tr key={hora}>
                  <td className="p-2 border-b border-surface-border text-surface-muted font-medium">{hora}</td>
                  {days.map(dia => {
                    const slot = byDay[dia]?.find(s => s.hora_inicio === hora)
                    if (!slot) return <td key={dia} className="p-2 border-b border-surface-border border-r border-surface-border" />
                    const key = `${dia}-${hora}`
                    const isAvail = availability[selectedProf]?.[key] ?? slot.disponible
                    // Check if has appointment
                    const hasApt = MOCK_APPOINTMENTS.some(a =>
                      a.profesional.id === selectedProf &&
                      a.hora_inicio === hora &&
                      (a.estado === 'confirmada' || a.estado === 'pendiente')
                    )
                    return (
                      <td key={dia} className="p-1.5 border-b border-surface-border border-r border-surface-border last:border-r-0">
                        <button
                          onClick={() => !hasApt && toggleSlot(dia, hora)}
                          className={cn(
                            'w-full py-2 rounded-lg text-[10px] font-medium cursor-pointer border transition-all',
                            hasApt
                              ? 'cursor-not-allowed'
                              : 'hover:opacity-80',
                          )}
                          style={
                            hasApt
                              ? { background: 'rgba(232,98,42,.15)', borderColor: 'rgba(232,98,42,.4)', color: '#E8622A' }
                              : isAvail
                              ? { background: 'rgba(76,175,130,.12)', borderColor: 'rgba(76,175,130,.4)', color: '#4CAF82' }
                              : { background: 'var(--surface-card2)', borderColor: 'var(--surface-border)', color: 'var(--surface-muted)' }
                          }
                          title={hasApt ? 'Este slot tiene una cita asignada' : isAvail ? 'Clic para marcar no disponible' : 'Clic para marcar disponible'}
                        >
                          {hasApt ? '📅 Cita' : isAvail ? '✓ Libre' : '—'}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => showToast('Disponibilidad guardada correctamente')}
          className="px-4 py-2 rounded-lg bg-brand-orange text-white text-[12px] font-medium cursor-pointer">
          💾 Guardar disponibilidad
        </button>
        <button onClick={() => showToast('Disponibilidad copiada a próxima semana')}
          className="px-4 py-2 rounded-lg bg-surface-card border border-surface-border text-white text-[12px] cursor-pointer">
          Copiar a próxima semana
        </button>
      </div>
    </div>
  )
}

// ─── New Appointment Modal ────────────────────────────────────────
function NewAppointmentModal() {
  const { openModal, setOpenModal, showToast } = useAppStore()
  return (
    <Modal isOpen={openModal === 'modal-nueva-cita'} onClose={() => setOpenModal(null)} title="Nueva cita virtual">
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="col-span-2">
          <div className="form-label">Tipo de cita</div>
          <select className="form-input">
            {Object.entries(TYPE_META).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <div>
          <div className="form-label">Profesional</div>
          <select className="form-input">
            {MOCK_PROFESSIONALS.slice(0,3).map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
        </div>
        <div>
          <div className="form-label">Paciente</div>
          <select className="form-input">
            <option>falcao</option>
            <option>ana_m</option>
            <option>carlos_r</option>
            <option>mig_89</option>
            <option>luisa_p</option>
          </select>
        </div>
        <div>
          <div className="form-label">Fecha</div>
          <input type="date" className="form-input" defaultValue="2026-06-10" />
        </div>
        <div>
          <div className="form-label">Hora inicio</div>
          <select className="form-input">
            {HOURS.map(h => <option key={h}>{h}</option>)}
          </select>
        </div>
        <div>
          <div className="form-label">Duración</div>
          <select className="form-input">
            <option>30 min</option>
            <option>45 min</option>
            <option>60 min</option>
          </select>
        </div>
        <div>
          <div className="form-label">Estado inicial</div>
          <select className="form-input">
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
          </select>
        </div>
        <div className="col-span-2">
          <div className="form-label">Motivo de la cita</div>
          <input type="text" className="form-input" placeholder="Describe el motivo de la consulta..." />
        </div>
        <div className="col-span-2">
          <div className="form-label">Notas adicionales</div>
          <textarea className="form-input resize-none" rows={2} placeholder="Notas previas, contexto..." />
        </div>
        <div className="col-span-2">
          <div className="form-label">Link de videollamada</div>
          <div className="flex gap-2">
            <input type="text" className="form-input flex-1" placeholder="https://meet.fitnflai.com/..." defaultValue="https://meet.fitnflai.com/new-apt" />
            <button className="px-2.5 py-1.5 text-[11px] rounded-lg bg-surface-card border border-surface-border text-white whitespace-nowrap cursor-pointer">Auto-generar</button>
          </div>
        </div>
      </div>
      <div className="flex gap-2 justify-end mt-2">
        <button onClick={() => setOpenModal(null)} className="px-3.5 py-[7px] text-[12px] rounded-lg bg-surface-card border border-surface-border text-white cursor-pointer">Cancelar</button>
        <button onClick={() => { setOpenModal(null); showToast('Cita creada · notificación enviada a ambas partes') }}
          className="px-3.5 py-[7px] text-[12px] rounded-lg bg-brand-orange text-white font-medium cursor-pointer flex items-center gap-1.5">
          <Calendar size={13}/> Crear cita
        </button>
      </div>
    </Modal>
  )
}

// ─── Main Page ────────────────────────────────────────────────────
type AgendaTab = 'calendario' | 'lista' | 'disponibilidad'

export function AgendaPage() {
  const [tab, setTab] = useState<AgendaTab>('calendario')
  const [weekOffset, setWeekOffset] = useState(0)
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null)
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS)
  const [filterProf, setFilterProf] = useState('todos')
  const [filterStatus, setFilterStatus] = useState<'todos' | AppointmentStatus>('todos')
  const { setOpenModal } = useAppStore()

  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset])

  const filteredApts = useMemo(() => {
    return appointments.filter(a => {
      const dateOk = weekDates.some(d => toISODate(d) === a.fecha)
      const profOk = filterProf === 'todos' || a.profesional.id === filterProf
      const statusOk = filterStatus === 'todos' || a.estado === filterStatus
      return dateOk && profOk && statusOk
    })
  }, [appointments, weekDates, filterProf, filterStatus])

  const handleStatusChange = (id: string, status: AppointmentStatus) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, estado: status } : a))
    setSelectedApt(prev => prev?.id === id ? { ...prev, estado: status } : prev)
  }

  // Stats for current week
  const weekApts = appointments.filter(a => weekDates.some(d => toISODate(d) === a.fecha))
  const stats = {
    total:      weekApts.length,
    confirmada: weekApts.filter(a => a.estado === 'confirmada').length,
    pendiente:  weekApts.filter(a => a.estado === 'pendiente').length,
    cancelada:  weekApts.filter(a => a.estado === 'cancelada').length,
  }

  const tabs: { id: AgendaTab; label: string }[] = [
    { id: 'calendario',    label: '📅 Calendario' },
    { id: 'lista',         label: '📋 Lista de citas' },
    { id: 'disponibilidad',label: '🕐 Disponibilidad' },
  ]

  return (
    <div className={cn('transition-all', selectedApt && 'pr-[408px]')}>
      {/* Header */}
      <div className="flex items-start justify-between mb-5 gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(74,124,199,.15)' }}>
            <Calendar size={16} style={{ color: '#4A7CC7' }} />
          </div>
          <div>
            <h2 className="text-lg font-bold">Agenda</h2>
            <p className="text-[12px] text-surface-muted mt-0.5">Gestión de citas virtuales con profesionales</p>
          </div>
        </div>
        <button onClick={() => setOpenModal('modal-nueva-cita')}
          className="inline-flex items-center gap-1.5 px-3.5 py-[7px] text-[12px] rounded-lg bg-brand-orange text-white font-medium cursor-pointer border-0">
          <Plus size={13}/> Nueva cita
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        <StatCard label="Citas esta semana" value={stats.total}       valueColor="#4A7CC7" />
        <StatCard label="Confirmadas"        value={stats.confirmada}  valueColor="#4CAF82" delta={`de ${stats.total} citas`} />
        <StatCard label="Pendientes"         value={stats.pendiente}   valueColor="#F5C842" />
        <StatCard label="Canceladas"         value={stats.cancelada}   valueColor="#E24B4A" />
      </div>

      {/* Tabs */}
      <div className="flex gap-0.5 border-b border-surface-border mb-5 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={cn('px-3.5 py-2 text-[12px] cursor-pointer border-0 bg-transparent whitespace-nowrap transition-all border-b-2 -mb-px', tab === t.id ? 'text-brand-blue border-brand-blue font-medium' : 'text-surface-muted border-transparent hover:text-white')}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── CALENDARIO ── */}
      {tab === 'calendario' && (
        <div>
          {/* Week navigator + filters */}
          <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
            <div className="flex items-center gap-2">
              <button onClick={() => setWeekOffset(w => w - 1)}
                className="w-8 h-8 bg-surface-card border border-surface-border rounded-lg flex items-center justify-center cursor-pointer hover:border-brand-orange text-surface-muted hover:text-white">
                <ChevronLeft size={15}/>
              </button>
              <div className="text-[13px] font-semibold min-w-48 text-center">{formatWeekRange(weekDates)}</div>
              <button onClick={() => setWeekOffset(w => w + 1)}
                className="w-8 h-8 bg-surface-card border border-surface-border rounded-lg flex items-center justify-center cursor-pointer hover:border-brand-orange text-surface-muted hover:text-white">
                <ChevronRight size={15}/>
              </button>
              <button onClick={() => setWeekOffset(0)}
                className="px-3 py-1.5 text-[11px] rounded-lg bg-surface-card border border-surface-border text-surface-muted hover:text-white cursor-pointer">
                Hoy
              </button>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <select value={filterProf} onChange={e => setFilterProf(e.target.value)} className="form-input w-auto text-[11px] py-1.5">
                <option value="todos">Todos los profesionales</option>
                {MOCK_PROFESSIONALS.slice(0,3).map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} className="form-input w-auto text-[11px] py-1.5">
                <option value="todos">Todos los estados</option>
                {Object.entries(STATUS_META).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mb-3 flex-wrap">
            {Object.entries(TYPE_META).map(([k,v]) => (
              <div key={k} className="flex items-center gap-1.5 text-[11px] text-surface-muted">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: v.color }} />
                {v.label}
              </div>
            ))}
          </div>

          <CalendarWeekView dates={weekDates} appointments={filteredApts} onSelectApt={setSelectedApt} />
        </div>
      )}

      {/* ── LISTA ── */}
      {tab === 'lista' && (
        <div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className="flex items-center gap-2">
              <button onClick={() => setWeekOffset(w => w - 1)} className="w-7 h-7 bg-surface-card border border-surface-border rounded-lg flex items-center justify-center cursor-pointer text-surface-muted hover:text-white"><ChevronLeft size={13}/></button>
              <div className="text-[13px] font-semibold min-w-44 text-center">{formatWeekRange(weekDates)}</div>
              <button onClick={() => setWeekOffset(w => w + 1)} className="w-7 h-7 bg-surface-card border border-surface-border rounded-lg flex items-center justify-center cursor-pointer text-surface-muted hover:text-white"><ChevronRight size={13}/></button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {(['todos','confirmada','pendiente','cancelada','completada'] as const).map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={cn('px-3 py-1 rounded-full text-[11px] border cursor-pointer transition-all', filterStatus === s ? 'bg-brand-blue border-brand-blue text-white' : 'bg-surface-card border-surface-border text-surface-muted hover:text-white')}>
                  {s === 'todos' ? 'Todas' : STATUS_META[s].label}
                </button>
              ))}
            </div>
          </div>

          {/* Group by date */}
          {weekDates.map(d => {
            const iso = toISODate(d)
            const dayApts = filteredApts.filter(a => a.fecha === iso)
            if (dayApts.length === 0) return null
            const dayNames = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']
            const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']
            const isToday = iso === '2026-06-08'
            return (
              <div key={iso} className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className={cn('text-[11px] font-semibold uppercase tracking-wider', isToday ? 'text-brand-orange' : 'text-surface-muted')}>
                    {dayNames[d.getDay()]} {d.getDate()} {months[d.getMonth()]}
                    {isToday && <span className="ml-2 text-[10px] bg-brand-orange text-white px-1.5 py-0.5 rounded-full font-medium">Hoy</span>}
                  </div>
                  <div className="flex-1 h-px bg-surface-border" />
                  <div className="text-[11px] text-surface-muted">{dayApts.length} cita{dayApts.length !== 1 ? 's' : ''}</div>
                </div>
                {dayApts.sort((a,b) => a.hora_inicio.localeCompare(b.hora_inicio)).map(apt => (
                  <AppointmentCard key={apt.id} apt={apt} onClick={() => setSelectedApt(apt)} />
                ))}
              </div>
            )
          })}

          {filteredApts.length === 0 && (
            <div className="text-center py-16 text-surface-muted">
              <div className="text-4xl mb-3">📅</div>
              <div className="text-[13px]">No hay citas para esta semana con los filtros seleccionados</div>
            </div>
          )}
        </div>
      )}

      {/* ── DISPONIBILIDAD ── */}
      {tab === 'disponibilidad' && <AvailabilityManager />}

      {/* Detail panel */}
      {selectedApt && (
        <AppointmentDetailPanel
          apt={selectedApt}
          onClose={() => setSelectedApt(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Overlay when panel open on mobile */}
      {selectedApt && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSelectedApt(null)} />
      )}

      {/* New appointment modal */}
      <NewAppointmentModal />
    </div>
  )
}

