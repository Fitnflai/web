import { useState, useMemo } from 'react'
import { Download, Plus } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { UsersTable } from '@/views/admin/UsuariosPage'
import { useAppStore } from '@/store/useAppStore'
import { MOCK_USERS } from '@/services/mocks/users.mock'
import { MOCK_PROFESSIONALS } from '@/services/mocks/professionals.mock'
import type { User } from '@/types'

export function MisPacientesPage() {
  const { setPage, setSelectedUser, setDetailOrigin } = useAppStore()

  // Default active specialist is Coach Martínez (pro-002) for specialist role
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
      Inactivos: assignedUsers.filter(u => !u.registro_activo),
      Revisión: assignedUsers.filter(u => u.onboarding_completo && u.registro_activo && (u.apodo === 'falcao' || u.apodo === 'luisa_p')),
      Pendientes: assignedUsers.filter(u => u.onboarding_completo && u.registro_activo && u.apodo === 'ana_m'),
    }
  }, [assignedUsers])

  const handleSelect = (u: User) => {
    setSelectedUser(u)
    setDetailOrigin('pacientes')
    setPage('paciente-detalle')
  }

  const [activeTab, setActiveTab] = useState<'Todos' | 'Nuevos' | 'Pendientes' | 'Revisión' | 'Inactivos'>('Todos')

  // Calculate stats dynamically from assigned roster


  return (
    <div>
      <div className="flex items-start justify-between mb-5 gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{background:'rgba(155,89,182,.15)'}}>
            <span style={{color:'#9B59B6',fontSize:15}}>🩺</span>
          </div>
          <div>
            <h2 className="text-lg font-bold">Pacientes asignados</h2>
            <p className="text-[12px] text-surface-muted mt-0.5">{categories.Todos.length} paciente(s) bajo tu cargo</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1.5 px-3.5 py-[7px] text-[12px] rounded-lg bg-surface-card border border-surface-border text-white font-medium"><Download size={13}/>Exportar</button>
          <button className="inline-flex items-center gap-1.5 px-3.5 py-[7px] text-[12px] rounded-lg text-white font-medium" style={{background:'#9B59B6'}}><Plus size={13}/>Nuevo paciente</button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3 mb-5">
        <StatCard label="Todos" value={categories.Todos.length.toString()} valueColor="#9B59B6" delta="Asignados" />
        <StatCard label="Nuevos" value={categories.Nuevos.length.toString()} valueColor="#4A7CC7" delta="En onboarding" />
        <StatCard label="Pendientes" value={categories.Pendientes.length.toString()} valueColor="#F5C842" delta="Requieren acción" />
        <StatCard label="Revisión" value={categories.Revisión.length.toString()} valueColor="#E24B4A" delta="En seguimiento" />
        <StatCard label="Inactivos" value={categories.Inactivos.length.toString()} valueColor="#7F8C8D" delta="Sin registro activo" />
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
            {tab} ({categories[tab].length})
          </button>
        ))}
      </div>

      <UsersTable users={categories[activeTab]} origin="pacientes" onSelect={handleSelect} isPacientes page={1} total={categories[activeTab].length} onPageChange={() => {}} />
    </div>
  )
}
