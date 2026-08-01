import { useState, useMemo, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Calendar, MessageSquare, Bell, Edit, Ban, Upload, Trash2 } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Toggle } from '@/components/ui/Toggle'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { toast } from '@/components/ui/Toast'
import { useAppStore } from '@/store/useAppStore'
import { usersService } from '@/services/endpoints/users'
import { ProgressTab } from '@/components/patient/ProgressTab'
import { ClinicalReportTab } from '@/components/patient/ClinicalReportTab'
import { SpecialistNutritionTab } from '../specialist/UserDetailPage'
import { MOCK_PLAN } from '@/services/mocks/plan.mock'
import { PLAN_NAMES, PLAN_MONTOS, DAYS_ES } from '@/constants'
import { formatDate, getPlanState, STATE_LABEL, typeColor } from '@/utils'
import { cn } from '@/utils'
import type { Workout, PlanItem, WorkoutExercise } from '@/types'

type Tab = 'perfil' | 'plan' | 'nutricion' | 'progreso' | 'reporte-clinico' | 'dispositivos'

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="frow">
      <span className="fkey">{label}</span>
      <span className="text-right text-[12px]">{children}</span>
    </div>
  )
}

function ChipList({ items }: { items: string[] }) {
  if (!items.length) return <span className="text-[11px] text-surface-muted">—</span>
  return (
    <div className="flex gap-1 flex-wrap">
      {items.map((item) => (
        <span key={item} className="inline-flex px-2 py-0.5 rounded-xl text-[10px] bg-surface-card2 border border-surface-border">{item}</span>
      ))}
    </div>
  )
}

function EditableChipList({
  title,
  items,
  isEditing,
  onAdd,
  onRemove,
  placeholder
}: {
  title: string
  items: string[]
  isEditing: boolean
  onAdd: (val: string) => void
  onRemove: (idx: number) => void
  placeholder: string
}) {
  const [newVal, setNewVal] = useState('')

  return (
    <div className="bg-surface-card border border-surface-border rounded-xl p-4">
      <div className="text-[12px] font-semibold text-white mb-2.5">{title}</div>
      <div className="flex gap-1.5 flex-wrap mb-3 min-h-[26px]">
        {(!items || items.length === 0) ? (
          <span className="text-[11px] text-surface-muted">Ninguno registrado</span>
        ) : (
          items.map((item, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] bg-surface-card2 border border-surface-border text-white font-medium"
            >
              {item}
              {isEditing && (
                <button
                  type="button"
                  onClick={() => onRemove(idx)}
                  className="text-brand-red hover:text-brand-red/80 font-bold text-[10px] bg-transparent border-0 cursor-pointer p-0"
                >
                  ✕
                </button>
              )}
            </span>
          ))
        )}
      </div>
      {isEditing && (
        <div className="flex gap-1.5 mt-2">
          <input
            type="text"
            placeholder={placeholder}
            value={newVal}
            onChange={(e) => setNewVal(e.target.value)}
            className="form-input flex-1 px-3 py-1.5 text-[11px] outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newVal.trim() !== '') {
                onAdd(newVal.trim())
                setNewVal('')
              }
            }}
          />
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              if (newVal.trim() !== '') {
                onAdd(newVal.trim())
                setNewVal('')
              }
            }}
            className="px-3"
          >
            +
          </Button>
        </div>
      )}
    </div>
  )
}

