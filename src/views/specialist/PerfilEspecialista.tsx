import { useState, useMemo } from 'react'
import { Plus, Trash2, Upload, Edit, Save, Bell, Check, Clock } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { MOCK_PROFESSIONALS } from '@/services/mocks/professionals.mock'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toast'
import type { Professional } from '@/types'
import { cn } from '@/utils'

export function PerfilEspecialista() {
  const { setPage } = useAppStore()

  const original = useMemo(() => {
    return MOCK_PROFESSIONALS.find(prof => prof.id === 'pro-002') || MOCK_PROFESSIONALS[1]
  }, [])

  const [p, setP] = useState<Professional>(() => JSON.parse(JSON.stringify(original)))
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleFieldChange = (field: keyof Professional, val: any) => {
    setP(prev => ({ ...prev, [field]: val }))
  }

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-white">Mi Perfil Profesional</h1>
        <Button
          variant={isEditing ? 'primary' : 'ghost'}
          onClick={async () => {
            if (isEditing) {
              setIsSaving(true)
              await new Promise(resolve => setTimeout(resolve, 500))
              // Commit local state changes to global MOCK_PROFESSIONALS
              const idx = MOCK_PROFESSIONALS.findIndex(prof => prof.id === 'pro-002')
              if (idx !== -1) {
                MOCK_PROFESSIONALS[idx] = p
              }
              setIsSaving(false)
              setIsEditing(false)
              toast.show('Perfil actualizado con éxito', 'success')
            } else {
              setIsEditing(true)
            }
          }}
          disabled={isSaving}
        >
          {isSaving ? 'Guardando...' : isEditing ? <><Save size={16} className="mr-2" />Guardar Cambios</> : <><Edit size={16} className="mr-2" />Editar Perfil</>}
        </Button>
      </div>

      {/* Card 1: Ficha Profesional */}
      <div className="card-base p-5 bg-surface-card border border-surface-border rounded-xl">
        <h3 className="text-sm font-bold text-white mb-4">Ficha Profesional</h3>
        <div className="flex flex-col md:flex-row gap-5 items-start mb-5">
          {/* Left: Avatar and Upload button */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <div className="relative">
              <Avatar initials={p.initials} color={p.color} size="lg" className="w-16 h-16 text-xl border-[3px] border-surface-card" />
              <div
                className={cn(
                  "absolute bottom-0 right-0 w-5 h-5 rounded-full flex items-center justify-center border border-surface-card bg-brand-orange",
                  !isEditing && "opacity-40 cursor-not-allowed pointer-events-none"
                )}
                aria-disabled={!isEditing || isSaving}
              >
                <Upload size={10} className="text-white"/>
              </div>
            </div>
          </div>

          {/* Middle: Biografía */}
          <div className="flex-1 w-full">
            <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">BIOGRAFÍA</label>
            <textarea
              value={p.bio || ''}
              disabled={!isEditing || isSaving}
              onChange={(e) => handleFieldChange('bio', e.target.value)}
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
              disabled={!isEditing || isSaving}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              placeholder="Ej. garcia@fitnflai.com"
              className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-purple disabled:opacity-75 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">ESPECIALIDAD</label>
            <input
              type="text"
              value={p.especialidad || ''}
              disabled={!isEditing || isSaving}
              onChange={(e) => handleFieldChange('especialidad', e.target.value)}
              placeholder="Ej. Medicina del deporte"
              className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-purple disabled:opacity-75 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">AÑOS DE EXPERIENCIA</label>
            <input
              type="number"
              value={p.experiencia || 0}
              disabled={true}
              placeholder="Ej. 10"
              className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-purple disabled:opacity-75 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">CIUDAD / PAÍS</label>
            <input
              type="text"
              value={p.ciudad || ''}
              disabled={!isEditing || isSaving}
              onChange={(e) => handleFieldChange('ciudad', e.target.value)}
              placeholder="Ej. Medellín, Colombia"
              className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-purple disabled:opacity-75 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">TELÉFONO</label>
            <input
              type="text"
              value={p.tel || ''}
              disabled={!isEditing || isSaving}
              onChange={(e) => handleFieldChange('tel', e.target.value)}
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
                disabled={!isEditing || isSaving}
                onChange={(e) => handleFieldChange('docTipo', e.target.value)}
                placeholder="Ej. Cédula de Ciudadanía, DNI, Pasaporte"
                className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-purple disabled:opacity-75 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">NÚMERO DE DOCUMENTO</label>
              <input
                type="text"
                value={p.docNumero || ''}
                disabled={!isEditing || isSaving}
                onChange={(e) => handleFieldChange('docNumero', e.target.value)}
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
                        onClick={() => toast.show('Visualizando copia...', 'info')}
                      >
                        Ver
                      </Button>
                        <button
                          onClick={() => {
                            if (isEditing) {
                              setP(prev => ({ ...prev, docDelantero: undefined }))
                              toast.show('Parte delantera removida', 'error')
                            }
                          }}
                          className={cn(
                            "p-1 text-brand-red hover:bg-brand-red/10 rounded-lg transition-all bg-transparent border-0",
                            !isEditing && "opacity-40 cursor-not-allowed pointer-events-none"
                          )}
                          title="Eliminar frente"
                          disabled={!isEditing || isSaving}
                        >
                          <Trash2 size={13} />
                        </button>
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
                          setP(prev => ({ ...prev, docDelantero: file.name }))
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
                        onClick={() => toast.show('Visualizando copia...', 'info')}
                      >
                        Ver
                      </Button>
                        <button
                          onClick={() => {
                            if (isEditing) {
                              setP(prev => ({ ...prev, docTrasero: undefined }))
                              toast.show('Parte trasera removida', 'error')
                            }
                          }}
                          className={cn(
                            "p-1 text-brand-red hover:bg-brand-red/10 rounded-lg transition-all bg-transparent border-0",
                            !isEditing && "opacity-40 cursor-not-allowed pointer-events-none"
                          )}
                          title="Eliminar dorso"
                          disabled={!isEditing || isSaving}
                        >
                          <Trash2 size={13} />
                        </button>
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
                          setP(prev => ({ ...prev, docTrasero: file.name }))
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
            <button
              onClick={() => {
                if (isEditing) {
                  setP(prev => ({
                    ...prev,
                    tray: [...(prev.tray || []), { titulo: '', org: '', inicio: '2020', fin: 'Presente', desc: '' }]
                  }))
                  toast.show('Nueva trayectoria añadida', 'success')
                }
              }}
              className={cn(
                "text-[11px] font-semibold text-brand-orange hover:text-brand-orange/80 transition-colors bg-transparent border-0",
                !isEditing && "opacity-40 cursor-not-allowed pointer-events-none"
              )}
              disabled={!isEditing || isSaving}
            >
              + Añadir
            </button>
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
                    disabled={!isEditing || isSaving}
                    onChange={(e) => {
                      const newTray = [...p.tray!]
                      newTray[idx].titulo = e.target.value
                      setP(prev => ({ ...prev, tray: newTray }))
                    }}
                    placeholder="Cargo (ej: Nutricionista)"
                    className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-purple disabled:opacity-75 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="flex-1 w-full">
                  <input
                    type="text"
                    value={t.org || ''}
                    disabled={!isEditing || isSaving}
                    onChange={(e) => {
                      const newTray = [...p.tray!]
                      newTray[idx].org = e.target.value
                      setP(prev => ({ ...prev, tray: newTray }))
                    }}
                    placeholder="Organización (ej: Club Deportivo)"
                    className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-purple disabled:opacity-75 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="w-full md:w-44">
                  <input
                    type="text"
                    value={(t.inicio && t.fin) ? `${t.inicio}-${t.fin}` : (t.inicio || '2020-Presente')}
                    disabled={!isEditing || isSaving}
                    onChange={(e) => {
                      const val = e.target.value
                      const newTray = [...p.tray!]
                      if (val.includes('-')) {
                        const [ini, fin] = val.split('-')
                        newTray[idx].inicio = ini.trim()
                        newTray[idx].fin = fin.trim()
                      } else {
                        newTray[idx].inicio = val
                        newTray[idx].fin = ''
                      }
                      setP(prev => ({ ...prev, tray: newTray }))
                    }}
                    placeholder="Período (ej: 2020-Presente)"
                    className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-purple disabled:opacity-75 disabled:cursor-not-allowed"
                  />
                </div>
                  <button
                    onClick={() => {
                      if (isEditing) {
                        setP(prev => ({ ...prev, tray: prev.tray!.filter((_, i) => i !== idx) }))
                        toast.show('Trayectoria eliminada', 'error')
                      }
                    }}
                    className={cn(
                      "p-2 text-brand-red hover:bg-brand-red/10 rounded-lg transition-all shrink-0 bg-transparent border-0",
                      !isEditing && "opacity-40 cursor-not-allowed pointer-events-none"
                    )}
                    title="Eliminar historial"
                    disabled={!isEditing || isSaving}
                  >
                    <Trash2 size={14} />
                  </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Card: Gestor de Certificados */}
      <div className="card-base p-5 bg-surface-card border border-surface-border rounded-xl">
        <h3 className="text-sm font-bold text-white mb-4">Gestor de Certificados</h3>
        
        {/* Dotted upload zone */}
        <label className={cn("border border-dashed border-surface-border rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.01] transition-all mb-4", (!isEditing || isSaving) && "pointer-events-none opacity-50")}>
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                setP(prev => ({
                  ...prev,
                  certs: [...(prev.certs || []), {
                    nombre: file.name.replace(/\.[^/.]+$/, ""), // remove extension
                    org: 'Subido por el usuario',
                    año: new Date().getFullYear().toString(),
                    venc: 'Sin vencimiento',
                    id: `USR-${Math.floor(1000 + Math.random() * 9000)}`
                  }]
                }))
                toast.show(`Certificado "${file.name}" cargado con éxito`, 'success')
              }
            }}
            disabled={!isEditing || isSaving}
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
                  <button
                    onClick={() => {
                      if (isEditing) {
                        setP(prev => ({ ...prev, certs: prev.certs!.filter((_, i) => i !== idx) }))
                        toast.show('Certificado eliminado', 'error')
                      }
                    }}
                    className={cn(
                      "p-1.5 text-brand-red hover:bg-brand-red/10 rounded-lg transition-all bg-transparent border-0",
                      !isEditing && "opacity-40 cursor-not-allowed pointer-events-none"
                    )}
                    title="Eliminar certificado"
                    disabled={!isEditing || isSaving}
                  >
                    <Trash2 size={14} />
                  </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
