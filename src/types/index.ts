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
  id_disciplina?: string
  objetivo_principal: string
  duracion_semanas_objetivo: number
  tiempo_sin_entrenar: string
  fecha_inicio_preferida: string
  proxima_competencia: string | null
  dias_entrenamiento: string[]
  alimentacion: string
  equipo: string[]
  historial_lesiones: any[]
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
  estado_cuenta?: 'activo' | 'suspendido_temporal' | 'suspendido_permanente'
  fecha_fin_suspencion?: string | null
  motivo_suspencion?: string | null
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
  apple_health?: { conectado: boolean; detalle: string }
  strava?: { conectado: boolean; detalle: string }
  garmin?: { conectado: boolean; detalle: string }
  google_fit?: { conectado: boolean; detalle: string }
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
  id_evento?: string
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
  estado?: 'Activo' | 'activo' | 'Suspendido Temporalmente' | 'Suspendido Permanentemente' | 'Pendiente'
  fecha_fin_suspension?: string | null;
  motivo_suspension?: string | null;
  docTipo?: string
  docNumero?: string
  docDelantero?: string
  docTrasero?: string
}

// ─── Plan ─────────────────────────────────────────────────────────
export interface ExerciseInstructions {
  objetivo?: string | null
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
  nombre_en?: string | null
  descripcion_en?: string | null
  multimedia_url_femenino?: string | null
  instrucciones_en?: string | null
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
  id_entrenamiento?: string
  id_ejercicio?: string
  comentario?: string | null
  series_completadas?: number
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
  comentario?: string | null
  tipo_entrenamiento?: string
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

export interface AdminProfessionalStats {
  total: number
  crecimiento_mes: string
  deportologos: number
  entrenadores: number
  pacientes_assigned: number
}

// ─── Memberships & Plans (Direct Backend Integration) ───────────────
export interface PlanPrice {
  monto: number
  monto_mensual?: number
  moneda: string
}

export interface MembershipBenefit {
  id_beneficio: string
  nombre: string
  descripcion?: string
}

export interface MembershipPlan {
  id_plan: string
  nombre: string
  descripcion: string
  activo: boolean
  dias_prueba: number
  descuento_anual: number
  precio: PlanPrice
  precios?: any[]
  orden?: number
  estado?: boolean
  caracteristicas: any[]
  usuarios_activos?: number
}

export interface MembershipStats {
  ingresos_este_mes: number
  crecimiento_porcentaje: number
  essential_activos: number
  pro_activos: number
  elite_activos: number
}

export interface LinkBenefitPayload {
  id_plan: string
  id_beneficio?: string
  nuevo_nombre?: string
  nueva_descripcion?: string
}

export interface UpdatePlanPayload {
  id_plan: string
  nombre?: string
  descripcion?: string
  activo?: boolean
  dias_prueba?: number
  descuento_anual?: number
  monto?: number
}

// ─── Transactions Backend Integration ────────────────────────────────
export interface TransactionSummary {
  ingresos_totales: number
  membresias: number
  citas_medicas: number
  total_transacciones: number
}

export interface APITransaction {
  id_transaccion: string
  fecha: string
  cliente: string
  tipo: 'membresia' | 'cita'
  detalle: string
  monto: number
  estado: 'exitosa' | 'pendiente' | 'cancelada'
}

// ─── Notifications Backend Integration ────────────────────────────────
export interface NotificationStats {
  enviadas_hoy: number
  apertura_promedio: number
  total_promedio: number
  mas_popular: number
}

export interface RecipientCounts {
  todos_los_usuarios: number
  solo_pacientes: number
  pro_elite: number
  inactivos_7_dias: number
  sin_checkin_hoy: number
  onboarding_incompleto: number
}

export interface RecentCampaign {
  id_campana: number
  titulo: string
  destinatarios_filtro: string
  estado: string
  fecha_programada: string
  tiempo_transcurrido: string
  porcentaje_apertura: number
}

export interface SendNotificationPayload {
  titulo: string
  mensaje: string
  destinatarios_filtro: string
  fecha_programada?: string | null
}

// ─── Specialist Patients ───────────────────────────────────────────────
export interface SpecialistPatient {
  id_usuario: string
  nombre_completo: string
  email: string
  disciplinas: string[]
  nivel: string
  ciudad: string
  membresia: string | null
  onboarding_completo: boolean
  estado: string
  avatar_url: string | null
  // We can also define clinical status and rendering fields that our mapper will compute
  initials?: string
  color?: string
  nombre?: string
  disciplina?: string
  registro_activo?: boolean
  estado_clinico?: string
}

export interface SpecialistPatientsResponse {
  total_asignados: number
  total_nuevos: number
  total_pendientes: number
  total_revision: number
  total_inactivos: number
  pacientes: SpecialistPatient[]
}

// --- Specialist Dashboard ---
export interface SpecialistDashboardStats {
  asignados: number
  nuevos: number
  pendientes: number
  en_seguimiento: number
  inactivos: number
  citas_hoy: number
}

export interface SpecialistActivePatientsMonth {
  mes: string
  total_pacientes: number
}

export interface SpecialistDashboardResponse {
  id_especialista: string
  nombre: string
  estadisticas: SpecialistDashboardStats
  pacientes_activos_mes: SpecialistActivePatientsMonth[]
}

// --- Specialist Dashboard Tabs ---
export interface SpecialistDashboardCita {
  id_cita: number
  hora: string
  nombre_paciente: string
  tipo_cita: string
}

export interface SpecialistDashboardRevision {
  id_usuario: string
  username: string
  nombre_completo: string
  avatar_color: string
}

export interface SpecialistDashboardNuevo {
  id_usuario: string
  username: string
  estado_onboarding: boolean
}

export interface SpecialistDashboardTabResponse {
  tab_activo: string
  total_agenda: number
  total_revisiones: number
  total_nuevos: number
  agenda: SpecialistDashboardCita[] | null
  revisiones: SpecialistDashboardRevision[] | null
  nuevos: SpecialistDashboardNuevo[] | null
}

export interface SpecialistPatientCabeceraResponse {
  nombre: string
  apodo: string
  estado: string
  edad: number
  peso: string
  altura: string
  ciudad: string
  membresia: string
  disciplina: string
  nivel_motor: string | number
  // computed frontend fields for legacy UI:
  initials?: string
  color?: string
  plan_idx?: number
  nombre_plan_activo?: string
  nombre_disciplina?: string
  registro_activo?: boolean
}
