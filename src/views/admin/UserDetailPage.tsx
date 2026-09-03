import { useState, useMemo, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Calendar, MessageSquare, Bell, Edit, Ban, Upload, Trash2 } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Toggle } from '@/components/ui/Toggle'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { toast } from '@/components/ui/Toast'
import { useAppStore } from '@/store/useAppStore'
import { usersService } from '@/services/endpoints/users'
import { ProgressTab } from '@/components/patient/ProgressTab'
import { ClinicalReportTab } from '@/components/patient/ClinicalReportTab'
import { SpecialistNutritionTab } from '../specialist/UserDetailPage'

import { PLAN_NAMES, PLAN_MONTOS, DAYS_ES } from '@/constants'
const TODAY = '2026-06-06'
import { formatDate, getPlanState, STATE_LABEL, typeColor } from '@/utils'
import { cn } from '@/utils'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import type { Workout, PlanItem, WorkoutExercise, User, Patient, TrajectoryItem } from '@/types'
import type { StatusPayload, SportsEventPayload, SportsEventResponse } from '@/services/endpoints/users'

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

type Tab = 'perfil' | 'plan' | 'nutricion' | 'progreso' | 'reporte-clinico' | 'dispositivos'

function DisciplineAutocomplete({
  value,
  onChange,
  onSelect,
  disabled,
}: {
  value: string;
  onChange: (val: string) => void;
  onSelect: (id: string, name: string) => void;
  disabled: boolean;
}) {
  const [disciplineQuery, setDisciplineQuery] = useState(value);
  const [disciplineOptions, setDisciplineOptions] = useState<any[]>([]);
  const [showDisciplineOptions, setShowDisciplineOptions] = useState(false);

  useEffect(() => {
    setDisciplineQuery(value || '');
  }, [value]);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (query: string) => {
        if (query.length > 1) {
          try {
            // Assuming usersService.searchDisciplines exists and returns an array of { id, name }
            const response = await usersService.searchDisciplines(query);
            setDisciplineOptions(response || []);
            setShowDisciplineOptions(true);
          } catch (error) {
            console.error('Error searching disciplines:', error);
            setDisciplineOptions([]);
          }
        } else {
          setDisciplineOptions([]);
          setShowDisciplineOptions(false);
        }
      }, 300),
    []
  );

  useEffect(() => {
    if (disciplineQuery !== value) {
      onChange(disciplineQuery);
      debouncedSearch(disciplineQuery);
    }
    // Cleanup debounce on unmount
    return () => {
      debouncedSearch.cancel();
    };
  }, [disciplineQuery, value, onChange, debouncedSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisciplineQuery(e.target.value);
    if (!e.target.value) {
      setShowDisciplineOptions(false);
      onSelect('', ''); // Clear selected discipline
    }
  };

  const handleSelectOption = (option: { id_disciplina: string; nombre_disciplina: string }) => {
    setDisciplineQuery(option.nombre_disciplina);
    onSelect(option.id_disciplina, option.nombre_disciplina);
    setShowDisciplineOptions(false);
  };

  if (disabled) {
    return (
      <input
        type="text"
        value={value}
        disabled={true}
        className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
      />
    );
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={disciplineQuery}
        onChange={handleInputChange}
        onFocus={() => setShowDisciplineOptions(disciplineOptions.length > 0)}
        onBlur={() => setTimeout(() => setShowDisciplineOptions(false), 100)} // Delay to allow click on options
        placeholder="Buscar disciplina..."
        className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange"
      />
      {showDisciplineOptions && disciplineOptions.length > 0 && (
        <ul className="absolute z-10 w-full bg-surface-card border border-surface-border rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
          {disciplineOptions.map((option) => (
            <li
              key={option.id_disciplina}
              onMouseDown={() => handleSelectOption(option)} // Use onMouseDown to trigger before onBlur
              className="px-3 py-2 text-[12px] cursor-pointer hover:bg-surface-card2"
            >
              {option.nombre_disciplina}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function debounce<T extends (...args: any[]) => any>(func: T, delay: number): T & { cancel: () => void } {
  let timeout: ReturnType<typeof setTimeout>;

  const debounced = ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  }) as T & { cancel: () => void };

  debounced.cancel = () => {
    clearTimeout(timeout);
  };

  return debounced;
}



function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="frow">
      <span className="fkey">{label}</span>
      <span className="text-right text-[12px]">{children}</span>
    </div>
  )
}

function ChipList({ items }: { items: string[] }) {
  if (!items.length) return <span className="text-[11px] text-surface-muted">—</span>
  return (
    <div className="flex gap-1 flex-wrap">
      {items.map((item) => (
        <span key={item} className="inline-flex px-2 py-0.5 rounded-xl text-[10px] bg-surface-card2 border border-surface-border">{item}</span>
      ))}
    </div>
  )
}

const renderChipItem = (item: any): string => {
  if (item && typeof item === 'object') {
    if ('nombre_equipo' in item) return item.nombre_equipo;
    if ('nombre_lesion' in item) return item.nombre_lesion;
    if ('detalle' in item) return item.detalle;
    // Fallback: look for keys containing 'nombre', 'detalle', 'desc', 'label'
    const keys = Object.keys(item);
    const nameKey = keys.find(k => k.includes('nombre') || k.includes('detalle') || k.includes('desc') || k.includes('label'));
    if (nameKey) return item[nameKey];
    // Secondary fallback: first string value in object
    const firstStr = Object.values(item).find(v => typeof v === 'string');
    if (firstStr) return firstStr as string;
  }
  return String(item);
};

function EditableChipList({
  title,
  items,
  isEditing,
  onAdd,
  onRemove,
  placeholder
}: {
  title: string
  items: any[]
  isEditing: boolean
  onAdd: (val: string) => void
  onRemove: (idx: number) => void
  placeholder: string
}) {
  const [newVal, setNewVal] = useState('')

  return (
    <div className="bg-surface-card border border-surface-border rounded-xl p-4">
      <div className="text-[12px] font-semibold text-white mb-2.5">{title}</div>
      <div className="flex gap-1.5 flex-wrap mb-3 min-h-[26px]">
        {(!items || items.length === 0) ? (
          <span className="text-[11px] text-surface-muted">Ninguno registrado</span>
        ) : (
          items.map((item, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] bg-surface-card2 border border-surface-border text-white font-medium"
            >
              {renderChipItem(item)}
              {isEditing && (
                <button
                  type="button"
                  onClick={() => onRemove(idx)}
                  className="text-brand-red hover:text-brand-red/80 font-bold text-[10px] bg-transparent border-0 cursor-pointer p-0"
                >
                  ✕
                </button>
              )}
            </span>
          ))
        )}
      </div>
      {isEditing && (
        <div className="flex gap-1.5 mt-2">
          <input
            type="text"
            placeholder={placeholder}
            value={newVal}
            onChange={(e) => setNewVal(e.target.value)}
            className="form-input flex-1 px-3 py-1.5 text-[11px] outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newVal.trim() !== '') {
                onAdd(newVal.trim())
                setNewVal('')
              }
            }}
          />
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              if (newVal.trim() !== '') {
                onAdd(newVal.trim())
                setNewVal('')
              }
            }}
            className="px-3"
          >
            +
          </Button>
        </div>
      )}
    </div>
  )
}

