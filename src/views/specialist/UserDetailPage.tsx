import { useState, useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { usersService } from '@/services/endpoints/users'
import { ChevronLeft, ChevronRight, Calendar, MessageSquare, Save, X, Edit2, Play, Eye, ClipboardList, Plus, Coffee, Trash2 } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Select, SelectOption } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { Toggle } from '@/components/ui/Toggle'
import { useAppStore } from '@/store/useAppStore'
import { useRepositories } from '@/core/repositories'
import { cn } from '@/utils'
import type { User, PlanItem, Workout, RestDay, WorkoutExercise, Exercise } from '@/types'
import { PLAN_NAMES } from '@/constants'
import { toast } from '@/components/ui/Toast'
import type { PredefinedWorkout, Comment, DailyNutritionHydrationLog, Comida, BiometricEntry } from '@/core/domain/types'
import { ProgressTab } from '@/components/patient/ProgressTab';
import { ClinicalReportTab } from '@/components/patient/ClinicalReportTab';

// Helper to render read-only lists of chips
function ReadOnlyChipList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-surface-card border border-surface-border rounded-xl p-4">
      <div className="text-[12px] font-semibold text-white mb-2.5">{title}</div>
      <div className="flex gap-1.5 flex-wrap min-h-[26px]">
        {(!items || items.length === 0) ? (
          <span className="text-[11px] text-surface-muted">Ninguno registrado</span>
        ) : (
          items.map((item, idx) => (
            <span
              key={idx}
              className="inline-flex px-2.5 py-1 rounded-xl text-[11px] bg-surface-card2 border border-surface-border text-white font-medium"
            >
              {item}
            </span>
          ))
        )}
      </div>
    </div>
  )
}

// ─── Perfil Tab ──────────────────────────────────────────────────
const PerfilTab = ({ u }: { u: User }) => (
  <div className="space-y-5">
    {/* Card 1: Ficha de Usuario */}
    <div className="card-base p-5 bg-surface-card border border-surface-border rounded-xl text-left">
      <h3 className="text-sm font-bold text-white mb-4">Ficha de Usuario</h3>
      <div className="flex flex-col md:flex-row gap-5 items-start mb-5">
        {/* Left: Avatar */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <Avatar initials={u.initials} color={u.color} size="lg" className="w-16 h-16 text-xl border-[3px] border-surface-card" />
        </div>

        {/* Middle: Objetivo Principal */}
        <div className="flex-1 w-full">
          <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">OBJETIVO PRINCIPAL</label>
          <textarea
            value={u.objetivo_principal || ''}
            disabled
            className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none min-h-[80px] resize-none opacity-80 cursor-not-allowed"
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
            disabled
            className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] opacity-80 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">EMAIL</label>
          <input
            type="email"
            value={u.email || ''}
            disabled
            className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] opacity-80 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">APODO</label>
          <input
            type="text"
            value={u.apodo || ''}
            disabled
            className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] opacity-80 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">GÉNERO</label>
          <input
            type="text"
            value={u.genero || ''}
            disabled
            className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] opacity-80 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">FECHA DE NACIMIENTO</label>
          <input
            type="text"
            value={u.fecha_nacimiento ? u.fecha_nacimiento.substring(0, 10) : '1990-01-01'}
            disabled
            className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] opacity-80 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">EDAD</label>
          <input
            type="number"
            value={u.edad || 0}
            disabled
            className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] opacity-80 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">CIUDAD</label>
          <input
            type="text"
            value={u.ciudad || ''}
            disabled
            className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] opacity-80 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">ALTITUD (M)</label>
          <input
            type="number"
            value={u.altitud || 0}
            disabled
            className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] opacity-80 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">IDIOMA</label>
          <input
            type="text"
            value={u.idioma || ''}
            disabled
            className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] opacity-80 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">ESTADO DE CUENTA</label>
          <div className="flex items-center gap-2 h-[38px]">
            <Badge variant={
              u.estado === 'Suspendido Temporalmente' ? 'orange' :
              u.estado === 'Suspendido Permanentemente' ? 'red' :
              (u.registro_activo ? 'green' : 'red')
            }>
              {u.estado || (u.registro_activo ? 'Activo' : 'Inactivo')}
            </Badge>
          </div>
        </div>
      </div>
    </div>

    {/* Card 2: Datos Físicos y Antropométricos */}
    <div className="card-base p-5 bg-surface-card border border-surface-border rounded-xl text-left">
      <h3 className="text-sm font-bold text-white mb-4">Datos Físicos y Antropométricos</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">PESO ({u.unidad_peso || 'kg'})</label>
          <input
            type="number"
            value={u.peso || 0}
            disabled
            className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] opacity-80 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">ALTURA ({u.unidad_altura || 'cm'})</label>
          <input
            type="number"
            value={u.altura || 0}
            disabled
            className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] opacity-80 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">NIVEL DE ACTIVIDAD (1-5)</label>
          <input
            type="number"
            value={u.nivel_actividad ?? 0}
            disabled
            className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] opacity-80 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">NIVEL MOTOR ACTUAL (1-5)</label>
          <input
            type="number"
            value={u.nivel_motor_actual ?? 0}
            disabled
            className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] opacity-80 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">CLASIFICACIÓN MOTOR</label>
          <input
            type="text"
            value={u.clasificacion_visible_actual || ''}
            disabled
            className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] opacity-80 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">TIEMPO SIN ENTRENAR</label>
          <input
            type="text"
            value={u.tiempo_sin_entrenar || ''}
            disabled
            className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] opacity-80 cursor-not-allowed"
          />
        </div>
      </div>
    </div>

    {/* Card 3: Planificación, Objetivos y Suscripción */}
    <div className="card-base p-5 bg-surface-card border border-surface-border rounded-xl text-left">
      <h3 className="text-sm font-bold text-white mb-4">Planificación, Objetivos y Suscripción</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">DISCIPLINA / DEPORTE</label>
          <input
            type="text"
            value={u.nombre_disciplina || ''}
            disabled
            className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] opacity-80 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">DURACIÓN OBJETIVO (SEMANAS)</label>
          <input
            type="number"
            value={u.duracion_semanas_objetivo || 0}
            disabled
            className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] opacity-80 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">FECHA INICIO PREFERIDA</label>
          <input
            type="text"
            value={u.fecha_inicio_preferida || ''}
            disabled
            className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] opacity-80 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">PRÓXIMA COMPETENCIA</label>
          <input
            type="text"
            value={u.proxima_competencia ? u.proxima_competencia.substring(0, 10) : '—'}
            disabled
            className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] opacity-80 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">ALIMENTACIÓN</label>
          <input
            type="text"
            value={u.alimentacion || ''}
            disabled
            className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] opacity-80 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">PLAN ACTIVO</label>
          <input
            type="text"
            value={u.nombre_plan_activo || PLAN_NAMES[u.plan_idx] || 'Essential'}
            disabled
            className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] opacity-80 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">ESTADO SUSCRIPCIÓN</label>
          <input
            type="text"
            value={u.estado_suscripcion || (u.tiene_plan_activo ? 'Activa' : 'Inactiva')}
            disabled
            className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] opacity-80 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">FIN SUSCRIPCIÓN</label>
          <input
            type="text"
            value={u.fecha_fin_suscripcion ? u.fecha_fin_suscripcion.substring(0, 10) : '—'}
            disabled
            className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] opacity-80 cursor-not-allowed"
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

    {/* Card 4: Preferencias, Reportes y Notificaciones */}
    <div className="card-base p-5 bg-surface-card border border-surface-border rounded-xl text-left">
      <h3 className="text-sm font-bold text-white mb-4">Preferencias, Reportes y Notificaciones</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">ESTILO DE COMUNICACIÓN</label>
          <input
            type="text"
            value={u.estilo_comunicacion || ''}
            disabled
            className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] opacity-80 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">INTENSIDAD NOTIFICACIONES</label>
          <input
            type="text"
            value={u.intensidad_notificaciones || ''}
            disabled
            className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] opacity-80 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">DÍA DE REPORTE</label>
          <input
            type="text"
            value={u.dia_reporte || ''}
            disabled
            className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] opacity-80 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">HORA DE REPORTE</label>
          <input
            type="text"
            value={u.hora_reporte || ''}
            disabled
            className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] opacity-80 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">HORA DE NOTIFICACIÓN</label>
          <input
            type="text"
            value={u.notification_time || ''}
            disabled
            className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] opacity-80 cursor-not-allowed"
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

    {/* Card 5: Días de Entreno, Equipamiento y Lesiones */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
      <ReadOnlyChipList title="Días de Entrenamiento" items={u.dias_entrenamiento || []} />
      <ReadOnlyChipList title="Equipamiento" items={u.equipo || []} />
      <ReadOnlyChipList title="Historial de Lesiones" items={u.historial_lesiones || []} />
    </div>

    {/* Card 6: Historial Deportivo */}
    <div className="card-base p-5 bg-surface-card border border-surface-border rounded-xl text-left">
      <h3 className="text-sm font-bold text-white mb-4">Historial Deportivo</h3>
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
                  disabled
                  placeholder="Logro o Carrera"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] opacity-80 cursor-not-allowed"
                />
              </div>
              <div className="flex-1 w-full">
                <input
                  type="text"
                  value={t.org || ''}
                  disabled
                  placeholder="Organizador o Lugar"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] opacity-80 cursor-not-allowed"
                />
              </div>
              <div className="w-full md:w-44">
                <input
                  type="text"
                  value={(t.inicio && t.fin) ? `${t.inicio}-${t.fin}` : (t.inicio || '2025')}
                  disabled
                  placeholder="Año o período"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] opacity-80 cursor-not-allowed"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)

// Helper to get dates of the week
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

