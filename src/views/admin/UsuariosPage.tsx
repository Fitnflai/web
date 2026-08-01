import { useState } from 'react'
import { Download, Plus, Search, Crown, Check, X } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { usersService } from '@/services/endpoints/users'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useAppStore } from '@/store/useAppStore'
import { MOCK_USERS } from '@/services/mocks/users.mock'
import { PLAN_NAMES } from '@/constants'
import type { User } from '@/types'

interface UsersTableProps {
  users: any[] // Changed to any[] due to dynamic backend response
  origin: 'usuarios' | 'pacientes'
  onSelect: (u: any) => void
  isPacientes?: boolean
  page: number
  total: number
  onPageChange: (newPage: number) => void
}

export function UsersTable({ users, origin, onSelect, isPacientes = false, page, total, onPageChange }: UsersTableProps) {
  const clinicalLabels = ['En seguimiento','Alta médica','Pendiente revisión','En seguimiento','Alta médica']
  const adhColors = (pct: number) => pct >= 80 ? '#4CAF82' : pct >= 50 ? '#F5C842' : '#E24B4A'

  return (
    <div className="card-base p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr>
              <th className="text-left p-2.5 text-[10px] text-surface-muted uppercase tracking-[0.7px] border-b border-surface-border font-medium">Usuario / Email</th>
              <th className="text-left p-2.5 text-[10px] text-surface-muted uppercase tracking-[0.7px] border-b border-surface-border font-medium">Disciplina</th>
              <th className="text-left p-2.5 text-[10px] text-surface-muted uppercase tracking-[0.7px] border-b border-surface-border font-medium">Nivel</th>
              <th className="text-left p-2.5 text-[10px] text-surface-muted uppercase tracking-[0.7px] border-b border-surface-border font-medium">Ciudad</th>
              <th className="text-left p-2.5 text-[10px] text-surface-muted uppercase tracking-[0.7px] border-b border-surface-border font-medium">Membresía</th>
              <th className="text-left p-2.5 text-[10px] text-surface-muted uppercase tracking-[0.7px] border-b border-surface-border font-medium">Onboarding</th>
              {isPacientes && <th className="text-left p-2.5 text-[10px] text-surface-muted uppercase tracking-[0.7px] border-b border-surface-border font-medium">Estado clínico</th>}
              <th className="text-left p-2.5 text-[10px] text-surface-muted uppercase tracking-[0.7px] border-b border-surface-border font-medium">Estado</th>
              <th className="p-2.5 border-b border-surface-border"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              return (
                <tr key={u.id_usuario} className="cursor-pointer hover:bg-white/[0.015]" onClick={() => onSelect(u)}>
                  <td className="p-2.5 border-b border-surface-border">
                    <div className="flex items-center gap-2">
                      <Avatar initials={u.initials} color={u.color} size="sm" />
                      <div>
                        <div className="font-medium">{u.nombre || u.apodo || u.email.split('@')[0]}</div>
                        <div className="text-[10px] text-surface-muted">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-2.5 border-b border-surface-border text-[11px]">
                    {u.disciplina && u.disciplina !== 'N/A' ? u.disciplina : ''}
                  </td>
                  <td className="p-2.5 border-b border-surface-border">
                    {u.nivel && u.nivel !== 'N/A' ? <Badge variant="blue">{u.nivel}</Badge> : ''}
                  </td>
                  <td className="p-2.5 border-b border-surface-border text-[11px] text-surface-muted">{u.ciudad || ''}</td>
                  <td className="p-2.5 border-b border-surface-border">
                    {u.membresia && u.membresia !== 'Ninguna' ? (
                      <Badge variant={(u.membresia === 'Pro' || u.membresia === 'Elite') ? 'yellow' : 'muted'}>
                        {(u.membresia === 'Pro' || u.membresia === 'Elite') ? <><Crown size={9} className="mr-0.5 inline-block" />{u.membresia}</> : u.membresia}
                      </Badge>
                    ) : ''}
                  </td>
                  <td className="p-2.5 border-b border-surface-border">
                    {u.onboarding === 'Completo' || u.onboarding_completo ? (
                      <Badge variant="green"><Check size={9} className="mr-0.5 inline-block" />Completo</Badge>
                    ) : (
                      <Badge variant="red"><X size={9} className="mr-0.5 inline-block" />Pendiente</Badge>
                    )}
                  </td>
                  {isPacientes && (
                    <td className="p-2.5 border-b border-surface-border">
                      <Badge variant={u.estado_clinico === 'Alta médica' ? 'green' : u.estado_clinico === 'Pendiente revisión' ? 'red' : 'purple'}>
                        {u.estado_clinico}
                      </Badge>
                    </td>
                  )}
                  <td className="p-2.5 border-b border-surface-border">
                    <Badge variant={(u.estado || u.registro_activo) === 'Activo' || (u.estado || u.registro_activo) === true ? 'green' : 'orange'}>
                      {(u.estado || u.registro_activo) === 'Activo' || (u.estado || u.registro_activo) === true ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </td>
                  <td className="p-2.5 border-b border-surface-border text-[11px] text-brand-orange">Ver →</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="p-2.5 flex items-center justify-between border-t border-surface-border">
        <span className="text-[11px] text-surface-muted">{users.length} de {total} usuarios</span>
        <div className="flex gap-1.5">
          <button className="px-2.5 py-1 text-[11px] rounded-lg bg-surface-card border border-surface-border text-white disabled:opacity-50 disabled:cursor-not-allowed" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>← Anterior</button>
          <button className="px-2.5 py-1 text-[11px] rounded-lg bg-surface-card border border-surface-border text-white disabled:opacity-50 disabled:cursor-not-allowed" disabled={page * 10 >= total} onClick={() => onPageChange(page + 1)}>Siguiente →</button>
        </div>
      </div>
    </div>
  )
}

export function UsuariosPage() {
  const { setPage, setSelectedUser, setDetailOrigin } = useAppStore()

  const [page, setLocalPage] = useState(1)
  const [activeFilter, setActiveFilter] = useState('Todos')
  const [searchQuery, setSearchQuery] = useState('')

  const filterMapping: Record<string, string> = {
    'Todos': 'todos',
    'Activos': 'activos',
    'Pro/Elite': 'pro_elite',
    'Onboarding pendiente': 'onboarding_pendiente'
  }

  const { data: responseData, isLoading, isError } = useQuery({
    queryKey: ['adminUsers', page, activeFilter, searchQuery],
    queryFn: () => usersService.getAdminUsers(page, 10, filterMapping[activeFilter] || 'todos', searchQuery),
  })

  const handleSelect = (u: any) => {
    setSelectedUser(u)
    setDetailOrigin('usuarios')
    setPage('usuario-detalle')
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-5 gap-3 flex-wrap">
        <div><h2 className="text-lg font-bold">Usuarios</h2><p className="text-[12px] text-surface-muted mt-0.5">{responseData?.total || 0} registrados · clic para ver perfil</p></div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1.5 px-3.5 py-[7px] text-[12px] rounded-lg bg-surface-card border border-surface-border text-white font-medium"><Download size={13}/>Exportar</button>
          <button className="inline-flex items-center gap-1.5 px-3.5 py-[7px] text-[12px] rounded-lg bg-brand-orange text-white font-medium"><Plus size={13}/>Invitar</button>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {['Todos','Activos','Pro/Elite','Onboarding pendiente'].map((f) => (
          <button 
            key={f} 
            className={`px-3 py-1 rounded-full text-[11px] border ${activeFilter === f ? 'bg-brand-orange border-brand-orange text-white' : 'bg-surface-card border-surface-border text-surface-muted'}`}
            onClick={() => { setActiveFilter(f); setLocalPage(1); }}
          >{f}</button>
        ))}
        <div className="ml-auto flex items-center gap-1.5 bg-surface-card border border-surface-border rounded-lg px-2.5 py-1.5">
          <Search size={12} className="text-surface-muted" />
          <input 
            type="search" 
            placeholder="Buscar..." 
            className="bg-transparent border-0 outline-none text-[12px] text-white placeholder:text-surface-muted w-40"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setLocalPage(1); }}
          />
        </div>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-40 text-surface-muted">Cargando usuarios...</div>
      ) : isError ? (
        <div className="flex items-center justify-center h-40 text-red-500">Error al cargar usuarios.</div>
      ) : (
        <UsersTable 
          users={responseData?.data || []} 
          origin="usuarios" 
          onSelect={handleSelect} 
          page={page}
          total={responseData?.total || 0}
          onPageChange={setLocalPage}
        />
      )}
    </div>
  )
}

