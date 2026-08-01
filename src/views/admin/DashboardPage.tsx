import { TrendingUp, Award, Users, AlertCircle, MessageSquare, Crown, Check, X, CalendarDays, Search, DollarSign } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { useAppStore } from '@/store/useAppStore'
import { MOCK_USERS } from '@/services/mocks/users.mock'
import { MOCK_PROFESSIONALS } from '@/services/mocks/professionals.mock'
import { MOCK_APPOINTMENTS } from '@/services/mocks/agenda.mock'
import { toast } from '@/components/ui/Toast'
import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/services/endpoints/dashboard'
import { formatCurrencyShorthand } from '@/utils'

type DashboardTab = 'especialistas-pendientes' | 'usuarios-nuevos' | 'citas-hoy' | 'transacciones-hoy';

const mockCurrentDate = '2026-06-10';

interface DashboardTransaction {
  id: string;
  date: string;
  client: string;
  type: 'membresia' | 'cita';
  detail: string;
  amount: number;
  status: 'exitosa' | 'pendiente' | 'cancelada';
}

const resolveListDataArray = (data: any, tab: string): any[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data.data && Array.isArray(data.data)) return data.data;
  if (data[tab] && Array.isArray(data[tab])) return data[tab];
  if (data.items && Array.isArray(data.items)) return data.items;
  if (data.result && Array.isArray(data.result)) return data.result;
  
  // Deep search: find the first key inside the object that holds an array
  const firstArrayKey = Object.keys(data).find(key => Array.isArray(data[key]));
  if (firstArrayKey) return data[firstArrayKey];
  
  return [];
};

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('especialistas-pendientes');
  const { setPage, setSelectedProfessional, setSelectedUser } = useAppStore();

  const { data: stats, isLoading, isError, refetch } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: dashboardService.getStats,
  });

  const totalUsersCount = stats?.usuarios_totales ?? 0;
  const activeUsersCount = stats?.usuarios_activos ?? 0;
  const newUsersCount = stats?.usuarios_nuevos ?? 0;
  const activeSpecialistsCount = stats?.especialistas_activos ?? 0;
  const pendingApprovalsCount = stats?.especialistas_pendientes ?? 0;
  const currentMonthIncome = stats?.ingresos_este_mes ?? 0;

  // Resolve the string query parameter for GET /admin/dashboard/list?tab=...
  const tabQueryParam = useMemo(() => {
    switch (activeTab) {
      case 'especialistas-pendientes': return 'especialistas_pendientes';
      case 'usuarios-nuevos':          return 'usuarios_nuevos';
      case 'citas-hoy':                return 'citas_hoy';
      case 'transacciones-hoy':        return 'transacciones_hoy';
      default:                         return 'especialistas_pendientes';
    }
  }, [activeTab]);

  // Query live list data for the selected tab using React Query
  const { data: listData, isLoading: isListLoading, isError: isListError, error: listError, refetch: refetchList } = useQuery({
    queryKey: ['adminDashboardList', tabQueryParam],
    queryFn: () => dashboardService.getListData(tabQueryParam),
    enabled: !!tabQueryParam,
  });

  const resolvedArray = useMemo(() => {
    return resolveListDataArray(listData, tabQueryParam);
  }, [listData, tabQueryParam]);

  // Assign live tab data or default to empty arrays to prevent crashes when empty
  const pendingSpecialists = useMemo(() => {
    return activeTab === 'especialistas-pendientes' ? resolvedArray : [];
  }, [resolvedArray, activeTab]);

  const newUsers = useMemo(() => {
    return activeTab === 'usuarios-nuevos' ? resolvedArray : [];
  }, [resolvedArray, activeTab]);

  const appointmentsToday = useMemo(() => {
    return activeTab === 'citas-hoy' ? resolvedArray : [];
  }, [resolvedArray, activeTab]);

  const transactionsToday = useMemo(() => {
    return activeTab === 'transacciones-hoy' ? resolvedArray : [];
  }, [resolvedArray, activeTab]);

  const ingresosMensuales = useMemo(() => {
    if (stats?.ingresos_mensuales && stats.ingresos_mensuales.length > 0) {
      return stats.ingresos_mensuales;
    }
    return [
      { mes: 'Ene', total: 0 },
      { mes: 'Feb', total: 0 },
      { mes: 'Mar', total: 0 },
      { mes: 'Abr', total: 0 },
      { mes: 'May', total: 0 },
      { mes: 'Jun', total: 0 },
    ];
  }, [stats?.ingresos_mensuales]);

  const maxVal = useMemo(() => {
    const maxData = Math.max(...ingresosMensuales.map(m => m.total), 0);
    return maxData > 0 ? maxData : 20000;
  }, [ingresosMensuales]);

  const getY = (total: number) => 135 - (total / maxVal) * 120;
  const getX = (index: number) => 60 + index * 80;

  const pathD = useMemo(() => {
    return ingresosMensuales.map((item, index) => `${index === 0 ? 'M' : 'L'} ${getX(index)} ${getY(item.total)}`).join(' ');
  }, [ingresosMensuales]);

  const handleRefreshAll = () => {
    refetch();
    refetchList();
    toast.show('Datos actualizados');
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-5 gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-bold">Dashboard</h2>
          <p className="text-[12px] text-surface-muted mt-0.5">Resumen general · Junio 2026</p>
        </div>
        <div className="flex gap-2 items-center">
          {(isLoading || isListLoading) && (
            <span className="text-[11px] text-brand-orange animate-pulse bg-brand-orange/5 px-2.5 py-1 rounded-full font-bold border border-brand-orange/10 mr-1">
              Sincronizando...
            </span>
          )}
          <Button variant="ghost">Exportar</Button>
          <Button variant="primary" onClick={handleRefreshAll}>Actualizar</Button>
        </div>
      </div>

      {/* Main Stats and Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        {/* Left section: 6 Metric Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          <StatCard label="Usuarios totales" value={totalUsersCount.toLocaleString()} delta="↑ +12% este mes" deltaUp />
          <StatCard label="Ingresos este mes" value={formatCurrencyShorthand(currentMonthIncome)} valueColor="#E8622A" delta="↑ +5%" deltaUp />
          <StatCard label="Especialistas activos" value={activeSpecialistsCount.toLocaleString()} valueColor="#9B59B6" />
          <StatCard label="Especialistas pendientes" value={pendingApprovalsCount.toLocaleString()} valueColor="#E8622A" delta={`${pendingApprovalsCount} por revisar`} />
          <StatCard label="Usuarios activos" value={activeUsersCount.toLocaleString()} valueColor="#4CAF82" />
          <StatCard label="Usuarios nuevos" value={newUsersCount.toLocaleString()} delta="↑ +5 este mes" deltaUp />
        </div>

        {/* Right section: Monthly Income Chart */}
        <div className="lg:col-span-1 card-base flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-semibold">Ingresos mensuales</span>
            <span className="text-[10px] bg-brand-orange/10 text-brand-orange px-2 py-0.5 rounded-full font-bold">Junio 2026</span>
          </div>
          <div className="flex-1 flex items-center justify-center py-2">
            <svg viewBox="0 0 500 160" className="w-full h-auto">
              {/* Y-Axis Grid Lines */}
              <line x1="60" y1="135" x2="480" y2="135" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
              <line x1="60" y1="105" x2="480" y2="105" stroke="rgba(255,255,255,0.07)" strokeDasharray="3,3" />
              <line x1="60" y1="75" x2="480" y2="75" stroke="rgba(255,255,255,0.07)" strokeDasharray="3,3" />
              <line x1="60" y1="45" x2="480" y2="45" stroke="rgba(255,255,255,0.07)" strokeDasharray="3,3" />
              <line x1="60" y1="15" x2="480" y2="15" stroke="rgba(255,255,255,0.07)" strokeDasharray="3,3" />

              {/* Y-Axis Labels */}
              <text x="40" y="138" textAnchor="end" fill="#71717A" className="text-[8px] font-medium">$0</text>
              <text x="40" y="108" textAnchor="end" fill="#71717A" className="text-[8px] font-medium">{formatCurrencyShorthand(maxVal * 0.25)}</text>
              <text x="40" y="78" textAnchor="end" fill="#71717A" className="text-[8px] font-medium">{formatCurrencyShorthand(maxVal * 0.5)}</text>
              <text x="40" y="48" textAnchor="end" fill="#71717A" className="text-[8px] font-medium">{formatCurrencyShorthand(maxVal * 0.75)}</text>
              <text x="40" y="18" textAnchor="end" fill="#71717A" className="text-[8px] font-medium">{formatCurrencyShorthand(maxVal)}</text>

              {ingresosMensuales.map((item, index) => (
                <g key={item.mes}>
                  {/* Bar Rects */}
                  <rect
                    x={getX(index) - 12}
                    y={getY(item.total)}
                    width={24}
                    height={Math.max(135 - getY(item.total), 0)}
                    rx={4}
                    fill="rgba(232, 98, 42, 0.15)"
                  />
                  {/* White Caps */}
                  <rect x={getX(index) - 12} y={getY(item.total)} width={24} height={3} rx={1.5} fill="#FFFFFF" />
                  {/* Dots */}
                  <circle cx={getX(index)} cy={getY(item.total)} r={3.5} fill="#FFFFFF" stroke="#E8622A" strokeWidth={1.5} />
                  {/* Value labels */}
                  <text x={getX(index)} y={getY(item.total) - 8} textAnchor="middle" fill={index === ingresosMensuales.length - 1 ? "#E8622A" : "#FFFFFF"} className="text-[8px] font-bold select-none">{formatCurrencyShorthand(item.total)}</text>
                  {/* X-axis labels */}
                  <text x={getX(index)} y={152} textAnchor="middle" fill={index === ingresosMensuales.length - 1 ? "#E8622A" : "#71717A"} className={`text-[10px] select-none ${index === ingresosMensuales.length - 1 ? "font-bold" : "font-medium"}`}>{item.mes}</text>
                </g>
              ))}

              {/* Line Path */}
              <path d={pathD} fill="none" stroke="#FFFFFF" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Tabs with Tables */}
      <div className="card-base p-0 overflow-hidden mb-5 bg-surface-panel">
        <div className="flex border-b border-surface-border overflow-x-auto">
          <button
            className={`py-3 px-5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'especialistas-pendientes'
                ? 'text-brand-orange border-brand-orange bg-brand-orange/5'
                : 'text-surface-muted hover:text-brand-orange border-transparent'
            }`}
            onClick={() => setActiveTab('especialistas-pendientes')}
          >
            Especialistas pendientes
          </button>
          <button
            className={`py-3 px-5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'usuarios-nuevos'
                ? 'text-brand-orange border-brand-orange bg-brand-orange/5'
                : 'text-surface-muted hover:text-brand-orange border-transparent'
            }`}
            onClick={() => setActiveTab('usuarios-nuevos')}
          >
            Usuarios nuevos
          </button>
          <button
            className={`py-3 px-5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'citas-hoy'
                ? 'text-brand-orange border-b-2 border-brand-orange bg-brand-orange/5'
                : 'text-surface-muted hover:text-brand-orange border-transparent'
            }`}
            onClick={() => setActiveTab('citas-hoy')}
          >
            Citas de hoy
          </button>
          <button
            className={`py-3 px-5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'transacciones-hoy'
                ? 'text-brand-orange border-b-2 border-brand-orange bg-brand-orange/5'
                : 'text-surface-muted hover:text-brand-orange border-transparent'
            }`}
            onClick={() => setActiveTab('transacciones-hoy')}
          >
            Transacciones de hoy
          </button>
        </div>

        <div className="p-4">
          {/* Non-intrusive Diagnostic Error Banner */}
          {isListError && (
            <div className="mb-4 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold flex flex-col gap-1.5 leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold text-red-300">
                <AlertCircle size={14} /> <span>Diagnóstico de API (/admin/dashboard/list):</span>
              </div>
              <div>
                <strong>Código / Mensaje:</strong> {listError?.message || 'Error desconocido'}
              </div>
              {(listError as any)?.response?.data && (
                <div className="bg-black/20 p-2 rounded-lg font-mono text-[10px] break-all">
                  <strong>Respuesta del servidor:</strong> {JSON.stringify((listError as any).response.data)}
                </div>
              )}
            </div>
          )}

          {/* Especialistas Pendientes Tab */}
          {activeTab === 'especialistas-pendientes' && (
            <div className="overflow-x-auto">
              {isListLoading ? (
                <div className="p-5 text-center text-brand-orange animate-pulse font-medium text-xs">Cargando especialistas...</div>
              ) : (
                <table className="w-full border-collapse text-[12px]">
                  <thead>
                    <tr>
                      {['Profesional', 'Rol', 'Especialidad', 'Pacientes', 'Certs', 'Acceso', 'Estado', ''].map(h => (
                        <th key={h} className="text-left p-2.5 text-[10px] text-surface-muted uppercase tracking-[0.7px] border-b border-surface-border font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pendingSpecialists.length > 0 ? (
                      pendingSpecialists.map((p) => (
                        <tr key={p.id_usuario || p.id} className="hover:bg-white/[0.015]">
                          <td className="p-2.5 border-b border-surface-border">
                            <div className="flex items-center gap-2">
                              <Avatar initials={p.initials || (p.nombre ? p.nombre.slice(0, 2).toUpperCase() : 'PE')} color={p.color || 'blue'} size="sm" />
                              <div>
                                <div className="font-medium text-white">{p.nombre || p.apodo || 'Sin nombre'}</div>
                                <div className="text-[10px] text-surface-muted">{p.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-2.5 border-b border-surface-border">
                            <Badge variant={(p.rol || p.nombre_rol || '').includes('Deport') ? 'purple' : 'green'}>
                              {(p.rol || p.nombre_rol || '').includes('Deport') ? '🩺' : '🏃'} {p.rol || p.nombre_rol || 'Especialista'}
                            </Badge>
                          </td>
                          <td className="p-2.5 border-b border-surface-border text-[11px] text-surface-muted">{p.especialidad || p.nombre_disciplina || 'General'}</td>
                          <td className="p-2.5 border-b border-surface-border font-semibold text-brand-orange">{p.pacientes ?? 0}</td>
                          <td className="p-2.5 border-b border-surface-border"><Badge variant="green">{(p.certs?.length || p.certificados?.length || 0)} certs</Badge></td>
                          <td className="p-2.5 border-b border-surface-border"><Badge variant="red">{p.accesoNivel || p.nivel_acceso || 'Sin acceso'}</Badge></td>
                          <td className="p-2.5 border-b border-surface-border"><Badge variant="orange">Pendiente</Badge></td>
                          <td className="p-2.5 border-b border-surface-border text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-brand-orange hover:bg-brand-orange/15 border border-brand-orange/20"
                              onClick={() => {
                                setSelectedProfessional(p);
                                setPage('prof-detalle');
                              }}
                            >
                              Revisar →
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="p-5 text-center text-surface-muted">No hay especialistas pendientes de aprobación.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Usuarios Nuevos Tab */}
          {activeTab === 'usuarios-nuevos' && (
            <div className="overflow-x-auto">
              {isListLoading ? (
                <div className="p-5 text-center text-brand-orange animate-pulse font-medium text-xs">Cargando usuarios...</div>
              ) : (
                <table className="w-full border-collapse text-[12px]">
                  <thead>
                    <tr>
                      {['Usuario / Email', 'Disciplina', 'Nivel', 'Ciudad', 'Membresía', 'Onboarding', 'Estado Clínico', 'Estado', ''].map(h => (
                        <th key={h} className="text-left p-2.5 text-[10px] text-surface-muted uppercase tracking-[0.7px] border-b border-surface-border font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {newUsers.length > 0 ? (
                      newUsers.map((u, idx) => {
                        // Strict and explicit status calculation
                        const isActive = u.registro_activo !== undefined ? u.registro_activo : (u.estado === true);
                        
                        return (
                          <tr key={u.id_usuario || u.id} className="hover:bg-white/[0.015]">
                            <td className="p-2.5 border-b border-surface-border">
                              <div className="flex items-center gap-2">
                                <Avatar initials={u.initials || (u.apodo || u.nombre ? (u.apodo || u.nombre).slice(0, 2).toUpperCase() : 'US')} color={u.color || 'blue'} size="sm" />
                                <div>
                                  <div className="font-medium text-white">{u.apodo || u.nombre || ''}</div>
                                  <div className="text-[10px] text-surface-muted">{u.email}</div>
                                </div>
                              </div>
                            </td>
                            
                            <td className="p-2.5 border-b border-surface-border text-[11px] text-white">
                              {u.nombre_disciplina || u.disciplina || ''}
                            </td>
                            
                            <td className="p-2.5 border-b border-surface-border">
                              {(u.nivel_actividad !== undefined && u.nivel_actividad !== null) || (u.nivel !== undefined && u.nivel !== null) ? (
                                <Badge variant={(u.nivel_actividad ?? u.nivel ?? 0) >= 4 ? 'blue' : (u.nivel_actividad ?? u.nivel ?? 0) >= 2 ? 'orange' : 'muted'}>
                                  {u.clasificacion_visible_actual || `Nivel ${u.nivel_actividad ?? u.nivel}`}
                                </Badge>
                              ) : ''}
                            </td>
                            
                            <td className="p-2.5 border-b border-surface-border text-[11px] text-surface-muted">
                              {u.ciudad || ''}
                            </td>
                            
                            <td className="p-2.5 border-b border-surface-border">
                              {u.nombre_plan_activo || u.membresia ? (
                                <Badge variant={(u.nombre_plan_activo || u.membresia) === 'Pro' || (u.nombre_plan_activo || u.membresia) === 'Elite' ? 'yellow' : 'muted'}>
                                  {(u.nombre_plan_activo || u.membresia) === 'Pro' || (u.nombre_plan_activo || u.membresia) === 'Elite' ? (
                                    <><Crown size={9} className="mr-0.5 inline-block" /> {u.nombre_plan_activo || u.membresia}</>
                                  ) : (
                                    u.nombre_plan_activo || u.membresia
                                  )}
                                </Badge>
                              ) : ''}
                            </td>
                            
                            <td className="p-2.5 border-b border-surface-border">
                              {u.onboarding_completo || u.onboarding ? (
                                <Badge variant="green"><Check size={9} className="mr-0.5 inline-block" />Completo</Badge>
                              ) : (
                                <Badge variant="red"><X size={9} className="mr-0.5 inline-block" />Pendiente</Badge>
                              )}
                            </td>
                            
                            <td className="p-2.5 border-b border-surface-border">
                              {u.estado_clinico ? (
                                <Badge variant={(u.estado_clinico || '').includes('Alta') ? 'green' : (u.estado_clinico || '').includes('Pendiente') ? 'red' : 'purple'}>
                                  {u.estado_clinico}
                                </Badge>
                              ) : ''}
                            </td>
                            
                            <td className="p-2.5 border-b border-surface-border">
                              <Badge variant={isActive ? 'green' : 'orange'}>
                                {isActive ? 'Activo' : 'Inactivo'}
                              </Badge>
                            </td>
                            
                            <td className="p-2.5 border-b border-surface-border text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-brand-orange hover:bg-brand-orange/15 border border-brand-orange/20"
                                onClick={() => {
                                  setSelectedUser(u);
                                  setPage('usuario-detalle');
                                }}
                              >
                                Ver →
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={9} className="p-5 text-center text-surface-muted">No hay usuarios nuevos registrados en los últimos 30 días.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Citas de Hoy Tab */}
          {activeTab === 'citas-hoy' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isListLoading ? (
                <div className="col-span-full text-center text-brand-orange animate-pulse font-medium text-xs p-5">Cargando citas...</div>
              ) : (
                <>
                  {appointmentsToday.length > 0 ? (
                    appointmentsToday.map((apt) => {
                      const appointmentTime = apt.fecha ? apt.fecha.split('T')[1]?.slice(0, 5) : '';
                      return (
                        <div key={apt.id_cita || apt.id} className="card-base p-4 flex items-start justify-between bg-surface-card2 hover:bg-white/[0.01] transition-colors border border-surface-border rounded-xl">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-brand-orange/10 text-brand-orange mt-0.5 flex-shrink-0">
                              {(apt.tipo_cita || '').toLowerCase().includes('consulta') ? '🩺' : '🏃'}
                            </div>
                            <div>
                              <div className="text-[12px] font-bold text-white line-clamp-1">{apt.descripcion_cita || 'Consulta general'}</div>
                              <div className="text-[10px] text-surface-muted mt-1 leading-relaxed">
                                {appointmentTime ? `🕒 ${appointmentTime} · ` : ''}👤 Paciente: <strong className="text-white">{apt.paciente || 'N/A'}</strong> · 🩺 Profesional: <strong className="text-white">{apt.especialista || 'N/A'}</strong>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1.5 flex-shrink-0 ml-3">
                            {apt.tipo_cita && <Badge variant={apt.tipo_cita.toLowerCase().includes('consulta') ? 'blue' : 'green'}>{apt.tipo_cita}</Badge>}
                            {apt.estado && <Badge variant={apt.estado.toLowerCase().includes('programa') || apt.estado.toLowerCase().includes('confirm') ? 'green' : 'orange'}>{apt.estado}</Badge>}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-full text-center text-surface-muted p-5">No hay citas programadas para hoy.</div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Transacciones de Hoy Tab */}
          {activeTab === 'transacciones-hoy' && (
            <div className="overflow-x-auto">
              {isListLoading ? (
                <div className="p-5 text-center text-brand-orange animate-pulse font-medium text-xs">Cargando transacciones...</div>
              ) : (
                <table className="w-full border-collapse text-[12px]">
                  <thead>
                    <tr>
                      {['Fecha', 'ID Transacción', 'Cliente', 'Tipo', 'Detalle', 'Monto', 'Estado'].map(h => (
                        <th key={h} className="text-left p-2.5 text-[10px] text-surface-muted uppercase tracking-[0.7px] border-b border-surface-border font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {transactionsToday.length > 0 ? (
                      transactionsToday.map((t) => (
                        <tr key={t.id_transaccion || t.id} className="hover:bg-white/[0.015]">
                          <td className="p-2.5 border-b border-surface-border text-surface-muted">{t.fecha || t.date}</td>
                          <td className="p-2.5 border-b border-surface-border font-medium text-white">{t.id_transaccion || t.id}</td>
                          <td className="p-2.5 border-b border-surface-border font-semibold text-white">{t.cliente || t.client || t.paciente_nombre || 'Cliente'}</td>
                          <td className="p-2.5 border-b border-surface-border">
                            <Badge variant={(t.tipo || t.type) === 'membresia' ? 'yellow' : 'blue'}>{(t.tipo || t.type) === 'membresia' ? 'Membresía' : 'Cita'}</Badge>
                          </td>
                          <td className="p-2.5 border-b border-surface-border text-surface-muted">{t.detalle || t.detail}</td>
                          <td className="p-2.5 border-b border-surface-border font-bold text-brand-green">${(t.monto || t.amount || 0).toFixed(2)}</td>
                          <td className="p-2.5 border-b border-surface-border">
                            <Badge variant={(t.estado || t.status) === 'exitosa' ? 'green' : (t.estado || t.status) === 'pendiente' ? 'orange' : 'red'}>{t.estado || t.status}</Badge>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-5 text-center text-surface-muted">No hay transacciones registradas para hoy.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