const formatDateISO = (d: Date): string => {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// ─── Nested Exercise Detail Modal (Option B - isolated copy edits & comments) ───
interface ExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: WorkoutExercise;
  onSave: (updated: WorkoutExercise) => void;
  readOnly?: boolean;
}

function ExerciseDetailModal({ isOpen, onClose, exercise, onSave, readOnly = false }: ExerciseModalProps) {
  const repos = useRepositories()
  const [localExercise, setLocalExercise] = useState<WorkoutExercise | null>(null)
  
  // Local exercise comments state
  const [comments, setComments] = useState<Comment[]>([])
  const [newCommentText, setNewCommentText] = useState('')
  const [updateTick, setUpdateTick] = useState(0)

  // Copy on open to shield parent state
  useEffect(() => {
    if (isOpen && exercise) {
      setLocalExercise(JSON.parse(JSON.stringify(exercise)))
      setUpdateTick(t => t + 1)
    }
  }, [isOpen, exercise])

  // Fetch comments specific to this exercise
  useEffect(() => {
    if (isOpen && exercise) {
      repos.comments.getComments('exercise', exercise.id_entrenamiento_ejercicio).then(setComments)
    }
  }, [isOpen, exercise, updateTick])

  if (!localExercise) return null

  const inst = localExercise.ejercicio.instrucciones || { posicion_inicial: '', ejecucion: '', consejos_tecnicos: [], errores_comunes: '' }

  const handleUpdateLocalField = (field: keyof WorkoutExercise | keyof Exercise | 'instrucciones', subfield: string | undefined, val: any) => {
    if (!localExercise) return
    
    // WorkoutExercise fields
    if (['series', 'repeticiones', 'orden', 'descanso_segundos', 'duracion_segundos', 'peso_objetivo', 'estado'].includes(field)) {
      setLocalExercise({ ...localExercise, [field]: val })
    }
    // Base Exercise fields
    else if (['nombre', 'descripcion', 'multimedia_url', 'tipo', 'necesita_mapa'].includes(field)) {
      setLocalExercise({
        ...localExercise,
        ejercicio: { ...localExercise.ejercicio, [field]: val }
      })
    }
    // Base Exercise Instructions fields
    else if (field === 'instrucciones' && subfield) {
      setLocalExercise({
        ...localExercise,
        ejercicio: {
          ...localExercise.ejercicio,
          instrucciones: {
            ...inst,
            [subfield]: subfield === 'consejos_tecnicos' ? val.split(',').map((s: string) => s.trim()) : val
          }
        }
      })
    }
  }

  // Post comments directly to DB (saves instantly)
  const handlePostComment = async () => {
    if (!newCommentText.trim()) return
    const commentData = {
      parentId: null,
      userId: 'esp-1',
      userName: 'Dr. Carlos Mendoza',
      userRole: 'specialist' as const,
      content: newCommentText,
      contextType: 'exercise' as const,
      contextId: localExercise.id_entrenamiento_ejercicio
    }
    await repos.comments.postComment(commentData)
    setNewCommentText('')
    toast.show('Comentario de ejercicio publicado', 'success')
    setUpdateTick(t => t + 1)
  }

  const handleSaveClick = () => {
    onSave(localExercise)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Detalle del Ejercicio: ${localExercise.ejercicio.nombre}`}
      depth={1} // Renders layered over Workout Modal (Workout depth is 0)
      className="max-w-5xl"
    >
      <div className="max-h-[75vh] overflow-y-auto pr-1 space-y-4">
        
        {/* Top Section: 2 Columns (Left: Parameters, Right: Instructions) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Left Column: Parámetros */}
          <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-3.5">
            <div className="text-[12px] font-bold text-brand-orange uppercase tracking-wider mb-2">Parámetros del Ejercicio</div>
            
            <div className="space-y-3">
              {/* 1. Tipo de Ejercicio Selector (First!) */}
              <div className="flex flex-col gap-1 w-full text-left">
                <span className="text-[11px] font-bold text-surface-muted uppercase tracking-wider">Tipo de Ejercicio</span>
                <select
                  value={localExercise.ejercicio.tipo || 'Fuerza'}
                  onChange={(e) => handleUpdateLocalField('tipo', undefined, e.target.value)}
                  className="form-input text-[12px] py-2 bg-surface-card2 border border-surface-border uppercase font-semibold text-white outline-none focus:border-brand-orange transition-colors"
                  disabled={readOnly}
                >
                  {['Fuerza', 'Resistencia', 'Cardio', 'Flexibilidad', 'Recuperación', 'Coordinación'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* 2. Nombre del Ejercicio (Select with Search!) */}
              <div className="text-left">
                <Select
                  label="Nombre del Ejercicio"
                  placeholder="Busca o selecciona un ejercicio..."
                  options={[
                    { value: 'Sentadillas', label: 'Sentadillas' },
                    { value: 'Peso Muerto', label: 'Peso Muerto' },
                    { value: 'Press de Banca', label: 'Press de Banca' },
                    { value: 'Zancadas Búlgaras', label: 'Zancadas Búlgaras' },
                    { value: 'Dominadas', label: 'Dominadas' },
                    { value: 'Remo con Barra', label: 'Remo con Barra' },
                    { value: 'Plancha Abdominal', label: 'Plancha Abdominal' },
                    { value: 'Flexiones de Brazo', label: 'Flexiones de Brazo' },
                    { value: 'Elevaciones Laterales', label: 'Elevaciones Laterales' },
                    { value: 'Carrera Continua', label: 'Carrera Continua' },
                    { value: 'Intervalos HIIT', label: 'Intervalos HIIT' },
                    { value: 'Estiramientos', label: 'Estiramientos Activos' },
                  ]}
                  value={localExercise.ejercicio.nombre}
                  onChange={(val) => handleUpdateLocalField('nombre', undefined, val)}
                  disabled={readOnly}
                />
              </div>

              {/* 3. Multimedia URL & Description */}
              <Input
                label="URL del Video / Multimedia"
                value={localExercise.ejercicio.multimedia_url || ''}
                onChange={(e) => handleUpdateLocalField('multimedia_url', undefined, e.target.value)}
                disabled={readOnly}
              />
              <div className="flex flex-col gap-1 w-full text-left">
                <label className="text-[11px] font-bold text-surface-muted uppercase tracking-wider">Descripción del Ejercicio</label>
                <input
                  type="text"
                  value={localExercise.ejercicio.descripcion || ''}
                  onChange={(e) => handleUpdateLocalField('descripcion', undefined, e.target.value)}
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none focus:border-brand-orange"
                  placeholder="Ej. Fortalecimiento del tren inferior..."
                  disabled={readOnly}
                />
              </div>

              {/* Grid of secondary details */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-surface-border/30 mt-2">
                <Input
                  label="Series"
                  type="number"
                  value={localExercise.series}
                  onChange={(e) => handleUpdateLocalField('series', undefined, Number(e.target.value))}
                  disabled={readOnly}
                />
                <Input
                  label="Reps / Distancia"
                  value={localExercise.repeticiones}
                  onChange={(e) => handleUpdateLocalField('repeticiones', undefined, e.target.value)}
                  disabled={readOnly}
                />
                <Input
                  label="Orden"
                  type="number"
                  value={localExercise.orden}
                  onChange={(e) => handleUpdateLocalField('orden', undefined, Number(e.target.value))}
                  disabled={readOnly}
                />
                <Input
                  label="Descanso (s)"
                  type="number"
                  value={localExercise.descanso_segundos}
                  onChange={(e) => handleUpdateLocalField('descanso_segundos', undefined, Number(e.target.value))}
                  disabled={readOnly}
                />
                <Input
                  label="Peso Objetivo (kg)"
                  type="number"
                  value={localExercise.peso_objetivo}
                  onChange={(e) => handleUpdateLocalField('peso_objetivo', undefined, Number(e.target.value))}
                  disabled={readOnly}
                />
                <Input
                  label="Duración (s)"
                  type="number"
                  value={localExercise.duracion_segundos}
                  onChange={(e) => handleUpdateLocalField('duracion_segundos', undefined, Number(e.target.value))}
                  disabled={readOnly}
                />
                <div className="flex flex-col gap-1 w-full text-left">
                  <span className="text-[11px] font-bold text-surface-muted uppercase tracking-wider">Estado</span>
                  <select
                    value={localExercise.estado}
                    onChange={(e) => handleUpdateLocalField('estado', undefined, e.target.value)}
                    className="form-input text-[11px] py-2 bg-surface-card2 border border-surface-border uppercase font-semibold text-white outline-none focus:border-brand-orange"
                  disabled={readOnly}
                  >
                    {['Pendiente', 'Completado', 'En progreso'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1 w-full text-left justify-center">
                  <span className="text-[11px] font-bold text-surface-muted uppercase tracking-wider">¿Mapa?</span>
                  <Toggle
                    checked={localExercise.ejercicio.necesita_mapa || false}
                    onChange={(val) => handleUpdateLocalField('necesita_mapa', undefined, val)}
                    disabled={readOnly}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Instrucciones de Ejecución */}
          <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-3.5 text-left">
            <div className="text-[12px] font-bold text-brand-orange uppercase tracking-wider mb-2">Instrucciones de Ejecución</div>
            <div className="flex flex-col gap-1 w-full">
              <label className="text-[11px] font-bold text-surface-muted uppercase tracking-wider">Posición Inicial</label>
              <textarea
                value={inst.posicion_inicial}
                onChange={(e) => handleUpdateLocalField('instrucciones', 'posicion_inicial', e.target.value)}
                rows={2}
                className="bg-surface-card2 border border-surface-border rounded-lg p-2.5 text-[11px] text-white outline-none focus:border-brand-orange placeholder:text-surface-muted"
                placeholder="Posición correcta para comenzar..."
                disabled={readOnly}
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label className="text-[11px] font-bold text-surface-muted uppercase tracking-wider">Ejecución Técnica</label>
              <textarea
                value={inst.ejecucion}
                onChange={(e) => handleUpdateLocalField('instrucciones', 'ejecucion', e.target.value)}
                rows={3}
                className="bg-surface-card2 border border-surface-border rounded-lg p-2.5 text-[11px] text-white outline-none focus:border-brand-orange placeholder:text-surface-muted"
                placeholder="Explicación detallada del movimiento..."
                disabled={readOnly}
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label className="text-[11px] font-bold text-surface-muted uppercase tracking-wider">Consejos Técnicos (Separar por comas)</label>
              <input
                type="text"
                value={inst.consejos_tecnicos.join(', ')}
                onChange={(e) => handleUpdateLocalField('instrucciones', 'consejos_tecnicos', e.target.value)}
                className="bg-surface-card2 border border-surface-border rounded-lg px-2.5 py-1.5 text-[11px] text-white outline-none focus:border-brand-orange placeholder:text-surface-muted"
                placeholder="Ej. Mantener espalda recta, respirar al bajar..."
                disabled={readOnly}
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label className="text-[11px] font-bold text-surface-muted uppercase tracking-wider">Errores Comunes</label>
              <textarea
                value={inst.errores_comunes}
                onChange={(e) => handleUpdateLocalField('instrucciones', 'errores_comunes', e.target.value)}
                rows={2}
                className="bg-surface-card2 border border-surface-border rounded-lg p-2.5 text-[11px] text-white outline-none focus:border-brand-orange placeholder:text-surface-muted"
                placeholder="Evitar arquear la columna, etc..."
                disabled={readOnly}
              />
            </div>
          </div>

        </div>

        {/* Bottom Section: Comentarios (Spans full width underneath both cards!) */}
        <div className="bg-surface-card border border-surface-border rounded-xl p-5 flex flex-col h-full min-h-[220px] text-left">
          <div className="text-[12px] font-bold text-surface-muted uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
            <MessageSquare size={13} className="text-brand-purple" />
            <span>Comentarios del Ejercicio</span>
          </div>

          <div className="overflow-y-auto space-y-2.5 max-h-[160px] pr-0.5 mb-4">
            {comments.map((c) => (
              <div key={c.id} className={cn('p-2.5 rounded-lg border text-[11px] leading-relaxed', c.userRole === 'specialist' ? 'bg-brand-purple/5 border-brand-purple/20 text-left' : 'bg-brand-orange/5 border-brand-orange/20 text-left')}>
                <div className="flex items-center justify-between mb-1 text-[9px] text-surface-muted font-bold">
                  <span className={c.userRole === 'specialist' ? 'text-brand-purple' : 'text-brand-orange'}>{c.userName} ({c.userRole === 'specialist' ? 'Pro' : 'Alumno'})</span>
                  <span>{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-white">{c.content}</p>
              </div>
            ))}
            {comments.length === 0 && (
              <div className="text-center py-6 text-[11px] text-surface-muted">No hay anotaciones ni indicaciones permanente para este ejercicio.</div>
            )}
          </div>

          {!readOnly && (
            <div className="pt-2.5 border-t border-surface-border flex gap-2 mt-auto">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Deja una nota sobre la ejecución o progresión de este ejercicio..."
                className="bg-surface-card border border-surface-border rounded-lg px-2.5 py-1.5 text-[11px] text-white outline-none flex-1 focus:border-brand-purple placeholder:text-surface-muted"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handlePostComment()
                }}
              />
              <Button variant="purple" size="sm" onClick={handlePostComment} className="py-1 px-3">Comentar</Button>
            </div>
          )}
        </div>

      </div>

      <div className="flex gap-2 justify-end mt-4 pt-3 border-t border-surface-border">
        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        {!readOnly && <Button variant="primary" onClick={handleSaveClick}>Guardar Ejercicio</Button>}
      </div>
    </Modal>
  )
}

const isUUID = (id: string) => {
  if (!id) return false
  if (id.startsWith('uid-') || id.startsWith('pro-') || id.startsWith('esp-') || id.length < 10) return false
  return true
}

// ─── Plan Tab (Continuous Calendar with Drag & Drop) ─────────────
export function SpecialistPlanTab({ userId, readOnly = false }: { userId: string; readOnly?: boolean }) {
  const repos = useRepositories()
  const [weekOffset, setWeekOffset] = useState(0)
  const [planItems, setPlanItems] = useState<PlanItem[]>([])
  const [selectedDateStr, setSelectedDateStr] = useState(formatDateISO(new Date()))
  const [updateTick, setUpdateTick] = useState(0)

  // Isolated Exercise details modal state (nested popup)
  const [selectedExercise, setSelectedExercise] = useState<WorkoutExercise | null>(null)

  // Workout comments state
  const [comments, setComments] = useState<Comment[]>([])
  const [newCommentText, setNewCommentText] = useState('')

  const { data: planData, isLoading: isPlanLoading } = useQuery({
    queryKey: ['userPlanTab', userId],
    queryFn: () => usersService.getUserTabDetalle(userId, 'plan'),
    enabled: !!userId,
  })

  // Set weekDates dynamically to align with the returned semana_rango if available
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

  // Select initial date from returned semana_rango or today, prioritizing days with scheduled items
  useEffect(() => {
    if (planData?.semana_rango?.inicio) {
      const start = planData.semana_rango.inicio
      const end = planData.semana_rango.fin
      const todayStr = formatDateISO(new Date())
      
      if (todayStr >= start && todayStr <= end) {
        // Today is within the week range
        const hasSomethingToday = planItems.some(item => item.fecha_programada === todayStr)
        if (hasSomethingToday) {
          setSelectedDateStr(todayStr)
        } else {
          // Find first day that has something scheduled this week
          const firstWithSomething = planItems.find(item => item.fecha_programada >= start && item.fecha_programada <= end)
          if (firstWithSomething) {
            setSelectedDateStr(firstWithSomething.fecha_programada)
          } else {
            setSelectedDateStr(todayStr)
          }
        }
      } else {
        // Today is outside the week range. Find first scheduled day, fallback to week start
        const firstWithSomething = planItems.find(item => item.fecha_programada >= start && item.fecha_programada <= end)
        if (firstWithSomething) {
          setSelectedDateStr(firstWithSomething.fecha_programada)
        } else {
          setSelectedDateStr(start)
        }
      }
    }
  }, [planData, planItems])

  // Populate plan items from API (or fallback to repo)
  useEffect(() => {
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
      setPlanItems(mapped)
    } else {
      repos.workouts.getPlanForUser(userId).then(setPlanItems)
    }
  }, [planData, userId, repos.workouts, updateTick])

  // Get active Workout or Rest Day for the selected date
  const activeWorkout = useMemo(() => {
    return planItems.find(item => 'id_entrenamiento' in item && item.fecha_programada === selectedDateStr) as Workout | undefined
  }, [planItems, selectedDateStr])

  const activeRestDay = useMemo(() => {
    return planItems.find(item => 'id_descanso' in item && item.fecha_programada === selectedDateStr) as RestDay | undefined
  }, [planItems, selectedDateStr])

  // Fetch comments when active workout or rest day changes
  useEffect(() => {
    if (activeWorkout) {
      repos.comments.getComments('workout', activeWorkout.id_entrenamiento).then(setComments)
    } else if (activeRestDay) {
      repos.comments.getComments('restday', activeRestDay.id_descanso).then(setComments)
    } else {
      setComments([])
    }
  }, [activeWorkout, activeRestDay, updateTick])

  // Save Workout
  const handleSaveActiveWorkout = async () => {
    if (activeWorkout) {
      await repos.workouts.saveWorkout(activeWorkout)
      toast.show('Entrenamiento guardado con éxito', 'success')
      setUpdateTick(t => t + 1)
    }
  }

  // Save Rest Day
  const handleSaveActiveRestDay = async () => {
    if (activeRestDay) {
      await repos.workouts.saveRestDay(activeRestDay)
      toast.show('Día de descanso guardado con éxito', 'success')
      setUpdateTick(t => t + 1)
    }
  }

  // Delete active Workout or Rest Day on the selected date
  const handleDeleteActiveWorkoutOrRestDay = () => {
    if (selectedDateStr) {
      repos.workouts.deletePlanItemByDate(selectedDateStr).then(() => {
        setUpdateTick(t => t + 1)
        toast.show('Eliminado con éxito', 'error')
      })
    }
  }

  // Create empty Workout dynamically on the selected date
  const handleCreateWorkout = (dateStr: string) => {
    repos.workouts.deletePlanItemByDate(dateStr).then(() => {
      const newWorkout: Workout = {
        id_entrenamiento: `wk-${Date.now()}`,
        tipo: 'FUERZA',
        fecha_programada: dateStr,
        estado: 'Pendiente',
        descripcion: 'Nueva sesión de entrenamiento planificada.',
        titulo_entrenamiento: 'Nuevo Entrenamiento',
        ejercicios_asociados: [],
        zona_esfuerzo: 'RPE 7-8',
        macros_objetivo_kcal: 0,
        macros_objetivo_ch: 0,
        macros_objetivo_proteina: 0,
        macros_objetivo_grasas: 0
      }
      repos.workouts.saveWorkout(newWorkout).then(() => {
        setSelectedDateStr(dateStr)
        setUpdateTick(t => t + 1)
        toast.show('Entrenamiento programado', 'success')
      })
    })
  }

  // Create empty Rest Day dynamically on the selected date
  const handleCreateRestDay = (dateStr: string) => {
    repos.workouts.deletePlanItemByDate(dateStr).then(() => {
      const newRestDay: RestDay = {
        id_descanso: `rd-${Date.now()}`,
        tipo: 'Descanso',
        fecha_programada: dateStr,
        mensaje: 'Día de descanso y recuperación activa.',
        caminata: 'Caminata de 20-30 min a ritmo suave',
        movilidad: '10 min de movilidad articular',
        hidratacion: 'Asegura la hidratación hoy',
        sueno: 'Asegura dormir 7-9 horas'
      }
      repos.workouts.saveRestDay(newRestDay).then(() => {
        setSelectedDateStr(dateStr)
        setUpdateTick(t => t + 1)
        toast.show('Día de descanso programado', 'success')
      })
    })
  }

  // Add Exercise inside active Workout
  const handleAddCustomExercise = () => {
    if (!activeWorkout) return
    const newWorkoutExercise: WorkoutExercise = {
      id_entrenamiento_ejercicio: `we-${Date.now()}`,
      series: 4,
      repeticiones: '12',
      orden: activeWorkout.ejercicios_asociados.length + 1,
      descanso_segundos: 60,
      duracion_segundos: 120,
      peso_objetivo: 10,
      estado: 'Pendiente',
      ejercicio: {
        id_ejercicio: `ex-${Date.now()}`,
        nombre: 'Nuevo Ejercicio',
        descripcion: 'Escribe la descripción del ejercicio...',
        multimedia_url: '',
        tipo: 'Fuerza',
        necesita_mapa: false,
        instrucciones: {
          posicion_inicial: 'Listo en posición de inicio.',
          ejecucion: 'Ejecuta el movimiento de forma controlada.',
          consejos_tecnicos: ['Mantén la postura erguida'],
          errores_comunes: 'Comprometer la postura de ejecución.'
        }
      }
    }
    activeWorkout.ejercicios_asociados.push(newWorkoutExercise)
    setUpdateTick(t => t + 1)
    toast.show('Nuevo ejercicio añadido', 'success')
  }

  // Remove Exercise from active Workout
  const handleRemoveExercise = (weId: string) => {
    if (!activeWorkout) return
    activeWorkout.ejercicios_asociados = activeWorkout.ejercicios_asociados.filter(we => we.id_entrenamiento_ejercicio !== weId)
    // Re-index orden values to keep them sequential
    activeWorkout.ejercicios_asociados = activeWorkout.ejercicios_asociados.map((we, idx) => ({ ...we, orden: idx + 1 }))
    setUpdateTick(t => t + 1)
    toast.show('Ejercicio removido', 'error')
  }

  // Post comments directly to active workout or rest day session
  const handlePostComment = async () => {
    if (!newCommentText.trim()) return
    if (activeWorkout) {
      const commentData = {
        parentId: null,
        userId: 'esp-1',
        userName: 'Dr. Carlos Mendoza',
        userRole: 'specialist' as const,
        content: newCommentText,
        contextType: 'workout' as const,
        contextId: activeWorkout.id_entrenamiento
      }
      await repos.comments.postComment(commentData)
      setNewCommentText('')
      toast.show('Comentario de entrenamiento publicado', 'success')
      setUpdateTick(t => t + 1)
    } else if (activeRestDay) {
      const commentData = {
        parentId: null,
        userId: 'esp-1',
        userName: 'Dr. Carlos Mendoza',
        userRole: 'specialist' as const,
        content: newCommentText,
        contextType: 'restday' as const,
        contextId: activeRestDay.id_descanso
      }
      await repos.comments.postComment(commentData)
      setNewCommentText('')
      toast.show('Comentario de descanso publicado', 'success')
      setUpdateTick(t => t + 1)
    }
  }

  const renderCommentsCard = (contextType: 'workout' | 'restday') => {
    return (
      <div className="card-base p-5 bg-surface-card border border-surface-border rounded-xl space-y-3.5">
        <div className="text-[12px] font-bold text-surface-muted uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
          <MessageSquare size={13} className="text-brand-purple" />
          <span>
            {contextType === 'workout' 
              ? 'Comentarios del Entrenamiento Diario' 
              : 'Comentarios del Día de Descanso'}
          </span>
        </div>

        <div className="overflow-y-auto space-y-2.5 max-h-[300px] pr-0.5">
          {comments.map((c) => (
            <div key={c.id} className={cn('p-2.5 rounded-lg border text-[11px] leading-relaxed', c.userRole === 'specialist' ? 'bg-brand-purple/5 border-brand-purple/20 text-left' : 'bg-brand-orange/5 border-brand-orange/20 text-left')}>
              <div className="flex items-center justify-between mb-1 text-[9px] text-surface-muted font-bold">
                <span className={c.userRole === 'specialist' ? 'text-brand-purple' : 'text-brand-orange'}>{c.userName} ({c.userRole === 'specialist' ? 'Pro' : 'Alumno'})</span>
                <span>{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-white">{c.content}</p>
            </div>
          ))}
          {comments.length === 0 && (
            <div className="text-center py-10 text-[11px] text-surface-muted font-normal">
              {contextType === 'workout' 
                ? 'No hay comentarios ni anotaciones en el entrenamiento de hoy.' 
                : 'No hay comentarios ni anotaciones en el descanso de hoy.'}
            </div>
          )}
        </div>

        {!readOnly && (
          <div className="pt-2.5 border-t border-surface-border flex gap-2">
            <input
              type="text"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Escribe una indicación o nota para hoy..."
              className="bg-surface-card border border-surface-border rounded-lg px-2.5 py-1.5 text-[11px] text-white outline-none flex-1 focus:border-brand-purple placeholder:text-surface-muted"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handlePostComment()
              }}
            />
            <Button variant="purple" size="sm" onClick={handlePostComment} className="py-1 px-3">Comentar</Button>
          </div>
        )}
      </div>
    )
  }

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

          // Check if there is a Workout or RestDay to display indicators
          const hasWorkout = planItems.some(item => 'id_entrenamiento' in item && item.fecha_programada === dateStr)
          const hasRestDay = planItems.some(item => 'id_descanso' in item && item.fecha_programada === dateStr)

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
              
              {/* Dynamic indicators for scheduled events */}
              <div className="absolute bottom-1.5 flex gap-1 justify-center w-full">
                {hasWorkout && <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" title="Entrenamiento planificado" />}
                {hasRestDay && <span className="w-1.5 h-1.5 rounded-full bg-brand-green" title="Día de descanso" />}
              </div>
            </button>
          )
        })}
      </div>

      {/* Detail Block below dates picker */}
      {activeWorkout ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          
          {/* Left Column: Entrenamiento Parameters & Comments */}
          <div className="space-y-4">
            
            {/* Card: Entrenamiento Parameters */}
            <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-3">
              <div className="text-[12px] font-bold text-brand-orange uppercase tracking-wider mb-2">Entrenamiento: Parámetros del Día</div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Tipo de Entrenamiento"
                  value={activeWorkout.tipo}
                  onChange={(e) => {
                    activeWorkout.tipo = e.target.value
                    activeWorkout.titulo_entrenamiento = e.target.value // keep title in sync with tipo!
                    setUpdateTick(t => t + 1)
                  }}
                  disabled={readOnly}
                />
                <Input
                  label="Zona de Esfuerzo (ej: RPE 7-8)"
                  value={activeWorkout.zona_esfuerzo || ''}
                  onChange={(e) => {
                    activeWorkout.zona_esfuerzo = e.target.value
                    setUpdateTick(t => t + 1)
                  }}
                  disabled={readOnly}
                />
                <Input
                  label="Fecha Programada"
                  value={activeWorkout.fecha_programada}
                  disabled
                  containerClassName="opacity-80"
                />
                <div className="flex flex-col gap-1 w-full text-left">
                  <label className="text-[11px] font-bold text-surface-muted uppercase tracking-wider">Estado</label>
                  <select
                    value={activeWorkout.estado}
                    onChange={(e) => {
                      activeWorkout.estado = e.target.value
                      setUpdateTick(t => t + 1)
                    }}
                    className="form-input text-[12px] py-2 bg-surface-card border border-surface-border uppercase font-semibold text-white outline-none transition-colors focus:border-brand-orange"
                  disabled={readOnly}
                  >
                    {['Pendiente', 'En progreso', 'Completado'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Calorías Objetivo (kcal)"
                  type="number"
                  value={activeWorkout.macros_objetivo_kcal || 0}
                  onChange={(e) => {
                    activeWorkout.macros_objetivo_kcal = Number(e.target.value)
                    setUpdateTick(t => t + 1)
                  }}
                  containerClassName="col-span-2"
                  disabled={readOnly}
                />
                <div className="col-span-2 flex flex-col gap-1 w-full">
                  <label className="text-[11px] font-bold text-surface-muted uppercase tracking-wider">Descripción del Entrenamiento</label>
                  <textarea
                    value={activeWorkout.descripcion}
                    onChange={(e) => {
                      activeWorkout.descripcion = e.target.value
                      setUpdateTick(t => t + 1)
                    }}
                    rows={2}
                    className="bg-surface-card2 border border-surface-border rounded-lg p-2.5 text-[11px] text-white outline-none focus:border-brand-orange resize-none"
                    placeholder="Escribe la descripción general..."
                    disabled={readOnly}
                  />
                </div>
              </div>

              {!readOnly && (
                <div className="pt-2 border-t border-surface-border/30 flex justify-between gap-2">
                  <Button
                    variant="ghost"
                    onClick={handleDeleteActiveWorkoutOrRestDay}
                    className="gap-1.5 border-brand-red/20 text-brand-red hover:bg-brand-red/5 hover:border-brand-red/40"
                  >
                    <Trash2 size={13} /> Eliminar Entrenamiento
                  </Button>
                  <Button
                    variant="primary"
                    style={{ background: '#4CAF82', borderColor: '#4CAF82' }}
                    onClick={handleSaveActiveWorkout}
                    className="gap-1.5"
                  >
                    <Save size={13} /> Guardar Parámetros
                  </Button>
                </div>
              )}
            </div>

            {renderCommentsCard('workout')}

          </div>

          {/* Right Column: Ejercicios & Estructuras */}
          <div className="space-y-4">
            <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[12px] font-bold text-brand-orange uppercase tracking-wider">Ejercicios & Estructuras</div>
                {!readOnly && (
                  <button
                    type="button"
                    onClick={handleAddCustomExercise}
                    className="text-[11px] font-semibold text-brand-orange hover:text-brand-orange/80 transition-colors bg-transparent border-0 cursor-pointer"
                  >
                    + Añadir Ejercicio
                  </button>
                )}
              </div>

              <div className="space-y-2.5 max-h-[550px] overflow-y-auto pr-0.5">
                {activeWorkout.ejercicios_asociados.map((we) => (
                  <div
                    key={we.id_entrenamiento_ejercicio}
                    onClick={() => setSelectedExercise(we)}
                    className="w-full p-3.5 flex justify-between items-center bg-surface-card2 border border-surface-border rounded-xl hover:border-brand-purple transition-all text-white text-left cursor-pointer"
                  >
                    <div>
                      <div className="text-[12px] font-bold text-white">{we.ejercicio.nombre}</div>
                      <div className="text-[10px] text-surface-muted mt-0.5">
                        Orden: {we.orden} · {we.series} series x {we.repeticiones} {we.peso_objetivo > 0 ? `· ${we.peso_objetivo}kg` : ''}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-brand-purple font-semibold hover:underline">Editar Detalle →</span>
                      {!readOnly && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation() // prevent opening details modal
                            handleRemoveExercise(we.id_entrenamiento_ejercicio)
                          }}
                          className="p-1 text-brand-red hover:bg-brand-red/10 rounded-lg transition-all cursor-pointer"
                          title="Eliminar de la rutina"
                        >
                          <Trash2 size={13} />
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {activeWorkout.ejercicios_asociados.length === 0 && (
                  <div className="text-center py-6 text-surface-muted text-[11px] bg-surface-card2 rounded-xl border border-surface-border">
                    No hay ejercicios agregados a esta rutina.<br />Haz clic en "+ Añadir Ejercicio" para comenzar.
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      ) : activeRestDay ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          
          {/* Left Column: Rest Day Customization */}
          <div className="space-y-4">
            <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-3.5">
              <div className="text-[12px] font-bold text-brand-green uppercase tracking-wider mb-2">Día de Descanso: Pautas de Recuperación</div>
              <Input
                label="Mensaje motivacional / educativo"
                value={activeRestDay.mensaje}
                onChange={(e) => {
                  activeRestDay.mensaje = e.target.value
                  setUpdateTick(t => t + 1)
                }}
              />
              <Input
                label="Caminata de recuperación activa"
                value={activeRestDay.caminata}
                onChange={(e) => {
                  activeRestDay.caminata = e.target.value
                  setUpdateTick(t => t + 1)
                }}
              />
              <Input
                label="Rutina de Movilidad (ej: estiramientos)"
                value={activeRestDay.movilidad}
                onChange={(e) => {
                  activeRestDay.movilidad = e.target.value
                  setUpdateTick(t => t + 1)
                }}
              />
              <Input
                label="Objetivo de Hidratación"
                value={activeRestDay.hidratacion}
                onChange={(e) => {
                  activeRestDay.hidratacion = e.target.value
                  setUpdateTick(t => t + 1)
                }}
              />
              <Input
                label="Pautas de Sueño"
                value={activeRestDay.sueno}
                onChange={(e) => {
                  activeRestDay.sueno = e.target.value
                  setUpdateTick(t => t + 1)
                }}
              />

              <div className="pt-2.5 border-t border-surface-border/30 flex justify-between gap-2">
                {!readOnly && (
                  <Button
                    variant="ghost"
                    onClick={handleDeleteActiveWorkoutOrRestDay}
                    className="gap-1.5 border-brand-red/20 text-brand-red hover:bg-brand-red/5 hover:border-brand-red/40"
                  >
                    <Trash2 size={13} /> Eliminar Descanso
                  </Button>
                )}
                <Button
                  variant="primary"
                  style={{ background: '#4CAF82', borderColor: '#4CAF82' }}
                  onClick={handleSaveActiveRestDay}
                  className="gap-1.5"
                >
                  <Save size={13} /> Guardar Pautas de Descanso
                </Button>
              </div>
            </div>
            {renderCommentsCard('restday')}
          </div>

          {/* Right Column: Beautiful Rest/Relax placeholder */}
          <div className="card-base p-5 bg-surface-card border border-surface-border rounded-xl flex flex-col items-center justify-center text-center min-h-[300px]">
            <span className="text-4xl mb-3">🌙</span>
            <div className="text-[14px] font-bold text-brand-green uppercase tracking-wide">Recuperación Activa</div>
            <p className="text-[12px] text-surface-muted max-w-[280px] mt-1.5 leading-relaxed">
              La asimilación de cargas y la supercompensación fisiológica suceden en el descanso. Prioriza el sueño y la hidratación hoy.
            </p>
          </div>

        </div>
      ) : (
        /* Empty Day State with large actions */
        <div className="card-base p-10 bg-surface-card border border-surface-border rounded-xl text-center flex flex-col items-center justify-center min-h-[280px]">
          <span className="text-4xl mb-3">📅</span>
          <div className="text-[14px] font-bold text-white uppercase tracking-wide">Día sin planificación programada</div>
          <p className="text-[12px] text-surface-muted max-w-[340px] mt-1.5 mb-5 leading-relaxed">
            No hay entrenamientos ni pautas de recuperación para el <span className="font-bold text-white">{selectedDateStr}</span>.{!readOnly && " Selecciona una opción para programar el día:"}
          </p>
          {!readOnly && (
            <div className="flex gap-3.5 flex-wrap justify-center">
              <Button
                variant="primary"
                onClick={() => handleCreateWorkout(selectedDateStr)}
                className="gap-1.5 py-2 px-5"
              >
                ➕ Programar Entrenamiento
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleCreateRestDay(selectedDateStr)}
                className="gap-1.5 py-2 px-5 text-brand-green border-brand-green/20 hover:bg-brand-green/5"
              >
                ➕ Programar Día de Descanso
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Nested Exercise Detail Modal (Option B - isolated edits) */}
      {selectedExercise && (
        <ExerciseDetailModal
          isOpen={selectedExercise !== null}
          onClose={() => {
            setSelectedExercise(null)
            setUpdateTick(t => t + 1)
          }}
          exercise={selectedExercise}
          onSave={async (updated) => {
            if (activeWorkout) {
              activeWorkout.ejercicios_asociados = activeWorkout.ejercicios_asociados.map(we =>
                we.id_entrenamiento_ejercicio === updated.id_entrenamiento_ejercicio ? updated : we
              )
              await repos.workouts.saveWorkout(activeWorkout)
              setSelectedExercise(null)
              setUpdateTick(t => t + 1)
              toast.show('Cambios de ejercicio guardados con éxito', 'success')
            }
          }}
          readOnly={readOnly}
        />
      )}
    </div>
  )
}


// ─── Nested Meal Detail Modal (Rich Comida edit & comments) ───────
interface MealModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal: Comida;
  onSave: (updated: Comida) => void;
  readOnly?: boolean;
}

function MealDetailModal({ isOpen, onClose, meal, onSave, readOnly = false }: MealModalProps) {
  const [localMeal, setLocalMeal] = useState<Comida | null>(null)

  // Copy on open to shield parent state
  useEffect(() => {
    if (isOpen && meal) {
      setLocalMeal(JSON.parse(JSON.stringify(meal)))
    }
  }, [isOpen, meal])

  if (!localMeal) return null

  const handleUpdateLocalField = (field: keyof Comida, val: any) => {
    if (!localMeal) return
    if (field === 'etiquetas') {
      setLocalMeal({ ...localMeal, etiquetas: val.split(',').map((s: string) => s.trim()) })
    } else {
      setLocalMeal({ ...localMeal, [field]: val })
    }
  }

  const handleSaveClick = () => {
    onSave(localMeal)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Detalle de la Comida: ${localMeal.tipo}`}
      depth={1}
      className="max-w-md"
    >
      <div className="max-h-[70vh] overflow-y-auto pr-1 space-y-4">
        {/* Form inputs */}
        <div className="bg-surface-card2 rounded-xl p-3.5 border border-surface-border space-y-3">
          <div className="text-[11px] font-bold text-surface-muted uppercase tracking-wider">Parámetros de la Comida</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1 w-full col-span-2">
              <span className="text-[11px] font-bold text-surface-muted uppercase tracking-wider">Tipo de Comida</span>
              <select
                value={localMeal.tipo}
                onChange={(e) => handleUpdateLocalField('tipo', e.target.value)}
                className="form-input text-[11px] py-1 bg-surface-card border border-surface-border uppercase font-semibold"
                disabled={readOnly}
              >
                {['DESAYUNO', 'PRE-ENTRENO', 'DURANTE', 'POST-ENTRENO', 'CENA'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <Input
              label="Calorías (kcal)"
              type="number"
              value={localMeal.kcal}
              onChange={(e) => handleUpdateLocalField('kcal', Number(e.target.value))}
              disabled={readOnly}
            />
            <Input
              label="Proteína (g)"
              type="number"
              value={localMeal.proteina}
              onChange={(e) => handleUpdateLocalField('proteina', Number(e.target.value))}
              disabled={readOnly}
            />
            <Input
              label="Carbohidratos (ch)"
              type="number"
              value={localMeal.ch}
              onChange={(e) => handleUpdateLocalField('ch', Number(e.target.value))}
              disabled={readOnly}
            />
            <Input
              label="Grasas (g)"
              type="number"
              value={localMeal.grasas}
              onChange={(e) => handleUpdateLocalField('grasas', Number(e.target.value))}
              disabled={readOnly}
            />
            <Input
              label="Etiquetas (Separadas por comas)"
              value={localMeal.etiquetas.join(', ')}
              onChange={(e) => handleUpdateLocalField('etiquetas', e.target.value)}
              containerClassName="col-span-2"
              disabled={readOnly}
            />
            <div className="col-span-2 flex flex-col gap-1 w-full">
              <label className="text-[11px] font-bold text-surface-muted uppercase tracking-wider">Descripción / Menú</label>
              <textarea
                value={localMeal.descripcion}
                onChange={(e) => handleUpdateLocalField('descripcion', e.target.value)}
                rows={2}
                className="bg-surface-card border border-surface-border rounded-lg p-2 text-[11px] text-white outline-none focus:border-brand-orange"
                disabled={readOnly}
              />
            </div>
            <div className="col-span-2 flex flex-col gap-1 w-full">
              <label className="text-[11px] font-bold text-surface-muted uppercase tracking-wider">Instrucciones de Preparación</label>
              <textarea
                value={localMeal.instrucciones}
                onChange={(e) => handleUpdateLocalField('instrucciones', e.target.value)}
                rows={3}
                className="bg-surface-card border border-surface-border rounded-lg p-2 text-[11px] text-white outline-none focus:border-brand-orange"
                disabled={readOnly}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-end mt-4 pt-3 border-t border-surface-border">
        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        {!readOnly && <Button variant="primary" onClick={handleSaveClick}>Guardar Comida</Button>}
      </div>
    </Modal>
  )
}

// ─── Nutrition & Hydration Tab (Continuous Calendar + Rich Meals + Overrides) ───
export function SpecialistNutritionTab({ userId, readOnly = false }: { userId: string; readOnly?: boolean }) {
  const repos = useRepositories()
  const [weekOffset, setWeekOffset] = useState(0)
  const [selectedDateStr, setSelectedDateStr] = useState(formatDateISO(new Date()))
  
  const [log, setLog] = useState<DailyNutritionHydrationLog | null>(null)
  const [updateTick, setUpdateTick] = useState(0)

  // Local override states
  const [newVolumeMl, setNewVolumeMl] = useState(3000)
  const [justification, setJustification] = useState('')
  const [isSaving, setIsLoading] = useState(false)

  // Meal modals states (Option B - isolated edits)
  const [isMealOpen, setIsMealOpen] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState<Comida | null>(null)

  // Diet comments state
  const [dietComments, setDietComments] = useState<Comment[]>([])
  const [newDietCommentText, setNewDietCommentText] = useState('')

  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset])

  // Dynamic log fetching based on selected calendar date
  useEffect(() => {
    repos.nutrition.getLog(userId, selectedDateStr).then(setLog)
  }, [userId, selectedDateStr, updateTick])

  // Fetch diet comments for the selected day
  useEffect(() => {
    repos.comments.getComments('plan', `${userId}-${selectedDateStr}`).then(setDietComments)
  }, [userId, selectedDateStr, updateTick])

  // Post comments directly to DB for the whole day's diet
  const handlePostDietComment = async () => {
    if (!newDietCommentText.trim()) return
    const commentData = {
      parentId: null,
      userId: 'esp-1',
      userName: 'Dr. Carlos Mendoza',
      userRole: 'specialist' as const,
      content: newDietCommentText,
      contextType: 'plan' as const,
      contextId: `${userId}-${selectedDateStr}`
    }
    await repos.comments.postComment(commentData)
    setNewDietCommentText('')
    toast.show('Comentario de pauta diaria publicado', 'success')
    setUpdateTick(t => t + 1)
  }

  // Sync override inputs when active log switches
  useEffect(() => {
    if (log) {
      setNewVolumeMl(log.targetLiquidVolumeMl)
      setJustification(log.hydrationJustification || '')
    }
  }, [log])

  const handleSaveOverride = async () => {
    if (!log) return
    if (!justification.trim()) {
      toast.show('Debes ingresar una justificación profesional para sobreescribir el objetivo', 'error')
      return
    }
    setIsLoading(true)
    const updatedLog: DailyNutritionHydrationLog = {
      ...log,
      targetLiquidVolumeMl: newVolumeMl,
      hydrationJustification: justification,
      overriddenBySpecialist: true
    }
    await repos.nutrition.saveLog(updatedLog)
    setLog(updatedLog)
    setIsLoading(false)
    toast.show('Objetivo de hidratación modificado con éxito', 'success')
    setUpdateTick(t => t + 1)
  }

  // Add a new empty meal to the daily log and open the modal to edit it
  const handleAddMeal = () => {
    if (!log) return
    const newMeal: Comida = {
      id_comida: `meal-${Date.now()}`,
      tipo: 'DESAYUNO',
      descripcion: 'Nueva comida planificada',
      instrucciones: 'Escribe las instrucciones de preparación...',
      kcal: 200,
      ch: 25,
      proteina: 15,
      grasas: 5,
      etiquetas: ['Sugerido']
    }
    setSelectedMeal(newMeal)
    setIsMealOpen(true)
  }

  const handleOpenMealEdit = (meal: Comida) => {
    setSelectedMeal(JSON.parse(JSON.stringify(meal))) // Clone state isolated
    setIsMealOpen(true)
  }

  // Recalculates and saves macro totals on save
  const handleSaveMeal = async (updated: Comida) => {
    if (!log) return
    const mealsList = log.comidas || []
    const idx = mealsList.findIndex(m => m.id_comida === updated.id_comida)
    
    let updatedMeals: Comida[] = []
    if (idx !== -1) {
      updatedMeals = mealsList.map(m => m.id_comida === updated.id_comida ? updated : m)
    } else {
      updatedMeals = [...mealsList, updated]
    }

    // Dynamic actual sums calculation
    const actualKcal = updatedMeals.reduce((sum, m) => sum + m.kcal, 0)
    const actualProteins = updatedMeals.reduce((sum, m) => sum + m.proteina, 0)
    const actualCarbs = updatedMeals.reduce((sum, m) => sum + m.ch, 0)
    const actualFats = updatedMeals.reduce((sum, m) => sum + m.grasas, 0)

    const updatedLog: DailyNutritionHydrationLog = {
      ...log,
      comidas: updatedMeals,
      actualKcal,
      actualProteins,
      actualCarbs,
      actualFats
    }

    await repos.nutrition.saveLog(updatedLog)
    setLog(updatedLog)
    setIsMealOpen(false)
    setSelectedMeal(null)
    toast.show('Pauta de alimentación actualizada', 'success')
    setUpdateTick(t => t + 1)
  }

  if (!log) return <div className="text-[12px] text-surface-muted">Cargando bitácora de nutrición...</div>

  return (
    <div className="space-y-4">
      {/* Calendar date selector picker */}
      <div className="card-base flex items-center justify-between py-3">
        <div className="flex items-center gap-2">
          <Calendar size={15} className="text-brand-orange" />
          <span className="text-[12px] font-bold text-white">Calendario Nutricional</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setWeekOffset(w => w - 1)}><ChevronLeft size={13} /></Button>
          <span className="text-[11px] font-medium text-surface-muted uppercase tracking-wider">
            Semana {weekOffset === 0 ? 'Actual' : weekOffset > 0 ? `+${weekOffset}` : weekOffset}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setWeekOffset(w => w + 1)}><ChevronRight size={13} /></Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2.5">
        {weekDates.map((date) => {
          const dateStr = formatDateISO(date)
          const isSelected = dateStr === selectedDateStr
          const isToday = dateStr === formatDateISO(new Date())

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDateStr(dateStr)}
              className={cn(
                'card-base p-2 text-center flex flex-col items-center justify-center transition-all cursor-pointer border',
                isSelected ? 'border-brand-orange bg-brand-orange/10 font-bold' : isToday ? 'border-brand-orange/40 bg-brand-orange/5' : 'border-surface-border bg-surface-card2'
              )}
            >
              <div className="text-[9px] text-surface-muted uppercase">{date.toLocaleDateString('es-ES', { weekday: 'short' })}</div>
              <div className="text-[14px] font-bold text-white mt-0.5">{date.getDate()}</div>
              {isToday && <span className="inline-block mt-1 w-1 h-1 rounded-full bg-brand-orange" />}
            </button>
          )
        })}
      </div>

      {/* Main layout: left side diet builder, right side hydration overrides */}
      <div className="grid grid-cols-2 gap-4">
        {/* Diet Builder List */}
        <div className="card-base flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[13px] font-semibold flex items-center gap-1.5 text-white">
                <Coffee size={14} className="text-brand-orange" />
                <span>Pauta de Alimentación</span>
              </h3>
              {!readOnly && (
                <Button variant="primary" size="sm" onClick={handleAddMeal} className="gap-1">
                  <Plus size={12} /> Comida
                </Button>
              )}
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-0.5">
              {(log.comidas || []).map((meal) => (
                <button
                  key={meal.id_comida}
                  onClick={() => handleOpenMealEdit(meal)}
                  className="w-full p-3 flex justify-between items-start bg-surface-card border border-surface-border rounded-xl hover:border-brand-orange transition-all text-white text-left cursor-pointer"
                >
                  <div className="min-w-0 flex-1 pr-4">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Badge variant="orange">{meal.tipo}</Badge>
                      <span className="text-[12px] font-bold text-white truncate">{meal.descripcion}</span>
                    </div>
                    {/* Tags List */}
                    {meal.etiquetas && meal.etiquetas.length > 0 && (
                      <div className="flex gap-1.5 flex-wrap">
                        {meal.etiquetas.map((t, idx) => (
                          <span key={idx} className="text-[9px] bg-surface-card2 border border-surface-border text-surface-muted px-2 py-0.5 rounded-full">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[12px] font-extrabold text-brand-orange block">{meal.kcal} kcal</span>
                    <span className="text-[9px] text-surface-muted mt-1 block font-medium">P: {meal.proteina}g · C: {meal.ch}g · G: {meal.grasas}g</span>
                  </div>
                </button>
              ))}

              {(log.comidas || []).length === 0 && (
                <div className="text-center py-10 text-surface-muted text-[11px] leading-relaxed">
                  No hay comidas planificadas para este día.<br />Agrega platos o colaciones recomendadas.
                </div>
              )}
            </div>
          </div>

          {/* Macro Progress Suggested Indicators */}
          <div className="mt-5 border-t border-surface-border pt-4">
            <h3 className="text-[12px] font-bold text-white mb-3">Balance de Macronutrientes</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-surface-muted">Energía Total (kcal)</span>
                  <span className="text-white font-bold">{log.actualKcal} / {log.targetKcal} kcal</span>
                </div>
                <div className="h-2 bg-surface-border rounded-full overflow-hidden">
                  <div className="h-full bg-brand-orange rounded-full" style={{ width: `${Math.min((log.actualKcal / log.targetKcal) * 100, 100)}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-1">
                <div>
                  <div className="text-[10px] text-surface-muted mb-0.5">Proteína (g)</div>
                  <div className="text-[12px] font-extrabold text-white">{log.actualProteins} / {log.targetProteins}g</div>
                </div>
                <div>
                  <div className="text-[10px] text-surface-muted mb-0.5">Carbohidratos (g)</div>
                  <div className="text-[12px] font-extrabold text-white">{log.actualCarbs} / {log.targetCarbs}g</div>
                </div>
                <div>
                  <div className="text-[10px] text-surface-muted mb-0.5">Grasas (g)</div>
                  <div className="text-[12px] font-extrabold text-white">{log.actualFats} / {log.targetFats}g</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hydration / Dehydration Overrides Panel */}
        <div className="card-base flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-semibold">Bitácora de Hidratación & Control</h3>
              {log.overriddenBySpecialist && <Badge variant="orange">Sobreescrito por Pro</Badge>}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-surface-card2 rounded-lg p-2.5 border border-surface-border text-center">
                <div className="text-[16px] font-extrabold text-brand-blue">{log.liquidVolumeMl} ml</div>
                <div className="text-[10px] text-surface-muted">Volumen Consumido</div>
              </div>
              <div className="bg-surface-card2 rounded-lg p-2.5 border border-surface-border text-center">
                <div className="text-[16px] font-extrabold text-brand-red">+{log.calculatedDehydrationLiters || 0.0} L</div>
                <div className="text-[10px] text-surface-muted">Deshidratación Estimada</div>
              </div>
            </div>

            <div className="space-y-3.5 border-t border-surface-border pt-3.5">
              <Input
                label="Modificar Objetivo Diario (ml)"
                type="number"
                value={newVolumeMl}
                onChange={(e) => setNewVolumeMl(Number(e.target.value))}
                placeholder="e.g. 3500"
                disabled={readOnly}
              />
              <div className="flex flex-col gap-1 w-full">
                <label className="text-[11px] font-bold text-surface-muted uppercase tracking-wider">
                  Justificación del Ajuste Profesional
                </label>
                <textarea
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  rows={2}
                  placeholder="Indica el criterio clínico o deportivo..."
                  className="bg-surface-card border border-surface-border rounded-lg p-2.5 text-[11px] text-white outline-none focus:border-brand-orange placeholder:text-surface-muted resize-none"
                  disabled={readOnly}
                />
              </div>
            </div>
          </div>

          {!readOnly && (
            <Button
              variant="primary"
              isLoading={isSaving}
              onClick={handleSaveOverride}
              className="w-full mt-5 gap-1.5"
            >
              <Save size={13} /> Guardar Ajuste Hidratación
            </Button>
          )}
        </div>
      </div>

      {/* Daily Diet Discussion Comments */}
      <div className="card-base p-5 bg-surface-card border border-surface-border rounded-xl mt-4">
        <div className="text-[12px] font-bold text-surface-muted uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
          <MessageSquare size={13} className="text-brand-purple" />
          <span>Comentarios de Seguimiento Alimentario Diario · {selectedDateStr}</span>
        </div>
        
        <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-0.5 mb-4">
          {dietComments.map((c) => (
            <div key={c.id} className={cn('p-2.5 rounded-lg border text-[11px] leading-relaxed', c.userRole === 'specialist' ? 'bg-brand-purple/5 border-brand-purple/20 text-left' : 'bg-brand-orange/5 border-brand-orange/20 text-left')}>
              <div className="flex items-center justify-between mb-1 text-[9px] text-surface-muted font-bold">
                <span className={c.userRole === 'specialist' ? 'text-brand-purple' : 'text-brand-orange'}>{c.userName} ({c.userRole === 'specialist' ? 'Pro' : 'Alumno'})</span>
                <span>{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-white">{c.content}</p>
            </div>
          ))}
          {dietComments.length === 0 && (
            <div className="text-center py-6 text-[11px] text-surface-muted">No hay anotaciones ni indicaciones para la dieta de este día.</div>
          )}
        </div>

        {!readOnly && (
          <div className="pt-2.5 border-t border-surface-border flex gap-2">
            <input
              type="text"
              value={newDietCommentText}
              onChange={(e) => setNewDietCommentText(e.target.value)}
              placeholder="Deja una indicación o recomendación para la dieta completa de hoy..."
              className="bg-surface-card border border-surface-border rounded-lg px-2.5 py-1.5 text-[11px] text-white outline-none flex-1 focus:border-brand-purple placeholder:text-surface-muted"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handlePostDietComment()
              }}
            />
            <Button variant="purple" size="sm" onClick={handlePostDietComment} className="py-1 px-3">Comentar</Button>
          </div>
        )}
      </div>

      {/* Nested Meal Detail Modal (Option B - isolated edits) */}
      {selectedMeal && (
        <MealDetailModal
          isOpen={isMealOpen}
          onClose={() => { setIsMealOpen(false); setSelectedMeal(null) }}
          meal={selectedMeal}
          onSave={handleSaveMeal}
          readOnly={readOnly}
        />
      )}
    </div>
  )
}

// ─── Progress Tab (Technogym Advanced Biometrics charts) ─────────
function SpecialistProgressTab({ userId }: { userId: string }) {
  const repos = useRepositories()
  const [history, setHistory] = useState<BiometricEntry[]>()
  const [range, setRange] = useState<'30' | '90' | 'all'>('30')

  useEffect(() => {
    repos.biometrics.getByUserId(userId).then(setHistory)
  }, [userId])

  const filteredHistory = useMemo(() => {
    if (!history) return []
    const now = new Date().getTime()
    return history.filter(e => {
      if (range === '30') return now - new Date(e.date).getTime() <= 30 * 24 * 60 * 60 * 1000
      if (range === '90') return now - new Date(e.date).getTime() <= 90 * 24 * 60 * 60 * 1000
      return true
    }).sort((a, b) => a.date.localeCompare(b.date))
  }, [history, range])

  const chartPoints = useMemo(() => {
    if (filteredHistory.length === 0) return { weightPoints: '', musclePoints: '', dateLabels: [] }
    
    const P = 15 
    const W = 400 
    const H = 140 

    const dates = filteredHistory.map(e => new Date(e.date).getTime())
    const tMin = Math.min(...dates)
    const tMax = Math.max(...dates)
    const tRange = tMax - tMin || 1

    const weights = filteredHistory.map(e => e.composition?.weight || 0)
    const wMin = Math.min(...weights) - 1
    const wMax = Math.max(...weights) + 1
    const wRange = wMax - wMin || 1

    const muscles = filteredHistory.map(e => e.composition?.muscleMass || 0)
    const mMin = Math.min(...muscles) - 1
    const mMax = Math.max(...muscles) + 1
    const mRange = mMax - mMin || 1

    const weightCoord: string[] = []
    const muscleCoord: string[] = []
    const dateLabels: { x: number; text: string }[] = []

    filteredHistory.forEach((e, i) => {
      const t = new Date(e.date).getTime()
      const x = P + ((t - tMin) / tRange) * (W - 2 * P)

      const w = e.composition?.weight || 0
      const yW = (H - P) - ((w - wMin) / wRange) * (H - 2 * P)
      weightCoord.push(`${x.toFixed(1)},${yW.toFixed(1)}`)

      const m = e.composition?.muscleMass || 0
      const yM = (H - P) - ((m - mMin) / mRange) * (H - 2 * P)
      muscleCoord.push(`${x.toFixed(1)},${yM.toFixed(1)}`)

      if (i === 0 || i === filteredHistory.length - 1 || filteredHistory.length < 5) {
        dateLabels.push({ x, text: e.date.substring(5) })
      }
    })

    return {
      weightPoints: weightCoord.join(' '),
      musclePoints: muscleCoord.join(' '),
      dateLabels
    }
  }, [filteredHistory])

  if (!history) return <div className="text-[12px] text-surface-muted">Cargando registros biométricos...</div>

  const latest = filteredHistory[filteredHistory.length - 1] || history[0]

  return (
    <div className="space-y-4">
      <div className="card-base flex items-center justify-between py-3 flex-wrap gap-2">
        <div className="text-[12px] font-bold text-white">Análisis Biométrico Technogym</div>
        <div className="flex bg-surface-card border border-surface-border rounded-lg p-0.5 gap-0.5">
          {(['30', '90', 'all'] as const).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                'px-3 py-1 rounded-md text-[10px] cursor-pointer border-0 transition-all font-semibold',
                range === r ? 'bg-brand-purple text-white' : 'text-surface-muted'
              )}
            >
              {r === '30' ? 'Últimos 30 días' : r === '90' ? '90 días' : 'Historial completo'}
            </button>
          ))}
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="card-base text-center py-10 text-surface-muted text-[12px]">Sin registros biométricos en este rango de tiempo.</div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 card-base flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-bold">Tendencia: Peso & Masa Muscular</span>
                <div className="flex gap-3 text-[9px] font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 text-brand-purple"><span className="w-2 h-2 bg-brand-purple rounded-full" /> Peso</span>
                  <span className="flex items-center gap-1.5 text-brand-green"><span className="w-2 h-2 bg-brand-green rounded-full" /> Masa Muscular</span>
                </div>
              </div>

              <div className="w-full bg-surface-card2 rounded-lg p-3 border border-surface-border mt-2">
                <svg className="w-full h-[140px]" viewBox="0 0 400 140" style={{ overflow: 'visible' }}>
                  <line x1="15" y1="15" x2="385" y2="15" stroke="#383838" strokeWidth="1" strokeDasharray="2,2" />
                  <line x1="15" y1="70" x2="385" y2="70" stroke="#383838" strokeWidth="1" strokeDasharray="2,2" />
                  <line x1="15" y1="125" x2="385" y2="125" stroke="#383838" strokeWidth="1" strokeDasharray="2,2" />

                  {chartPoints.weightPoints && (
                    <polyline points={chartPoints.weightPoints} fill="none" stroke="#9B59B6" strokeWidth="2.5" />
                  )}
                  {chartPoints.musclePoints && (
                    <polyline points={chartPoints.musclePoints} fill="none" stroke="#4CAF82" strokeWidth="2" />
                  )}

                  {chartPoints.dateLabels.map((lbl, idx) => (
                    <text
                      key={idx}
                      x={lbl.x}
                      y="138"
                      className="fill-surface-muted text-[9px] font-bold"
                      textAnchor="middle"
                    >
                      {lbl.text}
                    </text>
                  ))}
                </svg>
              </div>
            </div>
            <div className="text-[10px] text-surface-muted pl-1 mt-2">Valores graficados en escala linear. Sincronizado vía Technogym SDK.</div>
          </div>

          {latest && (
            <div className="card-base">
              <div className="text-[12px] font-bold text-white mb-2.5">Detalle Clínico Technogym</div>
              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between py-1.5 border-b border-surface-border">
                  <span className="text-surface-muted">Peso Total</span>
                  <span className="text-white font-bold">{latest.composition?.weight} kg</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-surface-border">
                  <span className="text-surface-muted">% Grasa Corporal (MGC)</span>
                  <span className="text-brand-orange font-bold">{latest.composition?.bodyFatPct}%</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-surface-border">
                  <span className="text-surface-muted">Masa Muscular (MME)</span>
                  <span className="text-brand-green font-bold">{latest.composition?.muscleMass} kg</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-surface-border">
                  <span className="text-surface-muted">Agua Corporal (ACT)</span>
                  <span className="text-brand-blue font-bold">{latest.composition?.waterACT} L ({latest.composition?.waterPct}%)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-surface-border">
                  <span className="text-surface-muted">Distribución AEC / AIC</span>
                  <span className="text-white font-semibold">{latest.composition?.waterAEC} L / {latest.composition?.waterAIC} L</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-surface-border">
                  <span className="text-surface-muted">Ángulo de Fase (PhA°)</span>
                  <span className="text-brand-purple font-bold">{latest.metabolic?.phaseAngle}°</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-surface-border">
                  <span className="text-surface-muted">Wellness Age™</span>
                  <span className="text-brand-yellow font-extrabold">{latest.performance?.wellnessAge} años</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

type Tab = 'perfil' | 'plan' | 'nutricion' | 'progreso' | 'reporte-clinico' | 'notificaciones'

interface NotificationItem {
  date: string;
  title: string;
  message: string;
  category: 'Recordatorio' | 'Alerta de Salud' | 'Motivacional';
}

const NotificacionesTab = ({ userId }: { userId: string }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<'Recordatorio' | 'Alerta de Salud' | 'Motivacional'>('Recordatorio');
  const [history, setHistory] = useState<NotificationItem[]>([
    {
      date: '2023-10-26 10:00',
      title: 'Recordatorio Semanal',
      message: 'No olvides registrar tu progreso semanal y tus medidas.',
      category: 'Recordatorio',
    },
    {
      date: '2023-10-25 14:30',
      title: '¡Gran Esfuerzo!',
      message: 'Tu dedicación en los entrenamientos es inspiradora. ¡Sigue así!',
      category: 'Motivacional',
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.show('Por favor, completa todos los campos.', 'error');
      return;
    }

    const newNotification: NotificationItem = {
      date: new Date().toLocaleString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      title,
      message,
      category,
    };

    setHistory([newNotification, ...history]);
    setTitle('');
    setMessage('');
    setCategory('Recordatorio');
    toast.show('Notificación enviada con éxito', 'success');
  };

  const getBadgeVariant = (category: NotificationItem['category']) => {
    switch (category) {
      case 'Recordatorio':
        return 'orange';
      case 'Alerta de Salud':
        return 'red';
      case 'Motivacional':
        return 'purple';
      default:
        return 'blue';
    }
  };

  return (
    <div className="space-y-6">
      {/* Sección de Envío de Notificaciones */}
      <div className="card-base p-5 bg-surface-card border border-surface-border rounded-xl text-left">
        <h3 className="text-sm font-bold text-white mb-4">Enviar Nueva Notificación</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Título de la Notificación"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. Recordatorio de entrenamiento"
          />
          <div className="flex flex-col gap-1 w-full">
            <label className="text-[11px] font-bold text-surface-muted uppercase tracking-wider">Mensaje</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="bg-surface-card border border-surface-border rounded-lg p-2.5 text-[12px] text-white outline-none focus:border-brand-orange placeholder:text-surface-muted"
              placeholder="Escribe el mensaje de la notificación..."
            />
          </div>
          <div className="flex flex-col gap-1 w-full text-left">
            <label className="text-[11px] font-bold text-surface-muted uppercase tracking-wider">Categoría</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as NotificationItem['category'])}
              className="form-input text-[12px] py-2 bg-surface-card border border-surface-border uppercase font-semibold text-white outline-none focus:border-brand-orange transition-colors"
            >
              {['Recordatorio', 'Alerta de Salud', 'Motivacional'].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <Button type="submit" variant="primary" className="w-full">Enviar Notificación</Button>
        </form>
      </div>

      {/* Historial de Notificaciones Enviadas */}
      <div className="card-base p-5 bg-surface-card border border-surface-border rounded-xl text-left">
        <h3 className="text-sm font-bold text-white mb-4">Historial de Notificaciones Enviadas</h3>
        {history.length === 0 ? (
          <div className="text-center py-6 text-surface-muted text-[12px]">No se han enviado notificaciones aún.</div>
        ) : (
          <div className="space-y-4">
            {history.map((item, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-surface-card2 rounded-lg border border-surface-border">
                <Badge variant={getBadgeVariant(item.category)} className="shrink-0 mt-0.5">
                  {item.category}
                </Badge>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-white font-semibold text-[13px]">{item.title}</p>
                    <span className="text-[10px] text-surface-muted ml-auto">{item.date}</span>
                  </div>
                  <p className="text-[12px] text-surface-muted leading-relaxed">{item.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export function UserDetailPage() {
  const { selectedUser: u, setPage, userRole } = useAppStore()
  const [tab, setTab] = useState<Tab>('perfil')

  if (!u) { setPage(userRole === 'admin' ? 'usuarios' : 'mis-pacientes'); return null }

  // Normalize ID (the real backend list uses 'id' but detail expects 'id_usuario')
  if (!u.id_usuario && (u as any).id) {
    u.id_usuario = (u as any).id
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'perfil',       label: 'Perfil' },
    { id: 'progreso',     label: 'Progreso' },
    { id: 'plan',         label: 'Plan' },
    { id: 'nutricion',    label: 'Nutrición' },
    { id: 'reporte-clinico', label: 'Reporte' },
    { id: 'notificaciones',  label: 'Notificaciones' },
  ]

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => setPage(userRole === 'admin' ? 'usuarios' : 'mis-pacientes')} className="mb-4">
        <ChevronLeft size={14} /> Volver
      </Button>

      <div className="card-base flex items-start gap-4 mb-5">
        <Avatar initials={u.initials} color={u.color} size="lg" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[17px] font-bold text-white">{u.nombre}</span>
            <Badge variant="yellow">👑 {PLAN_NAMES[u.plan_idx]}</Badge>
          </div>
          <div className="text-[11px] text-surface-muted">{u.nombre_disciplina} · {u.ciudad}</div>
        </div>
      </div>

      <div className="flex gap-0.5 border-b border-surface-border mb-5 overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={cn('px-4 py-2 text-[12px] border-b-2 transition-all cursor-pointer bg-transparent border-0', tab === t.id ? 'text-brand-orange border-brand-orange font-medium' : 'text-surface-muted border-transparent hover:text-white')}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'perfil' && <PerfilTab u={u} />}
      {tab === 'plan' && <SpecialistPlanTab key={u.id_usuario} userId={u.id_usuario} />}
      {tab === 'nutricion' && <SpecialistNutritionTab userId={u.id_usuario} />}
      {tab === 'progreso' && <ProgressTab patientId={u.id_usuario} isSpecialist={true} />}
      {tab === 'reporte-clinico' && <ClinicalReportTab patientId={u.id_usuario} />}
      {tab === 'notificaciones' && <NotificacionesTab userId={u.id_usuario} />}
    </div>
  )
}
