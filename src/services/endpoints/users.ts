import { apiClient } from '@/services/api/client'
import type { User, Professional, AdminProfessionalStats, AssignedPatient, SpecialistPatientCabeceraResponse } from '@/types'
import { useAppStore } from '@/store/useAppStore'
import { MOCK_USERS } from '@/services/mocks/users.mock'
import { MOCK_PLAN } from '@/services/mocks/plan.mock'
import { MOCK_PROFESSIONALS } from '@/services/mocks/professionals.mock'
import { parseISO, format, addDays, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale';

// New endpoint functions added to usersService:
export interface InjuryPayload {
  zona_afectada: string;
  descripcion_molestia: string;
}

export interface InjuryResponse {
  id_lesion_usuario: string;
  zona_afectada: string;
  descripcion_molestia: string;
  nombre_lesion: string;
}

export interface SportsEventPayload {
  nombre: string;
  lugar: string;
  fecha: string; // YYYY-MM-DD
}

export interface SportsEventResponse {
  id_evento: string;
  nombre: string;
  lugar: string;
  fecha: string;
}

export interface DisciplineResponse {
  id_disciplina: string;
  nombre_disciplina: string;
}

export interface StatusPayload {
  estado: 'suspendido_temporal' | 'suspendido_permanente' | 'activo';
  fecha_fin_suspencion?: string | null;
  motivo_suspencion?: string | null;
}

// Mock stores for new functionalities
const MOCK_USER_INJURIES: { [userId: string]: InjuryResponse[] } = {
  'uid-1': [{ id_lesion_usuario: 'inj-1', zona_afectada: 'Rodilla', descripcion_molestia: 'Dolor leve', nombre_lesion: 'Esguince' }],
};

const MOCK_USER_SPORTS_EVENTS: { [userId: string]: SportsEventResponse[] } = {
  'uid-1': [{ id_evento: 'evt-1', nombre: 'Maratón de Buenos Aires', lugar: 'Buenos Aires', fecha: '2025-10-12' }],
};

const MOCK_DISCIPLINES: DisciplineResponse[] = [
  { id_disciplina: 'disc-1', nombre_disciplina: 'Fútbol' },
  { id_disciplina: 'disc-2', nombre_disciplina: 'Baloncesto' },
  { id_disciplina: 'disc-3', nombre_disciplina: 'Atletismo' },
  { id_disciplina: 'disc-4', nombre_disciplina: 'Natación' },
];

const USE_MOCK = false // flip to false when backend ready

const isMockId = (id: string): boolean => {
  if (!id) return false
  return id.startsWith('uid-') || id.startsWith('pro-') || id.startsWith('esp-') || id.length < 10 || id.startsWith('uid-mock-')
}

const isMockProfessionalId = (id: string): boolean => {
  if (!id) return false
  return id.startsWith('pro-') || id.startsWith('esp-') || id.startsWith('uid-mock-')
}

// Helper to generate dates for a week based on a start date
const generateWeekDates = (startDateString: string | undefined) => {
  const referenceDate = startDateString ? parseISO(startDateString) : new Date('2026-06-06');
  const start = startOfWeek(referenceDate, { locale: es });
  const end = endOfWeek(referenceDate, { locale: es });
  return {
    inicio: format(start, 'yyyy-MM-dd'),
    fin: format(end, 'yyyy-MM-dd')
  };
};

// Helper to dynamically shift MOCK_PLAN dates
const shiftPlanDates = (basePlan: any[], startDateString: string | undefined) => {
  const weekDates = generateWeekDates(startDateString);
  const baseStartDate = parseISO('2026-06-01'); // MOCK_PLAN's original start date
  const targetStartDate = parseISO(weekDates.inicio);

  return basePlan.map((item: any) => {
    const originalDate = parseISO(item.fecha_programada || item.fecha_inicio || item.fecha_programada_clase);
    const diffDays = (targetStartDate.getTime() - baseStartDate.getTime()) / (1000 * 60 * 60 * 24);
    const newDate = addDays(originalDate, diffDays);

    return {
      ...item,
      fecha_programada: format(newDate, 'yyyy-MM-dd'),
      fecha_inicio: item.fecha_inicio ? format(newDate, 'yyyy-MM-dd') : undefined,
      fecha_programada_clase: item.fecha_programada_clase ? format(newDate, 'yyyy-MM-dd') : undefined,
    };
  });
};

// Helper to dynamically generate mock nutrition data for a week
const generateMockNutrition = (startDateString: string | undefined, endDateString: string | undefined) => {
  const referenceDate = startDateString ? parseISO(startDateString) : new Date('2026-06-06');
  const weekDates = generateWeekDates(startDateString);
  const start = parseISO(weekDates.inicio);
  const end = parseISO(weekDates.fin);

  const detalle_diario: { [dateStr: string]: any } = {};
  let currentDate = start;

  const mealTypeMap: { [key: string]: 'DESAYUNO' | 'ALMUERZO' | 'CENA' | 'PRE-ENTRENO' | 'DURANTE' | 'POST-ENTRENO' } = {
    'Desayuno': 'DESAYUNO',
    'Almuerzo': 'ALMUERZO',
    'Cena': 'CENA',
    'Snack': 'PRE-ENTRENO', // Mapping snack to pre-entreno for mock purposes
  };

  while (isWithinInterval(currentDate, { start, end }) || format(currentDate, 'yyyy-MM-dd') === format(end, 'yyyy-MM-dd')) {
    const formattedDate = format(currentDate, 'yyyy-MM-dd');

    const calorias_objetivo = Math.floor(Math.random() * 500) + 2000; // 2000-2500 kcal
    const calorias_consumidas = Math.floor(Math.random() * 400) + 1800; // 1800-2200 kcal
    const hidratacion_ml_real = Math.floor(Math.random() * 1500) + 1500; // 1500-3000 ml
    const hidratacion_ml_objetivo = Math.floor(Math.random() * 1000) + 2500; // 2500-3500 ml

    const proteina_objetivo = Math.floor(Math.random() * 30) + 100;
    const ch_objetivo = Math.floor(Math.random() * 50) + 200;
    const grasas_objetivo = Math.floor(Math.random() * 20) + 60;

    const proteina_real = Math.floor(Math.random() * 20) + 90;
    const ch_real = Math.floor(Math.random() * 40) + 180;
    const grasas_real = Math.floor(Math.random() * 15) + 50;


    detalle_diario[formattedDate] = {
      pauta_alimentacion: {
        objetivo: {
          kcal: calorias_objetivo,
          proteina: proteina_objetivo,
          ch: ch_objetivo,
          grasas: grasas_objetivo,
          hidratacion_ml_objetivo: hidratacion_ml_objetivo,
        },
        real: {
          kcal: calorias_consumidas,
          proteina: proteina_real,
          ch: ch_real,
          grasas: grasas_real,
          hidratacion_ml: hidratacion_ml_real,
        },
        comidas: [
          {
            id_comida: `meal-${formattedDate}-1`,
            tipo: mealTypeMap['Desayuno'],
            descripcion: 'Avena con frutas y frutos secos',
            kcal: Math.floor(Math.random() * 200) + 400,
            ch: Math.floor(Math.random() * 40) + 50,
            proteina: Math.floor(Math.random() * 15) + 15,
            grasas: Math.floor(Math.random() * 10) + 10,
          },
          {
            id_comida: `meal-${formattedDate}-2`,
            tipo: mealTypeMap['Almuerzo'],
            descripcion: 'Ensalada de pollo con vegetales y aderezo ligero',
            kcal: Math.floor(Math.random() * 300) + 600,
            ch: Math.floor(Math.random() * 60) + 70,
            proteina: Math.floor(Math.random() * 20) + 30,
            grasas: Math.floor(Math.random() * 15) + 20,
          },
          {
            id_comida: `meal-${formattedDate}-3`,
            tipo: mealTypeMap['Cena'],
            descripcion: 'Pescado al horno con boniato y espárragos',
            kcal: Math.floor(Math.random() * 250) + 500,
            ch: Math.floor(Math.random() * 50) + 60,
            proteina: Math.floor(Math.random() * 20) + 25,
            grasas: Math.floor(Math.random() * 12) + 15,
          },
          {
            id_comida: `meal-${formattedDate}-4`,
            tipo: mealTypeMap['Snack'],
            descripcion: 'Yogur griego con bayas',
            kcal: Math.floor(Math.random() * 100) + 150,
            ch: Math.floor(Math.random() * 20) + 20,
            proteina: Math.floor(Math.random() * 10) + 10,
            grasas: Math.floor(Math.random() * 5) + 5,
          },
        ],
      },
      analitica_hidratacion: {
        volumen_consumido_ml: hidratacion_ml_real,
        objetivo_ml: hidratacion_ml_objetivo,
        deshidratacion_estimada: Math.round(((hidratacion_ml_objetivo - hidratacion_ml_real) / hidratacion_ml_objetivo) * 100) / 100,
        justificacion_ajuste: '',
      },
    };
    currentDate = addDays(currentDate, 1);
  }

  return {
    semana_numero: 1, // As per instruction: "This might need to be dynamic too, but for now, keep as 1"
    semana_rango: weekDates,
    detalle_diario: detalle_diario,
  };
};

export const usersService = {
  getAll: async (): Promise<User[]> => {
    if (USE_MOCK) return MOCK_USERS
    const { data } = await apiClient.get('/users')
    return data
  },
  getById: async (id: string): Promise<User> => {
    if (USE_MOCK || isMockId(id)) return MOCK_USERS.find(u => u.id_usuario === id)!
    const { data } = await apiClient.get(`/users/${id}`)
    return data
  },
  update: async (id: string, payload: Partial<User>): Promise<User> => {
    if (USE_MOCK || isMockId(id)) return { ...MOCK_USERS.find(u => u.id_usuario === id)!, ...payload }
    const { data } = await apiClient.patch(`/users/${id}`, payload)
    return data
  },

  updateUserStatus: async (id_usuario: string, payload: StatusPayload): Promise<User> => {
    if (USE_MOCK || isMockId(id_usuario)) {
      const userIndex = MOCK_USERS.findIndex(u => u.id_usuario === id_usuario);
      if (userIndex > -1) {
        const user = MOCK_USERS[userIndex];
        user.estado_cuenta = payload.estado;
        user.fecha_fin_suspencion = payload.fecha_fin_suspencion;
        user.motivo_suspencion = payload.motivo_suspencion;
        MOCK_USERS[userIndex] = { ...user };
        return MOCK_USERS[userIndex];
      }
      return Promise.reject(new Error('User not found for status update'));
    }
    const { data } = await apiClient.patch(`/admin/usuarios/${id_usuario}/modificar-estado`, payload);
    return data;
  },

  registerInjury: async (id_usuario: string, payload: InjuryPayload): Promise<InjuryResponse> => {
    if (USE_MOCK || isMockId(id_usuario)) {
      const user = MOCK_USERS.find(u => u.id_usuario === id_usuario);
      if (user) {
        const newInjury: InjuryResponse = {
          id_lesion_usuario: `inj-${Date.now()}`,
          ...payload,
          nombre_lesion: payload.zona_afectada // Using zona_afectada as nombre_lesion for mock
        };
        if (!MOCK_USER_INJURIES[id_usuario]) {
          MOCK_USER_INJURIES[id_usuario] = [];
        }
        MOCK_USER_INJURIES[id_usuario].push(newInjury);
        return newInjury;
      }
      return Promise.reject(new Error('User not found for injury registration'));
    }
    const { data } = await apiClient.post(`/admin/usuarios/${id_usuario}/resgistar-lesion`, payload);
    return data;
  },

  removeInjury: async (id_usuario: string, id_lesion_usuario: string): Promise<any> => {
    if (USE_MOCK || isMockId(id_usuario)) {
      const user = MOCK_USERS.find(u => u.id_usuario === id_usuario);
      if (user && MOCK_USER_INJURIES[id_usuario]) {
        const initialLength = MOCK_USER_INJURIES[id_usuario].length;
        MOCK_USER_INJURIES[id_usuario] = MOCK_USER_INJURIES[id_usuario].filter(inj => inj.id_lesion_usuario !== id_lesion_usuario);
        if (MOCK_USER_INJURIES[id_usuario].length < initialLength) {
          return { success: true, message: "Lesión eliminada con éxito" };
        }
        return Promise.reject(new Error('Injury not found'));
      }
      return Promise.reject(new Error('User not found or no injuries to remove'));
    }
    const { data } = await apiClient.delete(`/admin/usuarios/${id_usuario}/remover-lesion/${id_lesion_usuario}`);
    return data;
  },

  registerSportsEvent: async (id_usuario: string, payload: SportsEventPayload): Promise<SportsEventResponse> => {
    if (USE_MOCK || isMockId(id_usuario)) {
      const user = MOCK_USERS.find(u => u.id_usuario === id_usuario);
      if (user) {
        const newEvent: SportsEventResponse = {
          id_evento: `evt-${Date.now()}`,
          ...payload,
        };
        if (!MOCK_USER_SPORTS_EVENTS[id_usuario]) {
          MOCK_USER_SPORTS_EVENTS[id_usuario] = [];
        }
        MOCK_USER_SPORTS_EVENTS[id_usuario].push(newEvent);
        return newEvent;
      }
      return Promise.reject(new Error('User not found for sports event registration'));
    }
    const { data } = await apiClient.post(`/admin/usuarios/historial-deportivo/registrar-evento`, payload, {
      params: { id_usuario } // id_usuario as query parameter
    });
    return data;
  },

  removeSportsEvent: async (id_usuario: string, id_evento: string): Promise<any> => {
    if (USE_MOCK || isMockId(id_usuario)) {
      const user = MOCK_USERS.find(u => u.id_usuario === id_usuario);
      if (user && MOCK_USER_SPORTS_EVENTS[id_usuario]) {
        const initialLength = MOCK_USER_SPORTS_EVENTS[id_usuario].length;
        MOCK_USER_SPORTS_EVENTS[id_usuario] = MOCK_USER_SPORTS_EVENTS[id_usuario].filter(event => event.id_evento !== id_evento);
        if (MOCK_USER_SPORTS_EVENTS[id_usuario].length < initialLength) {
          return { success: true, message: "Evento deportivo eliminado con éxito" };
        }
        return Promise.reject(new Error('Sports event not found'));
      }
      return Promise.reject(new Error('User not found or no sports events to remove'));
    }
    const { data } = await apiClient.delete(`/admin/usuarios/${id_usuario}/historial-deportivo/remover-evento/${id_evento}`);
    return data;
  },

  searchDisciplines: async (query: string): Promise<DisciplineResponse[]> => {
    if (USE_MOCK) {
      if (!query) return [];
      return MOCK_DISCIPLINES.filter(d => d.nombre_disciplina.toLowerCase().includes(query.toLowerCase()));
    }
    const { data } = await apiClient.get(`/admin/usuarios/buscar-disciplina`, { params: { q: query } });
    return data;
  },

  assignDiscipline: async (id_usuario: string, payload: { id_disciplina: string }): Promise<any> => {
    if (USE_MOCK || isMockId(id_usuario)) {
      const userIndex = MOCK_USERS.findIndex(u => u.id_usuario === id_usuario);
      if (userIndex > -1) {
        const discipline = MOCK_DISCIPLINES.find(d => d.id_disciplina === payload.id_disciplina);
        if (discipline) {
          MOCK_USERS[userIndex].nombre_disciplina = discipline.nombre_disciplina; // Assuming user has a single main discipline
          return { success: true, message: "Disciplina asignada con éxito" };
        }
        return Promise.reject(new Error('Discipline not found'));
      }
      return Promise.reject(new Error('User not found for discipline assignment'));
    }
    const { data } = await apiClient.post(`/admin/usuarios/${id_usuario}/asignar-disciplina`, payload);
    return data;
  },

  updateUserProfile: async (id_usuario: string, payload: Partial<User>): Promise<User> => {
    if (USE_MOCK || isMockId(id_usuario)) {
      const userIndex = MOCK_USERS.findIndex(u => u.id_usuario === id_usuario);
      if (userIndex > -1) {
        MOCK_USERS[userIndex] = { ...MOCK_USERS[userIndex], ...payload };
        return MOCK_USERS[userIndex];
      }
      return Promise.reject(new Error('User not found for profile update'));
    }
    const { data } = await apiClient.patch(`/admin/usuarios/${id_usuario}/actualizar-perfil`, payload);
    return data;
  },
  getAdminUsers: async (page: number, pageSize: number, filtro: string, search: string): Promise<{ total: number, data: any[] }> => {
    if (USE_MOCK) return { total: MOCK_USERS.length, data: MOCK_USERS.slice((page - 1) * pageSize, page * pageSize) };
    const { data } = await apiClient.get('/admin/usuarios', {
      params: { page, page_size: pageSize, filtro, search: search || undefined }
    });
    return data;
  },
  getUserTabDetalle: async (id_usuario: string, tab: string, fecha_inicio_plan?: string, fecha_fin_plan?: string): Promise<any> => {
    if (USE_MOCK || isMockId(id_usuario)) {
      if (tab === 'plan') {
        const weekDates = generateWeekDates(fecha_inicio_plan);
        return {
          semana_numero: 1, // This might need to be dynamic too, but for now, keep as 1
          semana_rango: weekDates,
          entrenamientos: shiftPlanDates(MOCK_PLAN, fecha_inicio_plan)
        };
      }
      if (tab === 'nutricion') {
        return generateMockNutrition(fecha_inicio_plan, fecha_fin_plan);
      }
      return MOCK_USERS.find(user => user.id_usuario === id_usuario);
    }
    const apiTab = tab === 'reporte-clinico' ? 'reporte_clinico' : tab;
    const params: { tab: string; fecha_inicio_plan?: string; fecha_fin_plan?: string } = { tab: apiTab };
    if (fecha_inicio_plan) params.fecha_inicio_plan = fecha_inicio_plan;
    if (fecha_fin_plan) params.fecha_fin_plan = fecha_fin_plan;

    const isSpecialist = useAppStore.getState().userRole === 'specialist';
    const url = isSpecialist
      ? `/specialist/specialist/pacientes/${id_usuario}/detalle`
      : `/admin/usuarios/detalle/${id_usuario}/detalle`;

    const { data } = await apiClient.get(url, {
      params
    });
    return data;
  },
  getUserHeaderDetalle: async (id_usuario: string): Promise<any> => {
    if (USE_MOCK || isMockId(id_usuario)) {
      return MOCK_USERS.find(user => user.id_usuario === id_usuario);
    }
    const isSpecialist = useAppStore.getState().userRole === 'specialist';
    if (isSpecialist) {
      const { data } = await apiClient.get<SpecialistPatientCabeceraResponse>(`/specialist/specialist/pacientes/${id_usuario}/cabecera`);
      
      const getInitials = (name: string): string => {
        const parts = name.trim().split(/\s+/)
        if (parts.length === 0 || !parts[0]) return 'U'
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
        return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase()
      }

      const getColorFromString = (str: string): string => {
        const colors = ['#E8622A', '#4CAF82', '#4A7CC7', '#E24B4A', '#9B59B6', '#7F8C8D']
        let hash = 0
        for (let i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash)
        }
        const index = Math.abs(hash) % colors.length
        return colors[index]
      }

      return {
        ...data,
        id_usuario,
        initials: getInitials(data.nombre || 'Usuario'),
        color: getColorFromString(data.nombre || 'Usuario'),
        plan_idx: data.membresia === 'Elite' ? 2 : data.membresia === 'Pro' ? 1 : 0,
        nombre_plan_activo: data.membresia,
        nombre_disciplina: data.disciplina,
        registro_activo: data.estado === 'Activo' || data.estado === 'activo'
      }
    }
    const { data } = await apiClient.get(`/admin/usuarios/detalle/${id_usuario}/cabecera`);
    return data;
  },
  getAdminProfessionals: async (page: number, pageSize: number, estado: string, search: string): Promise<{ total: number, data: Professional[] }> => {
    if (USE_MOCK) {
      const filtered = MOCK_PROFESSIONALS.filter((p: Professional) => {
        const matchesEstado = estado === 'Todos' ||
          (estado === 'Activos' && p.accesoNivel !== 'Sin acceso') ||
          (estado === 'Pendientes' && p.accesoNivel === 'Sin acceso');
        const matchesSearch = search.trim() === '' ||
          p.nombre.toLowerCase().includes(search.toLowerCase()) ||
          p.email.toLowerCase().includes(search.toLowerCase()) ||
          p.especialidad.toLowerCase().includes(search.toLowerCase()) ||
          p.rol.toLowerCase().includes(search.toLowerCase());
        return matchesEstado && matchesSearch;
      });
      return { total: filtered.length, data: filtered.slice((page - 1) * pageSize, page * pageSize) };
    }

    const { data } = await apiClient.get('/admin/listar-profesionales', {
      params: { page, page_size: pageSize, estado, search: search || undefined }
    });

    const mappedItems: Professional[] = (data.items || []).map((item: any) => {
      let accesoNivel = 'Sin acceso';
      if (item.nivel_acceso === 'completo') accesoNivel = 'Completo';
      else if (item.nivel_acceso === 'parcial') accesoNivel = 'Parcial';
      else if (item.nivel_acceso === 'lectura') accesoNivel = 'Lectura';
      else if (item.nivel_acceso === 'sin_acceso') accesoNivel = 'Sin acceso';

      const names = (item.nombre || '').split(' ')
      const initials = names.map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

      return {
        id: String(item.id_especialista),
        nombre: item.nombre,
        initials,
        color: '#9B59B6',
        email: item.email,
        tel: '',
        ciudad: '',
        rol: item.especialidad_principal || 'Especialista',
        especialidad: item.especialidad_principal || '',
        pacientes: item.pacientes_activos || 0,
        accesoNivel,
        accesoDesc: item.nivel_acceso || '',
        estado: item.estado || 'Activo',
        certs: [],
        tray: [],
        pacAsi: []
      }
    });

    return { 
      total: data.total || 0,
      data: mappedItems
    };
  },
  getProfessionalStats: async (): Promise<AdminProfessionalStats> => {
    if (USE_MOCK) {
      const total = MOCK_PROFESSIONALS.length
      const deportologos = MOCK_PROFESSIONALS.filter((p: Professional) => p.rol.includes('Deport')).length
      const entrenadores = MOCK_PROFESSIONALS.filter((p: Professional) => p.rol.includes('Entrena')).length
      const pacientes_assigned = MOCK_PROFESSIONALS.reduce((sum, p: Professional) => sum + (p.pacientes || 0), 0)
      return {
        total,
        deportologos,
        entrenadores,
        pacientes_assigned,
        crecimiento_mes: '↑ +2 este mes'
      }
    }

    const { data } = await apiClient.get<any>('/admin/estadisticas-profesionales')
    return {
      total: data.total || 0,
      deportologos: data.deportologos || 0,
      entrenadores: data.entrenadores || 0,
      pacientes_assigned: data.pacientes_assigned || data.pacientes_asignados_activos || 0,
      crecimiento_mes: data.crecimiento_mes || '↑ +0 este mes'
    }
  },

  getAvailableStudents: async (search?: string): Promise<{ id_usuario: string, nombre_alumno: string }[]> => {
    if (USE_MOCK) {
      const filteredUsers = MOCK_USERS.filter(u =>
        !search || u.nombre.toLowerCase().includes(search.toLowerCase())
      ).map(u => ({ id_usuario: u.id_usuario, nombre_alumno: u.nombre }));
      return filteredUsers;
    }
    const { data } = await apiClient.get('/admin/obtener-alumnos-disponibles-para-asignar', { params: { search } });
    return data;
  },

  linkStudentToSpecialist: async (id_usuario: string, id_especialista: string): Promise<any> => {
    if (USE_MOCK || isMockProfessionalId(id_especialista)) {
      const professional = MOCK_PROFESSIONALS.find(p => p.id === id_especialista);
      const targetUser = MOCK_USERS.find(u => u.id_usuario === id_usuario);

      if (professional && targetUser) {
        const newPatient: AssignedPatient = {
          nombre: targetUser.apodo || targetUser.nombre, // Assuming apodo exists, fallback to nombre
          disc: targetUser.nombre_disciplina || 'General',
          nivel: targetUser.clasificacion_visible_actual || 'Básico',
          adh: '85%',
          ultimo: 'Hoy',
          est: 'En seguimiento',
          ini: targetUser.initials || (targetUser.nombre ? targetUser.nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'US'),
          color: targetUser.color || '#9B59B6',
        };
        professional.pacAsi = [...(professional.pacAsi || []), newPatient];
        professional.pacientes = professional.pacAsi.length; // Update patient count
        return { success: true, message: "Alumno asignado con éxito" };
      }
      return Promise.reject(new Error('Professional or User not found for linking'));
    }
    const { data } = await apiClient.post('/admin/vincular-alumno-a-especialista', { id_usuario, id_especialista });
    return data;
  },

  updateProfessionalFicha: async (id: string, payload: any): Promise<any> => {
    if (USE_MOCK || isMockProfessionalId(id)) {
      const professional = MOCK_PROFESSIONALS.find(p => p.id === id);
      if (professional) {
        professional.bio = payload.biografia;
        professional.email = payload.email;
        professional.especialidad = payload.especialidades;
        professional.experiencia = payload.años_experiencia;
        professional.ciudad = payload.ciudad; // Assuming payload.ciudad might also contain country info for mock
        professional.tel = payload.telefono_contacto;
        professional.docTipo = payload.tipo_documento;
        professional.docNumero = payload.numero_documento;
        professional.tray = payload.historial_laboral;
        return professional;
      }
      return Promise.reject(new Error('Professional not found for ficha update'));
    }
    const { data } = await apiClient.put(`/admin/especialista/${id}/ficha`, payload);
    return data;
  },

  uploadProfessionalDocument: async (id: string, file: File, tipo: 'frente' | 'dorso'): Promise<any> => {
    if (USE_MOCK || isMockProfessionalId(id)) {
      const professional = MOCK_PROFESSIONALS.find(p => p.id === id);
      if (professional) {
        if (tipo === 'frente') {
          professional.docDelantero = file.name;
        } else if (tipo === 'dorso') {
          professional.docTrasero = file.name;
        }
        return { success: true, message: "Documento subido" };
      }
      return Promise.reject(new Error('Professional not found for document upload'));
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tipo', tipo);
    const { data } = await apiClient.post(`/admin/especialista/${id}/documento/subir`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return data;
  },

  deleteProfessionalDocument: async (id: string, tipo: 'frente' | 'dorso'): Promise<any> => {
    if (USE_MOCK || isMockProfessionalId(id)) {
      const professional = MOCK_PROFESSIONALS.find(p => p.id === id);
      if (professional) {
        if (tipo === 'frente') {
          professional.docDelantero = undefined;
        } else if (tipo === 'dorso') {
          professional.docTrasero = undefined;
        }
        return { success: true, message: "Documento eliminado" };
      }
      return Promise.reject(new Error('Professional not found for document deletion'));
    }
    const { data } = await apiClient.delete(`/admin/especialista/${id}/documento/${tipo}`);
    return data;
  },

  uploadProfessionalCertificate: async (id: string, file: File): Promise<any> => {
    if (USE_MOCK || isMockProfessionalId(id)) {
      const professional = MOCK_PROFESSIONALS.find(p => p.id === id);
      if (professional) {
        const mockCert = {
          nombre: file.name.replace(/\.[^/.]+$/, ""),
          org: 'Subido por el usuario',
          año: new Date().getFullYear().toString(),
          venc: 'Sin vencimiento',
          id: `CERT-${Math.floor(1000 + Math.random() * 9000)}`
        };
        professional.certs = [...(professional.certs || []), mockCert];
        return { success: true, message: "Certificado subido" };
      }
      return Promise.reject(new Error('Professional not found for certificate upload'));
    }
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await apiClient.post(`/admin/especialista/${id}/certificados/subir`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return data;
  },

  deleteProfessionalCertificate: async (id: string, certId: string): Promise<any> => {
    if (USE_MOCK || isMockProfessionalId(id)) {
      const professional = MOCK_PROFESSIONALS.find(p => p.id === id);
      if (professional) {
        professional.certs = (professional.certs || []).filter(c => c.id !== certId);
        return { success: true, message: "Certificado eliminado" };
      }
      return Promise.reject(new Error('Professional not found for certificate deletion'));
    }
    const { data } = await apiClient.delete(`/admin/especialista/${id}/certificado/${certId}`);
    return data;
  },

  updateProfessionalStatus: async (id: string, payload: { estado: string, motivo_suspencion?: string }): Promise<any> => {
    if (USE_MOCK || isMockProfessionalId(id)) {
      const professional = MOCK_PROFESSIONALS.find(p => p.id === id);
      if (professional) {
        professional.estado = payload.estado as any;
        professional.accesoNivel = payload.estado === 'Activo' ? 'Completo' : 'Sin acceso';
        return { success: true, message: "Estado actualizado" };
      }
      return Promise.reject(new Error('Professional not found for status update'));
    }
    const { data } = await apiClient.patch(`/admin/especialista/${id}/modificar-estado`, payload);
    return data;
  },

  getProfessionalHeaderDetalle: async (id: string): Promise<any> => {
    if (USE_MOCK || isMockProfessionalId(id)) {
      return MOCK_PROFESSIONALS.find(p => p.id === id);
    }
    const { data } = await apiClient.get(`/admin/${id}/detalle-especialista-cabecera`);
    return data;
  },

  getProfessionalTabDetalle: async (id: string, tab: string): Promise<any> => {
    if (USE_MOCK || isMockProfessionalId(id)) {
      const professional = MOCK_PROFESSIONALS.find(p => p.id === id);
      if (!professional) return undefined;

      switch (tab) {
        case 'ficha':
          return professional; // Return the whole professional object for ficha tab
        case 'pacientes':
          return professional.pacAsi || []; // Return assigned patients for pacientes tab
        case 'agenda': // Example of unsupported tab, returns mock
          return { message: 'Mock data for agenda tab' };
        default:
          return undefined;
      }
    }
    const { data } = await apiClient.get(`/admin/${id}/detalle-especialista-contenido?tab=${tab}`);
    return data;
  },

  updateProfessional: async (id: string, payload: Partial<Professional>): Promise<Professional> => {
    if (USE_MOCK || isMockProfessionalId(id)) {
      const index = MOCK_PROFESSIONALS.findIndex(p => p.id === id);
      if (index > -1) {
        MOCK_PROFESSIONALS[index] = { ...MOCK_PROFESSIONALS[index], ...payload };
        return MOCK_PROFESSIONALS[index];
      }
      return Promise.reject(new Error('Professional not found for update'));
    }
    const { data } = await apiClient.patch(`/admin/profesionales/${id}`, payload);
    return data;
  },

  assignPatientToProfessional: async (specialistId: string, id_usuario: string): Promise<any> => {
    if (USE_MOCK || isMockProfessionalId(specialistId)) {
      const professional = MOCK_PROFESSIONALS.find(p => p.id === specialistId);
      if (professional) {
        // This is a simplified mock. In a real scenario, you'd fetch patient details.
        const newPatient: AssignedPatient = {
          nombre: `Mock Patient ${id_usuario}`,
          disc: 'General',
          nivel: 'Alto',
          est: 'En seguimiento',
          ini: 'MP',
          color: '#9B59B6',
          adh: '90%',
          ultimo: 'Hoy'
        };
        professional.pacAsi = [...(professional.pacAsi || []), newPatient];
        return { success: true, message: `Patient ${id_usuario} assigned to ${specialistId}` };
      }
      return Promise.reject(new Error('Professional not found for patient assignment'));
    }
    const { data } = await apiClient.post(`/admin/profesionales/${specialistId}/asignar-paciente`, { id_usuario });
    return data;
  },

  reassignPatientBetweenProfessionals: async (fromSpecialistId: string, toSpecialistId: string, patientName: string): Promise<any> => {
    if (USE_MOCK || isMockProfessionalId(fromSpecialistId) || isMockProfessionalId(toSpecialistId)) {
      const fromProfessional = MOCK_PROFESSIONALS.find(p => p.id === fromSpecialistId);
      const toProfessional = MOCK_PROFESSIONALS.find(p => p.id === toSpecialistId);

      if (fromProfessional && toProfessional) {
        fromProfessional.pacAsi = (fromProfessional.pacAsi || []).filter(p => p.nombre !== patientName);
        const reassignedPatient: AssignedPatient = {
          nombre: patientName,
          disc: 'General',
          nivel: 'Alto',
          est: 'En seguimiento',
          ini: 'MP',
          color: '#9B59B6',
          adh: '90%',
          ultimo: 'Hoy'
        };
        toProfessional.pacAsi = [...(toProfessional.pacAsi || []), reassignedPatient];
        return { success: true, message: `Patient ${patientName} reassigned from ${fromSpecialistId} to ${toSpecialistId}` };
      }
      return Promise.reject(new Error('One or both professionals not found for patient reassignement'));
    }
    const { data } = await apiClient.post(`/admin/profesionales/reasignar-paciente`, { fromSpecialistId, toSpecialistId, patientName });
    return data;
  }
}
