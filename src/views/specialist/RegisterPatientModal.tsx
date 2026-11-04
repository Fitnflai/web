import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Activity,
  Trophy,
  AlertTriangle,
  Clock,
  Dumbbell,
  Check,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  HeartPulse,
  Info,
  Loader2
} from 'lucide-react';
import { searchCitiesGeocoding, GeocodingResult } from '@/services/api/geocoding';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select, SelectOption } from '@/components/ui/Select';
import { Toggle } from '@/components/ui/Toggle';
import { toast } from '@/components/ui/Toast';
import {
  specialistsService,
  RegisterPatientPayload,
  DetalleLesion,
  DetallesObjetivo,
  DisciplinaItem,
  EquipmentItem,
  ObjectiveItem,
} from '@/services/endpoints/specialists';

interface RegisterPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const DAYS_OF_WEEK = [
  { id: 'lunes', label: 'Lun', full: 'Lunes' },
  { id: 'martes', label: 'Mar', full: 'Martes' },
  { id: 'miercoles', label: 'Mié', full: 'Miércoles' },
  { id: 'jueves', label: 'Jue', full: 'Jueves' },
  { id: 'viernes', label: 'Vie', full: 'Viernes' },
  { id: 'sabado', label: 'Sáb', full: 'Sábado' },
  { id: 'domingo', label: 'Dom', full: 'Domingo' },
];

const AVAILABLE_EQUIPMENT_FALLBACK: EquipmentItem[] = [
  { id_implemento: 1, nombre: 'Cuerda para saltar' },
  { id_implemento: 2, nombre: 'Bandas de resistencia' },
  { id_implemento: 3, nombre: 'Pesa rusa (Kettlebell)' },
  { id_implemento: 4, nombre: 'Colchoneta de Yoga' },
  { id_implemento: 5, nombre: 'Rodillo de espuma (Foam roller)' },
  { id_implemento: 6, nombre: 'Mancuernas' },
  { id_implemento: 7, nombre: 'Barra y discos' },
  { id_implemento: 8, nombre: 'Bicicleta estática / Rodillo' },
];

const DISCIPLINES_FALLBACK: SelectOption[] = [
  { value: '1', label: 'Running / Atletismo' },
  { value: '2', label: 'Trail Running' },
  { value: '3', label: 'Ciclismo de Ruta / MTB' },
  { value: '4', label: 'Triatlón' },
  { value: '5', label: 'Natación' },
  { value: '6', label: 'Fuerza / Funcional' },
];

const OBJECTIVES_FALLBACK: SelectOption[] = [
  { value: '1', label: 'Preparación para competencia' },
  { value: '2', label: 'Rendimiento y resistencia aeróbica' },
  { value: '3', label: 'Pérdida de grasa / Composición corporal' },
  { value: '4', label: 'Ganancia muscular y fuerza' },
  { value: '5', label: 'Readaptación física y prevención' },
];

const DIFFICULTY_LEVELS: SelectOption[] = [
  { value: 'principiante', label: 'Principiante' },
  { value: 'intermedio', label: 'Intermedio' },
  { value: 'avanzado', label: 'Avanzado' },
  { value: 'elite', label: 'Élite' },
];

const GENDER_OPTIONS: SelectOption[] = [
  { value: 'Masculino', label: 'Masculino' },
  { value: 'Femenino', label: 'Femenino' },
  { value: 'Otro', label: 'Otro' },
];

const TIMEZONES: SelectOption[] = [
  { value: 'America/Guayaquil', label: 'America/Guayaquil (UTC-5)' },
  { value: 'America/Bogota', label: 'America/Bogota (UTC-5)' },
  { value: 'America/Lima', label: 'America/Lima (UTC-5)' },
  { value: 'America/Mexico_City', label: 'America/Mexico_City (UTC-6)' },
  { value: 'America/Santiago', label: 'America/Santiago (UTC-3)' },
  { value: 'America/Argentina/Buenos_Aires', label: 'America/Argentina/Buenos_Aires (UTC-3)' },
  { value: 'America/Caracas', label: 'America/Caracas (UTC-4)' },
  { value: 'Europe/Madrid', label: 'Europe/Madrid (UTC+1)' },
];

