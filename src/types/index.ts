// ─── User / Patient ───────────────────────────────────────────────
export interface User {
  id_usuario: string
  email: string
  apodo: string
  nombre: string
  genero: string
  edad: number
  peso: number
  unidad_peso: string
  altura: number
  unidad_altura: string
  ciudad: string
  altitud: number
  nivel_actividad: number
  nivel_motor_actual: number
  clasificacion_visible_actual: string
  nombre_disciplina: string
  objetivo_principal: string
  duracion_semanas_objetivo: number
  tiempo_sin_entrenar: string
  fecha_inicio_preferida: string
  proxima_competencia: string | null
  dias_entrenamiento: string[]
  alimentacion: string
  equipo: string[]
  historial_lesiones: string[]
  idioma: string
  estilo_comunicacion: string
  intensidad_notificaciones: string
  dia_reporte: string
  hora_reporte: string
  notification_time: string
  created_at: string
  registro_activo: boolean
  onboarding_completo: boolean
  health_connected: boolean
  strava_access_token: string | null
  last_strava_sync: string | null
  last_garmin_sync: string | null
  foto_avatar_url: string
  plan_idx: number
  color: string
  initials: string
  estado?: 'Activo' | 'Suspendido Temporalmente' | 'Suspendido Permanentemente' | 'Inactivo'
  docTipo?: string
  docNumero?: string
  docDelantero?: string
  docTrasero?: string
  telefono?: string
  tray?: TrajectoryItem[]
  fecha_nacimiento?: string
  id_objetivo_principal?: string
  nombre_plan_activo?: string
  fecha_fin_suscripcion?: string
  estado_suscripcion?: string
  tiene_plan_activo?: boolean
}

export type ClinicalStatus = 'En seguimiento' | 'Alta médica' | 'Pendiente revisión'

export interface Patient extends User {
  estado_clinico: ClinicalStatus
}

// ─── Professional ─────────────────────────────────────────────────
export type ProfRole = 'Deportólogo' | 'Deportóloga' | 'Entrenador' | 'Entrenadora' | 'Fisioterapeuta'
export type AccessLevel = 'Sin acceso' | 'Lectura' | 'Parcial' | 'Completo'

export interface Certification {
  nombre: string
  org: string
  año: string
  venc: string
  id: string
}

export interface TrajectoryItem {
  titulo: string
  org: string
  inicio: string
  fin: string
  desc: string
}

export interface AssignedPatient {
  ini: string
  nombre: string
  disc: string
  nivel: string
  adh: string
  ultimo: string
  est: ClinicalStatus
  color: string
}

export interface Professional {
  id: string
  nombre: string
  initials: string
  color: string
  email: string
  tel: string
  ciudad: string
  rol: ProfRole
  especialidad: string
  regPro: string
  inst: string
  idiomas: string
  ingreso: string
  experiencia: number
  linkedin: string
  web: string
  wa: string
  bio: string
  areas: string[]
  pacientes: number
  accesoNivel: AccessLevel
  accesoDesc: string
  ultimoAcceso: string
  certs: Certification[]
  tray: TrajectoryItem[]
  pacAsi: AssignedPatient[]
  estado?: 'Activo' | 'Suspendido Temporalmente' | 'Suspendido Permanentemente' | 'Pendiente'
  docTipo?: string
  docNumero?: string
  docDelantero?: string
  docTrasero?: string
}

// ─── Plan ─────────────────────────────────────────────────────────
export interface ExerciseInstructions {
  posicion_inicial: string
  ejecucion: string
  consejos_tecnicos: string[]
  errores_comunes: string
}

export interface Exercise {
  id_ejercicio: string
  nombre: string
  descripcion: string
  multimedia_url: string
  tipo: string
  necesita_mapa?: boolean
  instrucciones?: ExerciseInstructions
}

export interface WorkoutExercise {
  id_entrenamiento_ejercicio: string
  series: number
  repeticiones: string
  orden: number
  descanso_segundos: number
  duracion_segundos: number
  peso_objetivo: number
  estado: string
  ejercicio: Exercise
}

export interface Workout {
  id_entrenamiento: string
  tipo: string
  fecha_programada: string
  estado: string
  descripcion: string
  titulo_entrenamiento: string
  ejercicios_asociados: WorkoutExercise[]
  zona_esfuerzo?: string
  macros_objetivo_kcal?: number
  macros_objetivo_ch?: number
  macros_objetivo_proteina?: number
  macros_objetivo_grasas?: number
}

export interface RestDay {
  id_descanso: string
  tipo: 'Descanso'
  fecha_programada: string
  mensaje: string
  caminata: string
  movilidad: string
  hidratacion: string
  sueno: string
}

export type PlanItem = Workout | RestDay

// ─── Membership ───────────────────────────────────────────────────
export interface MembershipPlan {
  id: string
  nombre: string
  precio_mensual: number
  precio_anual: number
  dias_prueba: number
  descripcion: string
  activo: boolean
  features: string[]
  usuarios: number
}

// ─── Notification ─────────────────────────────────────────────────
export interface Notification {
  id: string
  titulo: string
  mensaje: string
  destinatarios: string
  estado: 'Enviada' | 'Programada' | 'Borrador'
  apertura: number
  fecha: string
}

// ─── Dashboard ────────────────────────────────────────────────────
export interface DashboardStats {
  usuarios_totales: number
  activos_hoy: number
  pacientes: number
  pro_elite: number
  sesiones_hoy: number
  ingresos_mes: number
}

// ─── UI helpers ───────────────────────────────────────────────────
export type BadgeVariant = 'green' | 'orange' | 'blue' | 'yellow' | 'red' | 'purple' | 'muted'
export type NavPage =
  | 'landing' | 'politica-privacidad' | 'terminos-condiciones' | 'dashboard' | 'usuarios' | 'pacientes' | 'profesionales'
  | 'membresias' | 'notificaciones' | 'configuracion' | 'agenda'
  | 'usuario-detalle' | 'paciente-detalle' | 'prof-detalle'
  | 'dashboard-especialista' | 'mis-pacientes' | 'perfil-especialista'
  | 'enviar-notificaciones' | 'notificaciones-recibidas'
  | 'transacciones' | 'login'

// ─── Agenda ───────────────────────────────────────────────────────
export type AppointmentStatus = 'confirmada' | 'pendiente' | 'cancelada' | 'completada'
export type AppointmentType   = 'consulta' | 'seguimiento' | 'evaluacion' | 'emergencia'

export interface Appointment {
  id: string
  fecha: string            // ISO date "2026-06-10"
  hora_inicio: string      // "10:00"
  hora_fin: string         // "11:00"
  tipo: AppointmentType
  estado: AppointmentStatus
  motivo: string
  notas: string
  link_videollamada: string
  profesional: {
    id: string
    nombre: string
    initials: string
    color: string
    especialidad: string
  }
  paciente: {
    id: string
    nombre: string
    apodo: string
    initials: string
    color: string
    disciplina: string
  }
}

export interface AvailabilitySlot {
  dia: string              // "Lun" | "Mar" … 
  hora_inicio: string      // "09:00"
  hora_fin: string         // "10:00"
  disponible: boolean
}

export interface ProfAvailability {
  profesional_id: string
  semana: string           // "2026-W24"
  slots: AvailabilitySlot[]
}
