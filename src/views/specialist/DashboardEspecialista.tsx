import { StatCard } from '@/components/ui/StatCard'
import { useAppStore } from '@/store/useAppStore'
import { useState, useMemo } from 'react'
import { Calendar, Users, AlertCircle, MessageSquare, ClipboardList, Clock, ArrowRight } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { useQuery } from '@tanstack/react-query'
import { specialistsService } from '@/services/endpoints/specialists'
import type { Patient, SpecialistDashboardResponse, SpecialistDashboardTabResponse } from '@/types'

export function DashboardEspecialista() {
  const { setPage, setSelectedUser, setDetailOrigin } = useAppStore()
  const [activeTab, setActiveTab] = useState<'agenda' | 'pendientes' | 'nuevos'>('agenda')

  // Helper to get initials
  const getInitials = (name: string): string => {
    const parts = name.trim().split(/\s+/)
    if (parts.length === 0 || !parts[0]) return 'U'
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase()
  }

  // Helper to get a stable color from a string
  const getColorFromString = (str: string): string => {
    const colors = ['#E8622A', '#4CAF82', '#4A7CC7', '#E24B4A', '#9B59B6', '#7F8C8D']
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    const index = Math.abs(hash) % colors.length
    return colors[index]
  }

  // Dashboard Query (Métricas globales y gráfico)
  const { data: dashboardData, isLoading: isLoadingDashboard, isError: isErrorDashboard, error: errorDashboard } = useQuery<SpecialistDashboardResponse, Error>({
    queryKey: ['specialistDashboard'],
    queryFn: specialistsService.getDashboard,
    staleTime: 5 * 60 * 1000
  })

  const specialistId = dashboardData?.id_especialista

  // Map activeTab to API tab param
  const apiTab = useMemo(() => {
    if (activeTab === 'pendientes') return 'revision'
    return activeTab
  }, [activeTab])

  // Dashboard Tab Query (Agenda, Revisiones o Nuevos)
  const { data: tabData, isLoading: isLoadingTab, isError: isErrorTab, error: errorTab } = useQuery<SpecialistDashboardTabResponse, Error>({
    queryKey: ['specialistDashboardTab', specialistId, apiTab],
    queryFn: () => specialistsService.getDashboardTab(specialistId!, apiTab),
    enabled: !!specialistId,
    staleTime: 5 * 60 * 1000
  })

  // Map agenda list
  const mappedAgenda = useMemo(() => {
    const list = tabData?.agenda || []
    return list.map(item => ({
      time: item.hora,
      patient: item.nombre_paciente,
      activity: item.tipo_cita
    }))
  }, [tabData])

  // Map revisiones list to full Patient type
  const mappedRevisionPatients = useMemo(() => {
    const list = tabData?.revisiones || []
    return list.map(r => ({
      id: r.id_usuario,
      id_usuario: r.id_usuario,
      email: `${r.username}@email.com`,
      nombre: r.nombre_completo,
      apodo: r.username,
      genero: 'Masculino',
      edad: 30,
      peso: 70,
      unidad_peso: 'kg',
      altura: 170,
      unidad_altura: 'cm',
      ciudad: '',
      altitud: 0,
      nivel_actividad: 3,
      nivel_motor_actual: 3,
      clasificacion_visible_actual: 'Intermedio',
      nombre_disciplina: '',
      objetivo_principal: 'Mantener forma física',
      duracion_semanas_objetivo: 12,
      tiempo_sin_entrenar: 'Ninguno',
      fecha_inicio_preferida: '2026-06-06',
      proxima_competencia: null,
      dias_entrenamiento: ['Lun', 'Mié', 'Vie'],
      alimentacion: 'Omnívoro',
      equipo: [],
      historial_lesiones: [],
      idioma: 'es',
      estilo_comunicacion: 'Amigable',
      intensidad_notificaciones: 'Media',
      dia_reporte: 'Domingo',
      hora_reporte: '08:00',
      notification_time: '08:00',
      created_at: '2026-06-06T00:00:00Z',
      registro_activo: true,
      onboarding_completo: true,
      health_connected: false,
      strava_access_token: null,
      last_strava_sync: null,
      last_garmin_sync: null,
      foto_avatar_url: '',
      plan_idx: 0,
      color: getColorFromString(r.nombre_completo || r.username),
      initials: getInitials(r.nombre_completo || r.username),
      estado_clinico: 'En seguimiento',
      estado: 'Activo',
    } as Patient))
  }, [tabData])

  // Map nuevos list to full Patient type
  const mappedNuevosPatients = useMemo(() => {
    const list = tabData?.nuevos || []
    return list.map(n => ({
      id: n.id_usuario,
      id_usuario: n.id_usuario,
      email: `${n.username}@email.com`,
      nombre: n.username,
      apodo: n.username,
      genero: 'Masculino',
      edad: 30,
      peso: 70,
      unidad_peso: 'kg',
      altura: 170,
      unidad_altura: 'cm',
      ciudad: '',
      altitud: 0,
      nivel_actividad: 3,
      nivel_motor_actual: 3,
      clasificacion_visible_actual: 'Intermedio',
      nombre_disciplina: '',
      objetivo_principal: 'Mantener forma física',
      duracion_semanas_objetivo: 12,
      tiempo_sin_entrenar: 'Ninguno',
      fecha_inicio_preferida: '2026-06-06',
      proxima_competencia: null,
      dias_entrenamiento: ['Lun', 'Mié', 'Vie'],
      alimentacion: 'Omnívoro',
      equipo: [],
      historial_lesiones: [],
      idioma: 'es',
      estilo_comunicacion: 'Amigable',
      intensidad_notificaciones: 'Media',
      dia_reporte: 'Domingo',
      hora_reporte: '08:00',
      notification_time: '08:00',
      created_at: '2026-06-06T00:00:00Z',
      registro_activo: true,
      onboarding_completo: n.estado_onboarding,
      health_connected: false,
      strava_access_token: null,
      last_strava_sync: null,
      last_garmin_sync: null,
      foto_avatar_url: '',
      plan_idx: 0,
      color: getColorFromString(n.username),
      initials: getInitials(n.username),
      estado_clinico: 'Pendiente revisión',
      estado: 'Activo',
    } as Patient))
  }, [tabData])

  const handleSelectPatient = (u: any) => {
    setSelectedUser(u)
    setDetailOrigin('pacientes')
    setPage('paciente-detalle')
  }

  const stats = dashboardData?.estadisticas || {
    asignados: 0,
    nuevos: 0,
    pendientes: 0,
    en_seguimiento: 0,
    inactivos: 0,
    citas_hoy: 0
  }

  // Totales dinámicos del endpoint tab
  const totalAgenda = tabData?.total_agenda ?? stats.citas_hoy
  const totalRevisiones = tabData?.total_revisiones ?? stats.en_seguimiento
  const totalNuevos = tabData?.total_nuevos ?? stats.nuevos

  const renderChart = () => {
    const months = dashboardData?.pacientes_activos_mes || []
    if (months.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center text-xs text-surface-muted h-[180px]">
          No hay datos mensuales disponibles.
        </div>
      )
    }

    const step = 55
    const barWidth = 14
    const startX = 53
    
    // Construct points for trendline and bars
    const points = months.map((m, i) => {
      const x = startX + i * step + 7
      const v = m.total_pacientes
      // Max expected scale on chart is 80 users, representing 160 pixels. Zero is at Y=190.
      const y = 190 - (v * 2)
      return { x, y, value: v, mes: m.mes }
    })

    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

    return (
      <svg viewBox="0 0 500 240" className="w-full h-auto mt-2">
        {/* Grid lines */}
        <line x1="45" y1="30" x2="475" y2="30" stroke="#2a2a2a" strokeDasharray="3 3" />
        <line x1="45" y1="70" x2="475" y2="70" stroke="#2a2a2a" strokeDasharray="3 3" />
        <line x1="45" y1="110" x2="475" y2="110" stroke="#2a2a2a" strokeDasharray="3 3" />
        <line x1="45" y1="150" x2="475" y2="150" stroke="#2a2a2a" strokeDasharray="3 3" />
        <line x1="45" y1="190" x2="475" y2="190" stroke="#2a2a2a" strokeDasharray="3 3" />

        {/* Y-Axis labels */}
        <text x="35" y="34" textAnchor="end" fill="#7E7E7E" fontSize="10">80</text>
        <text x="35" y="74" textAnchor="end" fill="#7E7E7E" fontSize="10">60</text>
        <text x="35" y="114" textAnchor="end" fill="#7E7E7E" fontSize="10">40</text>
        <text x="35" y="154" textAnchor="end" fill="#7E7E7E" fontSize="10">20</text>
        <text x="35" y="194" textAnchor="end" fill="#7E7E7E" fontSize="10">0</text>
        <text x="35" y="18" textAnchor="end" fill="#7E7E7E" fontSize="10">usuarios</text>

        {/* Bars */}
        {points.map((p, i) => {
          const rx = startX + i * step
          const height = p.value * 2
          const ry = 190 - height
          return (
            <g key={i}>
              <rect x={rx} y={ry} width={barWidth} height={height} rx="4" fill="#E8622A" />
              <text x={p.x} y="212" fill="#7E7E7E" fontSize="10" textAnchor="middle">{p.mes}</text>
            </g>
          )
        })}

        {/* Trendline */}
        <path d={pathD} stroke="#FFFFFF" strokeWidth="2" fill="none" />

        {/* Circular markers and values */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" stroke="#E8622A" strokeWidth="2" fill="#FFFFFF" />
            <text x={p.x} y={p.y - 12} fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">{p.value}</text>
          </g>
        ))}
      </svg>
    )
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-5 gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-bold">Dashboard del Especialista</h2>
          <p className="text-[12px] text-surface-muted mt-0.5">Gestión de pacientes y agenda diaria</p>
        </div>
      </div>

      {(isErrorDashboard || isErrorTab) && (
        <div className="p-4 rounded-xl border border-red-900/20 bg-red-950/10 text-red-400 text-center text-[11px] font-mono mb-5">
          Error al cargar dashboard: {
            (errorDashboard || errorTab as any)?.response?.status 
              ? `[HTTP ${(errorDashboard || errorTab as any).response.status}] ` 
              : ''
          }
          {(errorDashboard || errorTab as any)?.response?.data?.message || (errorDashboard || errorTab as any)?.message || 'Error de conexión'}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <StatCard label="TODOS" value={isLoadingDashboard ? '...' : stats.asignados.toString()} valueColor="#9B59B6" delta="Asignados" />
          <StatCard label="NUEVOS" value={isLoadingDashboard ? '...' : stats.nuevos.toString()} valueColor="#4A7CC7" delta="En onboarding" />
          <StatCard label="PENDIENTES" value={isLoadingDashboard ? '...' : stats.pendientes.toString()} valueColor="#F5C842" delta="Requieren acción" />
          <StatCard label="REVISIÓN" value={isLoadingDashboard ? '...' : stats.en_seguimiento.toString()} valueColor="#E24B4A" delta="En seguimiento" />
          <StatCard label="INACTIVOS" value={isLoadingDashboard ? '...' : stats.inactivos.toString()} valueColor="#7F8C8D" delta="Sin registro activo" />
          <StatCard label="CITAS HOY" value={isLoadingDashboard ? '...' : stats.citas_hoy.toString()} valueColor="#E8622A" delta="Citas hoy" />
        </div>

        <div className="lg:col-span-1 card-base p-4 bg-surface-card border border-surface-border rounded-xl flex flex-col justify-between h-full min-h-[250px]">
          <h3 className="text-sm font-semibold mb-2">Pacientes Activos por Mes</h3>
          {isLoadingDashboard ? (
            <div className="flex-1 flex items-center justify-center text-xs text-surface-muted animate-pulse h-[180px]">
              Cargando gráfico...
            </div>
          ) : (
            renderChart()
          )}
        </div>
      </div>

      <div className="card-base p-4 bg-surface-card border border-surface-border rounded-xl">
        <div className="flex border-b border-surface-border mb-4 overflow-x-auto">
          <button
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all cursor-pointer bg-transparent border-0 ${activeTab === 'agenda' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-surface-muted border-b-2 border-transparent'}`}
            onClick={() => setActiveTab('agenda')}
          >
            <Clock size={16} /> Agenda del Día <Badge variant="muted" className="ml-1">{isLoadingDashboard ? '...' : totalAgenda}</Badge>
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all cursor-pointer bg-transparent border-0 ${activeTab === 'pendientes' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-surface-muted border-b-2 border-transparent'}`}
            onClick={() => setActiveTab('pendientes')}
          >
            <AlertCircle size={16} /> Pacientes pendientes de revisión <Badge variant="muted" className="ml-1">{isLoadingDashboard ? '...' : totalRevisiones}</Badge>
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all cursor-pointer bg-transparent border-0 ${activeTab === 'nuevos' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-surface-muted border-b-2 border-transparent'}`}
            onClick={() => setActiveTab('nuevos')}
          >
            <Users size={16} /> Pacientes nuevos <Badge variant="muted" className="ml-1">{isLoadingDashboard ? '...' : totalNuevos}</Badge>
          </button>
        </div>

        <div>
          {activeTab === 'agenda' && (
            <div>
              {isLoadingTab ? (
                <p className="text-sm text-surface-muted animate-pulse">Cargando agenda...</p>
              ) : mappedAgenda.length > 0 ? (
                mappedAgenda.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 py-2 border-b border-surface-border last:border-0">
                    <span className="text-[12px] font-mono text-brand-orange w-12">{item.time}</span>
                    <div className="flex-1">
                      <div className="text-[12px] font-medium">{item.patient}</div>
                      <div className="text-[11px] text-surface-muted">{item.activity}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-surface-muted">No hay citas programadas para hoy.</p>
              )}
            </div>
          )}

          {activeTab === 'pendientes' && (
            <div>
              {isLoadingTab ? (
                <p className="text-sm text-surface-muted animate-pulse">Cargando pacientes pendientes...</p>
              ) : mappedRevisionPatients.length > 0 ? (
                mappedRevisionPatients.map(u => (
                  <div key={u.id_usuario} className="flex items-center gap-4 py-2 border-b border-surface-border last:border-0">
                    <Avatar initials={u.initials} color={u.color} size="sm" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{u.nombre}</div>
                      <div className="text-xs text-surface-muted">{u.email}</div>
                    </div>
                    <button
                      onClick={() => handleSelectPatient(u)}
                      className="text-brand-primary hover:underline text-sm flex items-center gap-1 bg-transparent border-0 cursor-pointer"
                    >
                      Ver Detalles <ArrowRight size={14} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-surface-muted">No hay pacientes pendientes de revisión.</p>
              )}
            </div>
          )}

          {activeTab === 'nuevos' && (
            <div>
              {isLoadingTab ? (
                <p className="text-sm text-surface-muted animate-pulse">Cargando pacientes nuevos...</p>
              ) : mappedNuevosPatients.length > 0 ? (
                mappedNuevosPatients.map(u => (
                  <div key={u.id_usuario} className="flex items-center gap-4 py-2 border-b border-surface-border last:border-0">
                    <Avatar initials={u.initials} color={u.color} size="sm" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{u.nombre}</div>
                      <div className="text-xs text-surface-muted">
                        Onboarding: <Badge variant={u.onboarding_completo ? 'green' : 'red'}>
                          {u.onboarding_completo ? 'Completo' : 'Pendiente'}
                        </Badge>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSelectPatient(u)}
                      className="text-brand-primary hover:underline text-sm flex items-center gap-1 bg-transparent border-0 cursor-pointer"
                    >
                      Ver Detalles <ArrowRight size={14} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-surface-muted">No hay pacientes nuevos registrados.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
