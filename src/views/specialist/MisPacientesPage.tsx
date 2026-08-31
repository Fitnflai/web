import { useState, useMemo } from 'react'
import { Download, Plus } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { UsersTable } from '@/views/admin/UsuariosPage'
import { useAppStore } from '@/store/useAppStore'
import { useQuery } from '@tanstack/react-query'
import { specialistsService } from '@/services/endpoints/specialists'
import type { User, Patient, SpecialistPatientsResponse } from '@/types'

export function MisPacientesPage() {
  const { setPage, setSelectedUser, setDetailOrigin } = useAppStore()
  const [activeTab, setActiveTab] = useState<'Todos' | 'Nuevos' | 'Pendientes' | 'Revisión' | 'Inactivos'>('Todos')

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

  // Map activeTab to API filter
  const apiFiltro = useMemo(() => {
    switch (activeTab) {
      case 'Todos': return 'todos'
      case 'Nuevos': return 'nuevos'
      case 'Pendientes': return 'pendientes'
      case 'Revisión': return 'revision'
      case 'Inactivos': return 'inactivos'
      default: return 'todos'
    }
  }, [activeTab])

  const { data, isLoading, isError, error } = useQuery<SpecialistPatientsResponse, Error>({
    queryKey: ['specialistPatients', apiFiltro],
    queryFn: () => specialistsService.getPatients(apiFiltro),
    staleTime: 5 * 60 * 1000 // 5 minutes
  })

  const mappedPatients = useMemo(() => {
    if (!data || !data.pacientes) return []

    return data.pacientes.map(p => {
      const initials = getInitials(p.nombre_completo || 'Usuario')
      const color = getColorFromString(p.nombre_completo || 'Usuario')

      let estado_clinico: Patient['estado_clinico']
      if (activeTab === 'Pendientes') {
        estado_clinico = 'Pendiente revisión'
      } else if (activeTab === 'Revisión') {
        estado_clinico = 'En seguimiento'
      } else {
        estado_clinico = p.onboarding_completo ? 'En seguimiento' : 'Pendiente revisión'
      }

      return {
        id: p.id_usuario,
        id_usuario: p.id_usuario,
        email: p.email,
        nombre: p.nombre_completo,
        apodo: (p.nombre_completo || 'usuario').toLowerCase().replace(/\s/g, '_'),
        genero: 'Masculino',
        edad: 30,
        peso: 70,
        unidad_peso: 'kg',
        altura: 170,
        unidad_altura: 'cm',
        ciudad: p.ciudad || '',
        altitud: 0,
        nivel_actividad: 3,
        nivel_motor_actual: 3,
        clasificacion_visible_actual: 'Intermedio',
        nombre_disciplina: p.disciplinas?.join(' / ') || '',
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
        registro_activo: p.estado === 'Activo' || p.estado === 'activo',
        onboarding_completo: p.onboarding_completo,
        health_connected: false,
        strava_access_token: null,
        last_strava_sync: null,
        last_garmin_sync: null,
        foto_avatar_url: p.avatar_url || '',
        plan_idx: p.membresia === 'Elite' ? 2 : p.membresia === 'Pro' ? 1 : 0,
        color: color,
        initials: initials,
        estado_clinico: estado_clinico,
        estado: p.estado as User['estado'],
      } as Patient
    })
  }, [data, activeTab])

  const handleSelect = (u: User) => {
    setSelectedUser(u)
    setDetailOrigin('pacientes')
    setPage('paciente-detalle')
  }

  const totalAsignados = data?.total_asignados ?? 0
  const totalNuevos = data?.total_nuevos ?? 0
  const totalPendientes = data?.total_pendientes ?? 0
  const totalRevision = data?.total_revision ?? 0
  const totalInactivos = data?.total_inactivos ?? 0

  const categoriesCount = useMemo(() => {
    return {
      Todos: totalAsignados,
      Nuevos: totalNuevos,
      Pendientes: totalPendientes,
      Revisión: totalRevision,
      Inactivos: totalInactivos,
    }
  }, [totalAsignados, totalNuevos, totalPendientes, totalRevision, totalInactivos])

  return (
    <div>
      <div className="flex items-start justify-between mb-5 gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{background:'rgba(155,89,182,.15)'}}>
            <span style={{color:'#9B59B6',fontSize:15}}>🩺</span>
          </div>
          <div>
            <h2 className="text-lg font-bold">Pacientes asignados</h2>
            <p className="text-[12px] text-surface-muted mt-0.5">
              {isLoading ? '...' : totalAsignados} paciente(s) bajo tu cargo
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1.5 px-3.5 py-[7px] text-[12px] rounded-lg bg-surface-card border border-surface-border text-white font-medium"><Download size={13}/>Exportar</button>
          <button className="inline-flex items-center gap-1.5 px-3.5 py-[7px] text-[12px] rounded-lg text-white font-medium" style={{background:'#9B59B6'}}><Plus size={13}/>Nuevo paciente</button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3 mb-5">
        <StatCard label="Todos" value={isLoading ? '...' : totalAsignados.toString()} valueColor="#9B59B6" delta="Asignados" />
        <StatCard label="Nuevos" value={isLoading ? '...' : totalNuevos.toString()} valueColor="#4A7CC7" delta="En onboarding" />
        <StatCard label="Pendientes" value={isLoading ? '...' : totalPendientes.toString()} valueColor="#F5C842" delta="Requieren acción" />
        <StatCard label="Revisión" value={isLoading ? '...' : totalRevision.toString()} valueColor="#E24B4A" delta="En seguimiento" />
        <StatCard label="Inactivos" value={isLoading ? '...' : totalInactivos.toString()} valueColor="#7F8C8D" delta="Sin registro activo" />
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {(['Todos', 'Nuevos', 'Pendientes', 'Revisión', 'Inactivos'] as const).map((tab) => (
          <button
            key={tab}
            className={`px-3 py-1 rounded-full text-[11px] border ${activeTab === tab ? 'text-white' : 'bg-surface-card border-surface-border text-surface-muted'}`}
            style={(() => {
              if (activeTab === tab) {
                switch (tab) {
                  case 'Todos': return { background: '#9B59B6', borderColor: '#9B59B6' }
                  case 'Nuevos': return { background: '#4A7CC7', borderColor: '#4A7CC7' }
                  case 'Pendientes': return { background: '#F5C842', borderColor: '#F5C842' }
                  case 'Revisión': return { background: '#E24B4A', borderColor: '#E24B4A' }
                  case 'Inactivos': return { background: '#7F8C8D', borderColor: '#7F8C8D' }
                }
              }
              return undefined
            })()}
            onClick={() => setActiveTab(tab)}
          >
            {tab} ({isLoading ? '...' : categoriesCount[tab]})
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="card-base p-6 text-center animate-pulse">
          <div className="text-[13px] font-medium text-surface-muted">Cargando pacientes asignados...</div>
        </div>
      )}

      {isError && (
        <div className="p-4 rounded-xl border border-red-900/20 bg-red-950/10 text-red-400 text-center text-[11px] font-mono mb-2.5">
          Error al cargar pacientes: {(error as any)?.response?.status ? `[HTTP ${(error as any).response.status}] ` : ''}
          {(error as any)?.response?.data?.message || (error as any)?.message || 'Error de conexión'}
        </div>
      )}

      {!isLoading && !isError && (
        <UsersTable 
          users={mappedPatients} 
          origin="pacientes" 
          onSelect={handleSelect} 
          isPacientes 
          page={1} 
          total={mappedPatients.length} 
          onPageChange={() => {}} 
        />
      )}
    </div>
  )
}