export function UserDetailPage() {
  const { selectedUser: u, detailOrigin, setPage } = useAppStore()
  const [tab, setTab] = useState<Tab>('perfil')
  const [isEditing, setIsEditing] = useState(false)

  // Local state to track updates and force renders
  const [updateTick, setUpdateTick] = useState(0)
  const triggerUpdate = () => setUpdateTick(t => t + 1)

  if (!u) { setPage('usuarios'); return null }

  // Normalize ID (the real backend list uses 'id' but detail expects 'id_usuario')
  if (!u.id_usuario && (u as any).id) {
    u.id_usuario = (u as any).id
  }

  const displayEstado = typeof u.estado === 'string' ? u.estado : (u.registro_activo ? 'Activo' : 'Inactivo')

  const isPac = detailOrigin === 'pacientes'

  // Query real-time user detail based on active tab
  const { data: tabData, isLoading: isTabLoading } = useQuery({
    queryKey: ['userTabDetalle', u?.id_usuario, tab],
    queryFn: () => usersService.getUserTabDetalle(u!.id_usuario, tab),
    enabled: !!u?.id_usuario && tab === 'perfil',
  })

  // Synchronize and adapt real-time profile fields seamlessly into the active user reference
  useMemo(() => {
    if (u && tabData) {
      if (!isEditing) {
        Object.assign(u, tabData)
        if (tabData.disciplina) u.nombre_disciplina = tabData.disciplina
        if (tabData.duracion_objetivo) u.duracion_semanas_objetivo = tabData.duracion_objetivo
        if (tabData.proximo_evento?.fecha) u.proxima_competencia = tabData.proximo_evento.fecha
      }
    }
  }, [u, tabData, isEditing])

  // Query real-time user header detail
  const { data: headerData, isLoading: isHeaderLoading } = useQuery({
    queryKey: ['userHeaderDetalle', u?.id_usuario],
    queryFn: () => usersService.getUserHeaderDetalle(u!.id_usuario),
    enabled: !!u?.id_usuario,
  })

  // Synchronize and adapt real-time header fields seamlessly into the active user reference
  useMemo(() => {
    if (u && headerData) {
      if (!isEditing) {
        Object.assign(u, headerData)
        if (headerData.disciplina) u.nombre_disciplina = headerData.disciplina
        if (headerData.nivel_motor !== undefined) u.nivel_motor_actual = headerData.nivel_motor
        
        // Parse weight "155.00 Lb" -> weight number + unit
        if (headerData.peso) {
          const parts = headerData.peso.split(' ')
          u.peso = parseFloat(parts[0]) || u.peso
          if (parts[1]) u.unidad_peso = parts[1]
        }
        
        // Parse height "175.00 Cm" -> height number + unit
        if (headerData.altura) {
          const parts = headerData.altura.split(' ')
          u.altura = parseFloat(parts[0]) || u.altura
          if (parts[1]) u.unidad_altura = parts[1]
        }

        // Map membresia
        if (headerData.membresia) {
          u.nombre_plan_activo = headerData.membresia
          const idx = PLAN_NAMES.indexOf(headerData.membresia)
          if (idx !== -1) {
            u.plan_idx = idx
          } else if (headerData.membresia === 'Sin membresía') {
            u.plan_idx = 0
          }
        }
      }
    }
  }, [u, headerData, isEditing])
  const backPage = isPac ? 'pacientes' : 'usuarios'
  const backLabel = isPac ? 'Pacientes' : 'Usuarios'

  const tabs: { id: Tab; label: string }[] = [
    { id: 'perfil',        label: 'Perfil' },
    { id: 'plan',          label: 'Plan' },
    { id: 'nutricion',     label: 'Nutrición' },
    { id: 'progreso',      label: 'Progreso' },
    { id: 'reporte-clinico', label: 'Reporte Clínico' },
    { id: 'dispositivos',  label: 'Dispositivos' },
  ]

  return (
    <div>
      {/* Breadcrumb */}
      <button onClick={() => setPage(backPage)} className="flex items-center gap-1.5 text-[12px] text-surface-muted hover:text-brand-orange mb-4 cursor-pointer bg-transparent border-0">
        <ChevronLeft size={14} />{backLabel}
      </button>

      {/* Hero */}
      <div className="card-base flex items-start gap-4 mb-5 flex-wrap">
        <div className="relative">
          <Avatar initials={u.initials} color={isPac ? '#9B59B6' : u.color} size="lg" />
          <div className={`absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-surface-card ${u.registro_activo ? 'bg-brand-green' : 'bg-brand-red'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[17px] font-bold">{u.apodo}</span>
            {u.plan_idx > 0 ? (
              <Badge variant="yellow">👑 {PLAN_NAMES[u.plan_idx]}</Badge>
            ) : (u.nombre_plan_activo && u.nombre_plan_activo !== 'Sin membresía' && u.nombre_plan_activo !== 'Essential' ? (
              <Badge variant="yellow">👑 {u.nombre_plan_activo}</Badge>
            ) : (
              <Badge variant="muted">Essential</Badge>
            ))}
            <Badge variant={
              displayEstado === 'Suspendido Temporalmente' ? 'orange' :
              displayEstado === 'Suspendido Permanentemente' ? 'red' :
              (displayEstado === 'Activo' ? 'green' : 'red')
            }>
              {displayEstado}
            </Badge>
            {isPac && <Badge variant="purple">🩺 Paciente</Badge>}
          </div>
          <div className="text-[11px] text-surface-muted">{u.nombre_disciplina} · {u.ciudad} · Nivel motor {u.nivel_motor_actual}</div>
          <div className="flex gap-4 mt-3 flex-wrap">
            {[['Nombre',u.nombre],['Edad',`${u.edad} años`],['Peso',`${u.peso}${u.unidad_peso}`],['Altura',`${u.altura}${u.unidad_altura}`],['Clasificación',u.clasificacion_visible_actual]].map(([l,v]) => (
              <div key={l}><div className="text-[10px] text-surface-muted">{l}</div><div className="font-semibold text-[12px]">{v}</div></div>
            ))}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap pt-2">
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsEditing(false)
                  toast.show('Edición cancelada', 'info')
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                style={{ background: '#4CAF82', borderColor: '#4CAF82' }}
                onClick={() => {
                  setIsEditing(false)
                  toast.show('Cambios guardados con éxito', 'success')
                  triggerUpdate()
                }}
              >
                💾 Guardar Cambios
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="primary"
                onClick={() => {
                  setIsEditing(true)
                  toast.show('Modo edición activado', 'info')
                }}
              >
                ✏️ Editar Perfil
              </Button>
              
              {displayEstado.includes('Suspendido') ? (
                <Button
                  variant="primary"
                  style={{ background: '#4CAF82', borderColor: '#4CAF82' }}
                  onClick={() => {
                    u.estado = 'Activo'
                    u.registro_activo = true // restore access
                    triggerUpdate()
                    toast.show('Usuario reactivado con éxito', 'success')
                  }}
                >
                  🟢 Reactivar Usuario
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="text-brand-orange hover:bg-brand-orange/10 border border-brand-orange/20"
                    onClick={() => {
                      u.estado = 'Suspendido Temporalmente'
                      u.registro_activo = false // revoke access
                      triggerUpdate()
                      toast.show('Usuario suspendido temporalmente', 'warning')
                    }}
                  >
                    🟡 Suspender Temporalmente
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      u.estado = 'Suspendido Permanentemente'
                      u.registro_activo = false // revoke access
                      triggerUpdate()
                      toast.show('Usuario suspendido permanentemente', 'error')
                    }}
                  >
                    🔴 Suspender Permanentemente
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0.5 border-b border-surface-border mb-5 overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={cn('px-3.5 py-2 text-[12px] cursor-pointer border-0 bg-transparent whitespace-nowrap transition-all', 'border-b-2 -mb-px', tab === t.id ? 'text-brand-orange border-brand-orange font-medium' : 'text-surface-muted border-transparent hover:text-white')}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'perfil' && (
        <div className="space-y-5">
          {/* Card 1: Ficha de Usuario */}
          <div className="card-base p-5 bg-surface-card border border-surface-border rounded-xl">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <span>Ficha de Usuario</span>
              {isTabLoading && (
                <span className="text-[10px] text-brand-orange animate-pulse font-semibold">
                  (Sincronizando con el servidor...)
                </span>
              )}
            </h3>
            <div className="flex flex-col md:flex-row gap-5 items-start mb-5">
              {/* Left: Avatar and Upload button */}
              <div className="flex flex-col items-center justify-center shrink-0">
                <div className="relative">
                  <Avatar initials={u.initials} color={isPac ? '#9B59B6' : u.color} size="lg" className="w-16 h-16 text-xl border-[3px] border-surface-card" />
                  {isEditing && (
                    <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer border border-surface-card bg-brand-orange">
                      <span className="text-[10px] text-white">⬆</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Middle: Objetivo Principal */}
              <div className="flex-1 w-full">
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">OBJETIVO PRINCIPAL</label>
                <textarea
                  value={u.objetivo_principal || ''}
                  disabled={!isEditing}
                  onChange={(e) => {
                    u.objetivo_principal = e.target.value
                    triggerUpdate()
                  }}
                  placeholder="Escribe el objetivo principal del deportista..."
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange min-h-[80px] resize-y disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Grid of details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border-t border-surface-border pt-4">
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">NOMBRE COMPLETO</label>
                <input
                  type="text"
                  value={u.nombre || ''}
                  disabled={!isEditing}
                  onChange={(e) => {
                    u.nombre = e.target.value
                    triggerUpdate()
                  }}
                  placeholder="Ej. Falcao García"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">EMAIL</label>
                <input
                  type="email"
                  value={u.email || ''}
                  disabled={!isEditing}
                  onChange={(e) => {
                    u.email = e.target.value
                    triggerUpdate()
                  }}
                  placeholder="Ej. usuario@email.com"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">APODO</label>
                <input
                  type="text"
                  value={u.apodo || ''}
                  disabled={!isEditing}
                  onChange={(e) => {
                    u.apodo = e.target.value
                    triggerUpdate()
                  }}
                  placeholder="Ej. falcao"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">GÉNERO</label>
                <input
                  type="text"
                  value={u.genero || ''}
                  disabled={!isEditing}
                  onChange={(e) => {
                    u.genero = e.target.value
                    triggerUpdate()
                  }}
                  placeholder="Ej. Masculino, Femenino"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">FECHA DE NACIMIENTO</label>
                <input
                  type="text"
                  value={u.fecha_nacimiento ? u.fecha_nacimiento.substring(0, 10) : '1990-01-01'}
                  disabled={!isEditing}
                  onChange={(e) => {
                    u.fecha_nacimiento = e.target.value
                    triggerUpdate()
                  }}
                  placeholder="AAAA-MM-DD"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">EDAD</label>
                <input
                  type="number"
                  value={u.edad || 0}
                  disabled={!isEditing}
                  onChange={(e) => {
                    u.edad = Number(e.target.value)
                    triggerUpdate()
                  }}
                  placeholder="Ej. 30"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">CIUDAD</label>
                <input
                  type="text"
                  value={u.ciudad || ''}
                  disabled={!isEditing}
                  onChange={(e) => {
                    u.ciudad = e.target.value
                    triggerUpdate()
                  }}
                  placeholder="Ej. Medellín"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">ALTITUD (M)</label>
                <input
                  type="number"
                  value={u.altitud || 0}
                  disabled={!isEditing}
                  onChange={(e) => {
                    u.altitud = Number(e.target.value)
                    triggerUpdate()
                  }}
                  placeholder="Ej. 1500"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">IDIOMA</label>
                <input
                  type="text"
                  value={u.idioma || ''}
                  disabled={!isEditing}
                  onChange={(e) => {
                    u.idioma = e.target.value
                    triggerUpdate()
                  }}
                  placeholder="Ej. es"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">ESTADO DE CUENTA</label>
                <div className="flex items-center gap-2 h-[38px]">
                  <Badge variant={
                    displayEstado === 'Suspendido Temporalmente' ? 'orange' :
                    displayEstado === 'Suspendido Permanentemente' ? 'red' :
                    (displayEstado === 'Activo' ? 'green' : 'red')
                  }>
                    {displayEstado}
                  </Badge>
                </div>
              </div>
            </div>
          </div>



          {/* Card 3: Datos Físicos y Antropométricos */}
          <div className="card-base p-5 bg-surface-card border border-surface-border rounded-xl">
            <h3 className="text-sm font-bold text-white mb-4">Datos Físicos y Antropométricos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">PESO ({u.unidad_peso || 'kg'})</label>
                <input
                  type="number"
                  value={u.peso || 0}
                  disabled={!isEditing}
                  onChange={(e) => {
                    u.peso = Number(e.target.value)
                    triggerUpdate()
                  }}
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">ALTURA ({u.unidad_altura || 'cm'})</label>
                <input
                  type="number"
                  value={u.altura || 0}
                  disabled={!isEditing}
                  onChange={(e) => {
                    u.altura = Number(e.target.value)
                    triggerUpdate()
                  }}
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">NIVEL DE ACTIVIDAD (1-5)</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={u.nivel_actividad ?? 0}
                  disabled={!isEditing}
                  onChange={(e) => {
                    u.nivel_actividad = Number(e.target.value)
                    triggerUpdate()
                  }}
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">NIVEL MOTOR ACTUAL (1-5)</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={u.nivel_motor_actual ?? 0}
                  disabled={!isEditing}
                  onChange={(e) => {
                    u.nivel_motor_actual = Number(e.target.value)
                    triggerUpdate()
                  }}
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">CLASIFICACIÓN MOTOR</label>
                <input
                  type="text"
                  value={u.clasificacion_visible_actual || ''}
                  disabled={!isEditing}
                  onChange={(e) => {
                    u.clasificacion_visible_actual = e.target.value
                    triggerUpdate()
                  }}
                  placeholder="Ej. Avanzado, Intermedio"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">TIEMPO SIN ENTRENAR</label>
                <input
                  type="text"
                  value={u.tiempo_sin_entrenar || ''}
                  disabled={!isEditing}
                  onChange={(e) => {
                    u.tiempo_sin_entrenar = e.target.value
                    triggerUpdate()
                  }}
                  placeholder="Ej. 2 semanas"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Card 4: Planificación, Objetivos y Suscripción */}
          <div className="card-base p-5 bg-surface-card border border-surface-border rounded-xl">
            <h3 className="text-sm font-bold text-white mb-4">Planificación, Objetivos y Suscripción</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">DISCIPLINA / DEPORTE</label>
                <input
                  type="text"
                  value={u.nombre_disciplina || ''}
                  disabled={!isEditing}
                  onChange={(e) => {
                    u.nombre_disciplina = e.target.value
                    triggerUpdate()
                  }}
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">DURACIÓN OBJETIVO (SEMANAS)</label>
                <input
                  type="number"
                  value={u.duracion_semanas_objetivo || 0}
                  disabled={!isEditing}
                  onChange={(e) => {
                    u.duracion_semanas_objetivo = Number(e.target.value)
                    triggerUpdate()
                  }}
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">FECHA INICIO PREFERIDA</label>
                <input
                  type="text"
                  value={u.fecha_inicio_preferida || ''}
                  disabled={!isEditing}
                  onChange={(e) => {
                    u.fecha_inicio_preferida = e.target.value
                    triggerUpdate()
                  }}
                  placeholder="AAAA-MM-DD"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">PRÓXIMA COMPETENCIA</label>
                <input
                  type="text"
                  value={u.proxima_competencia ? u.proxima_competencia.substring(0, 10) : '—'}
                  disabled={!isEditing}
                  onChange={(e) => {
                    u.proxima_competencia = e.target.value
                    triggerUpdate()
                  }}
                  placeholder="AAAA-MM-DD"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">ALIMENTACIÓN</label>
                <input
                  type="text"
                  value={u.alimentacion || ''}
                  disabled={!isEditing}
                  onChange={(e) => {
                    u.alimentacion = e.target.value
                    triggerUpdate()
                  }}
                  placeholder="Ej. Omnívoro, Vegetariano, Vegano"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">PLAN ACTIVO</label>
                <input
                  type="text"
                  value={u.nombre_plan_activo || PLAN_NAMES[u.plan_idx] || 'Essential'}
                  disabled={!isEditing}
                  onChange={(e) => {
                    u.nombre_plan_activo = e.target.value
                    triggerUpdate()
                  }}
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">ESTADO SUSCRIPCIÓN</label>
                <input
                  type="text"
                  value={u.estado_suscripcion || (u.tiene_plan_activo ? 'Activa' : 'Inactiva')}
                  disabled={!isEditing}
                  onChange={(e) => {
                    u.estado_suscripcion = e.target.value
                    triggerUpdate()
                  }}
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">FIN SUSCRIPCIÓN</label>
                <input
                  type="text"
                  value={u.fecha_fin_suscripcion ? u.fecha_fin_suscripcion.substring(0, 10) : '—'}
                  disabled={!isEditing}
                  onChange={(e) => {
                    u.fecha_fin_suscripcion = e.target.value
                    triggerUpdate()
                  }}
                  placeholder="AAAA-MM-DD"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">¿TIENE PLAN ACTIVO?</label>
                <div className="flex items-center gap-2 h-[38px]">
                  <Badge variant={u.tiene_plan_activo ?? u.plan_idx > 0 ? 'green' : 'muted'}>
                    {u.tiene_plan_activo ?? u.plan_idx > 0 ? 'SÍ' : 'NO'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: Preferencias, Reportes y Notificaciones */}
          <div className="card-base p-5 bg-surface-card border border-surface-border rounded-xl">
            <h3 className="text-sm font-bold text-white mb-4">Preferencias, Reportes y Notificaciones</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">ESTILO DE COMUNICACIÓN</label>
                <input
                  type="text"
                  value={u.estilo_comunicacion || ''}
                  disabled={!isEditing}
                  onChange={(e) => {
                    u.estilo_comunicacion = e.target.value
                    triggerUpdate()
                  }}
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">INTENSIDAD NOTIFICACIONES</label>
                <input
                  type="text"
                  value={u.intensidad_notificaciones || ''}
                  disabled={!isEditing}
                  onChange={(e) => {
                    u.intensidad_notificaciones = e.target.value
                    triggerUpdate()
                  }}
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">DÍA DE REPORTE</label>
                <input
                  type="text"
                  value={u.dia_reporte || ''}
                  disabled={!isEditing}
                  onChange={(e) => {
                    u.dia_reporte = e.target.value
                    triggerUpdate()
                  }}
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">HORA DE REPORTE</label>
                <input
                  type="text"
                  value={u.hora_reporte || ''}
                  disabled={!isEditing}
                  onChange={(e) => {
                    u.hora_reporte = e.target.value
                    triggerUpdate()
                  }}
                  placeholder="Ej. 08:00"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">HORA DE NOTIFICACIÓN</label>
                <input
                  type="text"
                  value={u.notification_time || ''}
                  disabled={!isEditing}
                  onChange={(e) => {
                    u.notification_time = e.target.value
                    triggerUpdate()
                  }}
                  placeholder="Ej. 07:30"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">ONBOARDING COMPLETO</label>
                <div className="flex items-center gap-2 h-[38px]">
                  <Badge variant={u.onboarding_completo ? 'green' : 'orange'}>
                    {u.onboarding_completo ? 'COMPLETADO' : 'PENDIENTE'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Card 6: Historial de Lesiones, Equipamiento y Días de Entrenamiento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <EditableChipList
              title="Días de Entrenamiento"
              items={u.dias_entrenamiento || []}
              isEditing={isEditing}
              onAdd={(val) => {
                if (!u.dias_entrenamiento) u.dias_entrenamiento = []
                u.dias_entrenamiento.push(val)
                triggerUpdate()
                toast.show('Día de entrenamiento agregado', 'success')
              }}
              onRemove={(idx) => {
                u.dias_entrenamiento = u.dias_entrenamiento.filter((_, i) => i !== idx)
                triggerUpdate()
                toast.show('Día de entrenamiento removido', 'error')
              }}
              placeholder="Añadir día (ej: Jue)"
            />

            <EditableChipList
              title="Equipamiento"
              items={u.equipo || []}
              isEditing={isEditing}
              onAdd={(val) => {
                if (!u.equipo) u.equipo = []
                u.equipo.push(val)
                triggerUpdate()
                toast.show('Equipamiento agregado', 'success')
              }}
              onRemove={(idx) => {
                u.equipo = u.equipo.filter((_, i) => i !== idx)
                triggerUpdate()
                toast.show('Equipamiento removido', 'error')
              }}
              placeholder="Añadir equipo (ej: Bastones)"
            />

            <EditableChipList
              title="Historial de Lesiones"
              items={u.historial_lesiones || []}
              isEditing={isEditing}
              onAdd={(val) => {
                if (!u.historial_lesiones) u.historial_lesiones = []
                u.historial_lesiones.push(val)
                triggerUpdate()
                toast.show('Lesión registrada', 'success')
              }}
              onRemove={(idx) => {
                u.historial_lesiones = u.historial_lesiones.filter((_, i) => i !== idx)
                triggerUpdate()
                toast.show('Registro de lesión eliminado', 'error')
              }}
              placeholder="Añadir lesión (ej: Rodilla 2025)"
            />
          </div>

          {/* Card 7: Historial Deportivo */}
          <div className="card-base p-5 bg-surface-card border border-surface-border rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Historial Deportivo</h3>
              {isEditing && (
                <button
                  onClick={() => {
                    if (!u.tray) u.tray = []
                    u.tray.push({
                      titulo: '',
                      org: '',
                      inicio: '2025',
                      fin: '',
                      desc: ''
                    })
                    triggerUpdate()
                    toast.show('Nueva trayectoria deportiva añadida', 'success')
                  }}
                  className="text-[11px] font-semibold text-brand-orange hover:text-brand-orange/80 transition-colors bg-transparent border-0 cursor-pointer"
                >
                  + Añadir Logro
                </button>
              )}
            </div>
            
            {(!u.tray || u.tray.length === 0) ? (
              <div className="text-center py-6 text-surface-muted text-[12px]">Sin logros o trayectoria registrada.</div>
            ) : (
              <div className="space-y-3">
                {u.tray.map((t, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row gap-3 items-center w-full">
                    <div className="flex-1 w-full">
                      <input
                        type="text"
                        value={t.titulo || ''}
                        disabled={!isEditing}
                        onChange={(e) => {
                          t.titulo = e.target.value
                          triggerUpdate()
                        }}
                        placeholder="Logro o Carrera (ej: Trail 15k)"
                        className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div className="flex-1 w-full">
                      <input
                        type="text"
                        value={t.org || ''}
                        disabled={!isEditing}
                        onChange={(e) => {
                          t.org = e.target.value
                          triggerUpdate()
                        }}
                        placeholder="Organizador o Lugar (ej: Liga de Bogotá)"
                        className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div className="w-full md:w-44">
                      <input
                        type="text"
                        value={(t.inicio && t.fin) ? `${t.inicio}-${t.fin}` : (t.inicio || '2025')}
                        disabled={!isEditing}
                        onChange={(e) => {
                          const val = e.target.value
                          if (val.includes('-')) {
                            const [ini, fin] = val.split('-')
                            t.inicio = ini.trim()
                            t.fin = fin.trim()
                          } else {
                            t.inicio = val
                            t.fin = ''
                          }
                          triggerUpdate()
                        }}
                        placeholder="Año o período (ej: 2024)"
                        className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                      />
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => {
                          u.tray = u.tray?.filter((_, i) => i !== idx)
                          triggerUpdate()
                          toast.show('Logro deportivo eliminado', 'error')
                        }}
                        className="p-2 text-brand-red hover:bg-brand-red/10 rounded-lg transition-all shrink-0 cursor-pointer bg-transparent border-0"
                        title="Eliminar historial"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'plan' && <AdminPlanTab key={u.id_usuario} userId={u.id_usuario} />}

      {tab === 'nutricion' && <SpecialistNutritionTab userId={u.id_usuario} readOnly={true} />}

      {tab === 'progreso' && <ProgressTab patientId={u.id_usuario} readOnly={true} />}

      {tab === 'reporte-clinico' && <ClinicalReportTab patientId={u.id_usuario} readOnly={true} />}

      {tab === 'dispositivos' && (
        <div>
          <div className="card-base mb-4">
            <div className="text-[13px] font-semibold mb-3">Dispositivos conectados</div>
            {[
              { name:'Apple Health', connected: u.health_connected, color:'#FF2D55', icon:'❤️' },
              { name:'Strava', connected: !!u.strava_access_token, color:'#FC4C02', icon:'🚴' },
              { name:'Garmin', connected: !!u.last_garmin_sync, color:'#007EC5', icon:'⌚' },
            ].map((d) => (
              <div key={d.name} className="flex items-center justify-between py-2.5 border-b border-surface-border last:border-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{background:`${d.color}22`}}>{d.icon}</div>
                  <div><div className="text-[12px] font-medium">{d.name}</div><div className="text-[11px] text-surface-muted">{d.connected ? 'Activo' : 'Sin conexión'}</div></div>
                </div>
                <Badge variant={d.connected ? 'green' : 'muted'}>{d.connected ? 'Conectado' : 'No conectado'}</Badge>
              </div>
            ))}
          </div>
          <div className="card-base">
            <div className="text-[13px] font-semibold mb-3">Tokens</div>
            <FieldRow label="strava_access_token"><span className="font-mono text-[10px] text-surface-muted">{u.strava_access_token || '—'}</span></FieldRow>
            <FieldRow label="last_strava_sync">{u.last_strava_sync ? new Date(u.last_strava_sync).toLocaleString('es-CO') : 'Nunca'}</FieldRow>
            <FieldRow label="last_garmin_sync">{u.last_garmin_sync ? new Date(u.last_garmin_sync).toLocaleString('es-CO') : 'Nunca'}</FieldRow>
            <FieldRow label="health_connected"><Badge variant={u.health_connected?'green':'muted'}>{u.health_connected?'true':'false'}</Badge></FieldRow>
          </div>
        </div>
      )}
    </div>
  )
}

const isUUID = (id: string) => {
  if (!id) return false
  if (id.startsWith('uid-') || id.startsWith('pro-') || id.startsWith('esp-') || id.length < 10) return false
  return true
}

const formatDateISO = (d: Date): string => {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getWeekDates = (offsetWeeks: number): Date[] => {
  const current = new Date()
  const day = current.getDay()
  const diff = current.getDate() - day + (day === 0 ? -6 : 1) // Adjust to start on Monday
  const monday = new Date(current.setDate(diff))
  monday.setDate(monday.getDate() + offsetWeeks * 7)

  const dates: Date[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    dates.push(d)
  }
  return dates
}

export function AdminPlanTab({ userId }: { userId: string }) {
  const [weekOffset, setWeekOffset] = useState(0)
  const [planItems, setPlanItems] = useState<PlanItem[]>([])
  const [selectedDateStr, setSelectedDateStr] = useState(formatDateISO(new Date()))
  const [selectedExercise, setSelectedExercise] = useState<WorkoutExercise | null>(null)

  const { data: planData, isLoading: isPlanLoading, error } = useQuery({
    queryKey: ['adminUserPlan', userId],
    queryFn: () => usersService.getUserTabDetalle(userId, 'plan'),
    enabled: !!userId,
  })

  useEffect(() => {
    console.log('AdminPlanTab query result:', { planData, isPlanLoading, error })
  }, [planData, isPlanLoading, error])

  // Set weekDates dynamically based on semana_rango if available
  const weekDates = useMemo(() => {
    if (planData?.semana_rango?.inicio) {
      const parts = planData.semana_rango.inicio.split('-')
      const baseDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
      baseDate.setDate(baseDate.getDate() + weekOffset * 7)
      const dates: Date[] = []
      for (let i = 0; i < 7; i++) {
        const d = new Date(baseDate)
        d.setDate(baseDate.getDate() + i)
        dates.push(d)
      }
      return dates
    }
    return getWeekDates(weekOffset)
  }, [planData, weekOffset])

  // Map workouts/plan items when planData loads
  useEffect(() => {
    try {
      console.log('Mapping planData:', planData)
      if (planData && planData.entrenamientos) {
        const mapped: PlanItem[] = planData.entrenamientos.map((item: any) => ({
          ...item,
          titulo_entrenamiento: item.titulo_entrenamiento || item.tipo || 'Entrenamiento',
          ejercicios_asociados: (item.ejercicios_asociados || []).map((we: any) => ({
            ...we,
            ejercicio: {
              ...we.ejercicio,
              instrucciones: we.ejercicio?.instrucciones || {
                posicion_inicial: '',
                ejecucion: '',
                consejos_tecnicos: [],
                errores_comunes: ''
              }
            }
          }))
        }))
        console.log('Mapped plan items successfully:', mapped)
        setPlanItems(mapped)
      } else {
        console.log('No entrenamientos to map. Setting empty.')
        setPlanItems([])
      }
    } catch (err) {
      console.error('Error during mapping planData:', err)
    }
  }, [planData])

  // Select initial date (prioritizes day with scheduled workouts)
  useEffect(() => {
    if (planData?.semana_rango?.inicio) {
      const start = planData.semana_rango.inicio
      const end = planData.semana_rango.fin
      const todayStr = formatDateISO(new Date())
      
      if (todayStr >= start && todayStr <= end) {
        const hasSomethingToday = planItems.some(item => item.fecha_programada === todayStr)
        if (hasSomethingToday) {
          setSelectedDateStr(todayStr)
        } else {
          const firstWithSomething = planItems.find(item => item.fecha_programada >= start && item.fecha_programada <= end)
          if (firstWithSomething) {
            setSelectedDateStr(firstWithSomething.fecha_programada)
          } else {
            setSelectedDateStr(todayStr)
          }
        }
      } else {
        const firstWithSomething = planItems.find(item => item.fecha_programada >= start && item.fecha_programada <= end)
        if (firstWithSomething) {
          setSelectedDateStr(firstWithSomething.fecha_programada)
        } else {
          setSelectedDateStr(start)
        }
      }
    }
  }, [planData, planItems])

  const activeWorkout = useMemo(() => {
    return planItems.find(item => 'id_entrenamiento' in item && item.fecha_programada === selectedDateStr) as Workout | undefined
  }, [planItems, selectedDateStr])

  if (isPlanLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange mb-3"></div>
        <div className="text-[12px] text-surface-muted font-medium">Cargando planificación del usuario...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4 text-left">
      {/* Week Navigator */}
      <div className="card-base flex items-center justify-between py-3">
        <div className="flex items-center gap-2">
          <Calendar size={15} className="text-brand-orange" />
          <span className="text-[12px] font-bold text-white">Planificación de Rutina</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setWeekOffset(w => w - 1)}><ChevronLeft size={13} /></Button>
          <span className="text-[11px] font-medium text-surface-muted uppercase tracking-wider">
            {weekOffset === 0 
              ? (planData?.semana_numero ? `Semana ${planData.semana_numero}` : 'Semana Actual') 
              : weekOffset > 0 ? `Semana +${weekOffset}` : `Semana ${weekOffset}`}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setWeekOffset(w => w + 1)}><ChevronRight size={13} /></Button>
        </div>
      </div>

      {/* Date Picker row */}
      <div className="grid grid-cols-7 gap-2.5">
        {weekDates.map((date) => {
          const dateStr = formatDateISO(date)
          const isSelected = dateStr === selectedDateStr
          const isToday = dateStr === formatDateISO(new Date())
          const hasWorkout = planItems.some(item => 'id_entrenamiento' in item && item.fecha_programada === dateStr)

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDateStr(dateStr)}
              className={cn(
                'card-base p-2 text-center flex flex-col items-center justify-center transition-all cursor-pointer border relative',
                isSelected ? 'border-brand-orange bg-brand-orange/10 font-bold' : isToday ? 'border-brand-orange/40 bg-brand-orange/5' : 'border-surface-border bg-surface-card2'
              )}
            >
              <div className="text-[9px] text-surface-muted uppercase">{date.toLocaleDateString('es-ES', { weekday: 'short' })}</div>
              <div className="text-[14px] font-bold text-white mt-0.5">{date.getDate()}</div>
              
              <div className="absolute bottom-1.5 flex gap-1 justify-center w-full">
                {hasWorkout && <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" title="Entrenamiento planificado" />}
              </div>
            </button>
          )
        })}
      </div>

      {/* Detail Block */}
      {activeWorkout ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          {/* Left Column: Workout Parameters */}
          <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-4">
            <div className="text-[12px] font-bold text-brand-orange uppercase tracking-wider">Detalle del Entrenamiento</div>
            <div className="grid grid-cols-2 gap-4 text-[12px]">
              <div>
                <label className="text-[10px] text-surface-muted uppercase font-semibold">Tipo de Entrenamiento</label>
                <div className="text-white font-medium mt-1">{activeWorkout.tipo}</div>
              </div>
              <div>
                <label className="text-[10px] text-surface-muted uppercase font-semibold">Zona de Esfuerzo</label>
                <div className="text-white font-medium mt-1">{activeWorkout.zona_esfuerzo || '—'}</div>
              </div>
              <div>
                <label className="text-[10px] text-surface-muted uppercase font-semibold">Fecha Programada</label>
                <div className="text-white font-medium mt-1">{activeWorkout.fecha_programada}</div>
              </div>
              <div>
                <label className="text-[10px] text-surface-muted uppercase font-semibold">Estado</label>
                <div className="mt-1">
                  <Badge variant={activeWorkout.estado.toLowerCase() === 'completado' ? 'green' : 'orange'}>
                    {activeWorkout.estado.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div className="col-span-2">
                <label className="text-[10px] text-surface-muted uppercase font-semibold">Calorías Objetivo</label>
                <div className="text-white font-medium mt-1">{activeWorkout.macros_objetivo_kcal ? `${activeWorkout.macros_objetivo_kcal} kcal` : '—'}</div>
              </div>
              {activeWorkout.macros_objetivo_proteina !== undefined && (
                <div className="col-span-2 grid grid-cols-3 gap-2 bg-surface-card2 border border-surface-border p-3 rounded-lg text-center">
                  <div>
                    <div className="text-[9px] text-surface-muted uppercase font-semibold">Carbohidratos</div>
                    <div className="text-white font-bold text-[13px] mt-0.5">{activeWorkout.macros_objetivo_ch || 0}g</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-surface-muted uppercase font-semibold">Proteínas</div>
                    <div className="text-white font-bold text-[13px] mt-0.5">{activeWorkout.macros_objetivo_proteina || 0}g</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-surface-muted uppercase font-semibold">Grasas</div>
                    <div className="text-white font-bold text-[13px] mt-0.5">{activeWorkout.macros_objetivo_grasas || 0}g</div>
                  </div>
                </div>
              )}
              <div className="col-span-2 border-t border-surface-border/50 pt-3">
                <label className="text-[10px] text-surface-muted uppercase font-semibold">Descripción de la Sesión</label>
                <p className="text-white mt-1.5 leading-relaxed whitespace-pre-wrap text-[11px]">{activeWorkout.descripcion || 'Sin descripción detallada.'}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Exercises list */}
          <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-4">
            <div className="text-[12px] font-bold text-brand-orange uppercase tracking-wider">Ejercicios & Estructuras</div>
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {activeWorkout.ejercicios_asociados.map((we) => (
                <div
                  key={we.id_entrenamiento_ejercicio}
                  onClick={() => setSelectedExercise(we)}
                  className="w-full p-3.5 flex justify-between items-center bg-surface-card2 border border-surface-border rounded-xl hover:border-brand-orange transition-all text-white text-left cursor-pointer"
                >
                  <div>
                    <div className="text-[12px] font-bold text-white">{we.ejercicio.nombre}</div>
                    <div className="text-[10px] text-surface-muted mt-0.5">
                      Orden: {we.orden} · {we.series} series x {we.repeticiones} {we.peso_objetivo > 0 ? `· ${we.peso_objetivo}kg` : ''}
                    </div>
                  </div>
                  <span className="text-[10px] text-brand-orange font-semibold hover:underline">Ver Detalle →</span>
                </div>
              ))}
              {activeWorkout.ejercicios_asociados.length === 0 && (
                <div className="text-center py-10 text-surface-muted text-[11px] bg-surface-card2 rounded-xl border border-surface-border">
                  No hay ejercicios registrados en este entrenamiento.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="card-base p-10 bg-surface-card border border-surface-border rounded-xl text-center flex flex-col items-center justify-center min-h-[250px]">
          <span className="text-3xl mb-2">📅</span>
          <div className="text-[13px] font-bold text-white uppercase tracking-wide">Día sin planificación</div>
          <p className="text-[11px] text-surface-muted max-w-[300px] mt-1">
            No hay entrenamientos planificados para el <span className="font-bold text-white">{selectedDateStr}</span>.
          </p>
        </div>
      )}

      {/* Exercise detail popup modal */}
      {selectedExercise && (
        <Modal isOpen={selectedExercise !== null} onClose={() => setSelectedExercise(null)} title={selectedExercise.ejercicio.nombre}>
          <div className="space-y-4 text-[12px] text-left text-white max-h-[450px] overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-3 bg-surface-card2 border border-surface-border p-3 rounded-lg">
              <div>
                <span className="text-[10px] text-surface-muted uppercase font-bold">Series</span>
                <div className="text-white font-bold text-[14px] mt-0.5">{selectedExercise.series}</div>
              </div>
              <div>
                <span className="text-[10px] text-surface-muted uppercase font-bold">Repeticiones</span>
                <div className="text-white font-bold text-[14px] mt-0.5">{selectedExercise.repeticiones}</div>
              </div>
              <div>
                <span className="text-[10px] text-surface-muted uppercase font-bold">Peso Objetivo</span>
                <div className="text-white font-bold text-[14px] mt-0.5">{selectedExercise.peso_objetivo} kg</div>
              </div>
              <div>
                <span className="text-[10px] text-surface-muted uppercase font-bold">Descanso</span>
                <div className="text-white font-bold text-[14px] mt-0.5">{selectedExercise.descanso_segundos} seg</div>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-brand-orange uppercase font-bold">Descripción de Ejercicio</span>
              <p className="text-white mt-1 leading-relaxed text-[11px]">{selectedExercise.ejercicio.descripcion}</p>
            </div>

            {selectedExercise.ejercicio.instrucciones?.posicion_inicial && (
              <div>
                <span className="text-[10px] text-brand-orange uppercase font-bold">Posición Inicial</span>
                <p className="text-white mt-1 leading-relaxed text-[11px]">{selectedExercise.ejercicio.instrucciones.posicion_inicial}</p>
              </div>
            )}

            {selectedExercise.ejercicio.instrucciones?.ejecucion && (
              <div>
                <span className="text-[10px] text-brand-orange uppercase font-bold">Ejecución</span>
                <p className="text-white mt-1 leading-relaxed text-[11px]">{selectedExercise.ejercicio.instrucciones.ejecucion}</p>
              </div>
            )}

            {selectedExercise.ejercicio.instrucciones?.errores_comunes && (
              <div>
                <span className="text-[10px] text-brand-red uppercase font-bold">Errores Comunes</span>
                <p className="text-white mt-1 leading-relaxed text-[11px]">{selectedExercise.ejercicio.instrucciones.errores_comunes}</p>
              </div>
            )}

            {(selectedExercise.ejercicio.instrucciones?.consejos_tecnicos?.length ?? 0) > 0 && (
              <div>
                <span className="text-[10px] text-brand-orange uppercase font-bold">Consejos Técnicos</span>
                <ul className="list-disc pl-4 mt-1 space-y-1 text-[11px]">
                  {selectedExercise.ejercicio.instrucciones?.consejos_tecnicos?.map((tip: string, idx: number) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="flex justify-end mt-4 pt-3 border-t border-surface-border">
            <Button variant="ghost" onClick={() => setSelectedExercise(null)}>Cerrar</Button>
          </div>
        </Modal>
      )}
    </div>
  )
}

