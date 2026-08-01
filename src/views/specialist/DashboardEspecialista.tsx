import { StatCard } from '@/components/ui/StatCard'
import { useAppStore } from '@/store/useAppStore'
import { useState, useMemo } from 'react'
import { Calendar, Users, AlertCircle, MessageSquare, ClipboardList, Clock, ArrowRight } from 'lucide-react'
import { MOCK_USERS } from '@/services/mocks/users.mock'
import { MOCK_PROFESSIONALS } from '@/services/mocks/professionals.mock'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'

const agendaHoy = [
  { time: '09:00', patient: 'Juan Pérez', activity: 'Evaluación Nutricional' },
  { time: '11:30', patient: 'Ana Gómez', activity: 'Rutina Entrenamiento' },
  { time: '15:00', patient: 'Luis Martínez', activity: 'Seguimiento Hidratación' },
]

export function DashboardEspecialista() {
  const { setPage, setSelectedUser, setDetailOrigin } = useAppStore()

  // Active Coach Martínez
  const activeSpecialist = MOCK_PROFESSIONALS.find(p => p.id === 'pro-002') || MOCK_PROFESSIONALS[1]
  const assignedUsernames = useMemo(() => {
    return activeSpecialist.pacAsi.map(pa => pa.nombre.toLowerCase())
  }, [activeSpecialist.pacAsi])

  const assignedUsers = useMemo(() => {
    return MOCK_USERS.filter(u => assignedUsernames.includes(u.apodo.toLowerCase()))
  }, [assignedUsernames])

  const categories = useMemo(() => {
    return {
      Todos: assignedUsers,
      Nuevos: assignedUsers.filter(u => !u.onboarding_completo),
      Revisión: assignedUsers.filter(u => u.onboarding_completo && u.registro_activo && (u.apodo === 'falcao' || u.apodo === 'luisa_p')),
      Pendientes: assignedUsers.filter(u => u.onboarding_completo && u.registro_activo && u.apodo === 'ana_m'),
      Inactivos: assignedUsers.filter(u => !u.registro_activo),
    }
  }, [assignedUsers])

  const handleSelectPatient = (u: any) => {
    setSelectedUser(u)
    setDetailOrigin('pacientes')
    setPage('paciente-detalle')
  }

  const [activeTab, setActiveTab] = useState<'agenda' | 'pendientes' | 'nuevos'>('agenda')

  return (
    <div>
      <div className="flex items-start justify-between mb-5 gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-bold">Dashboard del Especialista</h2>
          <p className="text-[12px] text-surface-muted mt-0.5">Gestión de pacientes y agenda diaria</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <StatCard label="TODOS" value={categories.Todos.length} valueColor="#9B59B6" delta="Asignados" />
          <StatCard label="NUEVOS" value={categories.Nuevos.length} valueColor="#4A7CC7" delta="En onboarding" />
          <StatCard label="PENDIENTES" value={categories.Pendientes.length} valueColor="#F5C842" delta="Requieren acción" />
          <StatCard label="REVISIÓN" value={categories.Revisión.length} valueColor="#E24B4A" delta="En seguimiento" />
          <StatCard label="INACTIVOS" value={categories.Inactivos.length} valueColor="#7F8C8D" delta="Sin registro activo" />
          <StatCard label="CITAS HOY" value={agendaHoy.length} valueColor="#E8622A" delta="Citas hoy" />
        </div>

        <div className="lg:col-span-1 card-base p-4 bg-surface-card border border-surface-border rounded-xl flex flex-col justify-between h-full">
          <h3 className="text-sm font-semibold mb-2">Pacientes Activos por Mes</h3>
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

            {/* Stacked Bars and X-Axis Labels */}
            {/* Ene */}
            <rect x="53" y="37.8" width="14" height="152.2" rx="4" fill="#E8622A" />
            <text x="60" y="212" fill="#7E7E7E" fontSize="10" textAnchor="middle">Ene</text>
            {/* Feb */}
            <rect x="108" y="39" width="14" height="151" rx="4" fill="#E8622A" />
            <text x="115" y="212" fill="#7E7E7E" fontSize="10" textAnchor="middle">Feb</text>
            {/* Mar */}
            <rect x="163" y="37" width="14" height="153" rx="4" fill="#E8622A" />
            <text x="170" y="212" fill="#7E7E7E" fontSize="10" textAnchor="middle">Mar</text>
            {/* Abr */}
            <rect x="218" y="41.6" width="14" height="148.4" rx="4" fill="#E8622A" />
            <text x="225" y="212" fill="#7E7E7E" fontSize="10" textAnchor="middle">Abr</text>
            {/* May */}
            <rect x="273" y="42.4" width="14" height="147.6" rx="4" fill="#E8622A" />
            <text x="280" y="212" fill="#7E7E7E" fontSize="10" textAnchor="middle">May</text>
            {/* Jun */}
            <rect x="328" y="44.2" width="14" height="145.8" rx="4" fill="#E8622A" />
            <text x="335" y="212" fill="#7E7E7E" fontSize="10" textAnchor="middle">Jun</text>
            {/* Jul */}
            <rect x="383" y="43.6" width="14" height="146.4" rx="4" fill="#E8622A" />
            <text x="390" y="212" fill="#7E7E7E" fontSize="10" textAnchor="middle">Jul</text>
            {/* Ago */}
            <rect x="438" y="45.2" width="14" height="144.8" rx="4" fill="#E8622A" />
            <text x="445" y="212" fill="#7E7E7E" fontSize="10" textAnchor="middle">Ago</text>

            {/* Trendline */}
            <path d="M 60 37.8 L 115 39.0 L 170 37.0 L 225 41.6 L 280 42.4 L 335 44.2 L 390 43.6 L 445 45.2" stroke="#FFFFFF" strokeWidth="2" fill="none" />

            {/* Circular markers */}
            <circle cx="60" cy="37.8" r="4" stroke="#E8622A" strokeWidth="2" fill="#FFFFFF" />
            <circle cx="115" cy="39.0" r="4" stroke="#E8622A" strokeWidth="2" fill="#FFFFFF" />
            <circle cx="170" cy="37.0" r="4" stroke="#E8622A" strokeWidth="2" fill="#FFFFFF" />
            <circle cx="225" cy="41.6" r="4" stroke="#E8622A" strokeWidth="2" fill="#FFFFFF" />
            <circle cx="280" cy="42.4" r="4" stroke="#E8622A" strokeWidth="2" fill="#FFFFFF" />
            <circle cx="335" cy="44.2" r="4" stroke="#E8622A" strokeWidth="2" fill="#FFFFFF" />
            <circle cx="390" cy="43.6" r="4" stroke="#E8622A" strokeWidth="2" fill="#FFFFFF" />
            <circle cx="445" cy="45.2" r="4" stroke="#E8622A" strokeWidth="2" fill="#FFFFFF" />

            {/* Value Text Labels */}
            <text x="60" y="25.8" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">76.1</text>
            <text x="115" y="27.0" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">75.5</text>
            <text x="170" y="25.0" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">76.5</text>
            <text x="225" y="29.6" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">74.2</text>
            <text x="280" y="30.4" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">73.8</text>
            <text x="335" y="32.2" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">72.9</text>
            <text x="390" y="31.6" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">73.2</text>
            <text x="445" y="33.2" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">72.4</text>
          </svg>
        </div>
      </div>

      <div className="card-base p-4 bg-surface-card border border-surface-border rounded-xl">
        <div className="flex border-b border-surface-border mb-4">
          <button
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${activeTab === 'agenda' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-surface-muted'}`}
            onClick={() => setActiveTab('agenda')}
          >
            <Clock size={16} /> Agenda del Día <Badge variant="muted" className="ml-1">{agendaHoy.length}</Badge>
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${activeTab === 'pendientes' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-surface-muted'}`}
            onClick={() => setActiveTab('pendientes')}
          >
            <AlertCircle size={16} /> Pacientes pendientes de revisión <Badge variant="muted" className="ml-1">{categories.Revisión.length}</Badge>
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${activeTab === 'nuevos' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-surface-muted'}`}
            onClick={() => setActiveTab('nuevos')}
          >
            <Users size={16} /> Pacientes nuevos <Badge variant="muted" className="ml-1">{categories.Nuevos.length}</Badge>
          </button>
        </div>

        <div>
          {activeTab === 'agenda' && (
            <div>
              {agendaHoy.length > 0 ? (
                agendaHoy.map((item, i) => (
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
              {categories.Revisión.length > 0 ? (
                categories.Revisión.map(u => (
                  <div key={u.id_usuario} className="flex items-center gap-4 py-2 border-b border-surface-border last:border-0">
                    <Avatar initials={u.initials} color={u.color} size="sm" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{u.apodo}</div>
                      <div className="text-xs text-surface-muted">{u.nombre}</div>
                    </div>
                    <button
                      onClick={() => handleSelectPatient(u)}
                      className="text-brand-primary hover:underline text-sm flex items-center gap-1"
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
              {categories.Nuevos.length > 0 ? (
                categories.Nuevos.map(u => (
                  <div key={u.id_usuario} className="flex items-center gap-4 py-2 border-b border-surface-border last:border-0">
                    <Avatar initials={u.initials} color={u.color} size="sm" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{u.apodo}</div>
                      <div className="text-xs text-surface-muted">
                        Onboarding: <Badge variant={u.onboarding_completo ? 'green' : 'red'}>
                          {u.onboarding_completo ? 'Completo' : 'Pendiente'}
                        </Badge>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSelectPatient(u)}
                      className="text-brand-primary hover:underline text-sm flex items-center gap-1"
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
