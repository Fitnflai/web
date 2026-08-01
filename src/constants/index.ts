export const PLAN_NAMES = ['Essential', 'Pro', 'Elite', 'Essential'] as const
export const PLAN_MONTOS = ['$9.99/mes', '$19.99/mes', '$29.99/mes', '$0 · Cancelado'] as const
export const DAYS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'] as const
export const MONTHS_ES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'] as const

export const TODAY = '2026-06-06'

export const ACCESS_LEVELS = {
  'Sin acceso': { label: 'Sin acceso', color: 'muted' },
  'Lectura':    { label: 'Lectura',    color: 'orange' },
  'Parcial':    { label: 'Parcial',    color: 'blue' },
  'Completo':   { label: 'Completo',  color: 'blue' },
} as const

export const NAV_TITLES: Record<string, string> = {
  dashboard:       'Dashboard',
  usuarios:        'Usuarios',
  pacientes:       'Pacientes',
  profesionales:   'Profesionales',
  membresias:      'Membresías',
  notificaciones:  'Notificaciones',
  configuracion:   'Configuración',
}