export function UserDetailPage() {
  const { selectedUser: u, detailOrigin, setPage, setSelectedUser, setSelectedPatient } = useAppStore()
  const [tab, setTab] = useState<Tab>('perfil')
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<User | null>(null)
  const [isSuspensionModalOpen, setIsSuspensionModalOpen] = useState(false)
  const [suspensionReason, setSuspensionReason] = useState('')
  const [suspensionEndDate, setSuspensionEndDate] = useState('2026-07-06') // Default date

  // Local state to track updates and force renders
  const [updateTick, setUpdateTick] = useState(0)
  const triggerUpdate = () => setUpdateTick(t => t + 1)

  const assignDisciplineMutation = useMutation({
    mutationFn: (id_disciplina: string) => usersService.assignDiscipline(u!.id_usuario, { id_disciplina }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userTabDetalle', u!.id_usuario] });
      queryClient.invalidateQueries({ queryKey: ['userHeaderDetalle', u!.id_usuario] });
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardList'] });
      toast.show('Disciplina asignada con éxito', 'success');
    },
    onError: (error) => {
      toast.show(`Error al asignar disciplina: ${error.message}`, 'error');
    }
  });

  // useEffect to manage editForm state
  useEffect(() => {
    if (isEditing && u) {
      setEditForm(deepClone(u))
    } else {
      setEditForm(null)
      setSuspensionReason('')
      setSuspensionEndDate('2026-07-06')
    }
  }, [isEditing, u])


  if (!u) { setPage('usuarios'); return null }

  // Define currentUser based on edit mode (guaranteed to be non-null after if (!u) check)
  const currentUser = isEditing && editForm ? editForm : u;

  // Normalize ID (the real backend list uses 'id' but detail expects 'id_usuario')
  if (!u.id_usuario && (u as any).id) {
    u.id_usuario = (u as any).id
  }

    const displayEstado = typeof currentUser.estado === 'string' ? currentUser.estado : (currentUser.registro_activo ? 'Activo' : 'Inactivo')

  const isPac = detailOrigin === 'pacientes'

  // Query real-time user detail based on active tab
  const { data: tabData, isLoading: isTabLoading } = useQuery({
    queryKey: ['userTabDetalle', u?.id_usuario, tab],
    queryFn: () => usersService.getUserTabDetalle(u!.id_usuario, tab),
    enabled: !!u?.id_usuario && (tab === 'perfil' || tab === 'dispositivos'),
  })

  // Synchronize and adapt real-time profile fields seamlessly into the active user reference
  useMemo(() => {
    if (u && tabData) {
      if (!isEditing) {
        Object.assign(u, tabData)
        if (tabData.disciplina) {
          u.nombre_disciplina = typeof tabData.disciplina === 'object' ? tabData.disciplina.disciplina : tabData.disciplina
        }
        if (tabData.duracion_objetivo) u.duracion_semanas_objetivo = tabData.duracion_objetivo
        if (tabData.proximo_evento?.fecha) u.proxima_competencia = tabData.proximo_evento.fecha
      }
    }
  }, [u, tabData, isEditing])

  // Query real-time user header detail
  const { data: headerData, isLoading: isHeaderLoading } = useQuery({
    queryKey: ['userHeaderDetalle', u?.id_usuario],
    queryFn: () => usersService.getUserHeaderDetalle(u!.id_usuario),
    enabled: !!u?.id_usuario,
  })

  // Synchronize and adapt real-time header fields seamlessly into the active user reference
  useMemo(() => {
    if (u && headerData) {
      if (!isEditing) {
        Object.assign(u, headerData)
        if (headerData.disciplina) {
          u.nombre_disciplina = typeof headerData.disciplina === 'object' ? headerData.disciplina.disciplina : headerData.disciplina
        }
        if (headerData.nivel_motor !== undefined) u.nivel_motor_actual = headerData.nivel_motor
        
        // Parse weight "155.00 Lb" -> weight number + unit
        if (headerData.peso) {
          const parts = headerData.peso.split(' ')
          u.peso = parseFloat(parts[0]) || u.peso
          if (parts[1]) u.unidad_peso = parts[1]
        }
        
        // Parse height "175.00 Cm" -> height number + unit
        if (headerData.altura) {
          const parts = headerData.altura.split(' ')
          u.altura = parseFloat(parts[0]) || u.altura
          if (parts[1]) u.unidad_altura = parts[1]
        }

        // Map membresia
        if (headerData.membresia) {
          u.nombre_plan_activo = headerData.membresia
          const idx = PLAN_NAMES.indexOf(headerData.membresia)
          if (idx !== -1) {
            u.plan_idx = idx
          } else if (headerData.membresia === 'Sin membresía') {
            u.plan_idx = 0
          }
        }
      }
    }
  }, [u, headerData, isEditing])
  const queryClient = useQueryClient();

  const updateUserProfileMutation = useMutation({
    mutationFn: (data: User) => usersService.updateUserProfile(u!.id_usuario, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userTabDetalle', u!.id_usuario] });
      queryClient.invalidateQueries({ queryKey: ['userHeaderDetalle', u!.id_usuario] });
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardList'] });
      
      if (editForm) {
        setSelectedUser({ ...u, ...editForm });
        if (isPac) {
          setSelectedPatient({ ...u, ...editForm } as Patient);
        }
      }
      setIsEditing(false);
      toast.show('Cambios guardados con éxito', 'success');
    },
    onError: (error) => {
      toast.show(`Error al guardar cambios: ${error.message}`, 'error');
    },
  });

  const updateUserStatusMutation = useMutation({
    mutationFn: ({ userId, statusPayload }: { userId: string, statusPayload: StatusPayload }) =>
      usersService.updateUserStatus(userId, statusPayload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userTabDetalle'] });
      queryClient.invalidateQueries({ queryKey: ['userHeaderDetalle'] });
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardList'] });
      setIsSuspensionModalOpen(false); // Close modal on success
      toast.show('Estado de usuario actualizado con éxito', 'success');
    },
    onError: (error) => {
      toast.show(`Error al actualizar estado: ${error.message}`, 'error');
    },
  });

  const registerInjuryMutation = useMutation({
    mutationFn: (newInjury: { zona_afectada: string, descripcion_molestia: string }) =>
      usersService.registerInjury(u!.id_usuario, newInjury),
    onSuccess: (returnedInjury) => {
      if (editForm) {
        setEditForm((prevEditForm) => ({
          ...prevEditForm!,
          historial_lesiones: [...(prevEditForm!.historial_lesiones || []), returnedInjury],
        }));
      }
      queryClient.invalidateQueries({ queryKey: ['userTabDetalle', u!.id_usuario] });
      queryClient.invalidateQueries({ queryKey: ['userHeaderDetalle', u!.id_usuario] });
      toast.show('Lesión registrada con éxito', 'success');
      triggerUpdate();
    },
    onError: (error) => {
      toast.show(`Error al registrar lesión: ${error.message}`, 'error');
    },
  });

  const removeInjuryMutation = useMutation({
    mutationFn: (id_lesion_usuario: string) =>
      usersService.removeInjury(u!.id_usuario, id_lesion_usuario),
    onSuccess: (_, id_lesion_usuario) => {
      if (editForm) {
        setEditForm((prevEditForm) => ({
          ...prevEditForm!,
          historial_lesiones: prevEditForm!.historial_lesiones.filter(
            (injury: any) => injury.id_lesion_usuario !== id_lesion_usuario
          ),
        }));
      }
      queryClient.invalidateQueries({ queryKey: ['userTabDetalle', u!.id_usuario] });
      queryClient.invalidateQueries({ queryKey: ['userHeaderDetalle', u!.id_usuario] });
      toast.show('Lesión eliminada con éxito', 'success');
      triggerUpdate();
    },
    onError: (error) => {
      toast.show(`Error al eliminar lesión: ${error.message}`, 'error');
    },
  });

  const registerSportsEventMutation = useMutation({
    mutationFn: (payload: SportsEventPayload) => {
      if (!u) {
        throw new Error("User is undefined for registering sports event.");
      }
      return usersService.registerSportsEvent(u.id_usuario, payload);
    },
    onSuccess: (returnedEvent, variables) => {
      if (editForm && u) {
        setEditForm((prevEditForm) => {
          const newTrajectoryItem: TrajectoryItem = {
            titulo: variables.nombre,
            org: variables.lugar,
            inicio: variables.fecha.substring(0, 4), // Extract year from fecha
            fin: '', // 'fin' is not in SportsEventPayload, assuming empty
            desc: '', // 'desc' is not in SportsEventPayload, assuming empty
            id_evento: returnedEvent.id_evento,
          };
          return {
            ...prevEditForm!,
            tray: [...(prevEditForm!.tray || []), newTrajectoryItem],
          };
        });
        queryClient.invalidateQueries({ queryKey: ['userTabDetalle', u.id_usuario] });
        queryClient.invalidateQueries({ queryKey: ['userHeaderDetalle', u.id_usuario] });
        toast.show('Logro registrado con éxito', 'success');
        triggerUpdate();
      }
    },
    onError: (error) => {
      toast.show(`Error al registrar logro: ${error.message}`, 'error');
    },
  });

  const removeSportsEventMutation = useMutation({
    mutationFn: (id_evento: string) => {
      if (!u) {
        throw new Error("User is undefined for removing sports event.");
      }
      return usersService.removeSportsEvent(u.id_usuario, id_evento);
    },
    onSuccess: (_, id_evento) => {
      if (editForm && u) {
        setEditForm((prevEditForm) => ({
          ...prevEditForm!,
          tray: (prevEditForm!.tray || []).filter((event: any) => event.id_evento !== id_evento),
        }));
        queryClient.invalidateQueries({ queryKey: ['userTabDetalle', u!.id_usuario] }); // Assert non-null
        queryClient.invalidateQueries({ queryKey: ['userHeaderDetalle', u!.id_usuario] }); // Assert non-null
        toast.show('Logro eliminado con éxito', 'success');
        triggerUpdate();
      }

      triggerUpdate();
    },
    onError: (error) => {
      toast.show(`Error al eliminar logro: ${error.message}`, 'error');
    },
  });

  const backPage = isPac ? 'pacientes' : 'usuarios'
  const backLabel = isPac ? 'Pacientes' : 'Usuarios'

  const tabs: { id: Tab; label: string }[] = [
    { id: 'perfil',        label: 'Perfil' },
    { id: 'plan',          label: 'Plan' },
    { id: 'nutricion',     label: 'Nutrición' },
    { id: 'progreso',      label: 'Progreso' },
    { id: 'reporte-clinico', label: 'Reporte Clínico' },
    { id: 'dispositivos',  label: 'Dispositivos' },
  ]

  return (
    <div>
      {/* Breadcrumb */}
      <button onClick={() => setPage(backPage)} className="flex items-center gap-1.5 text-[12px] text-surface-muted hover:text-brand-orange mb-4 cursor-pointer bg-transparent border-0">
        <ChevronLeft size={14} />{backLabel}
      </button>

      {/* Hero */}
      <div className="card-base flex items-start gap-4 mb-5 flex-wrap">
        <div className="relative">
          <Avatar initials={currentUser.initials} color={isPac ? '#9B59B6' : currentUser.color} size="lg" />
          <div className={`absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-surface-card ${currentUser.registro_activo ? 'bg-brand-green' : 'bg-brand-red'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[17px] font-bold">{currentUser.apodo}</span>
            {currentUser.plan_idx > 0 ? (
              <Badge variant="yellow">👑 {PLAN_NAMES[currentUser.plan_idx]}</Badge>
            ) : (currentUser.nombre_plan_activo && currentUser.nombre_plan_activo !== 'Sin membresía' && currentUser.nombre_plan_activo !== 'Essential' ? (
              <Badge variant="yellow">👑 {currentUser.nombre_plan_activo}</Badge>
            ) : (
              <Badge variant="muted">Essential</Badge>
            ))}
            <Badge variant={
              displayEstado === 'Suspendido Temporalmente' ? 'orange' :
              displayEstado === 'Suspendido Permanentemente' ? 'red' :
              (displayEstado === 'Activo' ? 'green' : 'red')
            }>
              {displayEstado}
            </Badge>
            {isPac && <Badge variant="purple">🩺 Paciente</Badge>}
          </div>
          <div className="text-[11px] text-surface-muted">{currentUser.nombre_disciplina} · {currentUser.ciudad} · Nivel motor {currentUser.nivel_motor_actual}</div>
          <div className="flex gap-4 mt-3 flex-wrap">
            {[['Nombre',currentUser.nombre],['Edad',`${currentUser.edad} años`],['Peso',`${currentUser.peso}${currentUser.unidad_peso}`],['Altura',`${currentUser.altura}${currentUser.unidad_altura}`],['Clasificación',currentUser.clasificacion_visible_actual]].map(([l,v]) => (
              <div key={l}><div className="text-[10px] text-surface-muted">{l}</div><div className="font-semibold text-[12px]">{v}</div></div>
            ))}
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
                onClick={async () => {
                  if (editForm && u) {
                    try {
                      // 1. Filter new achievements (those without id_evento)
                      const newAchievements = editForm.tray?.filter((event) => !event.id_evento) || [];
                      const existingAchievements = editForm.tray?.filter((event) => event.id_evento) || [];

                      // 2. Register new achievements in parallel
                      const registeredAchievements = await Promise.all(
                        newAchievements.map(async (event) => {
                          const payload = {
                            nombre: event.titulo,
                            lugar: event.org,
                            fecha: (event.inicio || "2026") + "-06-06"
                          };
                          // Call the service directly, not the mutation, to get the return value for mapping
                          const response = await usersService.registerSportsEvent(u.id_usuario, payload);
                          return { ...event, id_evento: response.id_evento }; // Map back to TrajectoryItem with ID
                        })
                      );

                      // 3. Map returned response events (with IDs) back into editForm.tray
                      const finalTray = [...existingAchievements, ...registeredAchievements];

                      // 4. Prepare finalEditForm (cloning to avoid direct state mutation issues)
                      const finalEditForm = { ...editForm, tray: finalTray };

                      // 5. Call updateUserProfile
                      const updatedUser = await usersService.updateUserProfile(u.id_usuario, finalEditForm);

                      // 6. Upon final success, invalidate query caches, dispatch Zustand actions, close edit mode, and show success toast.
        queryClient.invalidateQueries({ queryKey: ['userTabDetalle', u!.id_usuario] });
        queryClient.invalidateQueries({ queryKey: ['userHeaderDetalle', u!.id_usuario] });
                      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
                      queryClient.invalidateQueries({ queryKey: ['adminDashboardList'] });
                      setSelectedUser(updatedUser);
                      if (isPac) {
                        setSelectedPatient(updatedUser as Patient);
                      }
                      setIsEditing(false);
                      toast.show('Cambios guardados con éxito', 'success');
                    } catch (error: any) {
                      toast.show(`Error al guardar cambios: ${error.message}`, 'error');
                    }
                  }
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
              
              {displayEstado.includes('Suspendido') ? (
                <Button
                  variant="primary"
                  style={{ background: '#4CAF82', borderColor: '#4CAF82' }}
                  onClick={() => {
                    updateUserStatusMutation.mutate({ userId: u.id_usuario, statusPayload: { estado: 'activo' } });
                  }}
                >
                  🟢 Reactivar Usuario
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="text-brand-orange hover:bg-brand-orange/10 border border-brand-orange/20"
                    onClick={() => {
                      setIsSuspensionModalOpen(true);
                    }}
                  >
                    🟡 Suspender Temporalmente
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      updateUserStatusMutation.mutate({ userId: u.id_usuario, statusPayload: { estado: 'suspendido_permanente', motivo_suspencion: 'Suspensión permanente' } });
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

      {/* Tabs */}
      <div className="flex gap-0.5 border-b border-surface-border mb-5 overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={cn('px-3.5 py-2 text-[12px] cursor-pointer border-0 bg-transparent whitespace-nowrap transition-all', 'border-b-2 -mb-px', tab === t.id ? 'text-brand-orange border-brand-orange font-medium' : 'text-surface-muted border-transparent hover:text-white')}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'perfil' && (
        <div className="space-y-5">
          {/* Card 1: Ficha de Usuario */}
          <div className="card-base p-5 bg-surface-card border border-surface-border rounded-xl">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <span>Ficha de Usuario</span>
              {isTabLoading && (
                <span className="text-[10px] text-brand-orange animate-pulse font-semibold">
                  (Sincronizando con el servidor...)
                </span>
              )}
            </h3>
            <div className="flex flex-col md:flex-row gap-5 items-start mb-5">
              {/* Left: Avatar and Upload button */}
              <div className="flex flex-col items-center justify-center shrink-0">
                <div className="relative">
                  <Avatar initials={currentUser.initials} color={isPac ? '#9B59B6' : currentUser.color} size="lg" className="w-16 h-16 text-xl border-[3px] border-surface-card" />
                  {isEditing && (
                    <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer border border-surface-card bg-brand-orange">
                      <span className="text-[10px] text-white">⬆</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Middle: Objetivo Principal */}
              <div className="flex-1 w-full">
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">OBJETIVO PRINCIPAL</label>
                <textarea
                  value={currentUser.objetivo_principal || ''}
                  disabled={!isEditing}
                  onChange={(e) => {
                    if (editForm) setEditForm({ ...editForm, objetivo_principal: e.target.value });
                    triggerUpdate()
                  }}
                  placeholder="Escribe el objetivo principal del deportista..."
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange min-h-[80px] resize-y disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Grid of details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border-t border-surface-border pt-4">
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">NOMBRE COMPLETO</label>
                <input
                  type="text"
                  value={currentUser.nombre || ''}
                  disabled={!isEditing}
                  onChange={(e) => {
                    if (editForm) setEditForm({ ...editForm, nombre: e.target.value });
                    triggerUpdate()
                  }}
                  placeholder="Ej. Falcao García"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">EMAIL</label>
                <input
                  type="email"
                  value={currentUser.email || ''}
                  disabled={!isEditing}
                  onChange={(e) => {
                    if (editForm) setEditForm({ ...editForm, email: e.target.value });
                    triggerUpdate()
                  }}
                  placeholder="Ej. usuario@email.com"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">APODO</label>
                <input
                  type="text"
                  value={currentUser.apodo || ''}
                  disabled={!isEditing}
                  onChange={(e) => {
                    if (editForm) setEditForm({ ...editForm, apodo: e.target.value });
                    triggerUpdate()
                  }}
                  placeholder="Ej. falcao"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">GÉNERO</label>
                <input
                  type="text"
                  value={currentUser.genero || ''}
                  disabled={!isEditing}
                  onChange={(e) => {
                    if (editForm) setEditForm({ ...editForm, genero: e.target.value });
                    triggerUpdate()
                  }}
                  placeholder="Ej. Masculino, Femenino"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">FECHA DE NACIMIENTO</label>
                <input
                  type="text"
                  value={currentUser.fecha_nacimiento ? currentUser.fecha_nacimiento.substring(0, 10) : '1990-01-01'}
                  disabled={!isEditing}
                  onChange={(e) => {
                    if (editForm) setEditForm({ ...editForm, fecha_nacimiento: e.target.value });
                    triggerUpdate()
                  }}
                  placeholder="AAAA-MM-DD"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">EDAD</label>
                <input
                  type="number"
                  value={currentUser.edad || 0}
                  disabled={!isEditing}
                  onChange={(e) => {
                    if (editForm) setEditForm({ ...editForm, edad: Number(e.target.value) });
                    triggerUpdate()
                  }}
                  placeholder="Ej. 30"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">CIUDAD</label>
                <input
                  type="text"
                  value={currentUser.ciudad || ''}
                  disabled={!isEditing}
                  onChange={(e) => {
                    if (editForm) setEditForm({ ...editForm, ciudad: e.target.value });
                    triggerUpdate()
                  }}
                  placeholder="Ej. Medellín"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">ALTITUD (M)</label>
                <input
                  type="number"
                  value={currentUser.altitud || 0}
                  disabled={!isEditing}
                  onChange={(e) => {
                    if (editForm) setEditForm({ ...editForm, altitud: Number(e.target.value) });
                    triggerUpdate()
                  }}
                  placeholder="Ej. 1500"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">IDIOMA</label>
                <input
                  type="text"
                  value={currentUser.idioma || ''}
                  disabled={!isEditing}
                  onChange={(e) => {
                    if (editForm) setEditForm({ ...editForm, idioma: e.target.value });
                    triggerUpdate()
                  }}
                  placeholder="Ej. es"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">ESTADO DE CUENTA</label>
                <div className="flex items-center gap-2 h-[38px]">
                  <Badge variant={
                    displayEstado === 'Suspendido Temporalmente' ? 'orange' :
                    displayEstado === 'Suspendido Permanentemente' ? 'red' :
                    (displayEstado === 'Activo' ? 'green' : 'red')
                  }>
                    {displayEstado}
                  </Badge>
                </div>
              </div>
            </div>
          </div>



          {/* Card 3: Datos Físicos y Antropométricos */}
          <div className="card-base p-5 bg-surface-card border border-surface-border rounded-xl">
            <h3 className="text-sm font-bold text-white mb-4">Datos Físicos y Antropométricos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">PESO ({currentUser.unidad_peso || 'kg'})</label>
                <input
                  type="number"
                  value={currentUser.peso || 0}
                  disabled={!isEditing}
                  onChange={(e) => {
                    if (editForm) setEditForm({ ...editForm, peso: Number(e.target.value) });
                    triggerUpdate()
                  }}
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">ALTURA ({currentUser.unidad_altura || 'cm'})</label>
                <input
                  type="number"
                  value={currentUser.altura || 0}
                  disabled={!isEditing}
                  onChange={(e) => {
                    if (editForm) setEditForm({ ...editForm, altura: Number(e.target.value) });
                    triggerUpdate()
                  }}
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">NIVEL DE ACTIVIDAD (1-5)</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={currentUser.nivel_actividad ?? 0}
                  disabled={!isEditing}
                  onChange={(e) => {
                    if (editForm) setEditForm({ ...editForm, nivel_actividad: Number(e.target.value) });
                    triggerUpdate()
                  }}
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">NIVEL MOTOR ACTUAL (1-5)</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={currentUser.nivel_motor_actual ?? 0}
                  disabled={!isEditing}
                  onChange={(e) => {
                    if (editForm) setEditForm({ ...editForm, nivel_motor_actual: Number(e.target.value) });
                    triggerUpdate()
                  }}
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">CLASIFICACIÓN MOTOR</label>
                <input
                  type="text"
                  value={currentUser.clasificacion_visible_actual || ''}
                  disabled={!isEditing}
                  onChange={(e) => {
                    if (editForm) setEditForm({ ...editForm, clasificacion_visible_actual: e.target.value });
                    triggerUpdate()
                  }}
                  placeholder="Ej. Avanzado, Intermedio"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">TIEMPO SIN ENTRENAR</label>
                <input
                  type="text"
                  value={currentUser.tiempo_sin_entrenar || ''}
                  disabled={!isEditing}
                  onChange={(e) => {
                    if (editForm) setEditForm({ ...editForm, tiempo_sin_entrenar: e.target.value });
                    triggerUpdate()
                  }}
                  placeholder="Ej. 2 semanas"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Card 4: Planificación, Objetivos y Suscripción */}
          <div className="card-base p-5 bg-surface-card border border-surface-border rounded-xl">
            <h3 className="text-sm font-bold text-white mb-4">Planificación, Objetivos y Suscripción</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">DISCIPLINA / DEPORTE</label>
                <DisciplineAutocomplete
                  value={currentUser.nombre_disciplina || ''}
                  onChange={(val) => {
                    if (editForm) setEditForm({ ...editForm, nombre_disciplina: val });
                    triggerUpdate();
                  }}
                  onSelect={(id, name) => {
                    if (editForm) setEditForm({ ...editForm, nombre_disciplina: name, id_disciplina: id });
                    triggerUpdate();
                    assignDisciplineMutation.mutate(id);
                  }}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">DURACIÓN OBJETIVO (SEMANAS)</label>
                <input
                  type="number"
                  value={currentUser.duracion_semanas_objetivo || 0}
                  disabled={!isEditing}
                  onChange={(e) => {
                    if (editForm) setEditForm({ ...editForm, duracion_semanas_objetivo: Number(e.target.value) });
                    triggerUpdate()
                  }}
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">FECHA INICIO PREFERIDA</label>
                <input
                  type="text"
                  value={currentUser.fecha_inicio_preferida || ''}
                  disabled={!isEditing}
                  onChange={(e) => {
                    if (editForm) setEditForm({ ...editForm, fecha_inicio_preferida: e.target.value });
                    triggerUpdate()
                  }}
                  placeholder="AAAA-MM-DD"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">PRÓXIMA COMPETENCIA</label>
                <input
                  type="text"
                  value={currentUser.proxima_competencia ? currentUser.proxima_competencia.substring(0, 10) : '—'}
                  disabled={!isEditing}
                  onChange={(e) => {
                    if (editForm) setEditForm({ ...editForm, proxima_competencia: e.target.value });
                    triggerUpdate()
                  }}
                  placeholder="AAAA-MM-DD"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">ALIMENTACIÓN</label>
                <input
                  type="text"
                  value={currentUser.alimentacion || ''}
                  disabled={!isEditing}
                  onChange={(e) => {
                    if (editForm) setEditForm({ ...editForm, alimentacion: e.target.value });
                    triggerUpdate()
                  }}
                  placeholder="Ej. Omnívoro, Vegetariano, Vegano"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">PLAN ACTIVO</label>
                <input
                  type="text"
                  value={currentUser.nombre_plan_activo || PLAN_NAMES[currentUser.plan_idx] || 'Essential'}
                  disabled={!isEditing}
                  onChange={(e) => {
                    if (editForm) setEditForm({ ...editForm, nombre_plan_activo: e.target.value });
                    triggerUpdate()
                  }}
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">ESTADO SUSCRIPCIÓN</label>
                <input
                  type="text"
                  value={currentUser.estado_suscripcion || (currentUser.tiene_plan_activo ? 'Activa' : 'Inactiva')}
                  disabled={!isEditing}
                  onChange={(e) => {
                    if (editForm) setEditForm({ ...editForm, estado_suscripcion: e.target.value });
                    triggerUpdate()
                  }}
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">FIN SUSCRIPCIÓN</label>
                <input
                  type="text"
                  value={currentUser.fecha_fin_suscripcion ? currentUser.fecha_fin_suscripcion.substring(0, 10) : '—'}
                  disabled={!isEditing}
                  onChange={(e) => {
                    if (editForm) setEditForm({ ...editForm, fecha_fin_suscripcion: e.target.value });
                    triggerUpdate()
                  }}
                  placeholder="AAAA-MM-DD"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">¿TIENE PLAN ACTIVO?</label>
                <div className="flex items-center gap-2 h-[38px]">
                  <Badge variant={currentUser.tiene_plan_activo ?? currentUser.plan_idx > 0 ? 'green' : 'muted'}>
                    {currentUser.tiene_plan_activo ?? currentUser.plan_idx > 0 ? 'SÍ' : 'NO'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: Preferencias, Reportes y Notificaciones */}
          <div className="card-base p-5 bg-surface-card border border-surface-border rounded-xl">
            <h3 className="text-sm font-bold text-white mb-4">Preferencias, Reportes y Notificaciones</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">ESTILO DE COMUNICACIÓN</label>
                <input
                  type="text"
                  value={currentUser.estilo_comunicacion || ''}
                  disabled={!isEditing}
                  onChange={(e) => {
                    if (editForm) setEditForm({ ...editForm, estilo_comunicacion: e.target.value });
                    triggerUpdate()
                  }}
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">INTENSIDAD NOTIFICACIONES</label>
                <input
                  type="text"
                  value={currentUser.intensidad_notificaciones || ''}
                  disabled={!isEditing}
                  onChange={(e) => {
                    if (editForm) setEditForm({ ...editForm, intensidad_notificaciones: e.target.value });
                    triggerUpdate()
                  }}
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">DÍA DE REPORTE</label>
                <input
                  type="text"
                  value={currentUser.dia_reporte || ''}
                  disabled={!isEditing}
                  onChange={(e) => {
                    if (editForm) setEditForm({ ...editForm, dia_reporte: e.target.value });
                    triggerUpdate()
                  }}
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">HORA DE REPORTE</label>
                <input
                  type="text"
                  value={currentUser.hora_reporte || ''}
                  disabled={!isEditing}
                  onChange={(e) => {
                    if (editForm) setEditForm({ ...editForm, hora_reporte: e.target.value });
                    triggerUpdate()
                  }}
                  placeholder="Ej. 08:00"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">HORA DE NOTIFICACIÓN</label>
                <input
                  type="text"
                  value={currentUser.notification_time || ''}
                  disabled={!isEditing}
                  onChange={(e) => {
                    if (editForm) setEditForm({ ...editForm, notification_time: e.target.value });
                    triggerUpdate()
                  }}
                  placeholder="Ej. 07:30"
                  className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">ONBOARDING COMPLETO</label>
                <div className="flex items-center gap-2 h-[38px]">
                  <Badge variant={u.onboarding_completo ? 'green' : 'orange'}>
                    {u.onboarding_completo ? 'COMPLETADO' : 'PENDIENTE'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Card 6: Historial de Lesiones, Equipamiento y Días de Entrenamiento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <EditableChipList
              title="Días de Entrenamiento"
              items={currentUser.dias_entrenamiento || []}
              isEditing={isEditing}
              onAdd={(val) => {
                if (editForm) {
                  const updatedDays = [...(editForm.dias_entrenamiento || []), val];
                  setEditForm({ ...editForm, dias_entrenamiento: updatedDays });
                }
                triggerUpdate()
                toast.show('Día de entrenamiento agregado', 'success')
              }}
              onRemove={(idx) => {
                if (editForm) {
                  const updatedDays = editForm.dias_entrenamiento.filter((_, i) => i !== idx);
                  setEditForm({ ...editForm, dias_entrenamiento: updatedDays });
                }
                triggerUpdate()
                toast.show('Día de entrenamiento removido', 'error')
              }}
              placeholder="Añadir día (ej: Jue)"
            />

            <EditableChipList
              title="Equipamiento"
              items={currentUser.equipo || []}
              isEditing={isEditing}
              onAdd={(val) => {
                if (editForm) {
                  const updatedEquipo = [...(editForm.equipo || []), val];
                  setEditForm({ ...editForm, equipo: updatedEquipo });
                }
                triggerUpdate()
                toast.show('Equipamiento agregado', 'success')
              }}
              onRemove={(idx) => {
                if (editForm) {
                  const updatedEquipo = editForm.equipo.filter((_, i) => i !== idx);
                  setEditForm({ ...editForm, equipo: updatedEquipo });
                }
                triggerUpdate()
                toast.show('Equipamiento removido', 'error')
              }}
              placeholder="Añadir equipo (ej: Bastones)"
            />

            <EditableChipList
              title="Historial de Lesiones"
              items={currentUser.historial_lesiones || []}
              isEditing={isEditing}
              onAdd={(val) => {
                if (editForm && u) {
                  registerInjuryMutation.mutate({ zona_afectada: val, descripcion_molestia: val });
                }
              }}
              onRemove={(idx) => {
                if (editForm && u && editForm.historial_lesiones && editForm.historial_lesiones[idx]) {
                  removeInjuryMutation.mutate(editForm.historial_lesiones[idx].id_lesion_usuario);
                }
              }}
              placeholder="Añadir lesión (ej: Rodilla 2025)"
            />
          </div>

          {/* Card 7: Historial Deportivo */}
          <div className="card-base p-5 bg-surface-card border border-surface-border rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Historial Deportivo</h3>
              {isEditing && (
                <button
                  onClick={() => {
                    if (editForm) {
                      const updatedTray = [...(editForm.tray || [])];
                      updatedTray.push({
                        titulo: '',
                        org: '',
                        inicio: '2025',
                        fin: '',
                        desc: ''
                      });
                      setEditForm({ ...editForm, tray: updatedTray });
                    }
                    triggerUpdate()
                    toast.show('Nueva trayectoria deportiva añadida', 'success')
                  }}
                  className="text-[11px] font-semibold text-brand-orange hover:text-brand-orange/80 transition-colors bg-transparent border-0 cursor-pointer"
                >
                  + Añadir Logro
                </button>
              )}
            </div>
            
            {(!currentUser.tray || currentUser.tray.length === 0) ? (
              <div className="text-center py-6 text-surface-muted text-[12px]">Sin logros o trayectoria registrada.</div>
            ) : (
              <div className="space-y-3">
                {currentUser.tray?.map((t, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row gap-3 items-center w-full">
                    <div className="flex-1 w-full">
                      <input
                        type="text"
                        value={t.titulo || ''}
                        disabled={!isEditing}
                        onChange={(e) => {
                          if (editForm) {
                            const updatedTray = [...(editForm.tray || [])];
                            updatedTray[idx] = { ...updatedTray[idx], titulo: e.target.value };
                            setEditForm({ ...editForm, tray: updatedTray });
                          }
                          triggerUpdate()
                        }}
                        placeholder="Logro o Carrera (ej: Trail 15k)"
                        className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div className="flex-1 w-full">
                      <input
                        type="text"
                        value={t.org || ''}
                        disabled={!isEditing}
                        onChange={(e) => {
                          if (editForm) {
                            const updatedTray = [...(editForm.tray || [])];
                            updatedTray[idx] = { ...updatedTray[idx], org: e.target.value };
                            setEditForm({ ...editForm, tray: updatedTray });
                          }
                          triggerUpdate()
                        }}
                        placeholder="Organizador o Lugar (ej: Liga de Bogotá)"
                        className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div className="w-full md:w-44">
                      <input
                        type="text"
                        value={(t.inicio && t.fin) ? `${t.inicio}-${t.fin}` : (t.inicio || '2025')}
                        disabled={!isEditing}
                        onChange={(e) => {
                          if (editForm) {
                            const updatedTray = [...(editForm.tray || [])];
                            const val = e.target.value
                            if (val.includes('-')) {
                              const [ini, fin] = val.split('-')
                              updatedTray[idx] = { ...updatedTray[idx], inicio: ini.trim(), fin: fin.trim() };
                            } else {
                              updatedTray[idx] = { ...updatedTray[idx], inicio: val, fin: '' };
                            }
                            setEditForm({ ...editForm, tray: updatedTray });
                          }
                          triggerUpdate()
                        }}
                        placeholder="Año o período (ej: 2024)"
                        className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange disabled:opacity-75 disabled:cursor-not-allowed"
                      />
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => {
                          if (editForm && editForm.tray && editForm.tray[idx]) {
                            const eventToRemove = editForm.tray[idx];
                            if (eventToRemove.id_evento) {
                              removeSportsEventMutation.mutate(eventToRemove.id_evento);
                            } else {
                              // If no id_evento, it's a new unsaved event, remove locally
                              const updatedTray = editForm.tray.filter((_, i) => i !== idx);
                              setEditForm({ ...editForm, tray: updatedTray });
                              triggerUpdate();
                              toast.show('Logro deportivo eliminado localmente', 'info');
                            }
                          }
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
        </div>
      )}

      {tab === 'plan' && <AdminPlanTab key={u.id_usuario} userId={u.id_usuario} />}

      {tab === 'nutricion' && <SpecialistNutritionTab key={u.id_usuario} userId={u.id_usuario} readOnly={true} />}

      {tab === 'progreso' && <ProgressTab patientId={u.id_usuario} readOnly={true} />}

      {tab === 'reporte-clinico' && <ClinicalReportTab patientId={u.id_usuario} readOnly={true} />}

      {tab === 'dispositivos' && (
        <div>
          <div className="card-base mb-4">
            <div className="text-[13px] font-semibold mb-3">Dispositivos conectados</div>
            {[
              { name:'Apple Health', connected: u.apple_health?.conectado ?? u.health_connected, detail: u.apple_health?.detalle, color:'#FF2D55', icon:'❤️' },
              { name:'Strava', connected: u.strava?.conectado ?? !!u.strava_access_token, detail: u.strava?.detalle, color:'#FC4C02', icon:'🚴' },
              { name:'Garmin', connected: u.garmin?.conectado ?? !!u.last_garmin_sync, detail: u.garmin?.detalle, color:'#007EC5', icon:'⌚' },
              { name:'Google Fit', connected: u.google_fit?.conectado, detail: u.google_fit?.detalle, color:'#4285F4', icon:'🏃' },
            ].map((d) => (
              <div key={d.name} className="flex items-center justify-between py-2.5 border-b border-surface-border last:border-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{background:`${d.color}22`}}>{d.icon}</div>
                  <div><div className="text-[12px] font-medium">{d.name}</div><div className="text-[11px] text-surface-muted">{d.detail || (d.connected ? 'Activo' : 'Sin conexión')}</div></div>
                </div>
                <Badge variant={d.connected ? 'green' : 'muted'}>{d.connected ? 'Conectado' : 'No conectado'}</Badge>
              </div>
            ))}
          </div>
          <div className="card-base">
            <div className="text-[13px] font-semibold mb-3">Tokens</div>
            <FieldRow label="strava_access_token"><span className="font-mono text-[10px] text-surface-muted">{u.strava_access_token || '—'}</span></FieldRow>
            <FieldRow label="last_strava_sync">{u.last_strava_sync ? new Date(u.last_strava_sync).toLocaleString('es-CO') : 'Nunca'}</FieldRow>
            <FieldRow label="last_garmin_sync">{u.last_garmin_sync ? new Date(u.last_garmin_sync).toLocaleString('es-CO') : 'Nunca'}</FieldRow>
            <FieldRow label="health_connected"><Badge variant={u.health_connected?'green':'muted'}>{u.health_connected?'true':'false'}</Badge></FieldRow>
          </div>
        </div>
      )}
      {/* Suspension Modal */}
      <Modal
        isOpen={isSuspensionModalOpen}
        onClose={() => setIsSuspensionModalOpen(false)}
        title="Suspender Usuario Temporalmente"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="suspensionEndDate" className="form-label block text-[12px] font-medium mb-1">
              Fecha de fin de suspensión
            </label>
            <input
              type="date"
              id="suspensionEndDate"
              value={suspensionEndDate}
              onChange={(e) => setSuspensionEndDate(e.target.value)}
              className="form-input w-full px-3 py-2 text-[12px] rounded-lg border border-surface-border bg-surface-card2 focus:outline-none focus:border-brand-orange"
            />
          </div>
          <div>
            <label htmlFor="suspensionReason" className="form-label block text-[12px] font-medium mb-1">
              Motivo de la suspensión <span className="text-brand-red">*</span>
            </label>
            <textarea
              id="suspensionReason"
              value={suspensionReason}
              onChange={(e) => setSuspensionReason(e.target.value)}
              placeholder="Indica el motivo de la suspensión temporal..."
              rows={4}
              className="form-input w-full px-3 py-2 text-[12px] rounded-lg border border-surface-border bg-surface-card2 focus:outline-none focus:border-brand-orange resize-y"
            ></textarea>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="ghost"
              onClick={() => setIsSuspensionModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (!suspensionReason.trim()) {
                  toast.show('El motivo de la suspensión es obligatorio', 'error');
                  return;
                }
                updateUserStatusMutation.mutate({
                  userId: u.id_usuario,
                  statusPayload: {
                    estado: 'suspendido_temporal',
                    fecha_fin_suspencion: suspensionEndDate,
                    motivo_suspencion: suspensionReason,
                  },
                });
              }}
            >
              Confirmar Suspensión
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}



const formatDateISO = (d: Date): string => {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getWeekDates = (offsetWeeks: number): Date[] => {
  const current = new Date()
  const day = current.getDay()
  const diff = current.getDate() - day + (day === 0 ? -6 : 1) // Adjust to start on Monday
  const monday = new Date(current.setDate(diff))
  monday.setDate(monday.getDate() + offsetWeeks * 7)

  const dates: Date[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    dates.push(d)
  }
  return dates
}

export function AdminPlanTab({ userId }: { userId: string }) {
  const [weekOffset, setWeekOffset] = useState(0)
  const [planItems, setPlanItems] = useState<PlanItem[]>([])
  const [selectedExercise, setSelectedExercise] = useState<WorkoutExercise | null>(null)

  // Calculate start and end dates based on weekOffset
  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset])
  const startDate = useMemo(() => formatDateISO(weekDates[0]), [weekDates])
  const endDate = useMemo(() => formatDateISO(weekDates[6]), [weekDates])

  const todayStr = useMemo(() => formatDateISO(new Date()), [])
  const [selectedDateStr, setSelectedDateStr] = useState(() => {
    const initialWeekDates = getWeekDates(0)
    const initialStart = formatDateISO(initialWeekDates[0])
    const initialEnd = formatDateISO(initialWeekDates[6])
    const currentToday = formatDateISO(new Date())
    if (currentToday >= initialStart && currentToday <= initialEnd) {
      return currentToday
    }
    return initialStart
  })

  const { data: fetchedPlanData, isLoading: isPlanLoading, error } = useQuery({
    queryKey: ['adminUserPlan', userId, startDate, endDate],
    queryFn: () => usersService.getUserTabDetalle(userId, 'plan', startDate, endDate),
    enabled: !!userId,
  })

  const planData = useMemo(() => {
    if (fetchedPlanData) {
      if (Array.isArray(fetchedPlanData)) {
        const matchingWeek = fetchedPlanData.find(week => {
          const inicio = week?.semana_rango?.inicio
          const fin = week?.semana_rango?.fin
          return inicio && fin && selectedDateStr >= inicio && selectedDateStr <= fin
        })
        return matchingWeek || fetchedPlanData[0]
      }
      return fetchedPlanData
    }
    return undefined;
  }, [fetchedPlanData, selectedDateStr])

  useEffect(() => {
    console.log('AdminPlanTab query result:', { fetchedPlanData, isPlanLoading, error })
  }, [fetchedPlanData, isPlanLoading, error])

  // Sync selectedDateStr to today (if in range) or startDate (if not) when week changes
  useEffect(() => {
    if (todayStr >= startDate && todayStr <= endDate) {
      setSelectedDateStr(todayStr)
    } else {
      setSelectedDateStr(startDate)
    }
  }, [startDate, endDate, todayStr])

  // Map workouts/plan items when planData loads
  useEffect(() => {
    if (planData?.entrenamientos) {
      const baseWorkouts = planData.entrenamientos || []
      const mapped = baseWorkouts.map((item: any) => {
        if ('id_entrenamiento' in item) {
          const workout = item as Workout
          return {
            ...workout,
            ejercicios_asociados: workout.ejercicios_asociados || []
          }
        }
        return item
      })
      setPlanItems(mapped)
    } else {
      setPlanItems([])
    }
  }, [planData])

  // Synchronized initial date logic

  const activeWorkout = useMemo(() => {
    return planItems.find(item => 'id_entrenamiento' in item && item.fecha_programada === selectedDateStr) as Workout | undefined
  }, [planItems, selectedDateStr])

  if (isPlanLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange mb-3"></div>
        <div className="text-[12px] text-surface-muted font-medium">Cargando planificación del usuario...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4 text-left">
      {/* Week Navigator */}
      <div className="card-base flex items-center justify-between py-3">
        <div className="flex items-center gap-2">
          <Calendar size={15} className="text-brand-orange" />
          <span className="text-[12px] font-bold text-white">Planificación de Rutina</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setWeekOffset(w => w - 1)}><ChevronLeft size={13} /></Button>
          <span className="text-[11px] font-medium text-surface-muted uppercase tracking-wider">
            {weekOffset === 0 
              ? (planData?.semana_numero ? `Semana ${planData.semana_numero}` : 'Semana Actual') 
              : weekOffset > 0 ? `Semana +${weekOffset}` : `Semana ${weekOffset}`}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setWeekOffset(w => w + 1)}><ChevronRight size={13} /></Button>
        </div>
      </div>

      {/* Date Picker row */}
      <div className="grid grid-cols-7 gap-2.5">
        {weekDates.map((date) => {
          const dateStr = formatDateISO(date)
          const isSelected = dateStr === selectedDateStr
          const isToday = dateStr === formatDateISO(new Date())
          const hasWorkout = planItems.some(item => 'id_entrenamiento' in item && item.fecha_programada === dateStr)

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDateStr(dateStr)}
              className={cn(
                'card-base p-2 text-center flex flex-col items-center justify-center transition-all cursor-pointer border relative',
                isSelected ? 'border-brand-orange bg-brand-orange/10 font-bold' : isToday ? 'border-brand-orange/40 bg-brand-orange/5' : 'border-surface-border bg-surface-card2'
              )}
            >
              <div className="text-[9px] text-surface-muted uppercase">{date.toLocaleDateString('es-ES', { weekday: 'short' })}</div>
              <div className="text-[14px] font-bold text-white mt-0.5">{date.getDate()}</div>
              
              <div className="absolute bottom-1.5 flex gap-1 justify-center w-full">
                {hasWorkout && <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" title="Entrenamiento planificado" />}
              </div>
            </button>
          )
        })}
      </div>

      {/* Detail Block */}
      {activeWorkout ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          {/* Left Column: Workout Parameters */}
          <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-4">
            <div className="text-[12px] font-bold text-brand-orange uppercase tracking-wider">Detalle del Entrenamiento</div>
            <div className="grid grid-cols-2 gap-4 text-[12px]">
              <div>
                <label className="text-[10px] text-surface-muted uppercase font-semibold">Tipo de Entrenamiento</label>
                <div className="text-white font-medium mt-1">{activeWorkout.tipo}</div>
              </div>
              <div>
                <label className="text-[10px] text-surface-muted uppercase font-semibold">Zona de Esfuerzo</label>
                <div className="text-white font-medium mt-1">{activeWorkout.zona_esfuerzo || '—'}</div>
              </div>
              <div>
                <label className="text-[10px] text-surface-muted uppercase font-semibold">Fecha Programada</label>
                <div className="text-white font-medium mt-1">{activeWorkout.fecha_programada}</div>
              </div>
              <div>
                <label className="text-[10px] text-surface-muted uppercase font-semibold">Estado</label>
                <div className="mt-1">
                  <Badge variant={activeWorkout.estado.toLowerCase() === 'completado' ? 'green' : 'orange'}>
                    {activeWorkout.estado.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div className="col-span-2">
                <label className="text-[10px] text-surface-muted uppercase font-semibold">Calorías Objetivo</label>
                <div className="text-white font-medium mt-1">{activeWorkout.macros_objetivo_kcal ? `${activeWorkout.macros_objetivo_kcal} kcal` : '—'}</div>
              </div>
              {activeWorkout.macros_objetivo_proteina !== undefined && (
                <div className="col-span-2 grid grid-cols-3 gap-2 bg-surface-card2 border border-surface-border p-3 rounded-lg text-center">
                  <div>
                    <div className="text-[9px] text-surface-muted uppercase font-semibold">Carbohidratos</div>
                    <div className="text-white font-bold text-[13px] mt-0.5">{activeWorkout.macros_objetivo_ch || 0}g</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-surface-muted uppercase font-semibold">Proteínas</div>
                    <div className="text-white font-bold text-[13px] mt-0.5">{activeWorkout.macros_objetivo_proteina || 0}g</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-surface-muted uppercase font-semibold">Grasas</div>
                    <div className="text-white font-bold text-[13px] mt-0.5">{activeWorkout.macros_objetivo_grasas || 0}g</div>
                  </div>
                </div>
              )}
              <div className="col-span-2 border-t border-surface-border/50 pt-3">
                <label className="text-[10px] text-surface-muted uppercase font-semibold">Descripción de la Sesión</label>
                <p className="text-white mt-1.5 leading-relaxed whitespace-pre-wrap text-[11px]">{activeWorkout.descripcion || 'Sin descripción detallada.'}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Exercises list */}
          <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-4">
            <div className="text-[12px] font-bold text-brand-orange uppercase tracking-wider">Ejercicios & Estructuras</div>
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {activeWorkout.ejercicios_asociados.map((we) => (
                <div
                  key={we.id_entrenamiento_ejercicio}
                  onClick={() => setSelectedExercise(we)}
                  className="w-full p-3.5 flex justify-between items-center bg-surface-card2 border border-surface-border rounded-xl hover:border-brand-orange transition-all text-white text-left cursor-pointer"
                >
                  <div>
                    <div className="text-[12px] font-bold text-white">{we.ejercicio.nombre}</div>
                    <div className="text-[10px] text-surface-muted mt-0.5">
                      Orden: {we.orden} · {we.series} series x {we.repeticiones} {we.peso_objetivo > 0 ? `· ${we.peso_objetivo}kg` : ''}
                    </div>
                  </div>
                  <span className="text-[10px] text-brand-orange font-semibold hover:underline">Ver Detalle →</span>
                </div>
              ))}
              {activeWorkout.ejercicios_asociados.length === 0 && (
                <div className="text-center py-10 text-surface-muted text-[11px] bg-surface-card2 rounded-xl border border-surface-border">
                  No hay ejercicios registrados en este entrenamiento.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="card-base p-10 bg-surface-card border border-surface-border rounded-xl text-center flex flex-col items-center justify-center min-h-[250px]">
          <span className="text-3xl mb-2">📅</span>
          <div className="text-[13px] font-bold text-white uppercase tracking-wide">Día sin planificación</div>
          <p className="text-[11px] text-surface-muted max-w-[300px] mt-1">
            No hay entrenamientos planificados para el <span className="font-bold text-white">{selectedDateStr}</span>.
          </p>
        </div>
      )}

      {/* Exercise detail popup modal */}
      {selectedExercise && (
        <Modal isOpen={selectedExercise !== null} onClose={() => setSelectedExercise(null)} title={selectedExercise.ejercicio.nombre}>
          <div className="space-y-4 text-[12px] text-left text-white max-h-[450px] overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-3 bg-surface-card2 border border-surface-border p-3 rounded-lg">
              <div>
                <span className="text-[10px] text-surface-muted uppercase font-bold">Series</span>
                <div className="text-white font-bold text-[14px] mt-0.5">{selectedExercise.series}</div>
              </div>
              <div>
                <span className="text-[10px] text-surface-muted uppercase font-bold">Repeticiones</span>
                <div className="text-white font-bold text-[14px] mt-0.5">{selectedExercise.repeticiones}</div>
              </div>
              <div>
                <span className="text-[10px] text-surface-muted uppercase font-bold">Peso Objetivo</span>
                <div className="text-white font-bold text-[14px] mt-0.5">{selectedExercise.peso_objetivo} kg</div>
              </div>
              <div>
                <span className="text-[10px] text-surface-muted uppercase font-bold">Descanso</span>
                <div className="text-white font-bold text-[14px] mt-0.5">{selectedExercise.descanso_segundos} seg</div>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-brand-orange uppercase font-bold">Descripción de Ejercicio</span>
              <p className="text-white mt-1 leading-relaxed text-[11px]">{selectedExercise.ejercicio.descripcion}</p>
            </div>

            {selectedExercise.ejercicio.instrucciones?.posicion_inicial && (
              <div>
                <span className="text-[10px] text-brand-orange uppercase font-bold">Posición Inicial</span>
                <p className="text-white mt-1 leading-relaxed text-[11px]">{selectedExercise.ejercicio.instrucciones.posicion_inicial}</p>
              </div>
            )}

            {selectedExercise.ejercicio.instrucciones?.ejecucion && (
              <div>
                <span className="text-[10px] text-brand-orange uppercase font-bold">Ejecución</span>
                <p className="text-white mt-1 leading-relaxed text-[11px]">{selectedExercise.ejercicio.instrucciones.ejecucion}</p>
              </div>
            )}

            {selectedExercise.ejercicio.instrucciones?.errores_comunes && (
              <div>
                <span className="text-[10px] text-brand-red uppercase font-bold">Errores Comunes</span>
                <p className="text-white mt-1 leading-relaxed text-[11px]">{selectedExercise.ejercicio.instrucciones.errores_comunes}</p>
              </div>
            )}

            {(selectedExercise.ejercicio.instrucciones?.consejos_tecnicos?.length ?? 0) > 0 && (
              <div>
                <span className="text-[10px] text-brand-orange uppercase font-bold">Consejos Técnicos</span>
                <ul className="list-disc pl-4 mt-1 space-y-1 text-[11px]">
                  {selectedExercise.ejercicio.instrucciones?.consejos_tecnicos?.map((tip: string, idx: number) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="flex justify-end mt-4 pt-3 border-t border-surface-border">
            <Button variant="ghost" onClick={() => setSelectedExercise(null)}>Cerrar</Button>
          </div>
        </Modal>
      )}
    </div>
  )
}

