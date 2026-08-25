import { apiClient } from '@/services/api/client'
import type { User, Professional, AdminProfessionalStats } from '@/types'
import { MOCK_USERS } from '@/services/mocks/users.mock'
import { MOCK_PLAN } from '@/services/mocks/plan.mock'
import { MOCK_PROFESSIONALS } from '@/services/mocks/professionals.mock'
import { parseISO, format, addDays, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale';

const USE_MOCK = false // flip to false when backend ready

const isMockId = (id: string): boolean => {
  if (!id) return false
  return id.startsWith('uid-') || id.startsWith('pro-') || id.startsWith('esp-') || id.length < 10 || id.startsWith('uid-mock-')
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

  return basePlan.map(item => {
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

    const { data } = await apiClient.get(`/admin/usuarios/detalle/${id_usuario}/detalle`, {
      params
    });
    return data;
  },
  getUserHeaderDetalle: async (id_usuario: string): Promise<any> => {
    if (USE_MOCK || isMockId(id_usuario)) {
      return MOCK_USERS.find(user => user.id_usuario === id_usuario);
    }
    const { data } = await apiClient.get(`/admin/usuarios/detalle/${id_usuario}/cabecera`);
    return data;
  },
  getAdminProfessionals: async (page: number, pageSize: number, estado: string, search: string): Promise<{ total: number, data: Professional[] }> => {
    if (USE_MOCK) {
      const filtered = MOCK_PROFESSIONALS.filter(p => {
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
      const deportologos = MOCK_PROFESSIONALS.filter(p => p.rol.includes('Deport')).length
      const entrenadores = MOCK_PROFESSIONALS.filter(p => p.rol.includes('Entrena')).length
      const pacientes_assigned = MOCK_PROFESSIONALS.reduce((sum, p) => sum + (p.pacientes || 0), 0)
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
  }
}
