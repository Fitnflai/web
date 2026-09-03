import { useState, useMemo, useEffect, useRef } from 'react'
import { Plus, Trash2, Upload, Edit, Save, Bell, Check, Clock } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppStore } from '@/store/useAppStore'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toast'
import type { Professional } from '@/types'
import { cn } from '@/utils'
import {
  specialistsService,
  SpecialistProfile,
  UpdateSpecialistProfilePayload,
  SpecialistWorkHistory,
  SpecialistCertificate
} from '@/services/endpoints/specialists'



export function PerfilEspecialista() {
  const { setPage } = useAppStore()
  const queryClient = useQueryClient()

  const original: Professional = useMemo(() => ({
    id: 'pro-000',
    nombre: '',
    initials: 'XX',
    color: 'blue',
    email: '',
    tel: '',
    ciudad: '',
    rol: 'Entrenador',
    especialidad: '',
    regPro: '',
    inst: '',
    idiomas: '',
    ingreso: '',
    experiencia: 0,
    linkedin: '',
    web: '',
    wa: '',
    bio: '',
    areas: [],
    pacientes: 0,
    accesoNivel: 'Sin acceso',
    accesoDesc: '',
    ultimoAcceso: '',
    certs: [],
    tray: [],
    pacAsi: [],
    estado: 'Pendiente',
    fecha_fin_suspension: null,
    motivo_suspension: null,
    docTipo: '',
    docNumero: '',
    docDelantero: undefined,
    docTrasero: undefined,
  }), []);

  const [p, setP] = useState<Professional | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const fileInputRefFrente = useRef<HTMLInputElement>(null)
  const fileInputRefDorso = useRef<HTMLInputElement>(null)
  const fileInputRefCert = useRef<HTMLInputElement>(null)

  const { data: specialistProfile, isLoading: isLoadingProfile, isError: isErrorProfile } = useQuery<SpecialistProfile>({ // Use Query
    queryKey: ['specialistProfile'],
    queryFn: specialistsService.getSpecialistProfile,
  })

  useEffect(() => {
    if (specialistProfile) {
      const [ciudad, pais] = specialistProfile.ciudad_pais.split(', ').map(s => s.trim())
      setP({
        ...original,

        initials: specialistProfile.email.substring(0, 2).toUpperCase(),
        color: 'blue',
        bio: specialistProfile.biografia || '',
        email: specialistProfile.email || '',
        especialidad: specialistProfile.especialidad || '',
        experiencia: specialistProfile.anios_experiencia || 0,
        ciudad: specialistProfile.ciudad_pais || '',
        tel: specialistProfile.telefono || '',
        estado: (specialistProfile.estado_cuenta === 'Activo' || specialistProfile.estado_cuenta === 'activo' ? 'Activo' : 'Pendiente') as any,
        docTipo: specialistProfile.tipo_documento || '',
        docNumero: specialistProfile.numero_documento || '',
        docDelantero: specialistProfile.url_doc_frente || undefined,
        docTrasero: specialistProfile.url_doc_dorso || undefined,
        tray: (specialistProfile.historial_laboral || []).map(item => {
          const [inicio, fin = ''] = (item.periodo || '').split('-').map(s => s.trim());
          return { titulo: item.puesto, org: item.empresa, inicio, fin, desc: '' };
        }),
        certs: (specialistProfile.certificados || []).map(cert => ({
          id: cert.id_certificado,
          nombre: cert.nombre,
          org: cert.organizacion_emisora || 'Desconocido',
          año: cert.anio_obtencion || '2026',
          venc: cert.fecha_vencimiento === null ? 'Sin vencimiento' : cert.fecha_vencimiento || 'Sin vencimiento'
        })),

      })
    }
  }, [specialistProfile, original])

  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: (payload: UpdateSpecialistProfilePayload) => specialistsService.updateSpecialistProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialistProfile'] })
      toast.show('Perfil actualizado con éxito', 'success')
      setIsEditing(false)
    },
    onError: (error) => {
      toast.show(`Error al actualizar el perfil: ${error.message}`, 'error')
    },
  })

  const uploadDocMutation = useMutation({
    mutationFn: ({ file, tipo }: { file: File; tipo: 'frente' | 'dorso' }) => specialistsService.uploadSpecialistDocument(file, tipo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialistProfile'] })
      toast.show('Documento cargado con éxito', 'success')
    },
    onError: (error) => {
      toast.show(`Error al cargar documento: ${error.message}`, 'error')
    },
  })

  const deleteDocMutation = useMutation({
    mutationFn: (tipo: 'frente' | 'dorso') => specialistsService.deleteSpecialistDocument(tipo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialistProfile'] })
      toast.show('Documento eliminado con éxito', 'success')
    },
    onError: (error) => {
      toast.show(`Error al eliminar documento: ${error.message}`, 'error')
    },
  })

  const uploadCertMutation = useMutation({
    mutationFn: (file: File) => specialistsService.uploadSpecialistCertificate(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialistProfile'] })
      toast.show('Certificado cargado con éxito', 'success')
    },
    onError: (error) => {
      toast.show(`Error al cargar certificado: ${error.message}`, 'error')
    },
  })

  const deleteCertMutation = useMutation({
    mutationFn: (certificado_id: string) => specialistsService.deleteSpecialistCertificate(certificado_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialistProfile'] })
      toast.show('Certificado eliminado con éxito', 'success')
    },
    onError: (error) => {
      toast.show(`Error al eliminar certificado: ${error.message}`, 'error')
    },
  })

  const isSaving = updateProfileMutation.isPending || uploadDocMutation.isPending || deleteDocMutation.isPending || uploadCertMutation.isPending || deleteCertMutation.isPending

  if (isLoadingProfile || !p) {
    return (
      <div className="flex items-center justify-center h-full text-white">
        <Clock size={24} className="animate-spin mr-2" />
        Cargando perfil...
      </div>
    )
  }

  const handleFieldChange = (field: keyof Professional, val: any) => {
    setP(prev => {
      if (!prev) return null;
      return { ...prev, [field]: val };
    })
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
              // Prepare payload for updateProfileMutation
              if (!p) return
              const [ciudad_only, pais_only] = p.ciudad.split(', ').map(s => s.trim())
              const payload: UpdateSpecialistProfilePayload = {
                email: p.email || '',
                biografia: p.bio || '',
                especialidad: p.especialidad || '',
                anios_experiencia: p.experiencia || 0,
                ciudad: ciudad_only,
                pais: pais_only,
                telefono_contacto: p.tel || '',
                tipo_documento: p.docTipo || '',
                numero_documento: p.docNumero || '',
                historial_laboral: (p.tray || []).map(item => ({
                  puesto: item.titulo || '',
                  empresa: item.org || '',
                  periodo: item.fin === 'Presente' ? `${item.inicio}-Presente` : `${item.inicio}-${item.fin}`,
                })),
              }
              updateProfileMutation.mutate(payload)
            } else {
              setIsEditing(true)
            }
          }}
          disabled={isSaving || isLoadingProfile || updateProfileMutation.isPending}        >
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
                <input
                  type="file"
                  ref={fileInputRefFrente} // Using ref for triggering click programmatically if needed for avatar upload
                  style={{ display: 'none' }} // Hide the input
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      // Assuming avatar upload would use a similar mutation. For now, it's just a placeholder.
                      // This part needs to be connected to a specific avatar upload endpoint when available.
                      toast.show(`Avatar file selected: ${file.name}`, 'info')
                    }
                  }}
                />
                <div
                  className={cn(
                    "absolute bottom-0 right-0 w-5 h-5 rounded-full flex items-center justify-center border border-surface-card bg-brand-orange",
                    !isEditing && "opacity-40 cursor-not-allowed pointer-events-none"
                  )}
                  aria-disabled={!isEditing || isSaving}
                  onClick={() => {
                    if (isEditing && fileInputRefFrente.current) {
                      fileInputRefFrente.current.click() // Trigger hidden file input
                    }
                  }}
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
                disabled={!isEditing || isSaving || updateProfileMutation.isPending}
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
                        <div className="text-[11px] font-semibold text-white truncate max-w-[100px]" title={p.docDelantero}>{(p.docDelantero.split('/').pop() || 'documento.pdf')}</div>
                        <div className="text-[9px] text-brand-green font-medium">Verificado</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="px-1.5 h-7 text-[10px]"
                        onClick={() => window.open(p.docDelantero, '_blank')}
                      >
                        Ver
                      </Button>
                        <button
                          onClick={() => deleteDocMutation.mutate('frente')}
                          className={cn(
                            "p-1 text-brand-red hover:bg-brand-red/10 rounded-lg transition-all bg-transparent border-0",
                            (!isEditing || isSaving || deleteDocMutation.isPending) && "opacity-40 cursor-not-allowed pointer-events-none"
                          )}
                          title="Eliminar frente"
                          disabled={!isEditing || isSaving || deleteDocMutation.isPending}
                        >
                          <Trash2 size={13} />
                        </button>
                    </div>
                  </div>
                ) : (
                  <label className={cn("border border-dashed border-surface-border rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.01] transition-all h-[68px]", (!isEditing || isSaving || uploadDocMutation.isPending) && "pointer-events-none opacity-50")}>
                    <input
                      type="file"
                      className="hidden"
                      ref={fileInputRefFrente}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          uploadDocMutation.mutate({ file, tipo: 'frente' })
                          e.target.value = '' // Clear the input
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
                        <div className="text-[11px] font-semibold text-white truncate max-w-[100px]" title={p.docTrasero}>{(p.docTrasero.split('/').pop() || 'documento.pdf')}</div>
                        <div className="text-[9px] text-brand-green font-medium">Verificado</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="px-1.5 h-7 text-[10px]"
                        onClick={() => window.open(p.docTrasero, '_blank')}
                      >
                        Ver
                      </Button>
                        <button
                          onClick={() => deleteDocMutation.mutate('dorso')}
                          className={cn(
                            "p-1 text-brand-red hover:bg-brand-red/10 rounded-lg transition-all bg-transparent border-0",
                            (!isEditing || isSaving || deleteDocMutation.isPending) && "opacity-40 cursor-not-allowed pointer-events-none"
                          )}
                          title="Eliminar dorso"
                          disabled={!isEditing || isSaving || deleteDocMutation.isPending}
                        >
                          <Trash2 size={13} />
                        </button>
                    </div>
                  </div>
                ) : (
                  <label className={cn("border border-dashed border-surface-border rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.01] transition-all h-[68px]", (!isEditing || isSaving || uploadDocMutation.isPending) && "pointer-events-none opacity-50")}>
                    <input
                      type="file"
                      className="hidden"
                      ref={fileInputRefDorso}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          uploadDocMutation.mutate({ file, tipo: 'dorso' })
                          e.target.value = '' // Clear the input
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
                  setP(prev => {
                    if (!prev) return null;
                    return {
                      ...prev,
                      tray: [...(prev.tray || []), { titulo: '', org: '', inicio: '', fin: '', desc: '' }]
                    };
                  })
                }
              }}
              className={cn(
                "text-[11px] font-semibold text-brand-orange hover:text-brand-orange/80 transition-colors bg-transparent border-0",
                (!isEditing || isSaving || updateProfileMutation.isPending) && "opacity-40 cursor-not-allowed pointer-events-none"
              )}
              disabled={!isEditing || isSaving || updateProfileMutation.isPending}
            >
              + Añadir
            </button>
        </div>
        
        {(!p?.tray || p.tray.length === 0) ? (
          <div className="text-center py-6 text-surface-muted text-[12px]">Sin historial laboral registrado.</div>
        ) : (
          <div className="space-y-3">
            {(p.tray || []).map((t, idx) => (
              <div key={idx} className="flex flex-col md:flex-row gap-3 items-center w-full">
                <div className="flex-1 w-full">
                  <input
                    type="text"
                    value={t.titulo || ''}
                    disabled={!isEditing || isSaving || updateProfileMutation.isPending}
                    onChange={(e) => {
                      const newTray = [...(p?.tray || [])]
                      newTray[idx] = { ...newTray[idx], titulo: e.target.value }
                      setP(prev => {
                        if (!prev) return null;
                        return { ...prev, tray: newTray };
                      })
                    }}
                    placeholder="Cargo (ej: Nutricionista)"
                    className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-purple disabled:opacity-75 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="flex-1 w-full">
                  <input
                    type="text"
                    value={t.org || ''}
                    disabled={!isEditing || isSaving || updateProfileMutation.isPending}
                    onChange={(e) => {
                      const newTray = [...(p?.tray || [])]
                      newTray[idx] = { ...newTray[idx], org: e.target.value }
                      setP(prev => {
                        if (!prev) return null;
                        return { ...prev, tray: newTray };
                      })
                    }}
                    placeholder="Organización (ej: Club Deportivo)"
                    className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-purple disabled:opacity-75 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="w-full md:w-44">
                  <input
                    type="text"
                    value={(t.inicio && t.fin) ? `${t.inicio}-${t.fin}` : t.inicio}
                    disabled={!isEditing || isSaving || updateProfileMutation.isPending}
                    onChange={(e) => {
                      const val = e.target.value
                      const newTray = [...(p?.tray || [])]
                      if (val.includes('-')) {
                        const [ini, fin] = val.split('-')
                        newTray[idx] = { ...newTray[idx], inicio: ini.trim(), fin: fin.trim() }
                      } else {
                        newTray[idx] = { ...newTray[idx], inicio: val, fin: '' }
                      }
                      setP(prev => {
                        if (!prev) return null;
                        return { ...prev, tray: newTray };
                      })
                    }}
                    placeholder="Período (ej: 2020-Presente)"
                    className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-purple disabled:opacity-75 disabled:cursor-not-allowed"
                  />
                </div>
                  <button
                    onClick={() => {
                      if (isEditing) {
                        setP(prev => {
                          if (!prev) return null;
                          return { ...prev, tray: (prev.tray || []).filter((_, i) => i !== idx) };
                        })
                      }
                    }}
                    className={cn(
                      "p-2 text-brand-red hover:bg-brand-red/10 rounded-lg transition-all shrink-0 bg-transparent border-0",
                      (!isEditing || isSaving || updateProfileMutation.isPending) && "opacity-40 cursor-not-allowed pointer-events-none"
                    )}
                    title="Eliminar historial"
                    disabled={!isEditing || isSaving || updateProfileMutation.isPending}
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
        <label className={cn("border border-dashed border-surface-border rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.01] transition-all mb-4", (!isEditing || isSaving || uploadCertMutation.isPending) && "pointer-events-none opacity-50")}>
          <input
            type="file"
            className="hidden"
            ref={fileInputRefCert}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                uploadCertMutation.mutate(file)
                e.target.value = '' // Clear the input
              }
            }}
            disabled={!isEditing || isSaving || uploadCertMutation.isPending}
          />
          <Upload size={24} className="text-surface-muted mb-2" />
          <span className="text-[12px] text-surface-muted">Arrastra aquí tus diplomas o licencias (PDF/JPG) o haz clic para seleccionar</span>
        </label>

        {/* Certs list */}
        {(!p?.certs || p.certs.length === 0) ? (
          <div className="text-center py-4 text-surface-muted text-[12px]">Sin certificados cargados.</div>
        ) : (
          <div className="space-y-2">
            {(p.certs || []).map((c) => (
              <div key={c.id} className="flex items-center justify-between py-2 border-b border-surface-border last:border-0">
                <span className="text-[12px] text-white">{c.nombre}</span>
                  <button
                    onClick={() => deleteCertMutation.mutate(c.id)}
                    className={cn(
                      "p-1.5 text-brand-red hover:bg-brand-red/10 rounded-lg transition-all bg-transparent border-0",
                      (!isEditing || isSaving || deleteCertMutation.isPending) && "opacity-40 cursor-not-allowed pointer-events-none"
                    )}
                    title="Eliminar certificado"
                    disabled={!isEditing || isSaving || deleteCertMutation.isPending}
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
