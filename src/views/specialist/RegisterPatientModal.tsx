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
  Info,
  Loader2,
  Timer,
  Sun,
  Mountain,
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

export type DisciplineCategory =
  | 'trail_running'
  | 'triatlon'
  | 'ciclismo_ruta'
  | 'mtb'
  | 'senderismo'
  | 'acondicionamiento'
  | 'deportiva_general';

export type ObjectiveType = 'competencia' | 'mejorar_tiempo' | 'condicion_general' | 'otro';

export function getDisciplineCategory(disciplines: DisciplinaItem[], id?: number): DisciplineCategory {
  if (!id) return 'trail_running';
  const found = disciplines.find(d => d.id_disciplina === id);
  const name = (found?.nombre || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  if (name.includes('senderismo') || name.includes('trekking') || name.includes('hiking')) {
    return 'senderismo';
  }
  if (name.includes('acondicionamiento') || name.includes('fuerza') || name.includes('funcional') || name.includes('gimnasio')) {
    return 'acondicionamiento';
  }
  if (name.includes('trail')) {
    return 'trail_running';
  }
  if (name.includes('triat')) {
    return 'triatlon';
  }
  if (name.includes('mtb') || name.includes('montana')) {
    return 'mtb';
  }
  if (name.includes('ruta') || name.includes('ciclismo')) {
    return 'ciclismo_ruta';
  }
  return 'deportiva_general';
}

export interface PreconfiguredTest {
  id: string;
  label: string;
  distanceKm?: number;
}

export const SPORT_TESTS: Record<DisciplineCategory, PreconfiguredTest[]> = {
  trail_running: [
    { id: '5k', label: '5K', distanceKm: 5 },
    { id: '10k', label: '10K', distanceKm: 10 },
    { id: '21k', label: '21K', distanceKm: 21 },
    { id: '42k', label: '42K', distanceKm: 42.195 },
    { id: 'otro', label: 'Otro' },
  ],
  triatlon: [
    { id: 'sprint', label: 'Sprint', distanceKm: 25.75 },
    { id: 'olimpico', label: 'Olímpico', distanceKm: 51.5 },
    { id: '70.3', label: '70.3', distanceKm: 113 },
    { id: 'ironman', label: 'Ironman Completo', distanceKm: 226 },
    { id: 'otro', label: 'Otro' },
  ],
  ciclismo_ruta: [
    { id: 'paseo_salud', label: 'Paseo/Salud (30-60 km)', distanceKm: 45 },
    { id: 'fondo_medio', label: 'Fondo medio (80-120 km)', distanceKm: 100 },
    { id: 'gran_fondo', label: 'Gran Fondo (160-200 km)', distanceKm: 180 },
    { id: 'otro', label: 'Otro' },
  ],
  mtb: [
    { id: 'xc_corto', label: 'Cross-Country corto (<30 km)', distanceKm: 25 },
    { id: 'xc_largo', label: 'XC largo (30-60 km)', distanceKm: 45 },
    { id: 'enduro', label: 'Enduro' },
    { id: 'descenso', label: 'Descenso' },
    { id: 'otro', label: 'Otro' },
  ],
  senderismo: [
    { id: 'corta', label: 'Ruta corta (<10 km)', distanceKm: 8 },
    { id: 'media', label: 'Ruta media (10-20 km)', distanceKm: 15 },
    { id: 'larga', label: 'Trekking largo (>20 km)', distanceKm: 25 },
    { id: 'otro', label: 'Otro' },
  ],
  acondicionamiento: [
    { id: 'general', label: 'General' },
    { id: 'otro', label: 'Otro' },
  ],
  deportiva_general: [
    { id: '5k', label: '5K', distanceKm: 5 },
    { id: '10k', label: '10K', distanceKm: 10 },
    { id: '21k', label: '21K', distanceKm: 21 },
    { id: '42k', label: '42K', distanceKm: 42.195 },
    { id: 'otro', label: 'Otro' },
  ],
};

export const CG_CATEGORIES: SelectOption[] = [
  { value: 'Fuerza / Musculación', label: 'Fuerza / Musculación' },
  { value: 'Movilidad, Flexibilidad y Respiración', label: 'Movilidad, Flexibilidad y Respiración' },
  { value: 'Cardio General', label: 'Cardio General' },
];

export const CG_SUBCATEGORIES: Record<string, SelectOption[]> = {
  'Fuerza / Musculación': [
    { value: 'Tonificación / salud general', label: 'Tonificación / salud general' },
    { value: 'Hipertrofia (masa muscular)', label: 'Hipertrofia (masa muscular)' },
    { value: 'Fuerza máxima', label: 'Fuerza máxima' },
    { value: 'Recomposición corporal', label: 'Recomposición corporal' },
  ],
  'Movilidad, Flexibilidad y Respiración': [
    { value: 'Movilidad articular básica', label: 'Movilidad articular básica' },
    { value: 'Yoga funcional / Flexibilidad', label: 'Yoga funcional / Flexibilidad' },
    { value: 'Respiración / Mindfulness activo', label: 'Respiración / Mindfulness activo' },
  ],
  'Cardio General': [
    { value: 'Salud CV básica (20-30 min x3/sem)', label: 'Salud CV básica (20-30 min x3/sem)' },
    { value: 'Cardio zona 2 (fat burning, 45-60 min)', label: 'Cardio zona 2 (fat burning, 45-60 min)' },
    { value: 'Cardio largo (>60 min constante)', label: 'Cardio largo (>60 min constante)' },
  ],
};

function parseTimeToSeconds(timeStr?: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.split(':').map(val => parseInt(val, 10) || 0);
  const h = parts[0] || 0;
  const m = parts[1] || 0;
  const s = parts[2] || 0;
  return h * 3600 + m * 60 + s;
}

function formatSecondsToHMS(seconds: number): string {
  const isNegative = seconds < 0;
  const abs = Math.abs(seconds);
  const h = Math.floor(abs / 3600);
  const m = Math.floor((abs % 3600) / 60);
  const s = abs % 60;
  const sign = isNegative ? '-' : '+';
  if (h > 0) {
    return `${sign}${h}h ${m}m ${s}s`;
  }
  return `${sign}${m}m ${s}s`;
}

interface TimeInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

const TimeInput: React.FC<TimeInputProps> = ({ label, value, onChange, error }) => {
  const parts = (value || '00:00:00').split(':');
  const [hh, setHh] = useState(parts[0] || '00');
  const [mm, setMm] = useState(parts[1] || '00');
  const [ss, setSs] = useState(parts[2] || '00');

  useEffect(() => {
    const p = (value || '00:00:00').split(':');
    setHh(p[0] || '00');
    setMm(p[1] || '00');
    setSs(p[2] || '00');
  }, [value]);

  const update = (newH: string, newM: string, newS: string) => {
    const h = newH.replace(/\D/g, '').slice(0, 2).padStart(2, '0');
    const mNum = Math.min(59, Math.max(0, parseInt(newM.replace(/\D/g, '') || '0', 10)));
    const m = String(mNum).padStart(2, '0');
    const sNum = Math.min(59, Math.max(0, parseInt(newS.replace(/\D/g, '') || '0', 10)));
    const s = String(sNum).padStart(2, '0');
    onChange(`${h}:${m}:${s}`);
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-[11px] font-bold text-surface-muted uppercase tracking-wider">
        {label}
      </label>
      <div
        className={`flex items-center justify-between bg-surface-card border rounded-lg px-2.5 py-1.5 ${
          error ? 'border-red-500' : 'border-surface-border focus-within:border-purple-500'
        }`}
      >
        <div className="flex items-center gap-1.5 font-mono text-sm text-white">
          <input
            type="text"
            inputMode="numeric"
            maxLength={2}
            value={hh}
            onChange={e => {
              setHh(e.target.value);
              update(e.target.value, mm, ss);
            }}
            className="w-7 text-center bg-transparent focus:outline-none focus:text-purple-300 font-mono font-semibold"
            placeholder="00"
          />
          <span className="text-surface-muted font-bold">:</span>
          <input
            type="text"
            inputMode="numeric"
            maxLength={2}
            value={mm}
            onChange={e => {
              setMm(e.target.value);
              update(hh, e.target.value, ss);
            }}
            className="w-7 text-center bg-transparent focus:outline-none focus:text-purple-300 font-mono font-semibold"
            placeholder="00"
          />
          <span className="text-surface-muted font-bold">:</span>
          <input
            type="text"
            inputMode="numeric"
            maxLength={2}
            value={ss}
            onChange={e => {
              setSs(e.target.value);
              update(hh, mm, e.target.value);
            }}
            className="w-7 text-center bg-transparent focus:outline-none focus:text-purple-300 font-mono font-semibold"
            placeholder="00"
          />
        </div>
        <span className="text-[10px] text-surface-muted font-mono uppercase tracking-wider">
          HH:MM:SS
        </span>
      </div>
      {error && <span className="text-[10px] text-red-400">{error}</span>}
    </div>
  );
};

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
  { value: '1', label: 'Trail running' },
  { value: '2', label: 'Triatlón' },
  { value: '3', label: 'Ciclismo de ruta' },
  { value: '4', label: 'MTB' },
  { value: '5', label: 'Senderismo' },
  { value: '6', label: 'Acondicionamiento' },
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
  id_objetivo: 'competencia',
  detalles_objetivo: {
    nombre_competencia: '',
    fecha_competencia: '',
    distancia_objetivo: 10,
    unidad_distancia: 'km',
    desnivel_m: 0,
    altitud_destino_m: 0,
    requiere_aclimatacion_calor: false,
    prueba_preconfigurada: '10K',
    modalidad_mejora_tiempo: '10K',
    tiempo_actual: '00:50:00',
    tiempo_meta: '00:45:00',
    que_quieres_mejorar_cg: 'Fuerza / Musculación',
    objetivo_especifico_cg: 'Tonificación / salud general',
    descripcion_otro_objetivo: '',
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

  const { data: objectivesData } = useQuery<ObjectiveItem[]>({
    queryKey: ['onboardingObjectives'],
    queryFn: () => specialistsService.getObjectives(),
    staleTime: 10 * 60 * 1000,
  });

  // Calculate Discipline Category dynamically
  const disciplineCategory = useMemo<DisciplineCategory>(() => {
    const list = disciplinasData && disciplinasData.length > 0
      ? disciplinasData
      : DISCIPLINES_FALLBACK.map(d => ({
          id_disciplina: Number(d.value),
          nombre: d.label,
          descripcion: '',
        }));
    return getDisciplineCategory(list, formData.id_disciplina);
  }, [disciplinasData, formData.id_disciplina]);

  const selectedDisciplineName = useMemo(() => {
    const found = disciplineOptions.find(d => Number(d.value) === formData.id_disciplina);
    return found?.label || 'Trail running';
  }, [disciplineOptions, formData.id_disciplina]);

  // Allowed objectives according to discipline rules
  const allowedObjectiveTypes = useMemo<ObjectiveType[]>(() => {
    if (disciplineCategory === 'acondicionamiento') {
      return ['condicion_general', 'otro'];
    }
    if (disciplineCategory === 'senderismo') {
      return ['mejorar_tiempo', 'condicion_general', 'otro'];
    }
    return ['competencia', 'mejorar_tiempo', 'condicion_general', 'otro'];
  }, [disciplineCategory]);

  const [selectedObjectiveType, setSelectedObjectiveType] = useState<ObjectiveType>('competencia');

  const handleSelectObjectiveType = (type: ObjectiveType) => {
    setSelectedObjectiveType(type);

    // Sync id_objetivo with backend catalog if available
    let matchedId: string | number = type;
    if (objectivesData && objectivesData.length > 0) {
      const matched = objectivesData.find(o => {
        const n = o.nombre.toLowerCase();
        if (type === 'competencia') return n.includes('competenc') || n.includes('evento');
        if (type === 'mejorar_tiempo') return n.includes('tiempo') || n.includes('rendimiento') || n.includes('marca');
        if (type === 'condicion_general') return n.includes('condici') || n.includes('general') || n.includes('fuerza') || n.includes('grasa');
        return n.includes('otro');
      });
      if (matched) matchedId = matched.id_objetivo;
    }
    updateField('id_objetivo', matchedId);
  };

  // Auto-fallback if current objective is not allowed in new discipline
  useEffect(() => {
    if (!allowedObjectiveTypes.includes(selectedObjectiveType)) {
      const fallback = allowedObjectiveTypes[0];
      setSelectedObjectiveType(fallback);
      handleSelectObjectiveType(fallback);
    }
  }, [allowedObjectiveTypes, selectedObjectiveType]);

  // City geocoding search
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
    }, 350);

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
    setShowCityDropdown(false);

    const fullCityName = item.country ? `${item.name}, ${item.country}` : item.name;
    const elevation = item.elevation !== undefined ? Math.round(item.elevation) : 0;
    const tz = item.timezone || formData.timezone || 'America/Guayaquil';

    setFormData(prev => ({
      ...prev,
      ciudad: fullCityName,
      altitud_msnm: elevation,
      timezone: tz,
    }));
  };

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
      toast.show('¡Paciente registrado exitosamente!', 'success');
      queryClient.invalidateQueries({ queryKey: ['specialistPatients'] });
      queryClient.invalidateQueries({ queryKey: ['specialistDashboard'] });
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
    setErrors({});
    setStep(1);
    setShowAddInjury(false);
    setSelectedObjectiveType('competencia');
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
                className={`text-[10px] mt-1 font-semibold uppercase tracking-wider ${
                  step === s.num ? 'text-purple-400' : 'text-surface-muted'
                }`}
              >
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 -mt-3.5 transition-all ${
                  step > s.num ? 'bg-emerald-500' : 'bg-surface-border'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  // Preconfigured tests for current sport
  const currentSportTests = SPORT_TESTS[disciplineCategory] || SPORT_TESTS.deportiva_general;

  // Time difference metrics for 'mejorar_tiempo'
  const timeDifferenceSec = useMemo(() => {
    if (selectedObjectiveType !== 'mejorar_tiempo') return null;
    const actualSec = parseTimeToSeconds(formData.detalles_objetivo?.tiempo_actual);
    const metaSec = parseTimeToSeconds(formData.detalles_objetivo?.tiempo_meta);
    if (!actualSec || !metaSec) return null;
    return metaSec - actualSec;
  }, [selectedObjectiveType, formData.detalles_objetivo?.tiempo_actual, formData.detalles_objetivo?.tiempo_meta]);

  const activeCgCategory = formData.detalles_objetivo?.que_quieres_mejorar_cg || 'Fuerza / Musculación';
  const availableCgSubcategories = CG_SUBCATEGORIES[activeCgCategory] || CG_SUBCATEGORIES['Fuerza / Musculación'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Registrar Nuevo Paciente"
      className="max-w-2xl w-full"
    >
      <div className="space-y-4 max-h-[75vh] overflow-y-auto scrollbar-thin px-1">
        {/* Banner informativo coach */}
        <div className="p-3 rounded-lg bg-surface-card border border-surface-border flex items-start gap-2.5 text-xs text-surface-muted">
          <Info size={16} className="shrink-0 text-purple-400 mt-0.5" />
          <div>
            El paciente será asignado directamente bajo tu cargo con <strong className="text-white">membresía Coach</strong> y acceso automático a la app mediante credenciales generadas por correo.
          </div>
        </div>

        {renderStepIndicators()}

        <form onSubmit={e => e.preventDefault()}>
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

          {/* STEP 4: OBJETIVO ACOPLADO, LESIONES Y NOTAS */}
          {step === 4 && (
            <div className="space-y-4 animate-fadeIn">
              {/* Contexto de la disciplina */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-card border border-surface-border text-xs">
                <div className="flex items-center gap-2 text-surface-muted">
                  <Activity size={14} className="text-purple-400" />
                  <span>Disciplina seleccionada:</span>
                  <strong className="text-white">{selectedDisciplineName}</strong>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950/40 border border-purple-800/40 text-purple-300 font-semibold uppercase tracking-wider">
                  {disciplineCategory === 'acondicionamiento' ? 'Acondicionamiento' : disciplineCategory === 'senderismo' ? 'Senderismo' : 'Deporte'}
                </span>
              </div>

              {/* Selector de Objetivos Acoplados a la Disciplina */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-surface-muted uppercase tracking-wider block">
                  Objetivo Principal del Paciente *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  {/* Tarjeta Competencia (Solo para deportes) */}
                  {allowedObjectiveTypes.includes('competencia') && (
                    <button
                      type="button"
                      onClick={() => handleSelectObjectiveType('competencia')}
                      className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-all ${
                        selectedObjectiveType === 'competencia'
                          ? 'border-purple-500 bg-purple-950/25 ring-1 ring-purple-500'
                          : 'border-surface-border bg-surface-card hover:border-surface-border/80 text-surface-muted hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <Trophy size={16} className={selectedObjectiveType === 'competencia' ? 'text-purple-400' : 'text-surface-muted'} />
                        {selectedObjectiveType === 'competencia' && <Check size={14} className="text-purple-400" />}
                      </div>
                      <span className="text-xs font-bold text-white block mb-0.5">Competencia</span>
                      <span className="text-[10px] text-surface-muted leading-tight">
                        Preparar carrera o evento
                      </span>
                    </button>
                  )}

                  {/* Tarjeta Mejorar Tiempo */}
                  {allowedObjectiveTypes.includes('mejorar_tiempo') && (
                    <button
                      type="button"
                      onClick={() => handleSelectObjectiveType('mejorar_tiempo')}
                      className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-all ${
                        selectedObjectiveType === 'mejorar_tiempo'
                          ? 'border-purple-500 bg-purple-950/25 ring-1 ring-purple-500'
                          : 'border-surface-border bg-surface-card hover:border-surface-border/80 text-surface-muted hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <Timer size={16} className={selectedObjectiveType === 'mejorar_tiempo' ? 'text-purple-400' : 'text-surface-muted'} />
                        {selectedObjectiveType === 'mejorar_tiempo' && <Check size={14} className="text-purple-400" />}
                      </div>
                      <span className="text-xs font-bold text-white block mb-0.5">Mejorar tiempo</span>
                      <span className="text-[10px] text-surface-muted leading-tight">
                        Ritmo actual vs meta
                      </span>
                    </button>
                  )}

                  {/* Tarjeta Condición General */}
                  {allowedObjectiveTypes.includes('condicion_general') && (
                    <button
                      type="button"
                      onClick={() => handleSelectObjectiveType('condicion_general')}
                      className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-all ${
                        selectedObjectiveType === 'condicion_general'
                          ? 'border-purple-500 bg-purple-950/25 ring-1 ring-purple-500'
                          : 'border-surface-border bg-surface-card hover:border-surface-border/80 text-surface-muted hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <Dumbbell size={16} className={selectedObjectiveType === 'condicion_general' ? 'text-purple-400' : 'text-surface-muted'} />
                        {selectedObjectiveType === 'condicion_general' && <Check size={14} className="text-purple-400" />}
                      </div>
                      <span className="text-xs font-bold text-white block mb-0.5">Condición general</span>
                      <span className="text-[10px] text-surface-muted leading-tight">
                        Fuerza, movilidad o cardio
                      </span>
                    </button>
                  )}

                  {/* Tarjeta Otro */}
                  {allowedObjectiveTypes.includes('otro') && (
                    <button
                      type="button"
                      onClick={() => handleSelectObjectiveType('otro')}
                      className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-all ${
                        selectedObjectiveType === 'otro'
                          ? 'border-purple-500 bg-purple-950/25 ring-1 ring-purple-500'
                          : 'border-surface-border bg-surface-card hover:border-surface-border/80 text-surface-muted hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <Sparkles size={16} className={selectedObjectiveType === 'otro' ? 'text-purple-400' : 'text-surface-muted'} />
                        {selectedObjectiveType === 'otro' && <Check size={14} className="text-purple-400" />}
                      </div>
                      <span className="text-xs font-bold text-white block mb-0.5">Otro</span>
                      <span className="text-[10px] text-surface-muted leading-tight">
                        Objetivo a medida
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* 1. SECCIÓN COMPETENCIA */}
              {selectedObjectiveType === 'competencia' && (
                <div className="p-3.5 rounded-lg bg-surface-card border border-surface-border space-y-3.5 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-surface-border pb-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                      <Trophy size={14} className="text-purple-400" />
                      <span>Preparar Evento / Carrera</span>
                    </div>
                    <span className="text-[10px] text-surface-muted">
                      Pruebas preconfiguradas para {selectedDisciplineName}
                    </span>
                  </div>

                  {/* Selector de pruebas preconfiguradas según el deporte */}
                  <div>
                    <label className="text-[11px] font-bold text-surface-muted uppercase tracking-wider block mb-1.5">
                      Prueba Preconfigurada de la Disciplina
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {currentSportTests.map(test => {
                        const isSelected = formData.detalles_objetivo?.prueba_preconfigurada === test.label;
                        return (
                          <button
                            key={test.id}
                            type="button"
                            onClick={() => {
                              updateDetalleObjetivo('prueba_preconfigurada', test.label);
                              if (test.distanceKm !== undefined) {
                                updateDetalleObjetivo('distancia_objetivo', test.distanceKm);
                              }
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                              isSelected
                                ? 'text-white border-transparent'
                                : 'bg-surface-panel border-surface-border text-surface-muted hover:text-white'
                            }`}
                            style={isSelected ? { background: '#9B59B6' } : undefined}
                          >
                            {test.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    <Input
                      label="Nombre de la Competencia *"
                      placeholder="Ej: Maratón de Montaña, Ironman 70.3..."
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
                          label="Distancia Objetivo (km) *"
                          type="number"
                          step="0.1"
                          placeholder="42.2"
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
                      placeholder="Ej: 450"
                      value={formData.detalles_objetivo?.desnivel_m ?? ''}
                      onChange={e => updateDetalleObjetivo('desnivel_m', parseInt(e.target.value) || 0)}
                      iconPrefix={<Mountain size={13} className="text-surface-muted" />}
                    />

                    <Input
                      label="Altitud Destino (msnm)"
                      type="number"
                      placeholder="Ej: 2850"
                      value={formData.detalles_objetivo?.altitud_destino_m ?? ''}
                      onChange={e => updateDetalleObjetivo('altitud_destino_m', parseInt(e.target.value) || 0)}
                    />
                  </div>

                  {/* Toggle Aclimatación al calor */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-panel border border-surface-border">
                    <div className="flex items-center gap-2">
                      <Sun size={15} className="text-amber-400" />
                      <div>
                        <span className="text-xs font-semibold text-white block">
                          Requiere aclimatación al calor
                        </span>
                        <span className="text-[10px] text-surface-muted block">
                          Ajusta la hidratación y adaptación térmica si el evento es en clima cálido o húmedo.
                        </span>
                      </div>
                    </div>
                    <Toggle
                      checked={formData.detalles_objetivo?.requiere_aclimatacion_calor ?? false}
                      onChange={v => updateDetalleObjetivo('requiere_aclimatacion_calor', v)}
                    />
                  </div>
                </div>
              )}

              {/* 2. SECCIÓN MEJORAR TIEMPO */}
              {selectedObjectiveType === 'mejorar_tiempo' && (
                <div className="p-3.5 rounded-lg bg-surface-card border border-surface-border space-y-3.5 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-surface-border pb-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                      <Timer size={14} className="text-purple-400" />
                      <span>Mejorar Tiempo (Ritmo Actual vs Meta)</span>
                    </div>
                    <span className="text-[10px] text-surface-muted">
                      {selectedDisciplineName}
                    </span>
                  </div>

                  {/* Modalidad / distancia de la disciplina */}
                  <div>
                    <label className="text-[11px] font-bold text-surface-muted uppercase tracking-wider block mb-1.5">
                      Distancia / Modalidad de Mejora
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      {currentSportTests.map(test => {
                        const isSelected = formData.detalles_objetivo?.modalidad_mejora_tiempo === test.label;
                        return (
                          <button
                            key={test.id}
                            type="button"
                            onClick={() => {
                              updateDetalleObjetivo('modalidad_mejora_tiempo', test.label);
                              if (test.distanceKm !== undefined) {
                                updateDetalleObjetivo('distancia_objetivo', test.distanceKm);
                              }
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                              isSelected
                                ? 'text-white border-transparent'
                                : 'bg-surface-panel border-surface-border text-surface-muted hover:text-white'
                            }`}
                            style={isSelected ? { background: '#9B59B6' } : undefined}
                          >
                            {test.label}
                          </button>
                        );
                      })}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                      <Input
                        label="Distancia Objetivo (km) *"
                        type="number"
                        step="0.1"
                        placeholder="10"
                        value={formData.detalles_objetivo?.distancia_objetivo ?? ''}
                        onChange={e => updateDetalleObjetivo('distancia_objetivo', parseFloat(e.target.value) || 0)}
                      />
                      <TimeInput
                        label="Tiempo Actual (HH:MM:SS) *"
                        value={formData.detalles_objetivo?.tiempo_actual || '00:50:00'}
                        onChange={val => updateDetalleObjetivo('tiempo_actual', val)}
                      />
                      <TimeInput
                        label="Tiempo Meta Deseado (HH:MM:SS) *"
                        value={formData.detalles_objetivo?.tiempo_meta || '00:45:00'}
                        onChange={val => updateDetalleObjetivo('tiempo_meta', val)}
                      />
                    </div>
                  </div>

                  {/* Resumen de contraste de ritmo */}
                  {timeDifferenceSec !== null && (
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-panel border border-surface-border text-xs">
                      <span className="text-surface-muted">Diferencia de tiempo proyectada:</span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                            timeDifferenceSec < 0
                              ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
                              : 'bg-amber-950/40 text-amber-400 border border-amber-800/40'
                          }`}
                        >
                          {formatSecondsToHMS(timeDifferenceSec)}
                        </span>
                        {timeDifferenceSec < 0 && (
                          <span className="text-[10px] text-emerald-400 font-medium">
                            (Mejora deseada)
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3. SECCIÓN CONDICIÓN GENERAL (Cascada 2 niveles) */}
              {selectedObjectiveType === 'condicion_general' && (
                <div className="p-3.5 rounded-lg bg-surface-card border border-surface-border space-y-3.5 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-surface-border pb-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                      <Dumbbell size={14} className="text-purple-400" />
                      <span>Condición General (Enfoque en Salud y Rendimiento)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Select
                      label="¿Qué quieres mejorar? (Categoría) *"
                      options={CG_CATEGORIES}
                      value={activeCgCategory}
                      onChange={val => {
                        updateDetalleObjetivo('que_quieres_mejorar_cg', val);
                        const firstSub = CG_SUBCATEGORIES[val]?.[0]?.value || '';
                        updateDetalleObjetivo('objetivo_especifico_cg', firstSub);
                      }}
                    />

                    <Select
                      label="Objetivo Específico (Subcategoría) *"
                      options={availableCgSubcategories}
                      value={formData.detalles_objetivo?.objetivo_especifico_cg || availableCgSubcategories[0]?.value || ''}
                      onChange={val => updateDetalleObjetivo('objetivo_especifico_cg', val)}
                    />
                  </div>
                </div>
              )}

              {/* 4. SECCIÓN OTRO */}
              {selectedObjectiveType === 'otro' && (
                <div className="p-3.5 rounded-lg bg-surface-card border border-surface-border space-y-2.5 animate-fadeIn">
                  <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider border-b border-surface-border pb-2">
                    <Sparkles size={14} className="text-purple-400" />
                    <span>Objetivo Personalizado</span>
                  </div>
                  <Input
                    label="Especificar Objetivo *"
                    placeholder="Describe detalladamente la meta o propósito del paciente..."
                    value={formData.detalles_objetivo?.descripcion_otro_objetivo || ''}
                    onChange={e => {
                      const val = e.target.value;
                      updateDetalleObjetivo('descripcion_otro_objetivo', val);
                      updateDetalleObjetivo('nombre_competencia', val);
                    }}
                    required
                  />
                </div>
              )}

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
                  placeholder="Anotaciones adicionales del especialista para la prescripción del plan..."
                  className="w-full px-3 py-2 text-xs bg-surface-card border border-surface-border rounded-lg text-white placeholder-surface-muted focus:outline-none focus:border-purple-500 transition-colors resize-none"
                />
              </div>
            </div>
          )}

          {/* FOOTER ACTIONS */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-surface-border">
            {step > 1 ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handlePrev}
                className="text-xs"
              >
                <ChevronLeft size={14} />
                <span>Anterior</span>
              </Button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="text-xs"
              >
                Cancelar
              </Button>

              {step < 4 ? (
                <Button
                  type="button"
                  variant="purple"
                  size="sm"
                  onClick={handleNext}
                  className="text-xs text-white"
                >
                  <span>Siguiente</span>
                  <ChevronRight size={14} />
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="purple"
                  size="sm"
                  onClick={handleSubmit}
                  isLoading={mutation.isPending}
                  className="text-xs text-white font-bold shadow-lg shadow-purple-900/30"
                >
                  <Sparkles size={14} />
                  <span>Registrar Paciente</span>
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}
