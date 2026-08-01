import { useState, useMemo } from 'react'
import { Download, Plus, ChevronLeft, Search, Trash2, Upload } from 'lucide-react'
import { AgendaPage } from '@/views/shared/AgendaPage'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { StatCard } from '@/components/ui/StatCard'
import { Toggle } from '@/components/ui/Toggle'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Select, SelectOption } from '@/components/ui/Select'
import { useAppStore } from '@/store/useAppStore'
import { MOCK_PROFESSIONALS } from '@/services/mocks/professionals.mock'
import { MOCK_USERS } from '@/services/mocks/users.mock'
import { toast } from '@/components/ui/Toast'
import { cn } from '@/utils'
import type { Professional } from '@/types'

type ProfTab = 'perfil' | 'pacientes' | 'agenda'

// ─── Detail ───────────────────────────────────────────────────────
function ProfDetail({ onUpdate }: { onUpdate: () => void }) {
  const { selectedProfessional: p, setPage } = useAppStore()
  const [tab, setTab] = useState<ProfTab>('perfil')
  const [isEditing, setIsEditing] = useState(false)
  
  // Local state for pupil assignments modal
  const [isAssignOpen, setIsAssignOpen] = useState(false)
  const [selectedUserVal, setSelectedUserVal] = useState('')

  // Local state for patient reassignment
  const [isReassignOpen, setIsReassignOpen] = useState(false)
  const [reassignPatient, setReassignPatient] = useState<any | null>(null)
  const [targetSpecialistId, setTargetSpecialistId] = useState('')

  if (!p) return null

  const tabs: {id:ProfTab;label:string}[] = [
    {id:'perfil',label:'Ficha Profesional'},
    {id:'pacientes',label:'Pacientes asignados'},
    {id:'agenda',label:'Agenda profesional'},
  ]

  const roleBadge = p.rol.includes('Deport') ? 'purple' : 'green'

  // Process patient reassignment
  const handleReassign = () => {
    if (!reassignPatient) return
    if (!targetSpecialistId) {
      toast.show('Por favor, selecciona un especialista de destino', 'error')
      return
    }

    const targetSpec = MOCK_PROFESSIONALS.find(spec => spec.id === targetSpecialistId)
    if (targetSpec) {
      // 1. Remove from current specialist
      p.pacAsi = p.pacAsi.filter(pa => pa.nombre !== reassignPatient.nombre)
      p.pacientes = p.pacAsi.length

      // 2. Add to target specialist
      if (!targetSpec.pacAsi) targetSpec.pacAsi = []
      targetSpec.pacAsi.push({ ...reassignPatient })
      targetSpec.pacientes = targetSpec.pacAsi.length

      toast.show(`Paciente ${reassignPatient.nombre} reasignado con éxito a ${targetSpec.nombre}`, 'success')
      setIsReassignOpen(false)
      setReassignPatient(null)
      setTargetSpecialistId('')
      onUpdate()
    }
  }

  // Options list of available pupils (excluding those already assigned)
  const pupilOptions: SelectOption[] = useMemo(() => {
    const assignedNames = p.pacAsi.map(pa => pa.nombre.toLowerCase())
    return MOCK_USERS
      .filter(u => !assignedNames.includes(u.apodo.toLowerCase()))
      .map(u => ({
        value: u.id_usuario,
        label: `${u.nombre} (${u.nombre_disciplina})`
      }))
  }, [p.pacAsi, isAssignOpen])

  // Process pupil assignment
  const handleAssignPupil = () => {
    if (!selectedUserVal) {
      toast.show('Por favor selecciona un alumno', 'error')
      return
    }
    const targetUser = MOCK_USERS.find(u => u.id_usuario === selectedUserVal)
    if (targetUser) {
      p.pacAsi.push({
        ini: targetUser.initials || 'US',
        nombre: targetUser.apodo,
        disc: targetUser.nombre_disciplina,
        nivel: targetUser.clasificacion_visible_actual,
        adh: '85%', // Default mock starting value
        ultimo: 'Hoy',
        est: 'En seguimiento',
        color: targetUser.color || '#9B59B6'
      })
      p.pacientes = p.pacAsi.length
      toast.show(`Alumno ${targetUser.nombre} asignado con éxito`, 'success')
      setIsAssignOpen(false)
      setSelectedUserVal('')
      onUpdate()
    }
  }

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => setPage('profesionales')} className="mb-4">
        <ChevronLeft size={14}/> Volver a Profesionales
      </Button>

      {/* Hero card */}
      <div className="card-base overflow-hidden p-0 mb-5">
        <div className="h-16" style={{background:'linear-gradient(135deg,rgba(155,89,182,.4),rgba(74,124,199,.3))'}} />
        <div className="px-5 pb-5">
          <div className="flex items-end gap-4 flex-wrap">
            <div className="relative -mt-8">
              <Avatar initials={p.initials} color={p.color} size="lg" className="border-[3px] border-surface-card w-16 h-16 text-xl" />
              <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer border-2 border-surface-card" style={{background:p.color}}>
                <span className="text-[9px] text-white">✏</span>
              </div>
            </div>
            <div className="flex-1 min-w-0 pt-2">
              <div className="text-[17px] font-bold mb-1">{p.nombre}</div>
              <div className="text-[12px] text-surface-muted mb-2">{p.rol} · {p.email}</div>
              <div className="flex gap-2 flex-wrap">
                <Badge variant={roleBadge}>{p.especialidad}</Badge>
                <Badge variant={
                  p.estado === 'Suspendido Temporalmente' ? 'orange' :
                  p.estado === 'Suspendido Permanentemente' ? 'red' :
                  (p.accesoNivel === 'Sin acceso' ? 'orange' : 'green')
                }>
                  {p.estado || (p.accesoNivel === 'Sin acceso' ? 'Pendiente' : 'Activo')}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap pt-2">
              {isEditing ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsEditing(false)
                      toast.show('Edición cancelada', 'info')
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    style={{ background: '#4CAF82', borderColor: '#4CAF82' }}
                    onClick={() => {
                      setIsEditing(false)
                      toast.show('Cambios guardados con éxito', 'success')
                      onUpdate()
                    }}
                  >
                    💾 Guardar Cambios
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setIsEditing(true)
                      toast.show('Modo edición activado', 'info')
                    }}
                  >
                    ✏️ Editar Perfil
                  </Button>
                  
                  {p.estado && p.estado.includes('Suspendido') ? (
                    <Button
                      variant="primary"
                      style={{ background: '#4CAF82', borderColor: '#4CAF82' }}
                      onClick={() => {
                        p.estado = 'Activo'
                        p.accesoNivel = 'Completo' // restore access
                        onUpdate()
                        toast.show('Especialista reactivado con éxito', 'success')
                      }}
                    >
                      🟢 Reactivar Especialista
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        className="text-brand-orange hover:bg-brand-orange/10 border border-brand-orange/20"
                        onClick={() => {
                          p.estado = 'Suspendido Temporalmente'
                          p.accesoNivel = 'Sin acceso' // revoke access
                          onUpdate()
                          toast.show('Especialista suspendido temporalmente', 'warning')
                        }}
                      >
                        🟡 Suspender Temporalmente
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => {
                          p.estado = 'Suspendido Permanentemente'
                          p.accesoNivel = 'Sin acceso' // revoke access
                          onUpdate()
                          toast.show('Especialista suspendido permanentemente', 'error')
                        }}
                      >
                        🔴 Suspender Permanentemente
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0.5 border-b border-surface-border mb-5 overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={cn('px-3.5 py-2 text-[12px] cursor-pointer border-0 bg-transparent whitespace-nowrap transition-all border-b-2 -mb-px', tab === t.id ? 'font-medium border-brand-purple' : 'text-surface-muted border-transparent hover:text-white')}
            style={tab === t.id ? {color:'#9B59B6'} : undefined}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Ficha Profesional / Perfil Unificado */}
      {tab === 'perfil' && (
        <div className="space-y-5">
          {/* Card: Ficha Profesional */}
          <div className="card-base p-5 bg-surface-card border border-surface-border rounded-xl">
            <h3 className="text-sm font-bold text-white mb-4">Ficha Profesional</h3>
            <div className="flex flex-col md:flex-row gap-5 items-start mb-5">
              {/* Left: Avatar and Upload button */}
              <div className="flex flex-col items-center justify-center shrink-0">
                <div className="relative">
                  <Avatar initials={p.initials} color={p.color} size="lg" className="w-16 h-16 text-xl border-[3px] border-surface-card" />
                  {isEditing && (
                    <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer border border-surface-card bg-brand-orange">
                      <span className="text-[10px] text-white">⬆</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Middle: Biografía */}
              <div className="flex-1 w-full">
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">BIOGRAFÍA</label>
                <textarea
                  value={p.bio || ''}
                  disabled={!isEditing}
                  onChange={(e) => {
                    p.bio = e.target.value
                    onUpdate()
                  }}
                  placeholder="Escribe la biografía del especialista..."
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-purple min-h-[80px] resize-y disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Grid of details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border-t border-surface-border pt-4">
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">EMAIL</label>
                <input
                  type="email"
                  value={p.email || ''}
                  disabled={!isEditing}
                  onChange={(e) => {
                    p.email = e.target.value
                    onUpdate()
                  }}
                  placeholder="Ej. garcia@fitnflai.com"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-purple disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">ESPECIALIDAD</label>
                <input
                  type="text"
                  value={p.especialidad || ''}
                  disabled={!isEditing}
                  onChange={(e) => {
                    p.especialidad = e.target.value
                    onUpdate()
                  }}
                  placeholder="Ej. Medicina del deporte"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-purple disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">AÑOS DE EXPERIENCIA</label>
                <input
                  type="number"
                  value={p.experiencia || 0}
                  disabled={!isEditing}
                  onChange={(e) => {
                    p.experiencia = Number(e.target.value)
                    onUpdate()
                  }}
                  placeholder="Ej. 10"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-purple disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">CIUDAD / PAÍS</label>
                <input
                  type="text"
                  value={p.ciudad || ''}
                  disabled={!isEditing}
                  onChange={(e) => {
                    p.ciudad = e.target.value
                    onUpdate()
                  }}
                  placeholder="Ej. Medellín, Colombia"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-purple disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">TELÉFONO</label>
                <input
                  type="text"
                  value={p.tel || ''}
                  disabled={!isEditing}
                  onChange={(e) => {
                    p.tel = e.target.value
                    onUpdate()
                  }}
                  placeholder="Ej. +57 300 123 4567"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-purple disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">ESTADO DE CUENTA</label>
                <div className="flex items-center gap-2 h-[38px]">
                  <Badge variant={
                    p.estado === 'Suspendido Temporalmente' ? 'orange' :
                    p.estado === 'Suspendido Permanentemente' ? 'red' :
                    (p.accesoNivel === 'Sin acceso' ? 'orange' : 'green')
                  }>
                    {p.estado || (p.accesoNivel === 'Sin acceso' ? 'Pendiente' : 'Activo')}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Documento de Identidad */}
          <div className="card-base p-5 bg-surface-card border border-surface-border rounded-xl">
            <h3 className="text-sm font-bold text-white mb-4">Documento de Identidad</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
              {/* Left side: Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">TIPO DE DOCUMENTO</label>
                  <input
                    type="text"
                    value={p.docTipo || ''}
                    disabled={!isEditing}
                    onChange={(e) => {
                      p.docTipo = e.target.value
                      onUpdate()
                    }}
                    placeholder="Ej. Cédula de Ciudadanía, DNI, Pasaporte"
                    className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-purple disabled:opacity-75 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">NÚMERO DE DOCUMENTO</label>
                  <input
                    type="text"
                    value={p.docNumero || ''}
                    disabled={!isEditing}
                    onChange={(e) => {
                      p.docNumero = e.target.value
                      onUpdate()
                    }}
                    placeholder="Ej. 1020304050"
                    className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-purple disabled:opacity-75 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Right side: File upload/view (Front and Back sides) */}
              <div className="space-y-4 w-full">
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">Copia digital escaneada (Ambas caras)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Parte Delantera */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-surface-muted uppercase font-medium">Parte Delantera</span>
                    {p.docDelantero ? (
                      <div className="bg-surface-card2 border border-surface-border rounded-xl p-3 flex items-center justify-between h-[68px]">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base bg-brand-orange/15 text-brand-orange shrink-0">
                            📄
                          </div>
                          <div className="min-w-0">
                            <div className="text-[11px] font-semibold text-white truncate max-w-[100px]" title={p.docDelantero}>{p.docDelantero}</div>
                            <div className="text-[9px] text-brand-green font-medium">Verificado</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="px-1.5 h-7 text-[10px]"
                            onClick={() => toast.show(`Visualizando frente: ${p.docDelantero}`, 'info')}
                          >
                            Ver
                          </Button>
                          {isEditing && (
                            <button
                              onClick={() => {
                                p.docDelantero = undefined
                                onUpdate()
                                toast.show('Parte delantera removida', 'error')
                              }}
                              className="p-1 text-brand-red hover:bg-brand-red/10 rounded-lg transition-all cursor-pointer bg-transparent border-0"
                              title="Eliminar frente"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <label className={cn("border border-dashed border-surface-border rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.01] transition-all h-[68px]", !isEditing && "pointer-events-none opacity-50")}>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              p.docDelantero = file.name
                              onUpdate()
                              toast.show(`Frente "${file.name}" cargado con éxito`, 'success')
                            }
                          }}
                        />
                        <Upload size={14} className="text-surface-muted mb-1" />
                        <span className="text-[9px] text-surface-muted text-center leading-tight">Cargar Frente</span>
                      </label>
                    )}
                  </div>

                  {/* Parte Trasera */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-surface-muted uppercase font-medium">Parte Trasera</span>
                    {p.docTrasero ? (
                      <div className="bg-surface-card2 border border-surface-border rounded-xl p-3 flex items-center justify-between h-[68px]">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base bg-brand-orange/15 text-brand-orange shrink-0">
                            📄
                          </div>
                          <div className="min-w-0">
                            <div className="text-[11px] font-semibold text-white truncate max-w-[100px]" title={p.docTrasero}>{p.docTrasero}</div>
                            <div className="text-[9px] text-brand-green font-medium">Verificado</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="px-1.5 h-7 text-[10px]"
                            onClick={() => toast.show(`Visualizando dorso: ${p.docTrasero}`, 'info')}
                          >
                            Ver
                          </Button>
                          {isEditing && (
                            <button
                              onClick={() => {
                                p.docTrasero = undefined
                                onUpdate()
                                toast.show('Parte trasera removida', 'error')
                              }}
                              className="p-1 text-brand-red hover:bg-brand-red/10 rounded-lg transition-all cursor-pointer bg-transparent border-0"
                              title="Eliminar dorso"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <label className={cn("border border-dashed border-surface-border rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.01] transition-all h-[68px]", !isEditing && "pointer-events-none opacity-50")}>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              p.docTrasero = file.name
                              onUpdate()
                              toast.show(`Dorso "${file.name}" cargado con éxito`, 'success')
                            }
                          }}
                        />
                        <Upload size={14} className="text-surface-muted mb-1" />
                        <span className="text-[9px] text-surface-muted text-center leading-tight">Cargar Dorso</span>
                      </label>
                    )}
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* Card: Historial Laboral */}
          <div className="card-base p-5 bg-surface-card border border-surface-border rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Historial Laboral</h3>
              {isEditing && (
                <button
                  onClick={() => {
                    if (!p.tray) p.tray = []
                    p.tray.push({
                      titulo: '',
                      org: '',
                      inicio: '2020',
                      fin: 'Presente',
                      desc: ''
                    })
                    onUpdate()
                    toast.show('Nueva trayectoria añadida', 'success')
                  }}
                  className="text-[11px] font-semibold text-brand-orange hover:text-brand-orange/80 transition-colors bg-transparent border-0 cursor-pointer"
                >
                  + Añadir
                </button>
              )}
            </div>
            
            {(!p.tray || p.tray.length === 0) ? (
              <div className="text-center py-6 text-surface-muted text-[12px]">Sin historial laboral registrado.</div>
            ) : (
              <div className="space-y-3">
                {p.tray.map((t, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row gap-3 items-center w-full">
                    <div className="flex-1 w-full">
                      <input
                        type="text"
                        value={t.titulo || ''}
                        disabled={!isEditing}
                        onChange={(e) => {
                          t.titulo = e.target.value
                          onUpdate()
                        }}
                        placeholder="Cargo (ej: Nutricionista)"
                        className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-purple disabled:opacity-75 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div className="flex-1 w-full">
                      <input
                        type="text"
                        value={t.org || ''}
                        disabled={!isEditing}
                        onChange={(e) => {
                          t.org = e.target.value
                          onUpdate()
                        }}
                        placeholder="Organización (ej: Club Deportivo)"
                        className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-purple disabled:opacity-75 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div className="w-full md:w-44">
                      <input
                        type="text"
                        value={(t.inicio && t.fin) ? `${t.inicio}-${t.fin}` : (t.inicio || '2020-Presente')}
                        disabled={!isEditing}
                        onChange={(e) => {
                          const val = e.target.value
                          if (val.includes('-')) {
                            const [ini, fin] = val.split('-')
                            t.inicio = ini.trim()
                            t.fin = fin.trim()
                          } else {
                            t.inicio = val
                            t.fin = ''
                          }
                          onUpdate()
                        }}
                        placeholder="Período (ej: 2020-Presente)"
                        className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-purple disabled:opacity-75 disabled:cursor-not-allowed"
                      />
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => {
                          p.tray = p.tray.filter((_, i) => i !== idx)
                          onUpdate()
                          toast.show('Trayectoria eliminada', 'error')
                        }}
                        className="p-2 text-brand-red hover:bg-brand-red/10 rounded-lg transition-all shrink-0 cursor-pointer bg-transparent border-0"
                        title="Eliminar historial"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card: Gestor de Certificados */}
          <div className="card-base p-5 bg-surface-card border border-surface-border rounded-xl">
            <h3 className="text-sm font-bold text-white mb-4">Gestor de Certificados</h3>
            
            {/* Dotted upload zone */}
            <label className={cn("border border-dashed border-surface-border rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.01] transition-all mb-4", !isEditing && "pointer-events-none opacity-50")}>
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    if (!p.certs) p.certs = []
                    p.certs.push({
                      nombre: file.name.replace(/\.[^/.]+$/, ""), // remove extension
                      org: 'Subido por el usuario',
                      año: new Date().getFullYear().toString(),
                      venc: 'Sin vencimiento',
                      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`
                    })
                    onUpdate()
                    toast.show(`Certificado "${file.name}" cargado con éxito`, 'success')
                  }
                }}
              />
              <Upload size={24} className="text-surface-muted mb-2" />
              <span className="text-[12px] text-surface-muted">Arrastra aquí tus diplomas o licencias (PDF/JPG) o haz clic para seleccionar</span>
            </label>

            {/* Certs list */}
            {(!p.certs || p.certs.length === 0) ? (
              <div className="text-center py-4 text-surface-muted text-[12px]">Sin certificados cargados.</div>
            ) : (
              <div className="space-y-2">
                {p.certs.map((c, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-surface-border last:border-0">
                    <span className="text-[12px] text-white">{c.nombre}</span>
                    {isEditing && (
                      <button
                        onClick={() => {
                          p.certs = p.certs.filter((_, i) => i !== idx)
                          onUpdate()
                          toast.show('Certificado eliminado', 'error')
                        }}
                        className="p-1.5 text-brand-red hover:bg-brand-red/10 rounded-lg transition-all cursor-pointer bg-transparent border-0"
                        title="Eliminar certificado"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}



      {/* Agenda */}
      {tab === 'agenda' && <div className="card-base"><AgendaPage /></div>}

      {/* Pacientes */}
      {tab === 'pacientes' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="text-[13px] text-surface-muted">{p.pacAsi.length} paciente{p.pacAsi.length !== 1 ? 's' : ''} asignado{p.pacAsi.length !== 1 ? 's' : ''}</div>
            <Button variant="primary" size="sm" onClick={() => setIsAssignOpen(true)}>+ Asignar Alumno</Button>
          </div>
          {p.pacAsi.length === 0 ? (
            <div className="text-center py-10 text-surface-muted"><div className="text-3xl mb-3">👥</div><div>Sin pacientes asignados</div></div>
          ) : (
            <div className="card-base p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[12px]">
                  <thead><tr>{['Paciente','Disciplina','Nivel','Adherencia','Último acceso','Estado',''].map(h=><th key={h} className="text-left p-2.5 text-[10px] text-surface-muted uppercase tracking-[0.7px] border-b border-surface-border font-medium">{h}</th>)}</tr></thead>
                  <tbody>
                    {p.pacAsi.map((pa) => (
                      <tr key={pa.nombre} className="hover:bg-white/[0.015]">
                        <td className="p-2.5 border-b border-surface-border"><div className="flex items-center gap-2"><Avatar initials={pa.ini} color={pa.color} size="sm" /><span className="font-medium">{pa.nombre}</span></div></td>
                        <td className="p-2.5 border-b border-surface-border text-[11px]">{pa.disc}</td>
                        <td className="p-2.5 border-b border-surface-border"><Badge variant="muted">{pa.nivel}</Badge></td>
                        <td className="p-2.5 border-b border-surface-border">
                          <div className="text-[11px] text-brand-green mb-1">{pa.adh}</div>
                          <div className="h-1 w-16 bg-surface-border rounded-full overflow-hidden"><div className="h-full bg-brand-green rounded-full" style={{width:pa.adh}} /></div>
                        </td>
                        <td className="p-2.5 border-b border-surface-border text-[11px] text-surface-muted">{pa.ultimo}</td>
                        <td className="p-2.5 border-b border-surface-border"><Badge variant={pa.est==='Alta médica'?'green':pa.est==='Pendiente revisión'?'red':'purple'}>{pa.est}</Badge></td>
                        <td className="p-2.5 border-b border-surface-border">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-brand-orange hover:bg-brand-orange/15 border border-brand-orange/20"
                            onClick={() => {
                              setReassignPatient(pa)
                              setIsReassignOpen(true)
                            }}
                          >
                            Reasignar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pupil Assignment Modal (Nested modal support) */}
          <Modal
            isOpen={isAssignOpen}
            onClose={() => setIsAssignOpen(false)}
            title={`Asignar alumno a ${p.nombre}`}
            depth={1}
          >
            {pupilOptions.length === 0 ? (
              <div className="text-center py-6 text-surface-muted text-[12px]">Todos los alumnos disponibles ya están asignados a este profesional.</div>
            ) : (
              <div className="space-y-4">
                <Select
                  label="Selecciona un Alumno"
                  options={pupilOptions}
                  value={selectedUserVal}
                  onChange={setSelectedUserVal}
                  placeholder="Elige un alumno del listado..."
                />
                <div className="flex gap-2 justify-end mt-4">
                  <Button variant="ghost" onClick={() => setIsAssignOpen(false)}>Cancelar</Button>
                  <Button variant="primary" onClick={handleAssignPupil}>Confirmar Asignación</Button>
                </div>
              </div>
            )}
          </Modal>

          {/* Patient Reassignment Modal */}
          <Modal
            isOpen={isReassignOpen}
            onClose={() => {
              setIsReassignOpen(false)
              setReassignPatient(null)
              setTargetSpecialistId('')
            }}
            title={`Reasignar alumno ${reassignPatient?.nombre || ''}`}
            depth={1}
          >
            <div className="space-y-4">
              <p className="text-[12px] text-surface-muted">
                Selecciona el especialista al cual deseas transferir el seguimiento de <span className="font-bold text-white">{reassignPatient?.nombre}</span>. El alumno se removerá automáticamente de la lista de {p.nombre}.
              </p>
              
              <Select
                label="Especialista Destinatario"
                options={MOCK_PROFESSIONALS
                  .filter(spec => spec.id !== p.id)
                  .map(spec => ({
                    value: spec.id,
                    label: `${spec.nombre} (${spec.especialidad || spec.rol})`
                  }))
                }
                value={targetSpecialistId}
                onChange={setTargetSpecialistId}
                placeholder="Elige un especialista para reasignar..."
              />

              <div className="flex gap-2 justify-end mt-4">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsReassignOpen(false)
                    setReassignPatient(null)
                    setTargetSpecialistId('')
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  style={{ background: '#9B59B6', borderColor: '#9B59B6' }}
                  onClick={handleReassign}
                >
                  Confirmar Reasignación
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      )}
    </div>
  )
}

// ─── List ──────────────────────────────────────────────────────────
export function ProfesionalesPage() {
  const { setPage, setSelectedProfessional, selectedProfessional, currentPage } = useAppStore()
  
  // Local state to track updates and force renders
  const [updateTick, setUpdateTick] = useState(0)
  const triggerUpdate = () => setUpdateTick(t => t + 1)

  // Filtering and search state
  const [filter, setFilter] = useState<'Todos' | 'Activos' | 'Pendientes'>('Todos')
  const [search, setSearch] = useState('')

  // Approval review modal state
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [reviewProfessional, setReviewProfessional] = useState<Professional | null>(null)

  const filteredProfessionals = useMemo(() => {
    return MOCK_PROFESSIONALS.filter(p => {
      // 1. Filter by status tag
      if (filter === 'Activos' && p.accesoNivel === 'Sin acceso') return false
      if (filter === 'Pendientes' && p.accesoNivel !== 'Sin acceso') return false

      // 2. Filter by search query
      if (search.trim() !== '') {
        const query = search.toLowerCase()
        const matchesNombre = p.nombre?.toLowerCase().includes(query)
        const matchesEmail = p.email?.toLowerCase().includes(query)
        const matchesEspecialidad = p.especialidad?.toLowerCase().includes(query)
        const matchesRol = p.rol?.toLowerCase().includes(query)
        return matchesNombre || matchesEmail || matchesEspecialidad || matchesRol
      }

      return true
    })
  }, [filter, search, updateTick])

  const handleRowClick = (p: Professional) => {
    if (p.accesoNivel === 'Sin acceso' && !p.estado?.includes('Suspendido')) {
      // Pending specialist review triggers the dedicated Modal de revisión
      setReviewProfessional(p)
      setIsReviewOpen(true)
    } else {
      // Approved or suspended specialists navigate to detail page
      setSelectedProfessional(p)
      setPage('prof-detalle')
    }
  }

  // Handle Approve professional action
  const handleApprove = () => {
    if (reviewProfessional) {
      reviewProfessional.accesoNivel = 'Completo'
      reviewProfessional.accesoDesc = 'Acceso total al panel excepto configuración'
      reviewProfessional.ultimoAcceso = 'Hoy'
      toast.show(`Especialista ${reviewProfessional.nombre} aprobado con éxito`, 'success')
      setIsReviewOpen(false)
      setReviewProfessional(null)
      triggerUpdate()
    }
  }

  // Handle Reject professional action
  const handleReject = () => {
    if (reviewProfessional) {
      toast.show(`Registro de ${reviewProfessional.nombre} denegado`, 'error')
      setIsReviewOpen(false)
      setReviewProfessional(null)
      triggerUpdate()
    }
  }

  const accBadge = (l: string) => l === 'Completo' ? 'blue' : l === 'Parcial' ? 'orange' : l === 'Lectura' ? 'blue' : 'muted'

  if (currentPage === 'prof-detalle' && selectedProfessional) {
    return <ProfDetail onUpdate={triggerUpdate} />
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-5 gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{background:'rgba(155,89,182,.15)'}}>
            <span style={{color:'#9B59B6',fontSize:15}}>🪪</span>
          </div>
          <div><h2 className="text-lg font-bold">Profesionales</h2><p className="text-[12px] text-surface-muted mt-0.5">{filteredProfessionals.length} deportólogos y entrenadores</p></div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" className="gap-1.5"><Download size={13}/> Exportar</Button>
          <Button variant="primary" className="gap-1.5" onClick={() => toast.show('Formulario externo para alta de profesionales listo', 'info')}><Plus size={13}/> Nuevo profesional</Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-5">
        <StatCard label="Total" value={MOCK_PROFESSIONALS.length.toString()} valueColor="#9B59B6" delta="↑ +2 este mes" deltaUp />
        <StatCard label="Deportólogos" value={MOCK_PROFESSIONALS.filter(p=>p.rol.includes('Deport')).length.toString()} valueColor="#4A7CC7" />
        <StatCard label="Entrenadores" value={MOCK_PROFESSIONALS.filter(p=>p.rol.includes('Entrena')).length.toString()} valueColor="#4CAF82" />
        <StatCard label="Pacientes asignados" value={MOCK_PROFESSIONALS.reduce((sum, p) => sum + p.pacientes, 0).toString()} valueColor="#E8622A" />
      </div>

      {/* Filter Tabs and Search */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {(['Todos', 'Activos', 'Pendientes'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-3 py-1 rounded-full text-[11px] border cursor-pointer transition-all',
              filter === f
                ? 'text-white border-brand-purple bg-brand-purple'
                : 'bg-surface-card border-surface-border text-surface-muted hover:text-white'
            )}
            style={filter === f ? {background:'#9B59B6'} : undefined}
          >
            {f}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1.5 bg-surface-card border border-surface-border rounded-lg px-2.5 py-1.5">
          <Search size={12} className="text-surface-muted" />
          <input
            type="search"
            placeholder="Buscar especialista..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-0 outline-none text-[12px] text-white placeholder:text-surface-muted w-40"
          />
        </div>
      </div>

      <div className="card-base p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[12px]">
            <thead><tr>{['Profesional','Rol','Especialidad','Pacientes','Certs','Acceso','Estado',''].map(h=><th key={h} className="text-left p-2.5 text-[10px] text-surface-muted uppercase tracking-[0.7px] border-b border-surface-border font-medium">{h}</th>)}</tr></thead>
            <tbody>
              {filteredProfessionals.map((p) => {
                const active = p.accesoNivel !== 'Sin acceso'
                const displayStatus = p.estado || (active ? 'Activo' : 'Pendiente')
                const statusVariant = 
                  p.estado === 'Suspendido Temporalmente' ? 'orange' :
                  p.estado === 'Suspendido Permanentemente' ? 'red' :
                  (active ? 'green' : 'orange')

                return (
                  <tr key={p.id} className="cursor-pointer hover:bg-white/[0.015]" onClick={() => handleRowClick(p)}>
                    <td className="p-2.5 border-b border-surface-border">
                      <div className="flex items-center gap-2">
                        <Avatar initials={p.initials} color={p.color} size="sm" />
                        <div><div className="font-medium text-white">{p.nombre}</div><div className="text-[10px] text-surface-muted">{p.email}</div></div>
                      </div>
                    </td>
                    <td className="p-2.5 border-b border-surface-border">
                      <Badge variant={p.rol.includes('Deport') ? 'purple' : 'green'}>
                        {p.rol.includes('Deport') ? '🩺' : '🏃'} {p.rol}
                      </Badge>
                    </td>
                    <td className="p-2.5 border-b border-surface-border text-[11px] text-surface-muted">{p.especialidad}</td>
                    <td className="p-2.5 border-b border-surface-border font-semibold text-brand-orange">{p.pacientes}</td>
                    <td className="p-2.5 border-b border-surface-border"><Badge variant="green">{p.certs.length} certs</Badge></td>
                    <td className="p-2.5 border-b border-surface-border"><Badge variant={accBadge(p.accesoNivel) as any}>{p.accesoNivel}</Badge></td>
                    <td className="p-2.5 border-b border-surface-border"><Badge variant={statusVariant as any}>{displayStatus}</Badge></td>
                    <td className="p-2.5 border-b border-surface-border text-[11px] text-brand-purple">
                      {p.estado && p.estado.includes('Suspendido') ? 'Gestionar →' : (active ? 'Ver →' : 'Revisar →')}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="p-2.5 flex items-center justify-between border-t border-surface-border">
          <span className="text-[11px] text-surface-muted">{filteredProfessionals.length} de {MOCK_PROFESSIONALS.length} profesionales</span>
          <div className="flex gap-1.5">
            <Button variant="ghost" size="sm">← Anterior</Button>
            <Button variant="ghost" size="sm">Siguiente →</Button>
          </div>
        </div>
      </div>

      {/* Specialist Review Modal */}
      {reviewProfessional && (
        <Modal
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
          title={`Revisión de Credenciales: ${reviewProfessional.nombre}`}
        >
          <div className="space-y-4">
            {/* Header info */}
            <div className="flex items-center gap-3 bg-surface-card2 rounded-xl p-3 border border-surface-border">
              <Avatar initials={reviewProfessional.initials} color={reviewProfessional.color} size="md" />
              <div>
                <div className="text-[13px] font-bold text-white">{reviewProfessional.nombre}</div>
                <div className="text-[10px] text-surface-muted">{reviewProfessional.rol} · {reviewProfessional.especialidad}</div>
                <div className="text-[10px] text-surface-muted">Ingreso: {reviewProfessional.ingreso} · Exp: {reviewProfessional.experiencia} años</div>
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="text-[11px] font-bold text-surface-muted uppercase tracking-wider mb-1">Biografía Profesional</div>
              <p className="text-[12px] text-white/90 bg-surface-card2 rounded-lg p-2.5 border border-surface-border leading-relaxed">
                {reviewProfessional.bio}
              </p>
            </div>

            {/* Certificates review */}
            <div>
              <div className="text-[11px] font-bold text-surface-muted uppercase tracking-wider mb-2">Documentación y Certificados</div>
              <div className="space-y-2">
                {reviewProfessional.certs.map((c, idx) => (
                  <div key={idx} className="bg-surface-card2 border border-surface-border rounded-lg p-2.5 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-semibold text-white">{c.nombre}</div>
                      <div className="text-[9px] text-surface-muted">{c.org} · Id: {c.id}</div>
                    </div>
                    <span className="text-[9px] bg-brand-green/20 text-brand-green px-1.5 py-0.5 rounded-full font-bold">PDF Listo</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 justify-end pt-3 border-t border-surface-border">
              <Button variant="danger" onClick={handleReject}>Denegar Registro</Button>
              <Button variant="primary" onClick={handleApprove}>Aprobar Acceso Completo</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