const initialPayload: RegisterPatientPayload = {
  nombre: '',
  email: '',
  apodo: '',
  telefono: '',
  genero: '',
  fecha_nacimiento: '',
  peso: 70,
  unidad_peso: 'kg',
  altura: 170,
  unidad_altura: 'cm',
  ciudad: '',
  altitud_msnm: 0,
  timezone: 'America/Guayaquil',
  id_disciplina: 1,
  nivel_dificultad: 'intermedio',
  fecha_inicio_deseada: new Date().toISOString().split('T')[0],
  tiempo_por_sesion: 60,
  dias_disponibles: ['lunes', 'miercoles', 'viernes'],
  equipamiento_ids: [1, 2],
  id_objetivo: '1',
  detalles_objetivo: {
    nombre_competencia: '',
    fecha_competencia: '',
    distancia_objetivo: 10,
    unidad_distancia: 'km',
    desnivel_m: 0,
    altitud_destino_m: 0,
  },
  detalles_lesiones: [],
  adaptacion_ciclo_menstrual: false,
  notas: '',
};

export function RegisterPatientModal({ isOpen, onClose, onSuccess }: RegisterPatientModalProps) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegisterPatientPayload>(initialPayload);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cityResults, setCityResults] = useState<GeocodingResult[]>([]);
  const [isSearchingCity, setIsSearchingCity] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const cityContainerRef = useRef<HTMLDivElement>(null);
  const isCitySelectedRef = useRef(false);

  const timezoneOptions = useMemo(() => {
    if (formData.timezone && !TIMEZONES.some(tz => tz.value === formData.timezone)) {
      return [{ value: formData.timezone, label: formData.timezone }, ...TIMEZONES];
    }
    return TIMEZONES;
  }, [formData.timezone]);

  const { data: disciplinasData, isLoading: isLoadingDisciplinas } = useQuery<DisciplinaItem[]>({
    queryKey: ['onboardingDisciplinas'],
    queryFn: () => specialistsService.getDisciplines(),
    staleTime: 10 * 60 * 1000,
  });

  const disciplineOptions: SelectOption[] = useMemo(() => {
    if (!disciplinasData || disciplinasData.length === 0) {
      return DISCIPLINES_FALLBACK;
    }
    return disciplinasData.map(d => ({
      value: String(d.id_disciplina),
      label: d.nombre,
    }));
  }, [disciplinasData]);

  useEffect(() => {
    if (disciplineOptions.length > 0 && !formData.id_disciplina) {
      setFormData(prev => ({ ...prev, id_disciplina: Number(disciplineOptions[0].value) }));
    }
  }, [disciplineOptions, formData.id_disciplina]);

  const { data: equipmentsData, isLoading: isLoadingEquipments } = useQuery<EquipmentItem[]>({
    queryKey: ['onboardingEquipments'],
    queryFn: () => specialistsService.getEquipments(),
    staleTime: 10 * 60 * 1000,
  });

  const availableEquipments = useMemo(() => {
    if (!equipmentsData || equipmentsData.length === 0) {
      return AVAILABLE_EQUIPMENT_FALLBACK;
    }
    return equipmentsData;
  }, [equipmentsData]);

  const { data: objectivesData, isLoading: isLoadingObjectives } = useQuery<ObjectiveItem[]>({
    queryKey: ['onboardingObjectives'],
    queryFn: () => specialistsService.getObjectives(),
    staleTime: 10 * 60 * 1000,
  });

  const [customObjectiveText, setCustomObjectiveText] = useState('');

  const objectiveOptions: SelectOption[] = useMemo(() => {
    const list: SelectOption[] = (!objectivesData || objectivesData.length === 0)
      ? OBJECTIVES_FALLBACK
      : objectivesData.map(o => ({
          value: String(o.id_objetivo),
          label: o.nombre,
        }));

    if (!list.some(opt => opt.value === 'otro' || opt.label.toLowerCase() === 'otro')) {
      return [...list, { value: 'otro', label: 'Otro' }];
    }
    return list;
  }, [objectivesData]);

  useEffect(() => {
    if (objectiveOptions.length > 0 && !formData.id_objetivo) {
      setFormData(prev => ({ ...prev, id_objetivo: objectiveOptions[0].value }));
    }
  }, [objectiveOptions, formData.id_objetivo]);

  useEffect(() => {
    if (isCitySelectedRef.current) {
      isCitySelectedRef.current = false;
      return;
    }

    const trimmed = (formData.ciudad || '').trim();
    if (trimmed.length < 2) {
      setCityResults([]);
      setIsSearchingCity(false);
      setShowCityDropdown(false);
      return;
    }

    const controller = new AbortController();
    setIsSearchingCity(true);
    setShowCityDropdown(true);

    const timer = setTimeout(async () => {
      try {
        const results = await searchCitiesGeocoding(trimmed, controller.signal);
        setCityResults(results);
        setShowCityDropdown(true);
      } catch (err) {
        console.error('Error fetching cities:', err);
      } finally {
        setIsSearchingCity(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [formData.ciudad]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cityContainerRef.current && !cityContainerRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCityResult = (item: GeocodingResult) => {
    isCitySelectedRef.current = true;
    const formattedCity = [item.name, item.admin1, item.country].filter(Boolean).join(', ');
    const altitude = item.elevation !== undefined ? Math.round(item.elevation) : 0;
    const timezone = item.timezone || 'America/Guayaquil';

    setFormData(prev => ({
      ...prev,
      ciudad: formattedCity,
      altitud_msnm: altitude,
      timezone: timezone,
    }));
    setShowCityDropdown(false);
    toast.show(`Altitud (${altitude} msnm) y zona horaria (${timezone}) autocompletadas`, 'info');
  };

  // Injury form temporary state
  const [injuryForm, setInjuryForm] = useState<DetalleLesion>({
    zona_afectada: '',
    descripcion_molestia: '',
    nivel_dolor_eva: 3,
    tipo_lesion: 'activa',
  });
  const [showAddInjury, setShowAddInjury] = useState(false);

  const mutation = useMutation({
    mutationFn: (payload: RegisterPatientPayload) => specialistsService.registerPatient(payload),
    onSuccess: () => {
      toast.show('¡Paciente registrado con éxito! Credenciales enviadas por correo.', 'success');
      queryClient.invalidateQueries({ queryKey: ['specialistPatients'] });
      onSuccess?.();
      handleClose();
    },
    onError: (err: any) => {
      const detail = err?.response?.data?.detail || err?.response?.data?.message || err.message || 'Error al registrar paciente';
      toast.show(typeof detail === 'string' ? detail : JSON.stringify(detail), 'error');
    },
  });

  const handleClose = () => {
    setFormData(initialPayload);
    setCityResults([]);
    setShowCityDropdown(false);
    setCustomObjectiveText('');
    setErrors({});
    setStep(1);
    setShowAddInjury(false);
    onClose();
  };

  const updateField = <K extends keyof RegisterPatientPayload>(key: K, value: RegisterPatientPayload[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const updateDetalleObjetivo = <K extends keyof DetallesObjetivo>(key: K, value: DetallesObjetivo[K]) => {
    setFormData(prev => ({
      ...prev,
      detalles_objetivo: {
        ...(prev.detalles_objetivo || {}),
        [key]: value,
      },
    }));
  };

  const toggleDay = (dayId: string) => {
    const current = formData.dias_disponibles || [];
    const next = current.includes(dayId)
      ? current.filter(d => d !== dayId)
      : [...current, dayId];
    updateField('dias_disponibles', next);
  };

  const toggleEquipment = (equipId: number) => {
    const current = formData.equipamiento_ids || [];
    const next = current.includes(equipId)
      ? current.filter(id => id !== equipId)
      : [...current, equipId];
    updateField('equipamiento_ids', next);
  };

  const handleAddInjury = () => {
    if (!injuryForm.zona_afectada.trim()) {
      toast.show('Indica la zona afectada por la lesión', 'error');
      return;
    }
    const current = formData.detalles_lesiones || [];
    updateField('detalles_lesiones', [...current, { ...injuryForm }]);
    setInjuryForm({
      zona_afectada: '',
      descripcion_molestia: '',
      nivel_dolor_eva: 3,
      tipo_lesion: 'activa',
    });
    setShowAddInjury(false);
  };

  const handleRemoveInjury = (index: number) => {
    const current = formData.detalles_lesiones || [];
    updateField('detalles_lesiones', current.filter((_, i) => i !== index));
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
      if (!formData.email.trim()) {
        newErrors.email = 'El email es obligatorio';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Formato de email inválido';
      }
      if (!formData.genero || !formData.genero.trim()) {
        newErrors.genero = 'El género es obligatorio';
      }
      if (!formData.fecha_nacimiento || !formData.fecha_nacimiento.trim()) {
        newErrors.fecha_nacimiento = 'La fecha de nacimiento es obligatoria';
      }
    }

    if (currentStep === 3) {
      if (!formData.dias_disponibles || formData.dias_disponibles.length === 0) {
        newErrors.dias_disponibles = 'Selecciona al menos un día disponible';
        toast.show('Selecciona al menos un día disponible para entrenar', 'error');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrev = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (!validateStep(1) || !validateStep(3)) {
      toast.show('Por favor verifica los campos obligatorios', 'error');
      return;
    }
    mutation.mutate(formData);
  };

  const renderStepIndicators = () => {
    const steps = [
      { num: 1, label: 'Personal', icon: <User size={14} /> },
      { num: 2, label: 'Biometría', icon: <Activity size={14} /> },
      { num: 3, label: 'Planificación', icon: <Clock size={14} /> },
      { num: 4, label: 'Objetivo y Salud', icon: <Trophy size={14} /> },
    ];

    return (
      <div className="flex items-center justify-between w-full mb-5 border-b border-surface-border pb-3 select-none">
        {steps.map((s, idx) => (
          <div key={s.num} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  step === s.num
                    ? 'text-white ring-4'
                    : step > s.num
                    ? 'bg-emerald-500 text-white'
                    : 'bg-surface-card text-surface-muted border border-surface-border'
                }`}
                style={
                  step === s.num
                    ? { background: '#9B59B6', boxShadow: '0 0 0 4px rgba(155, 89, 182, 0.2)' }
                    : undefined
                }
              >
                {step > s.num ? <Check size={14} /> : s.icon}
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider mt-1 transition-colors ${
                  step === s.num ? 'text-white' : 'text-surface-muted'
                }`}
                style={step === s.num ? { color: '#9B59B6' } : undefined}
              >
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`flex-1 h-[2px] mx-2 -mt-3.5 transition-colors ${
                  step > s.num ? 'bg-emerald-500' : 'bg-surface-border'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Registrar Nuevo Paciente"
      className="max-w-2xl max-h-[90vh]"
    >
      <div className="flex flex-col h-full text-white">
        {/* Banner informativo de reglas de negocio */}
        <div className="flex items-start gap-2.5 p-2.5 mb-3 rounded-lg bg-surface-card border border-surface-border text-[11px] text-surface-muted">
          <Info size={15} className="shrink-0 mt-0.5" style={{ color: '#9B59B6' }} />
          <span>
            El paciente será asignado directamente bajo tu cargo con <strong className="text-white">membresía Coach</strong> y acceso automático a la app mediante credenciales generadas por correo.
          </span>
        </div>

        {renderStepIndicators()}

        <div className="flex-1 overflow-y-auto max-h-[56vh] pr-1 scrollbar-thin">
          {/* STEP 1: DATOS PERSONALES */}
          {step === 1 && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  label="Nombre Completo *"
                  placeholder="Ej: Juan Pérez"
                  value={formData.nombre}
                  onChange={e => updateField('nombre', e.target.value)}
                  iconPrefix={<User size={14} />}
                  error={errors.nombre}
                  required
                />
                <Input
                  label="Correo Electrónico *"
                  type="email"
                  placeholder="juan.perez@example.com"
                  value={formData.email}
                  onChange={e => updateField('email', e.target.value)}
                  iconPrefix={<Mail size={14} />}
                  error={errors.email}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  label="Apodo / Alias"
                  placeholder="Ej: Juancho"
                  value={formData.apodo || ''}
                  onChange={e => updateField('apodo', e.target.value)}
                />
                <Input
                  label="Teléfono"
                  placeholder="+593991234567"
                  value={formData.telefono || ''}
                  onChange={e => updateField('telefono', e.target.value)}
                  iconPrefix={<Phone size={14} />}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Select
                  label="Género *"
                  placeholder="Selecciona un género..."
                  options={GENDER_OPTIONS}
                  value={formData.genero || ''}
                  onChange={val => updateField('genero', val)}
                  error={errors.genero}
                />
                <Input
                  label="Fecha de Nacimiento *"
                  type="date"
                  value={formData.fecha_nacimiento || ''}
                  onChange={e => updateField('fecha_nacimiento', e.target.value)}
                  iconPrefix={<Calendar size={14} />}
                  error={errors.fecha_nacimiento}
                  required
                />
              </div>
            </div>
          )}

          {/* STEP 2: BIOMETRÍA Y UBICACIÓN */}
          {step === 2 && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      label="Peso"
                      type="number"
                      step="0.1"
                      placeholder="75.0"
                      value={formData.peso ?? ''}
                      onChange={e => updateField('peso', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="w-24">
                    <Select
                      label="Unidad"
                      options={[
                        { value: 'kg', label: 'kg' },
                        { value: 'lb', label: 'lb' },
                      ]}
                      value={formData.unidad_peso || 'kg'}
                      onChange={val => updateField('unidad_peso', val)}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      label="Altura"
                      type="number"
                      step="0.1"
                      placeholder="178"
                      value={formData.altura ?? ''}
                      onChange={e => updateField('altura', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="w-24">
                    <Select
                      label="Unidad"
                      options={[
                        { value: 'cm', label: 'cm' },
                        { value: 'm', label: 'm' },
                        { value: 'in', label: 'in' },
                      ]}
                      value={formData.unidad_altura || 'cm'}
                      onChange={val => updateField('unidad_altura', val)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="relative" ref={cityContainerRef}>
                  <Input
                    label="Ciudad (Buscador mundial)"
                    placeholder="Escribe una ciudad (ej: Bogotá, Quito, Chía...)"
                    value={formData.ciudad || ''}
                    onChange={e => {
                      isCitySelectedRef.current = false;
                      updateField('ciudad', e.target.value);
                    }}
                    onFocus={() => {
                      if ((formData.ciudad || '').trim().length >= 2) setShowCityDropdown(true);
                    }}
                    iconPrefix={<MapPin size={14} />}
                    iconSuffix={isSearchingCity ? <Loader2 size={13} className="animate-spin text-purple-400" /> : undefined}
                    autoComplete="off"
                  />
                  {showCityDropdown && (formData.ciudad || '').trim().length >= 2 && (
                    <div className="absolute top-[100%] left-0 w-full mt-1 bg-surface-panel border border-surface-border rounded-lg shadow-2xl z-50 flex flex-col p-1.5 max-h-[220px] overflow-y-auto scrollbar-thin">
                      <div className="px-2 py-1 text-[9px] uppercase tracking-wider text-surface-muted font-bold border-b border-surface-border mb-1 flex items-center justify-between">
                        <span>Ciudades encontradas</span>
                        {isSearchingCity ? (
                          <span className="text-[9px] text-purple-400 flex items-center gap-1">
                            <Loader2 size={10} className="animate-spin" /> Buscando...
                          </span>
                        ) : (
                          <span className="text-[9px] text-surface-muted font-normal">Open-Meteo Geocoding</span>
                        )}
                      </div>

                      {isSearchingCity && cityResults.length === 0 && (
                        <div className="p-3 text-xs text-center text-surface-muted flex items-center justify-center gap-2">
                          <Loader2 size={13} className="animate-spin text-purple-400" />
                          <span>Buscando ciudades...</span>
                        </div>
                      )}

                      {!isSearchingCity && cityResults.length === 0 && (
                        <div className="p-3 text-xs text-center text-surface-muted">
                          No se encontraron resultados para "{formData.ciudad}"
                        </div>
                      )}

                      {cityResults.map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onMouseDown={() => handleSelectCityResult(item)}
                          className="flex items-center justify-between p-2 rounded-md hover:bg-surface-card transition-colors text-left group cursor-pointer"
                        >
                          <div className="flex flex-col pr-2">
                            <span className="text-xs font-semibold text-white group-hover:text-purple-400 transition-colors">
                              {item.name}
                            </span>
                            <span className="text-[10px] text-surface-muted truncate">
                              {[item.admin1, item.country].filter(Boolean).join(', ')}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 text-right">
                            {item.elevation !== undefined && (
                              <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-surface-card border border-surface-border text-purple-300">
                                {Math.round(item.elevation).toLocaleString()} msnm
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <Input
                  label="Altitud (msnm)"
                  type="number"
                  placeholder="2850"
                  value={formData.altitud_msnm ?? ''}
                  onChange={e => updateField('altitud_msnm', parseInt(e.target.value) || 0)}
                />
              </div>

              <Select
                label="Zona Horaria (Timezone)"
                options={timezoneOptions}
                value={formData.timezone || 'America/Guayaquil'}
                onChange={val => updateField('timezone', val)}
              />
            </div>
          )}

          {/* STEP 3: PLANIFICACIÓN DEPORTIVA */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Select
                  label="Disciplina Deportiva"
                  options={disciplineOptions}
                  value={formData.id_disciplina ? String(formData.id_disciplina) : (disciplineOptions[0]?.value || '1')}
                  onChange={val => updateField('id_disciplina', parseInt(val))}
                  placeholder={isLoadingDisciplinas ? 'Cargando disciplinas...' : 'Selecciona una disciplina...'}
                />
                <Select
                  label="Nivel de Dificultad"
                  options={DIFFICULTY_LEVELS}
                  value={formData.nivel_dificultad || 'intermedio'}
                  onChange={val => updateField('nivel_dificultad', val)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  label="Fecha de Inicio Deseada"
                  type="date"
                  value={formData.fecha_inicio_deseada || ''}
                  onChange={e => updateField('fecha_inicio_deseada', e.target.value)}
                  iconPrefix={<Calendar size={14} />}
                />
                <Input
                  label="Tiempo por Sesión (min)"
                  type="number"
                  placeholder="60"
                  value={formData.tiempo_por_sesion ?? ''}
                  onChange={e => updateField('tiempo_por_sesion', parseInt(e.target.value) || 0)}
                  iconPrefix={<Clock size={14} />}
                />
              </div>

              {/* Días Disponibles */}
              <div>
                <label className="text-[11px] font-bold text-surface-muted uppercase tracking-wider block mb-1.5">
                  Días Disponibles para Entrenar *
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {DAYS_OF_WEEK.map(d => {
                    const isSelected = (formData.dias_disponibles || []).includes(d.id);
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => toggleDay(d.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                          isSelected
                            ? 'text-white border-transparent'
                            : 'bg-surface-card border-surface-border text-surface-muted hover:text-white'
                        }`}
                        style={isSelected ? { background: '#9B59B6' } : undefined}
                      >
                        {d.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Equipamiento disponible */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold text-surface-muted uppercase tracking-wider block">
                    Equipamiento / Implementos Disponibles
                  </label>
                  {isLoadingEquipments && (
                    <span className="text-[10px] text-surface-muted flex items-center gap-1">
                      <Loader2 size={10} className="animate-spin text-purple-400" /> Cargando catálogo...
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-[190px] overflow-y-auto scrollbar-thin pr-1">
                  {availableEquipments.map(eq => {
                    const isChecked = (formData.equipamiento_ids || []).includes(eq.id_implemento);
                    return (
                      <button
                        key={eq.id_implemento}
                        type="button"
                        onClick={() => toggleEquipment(eq.id_implemento)}
                        className={`flex items-center gap-2 p-2 rounded-lg text-left text-xs border transition-all ${
                          isChecked
                            ? 'bg-purple-950/20 border-purple-500/40 text-white'
                            : 'bg-surface-card border-surface-border text-surface-muted hover:text-white'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                            isChecked
                              ? 'text-white border-transparent'
                              : 'border-surface-border bg-surface-card'
                          }`}
                          style={isChecked ? { background: '#9B59B6' } : undefined}
                        >
                          {isChecked && <Check size={11} />}
                        </div>
                        <span className="truncate">{eq.nombre}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Toggle ciclo menstrual */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-card border border-surface-border">
                <div>
                  <span className="text-xs font-semibold text-white block">Adaptación al ciclo menstrual</span>
                  <span className="text-[11px] text-surface-muted block">
                    Ajustar cargas y fases de entrenamiento según el ciclo menstrual del paciente.
                  </span>
                </div>
                <Toggle
                  checked={formData.adaptacion_ciclo_menstrual ?? false}
                  onChange={v => updateField('adaptacion_ciclo_menstrual', v)}
                />
              </div>
            </div>
          )}

          {/* STEP 4: OBJETIVO, LESIONES Y NOTAS */}
          {step === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-2">
                <Select
                  label="Objetivo Principal"
                  options={objectiveOptions}
                  value={formData.id_objetivo !== undefined ? String(formData.id_objetivo) : (objectiveOptions[0]?.value || '1')}
                  onChange={val => updateField('id_objetivo', val)}
                  placeholder={isLoadingObjectives ? 'Cargando objetivos...' : 'Selecciona un objetivo...'}
                />

                {String(formData.id_objetivo) === 'otro' && (
                  <div className="animate-fadeIn">
                    <Input
                      label="Especificar Otro Objetivo *"
                      placeholder="Describe el objetivo personalizado del paciente..."
                      value={customObjectiveText}
                      onChange={e => {
                        const val = e.target.value;
                        setCustomObjectiveText(val);
                        updateDetalleObjetivo('nombre_competencia', val);
                      }}
                      required
                    />
                  </div>
                )}
              </div>

              {/* Detalles de objetivo / competencia */}
              <div className="p-3 rounded-lg bg-surface-card border border-surface-border space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                  <Trophy size={14} style={{ color: '#9B59B6' }} />
                  <span>Detalles de la Competencia / Meta</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <Input
                    label="Nombre de la Competencia"
                    placeholder="Ej: Maratón Quito 2026"
                    value={formData.detalles_objetivo?.nombre_competencia || ''}
                    onChange={e => updateDetalleObjetivo('nombre_competencia', e.target.value)}
                  />
                  <Input
                    label="Fecha de la Competencia"
                    type="date"
                    value={formData.detalles_objetivo?.fecha_competencia || ''}
                    onChange={e => updateDetalleObjetivo('fecha_competencia', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  <div className="flex gap-1.5">
                    <div className="flex-1">
                      <Input
                        label="Distancia"
                        type="number"
                        step="0.01"
                        placeholder="42.195"
                        value={formData.detalles_objetivo?.distancia_objetivo ?? ''}
                        onChange={e => updateDetalleObjetivo('distancia_objetivo', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="w-20">
                      <Select
                        label="Unidad"
                        options={[
                          { value: 'km', label: 'km' },
                          { value: 'mi', label: 'mi' },
                        ]}
                        value={formData.detalles_objetivo?.unidad_distancia || 'km'}
                        onChange={val => updateDetalleObjetivo('unidad_distancia', val)}
                      />
                    </div>
                  </div>

                  <Input
                    label="Desnivel (+m)"
                    type="number"
                    placeholder="450"
                    value={formData.detalles_objetivo?.desnivel_m ?? ''}
                    onChange={e => updateDetalleObjetivo('desnivel_m', parseInt(e.target.value) || 0)}
                  />

                  <Input
                    label="Altitud Destino (m)"
                    type="number"
                    placeholder="2850"
                    value={formData.detalles_objetivo?.altitud_destino_m ?? ''}
                    onChange={e => updateDetalleObjetivo('altitud_destino_m', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              {/* Lesiones y Molestias */}
              <div className="p-3 rounded-lg bg-surface-card border border-surface-border space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                    <AlertTriangle size={14} className="text-amber-400" />
                    <span>Lesiones y Molestias Físicas</span>
                  </div>
                  {!showAddInjury && (
                    <button
                      type="button"
                      onClick={() => setShowAddInjury(true)}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-400 hover:text-purple-300"
                    >
                      <Plus size={13} />
                      Agregar lesión
                    </button>
                  )}
                </div>

                {/* Lista de lesiones registradas */}
                {formData.detalles_lesiones && formData.detalles_lesiones.length > 0 ? (
                  <div className="space-y-2">
                    {formData.detalles_lesiones.map((lesion, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-surface-panel border border-surface-border text-xs"
                      >
                        <div className="flex-1 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white capitalize">{lesion.zona_afectada}</span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-950/40 text-red-400 border border-red-800/30">
                              EVA {lesion.nivel_dolor_eva}/10
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-950/40 text-purple-300 border border-purple-800/30 capitalize">
                              {lesion.tipo_lesion}
                            </span>
                          </div>
                          {lesion.descripcion_molestia && (
                            <p className="text-[11px] text-surface-muted mt-0.5">{lesion.descripcion_molestia}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveInjury(index)}
                          className="p-1 rounded text-surface-muted hover:text-red-400 hover:bg-surface-card transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : !showAddInjury ? (
                  <p className="text-[11px] text-surface-muted">No se han registrado lesiones activas para este paciente.</p>
                ) : null}

                {/* Sub-formulario para agregar lesión */}
                {showAddInjury && (
                  <div className="p-3 rounded-lg bg-surface-panel border border-surface-border space-y-2.5 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Input
                        label="Zona Afectada *"
                        placeholder="Ej: Rodilla derecha, Gemelo..."
                        value={injuryForm.zona_afectada}
                        onChange={e => setInjuryForm(prev => ({ ...prev, zona_afectada: e.target.value }))}
                      />
                      <Select
                        label="Tipo de Lesión"
                        options={[
                          { value: 'activa', label: 'Activa' },
                          { value: 'en_recuperacion', label: 'En recuperación' },
                          { value: 'cronica', label: 'Crónica' },
                        ]}
                        value={injuryForm.tipo_lesion}
                        onChange={val => setInjuryForm(prev => ({ ...prev, tipo_lesion: val }))}
                      />
                    </div>

                    <Input
                      label="Descripción de la Molestia"
                      placeholder="Ej: Tendinopatía rotuliana leve al descender cuestas"
                      value={injuryForm.descripcion_molestia}
                      onChange={e => setInjuryForm(prev => ({ ...prev, descripcion_molestia: e.target.value }))}
                    />

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-surface-muted uppercase tracking-wider">
                          Nivel de Dolor Escala EVA: {injuryForm.nivel_dolor_eva}/10
                        </label>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={injuryForm.nivel_dolor_eva}
                        onChange={e => setInjuryForm(prev => ({ ...prev, nivel_dolor_eva: parseInt(e.target.value) }))}
                        className="w-full accent-purple-500 cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] text-surface-muted px-1">
                        <span>1 (Leve)</span>
                        <span>5 (Moderado)</span>
                        <span>10 (Severo)</span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAddInjury(false)}
                        className="text-xs"
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={handleAddInjury}
                        className="text-xs"
                        style={{ background: '#9B59B6' }}
                      >
                        Guardar Lesión
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Notas del especialista */}
              <div className="flex flex-col gap-1 w-full">
                <label className="text-[11px] font-bold text-surface-muted uppercase tracking-wider">
                  Notas Clínicas / Observaciones
                </label>
                <textarea
                  rows={2}
                  value={formData.notas || ''}
                  onChange={e => updateField('notas', e.target.value)}
                  placeholder="Ej: Paciente con buena base aeróbica, cuidar articulaciones de rodilla..."
                  className="w-full text-[12px] bg-surface-card border border-surface-border rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 placeholder:text-surface-muted resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="mt-4 pt-3 border-t border-surface-border flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={handlePrev}
            disabled={step === 1 || mutation.isPending}
            className="text-surface-muted hover:text-white"
          >
            <ChevronLeft size={14} className="mr-1" />
            Anterior
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={mutation.isPending}
              className="text-surface-muted hover:text-white"
            >
              Cancelar
            </Button>

            {step < 4 ? (
              <Button
                type="button"
                variant="primary"
                onClick={handleNext}
                style={{ background: '#9B59B6' }}
              >
                Siguiente
                <ChevronRight size={14} className="ml-1" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                onClick={handleSubmit}
                disabled={mutation.isPending}
                style={{ background: '#9B59B6' }}
              >
                {mutation.isPending ? 'Registrando...' : 'Registrar Paciente'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
