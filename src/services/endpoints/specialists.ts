import { apiClient } from '@/services/api/client'
import { MOCK_APPOINTMENTS } from '@/services/mocks/agenda.mock'

const USE_MOCK = false // TODO: Change to false when integrating with real backend
import type { SpecialistPatientsResponse, SpecialistDashboardResponse, SpecialistDashboardTabResponse } from '@/types'

export interface SpecialistAgendaSummary {
  citas_esta_semana: number;
  confirmadas: number;
  pendientes: number;
  canceladas: number;
  programadas: number;
}

export interface SpecialistAppointment {
  estado_cita: string;
  fecha_hora: string;
  id_cita_agenda_especialista: string;
  id_especialista: string;
  id_usuario: string;
  motivo: string;
  tipo_cita: string;
}

export interface AdminWeeklyAgendaSummary {
  citas_esta_semana: number;
  confirmadas: number;
  pendientes: number;
  canceladas: number;
  terminadas: number;
  programadas: number;
}

export interface SpecialistWorkHistory {
  puesto: string;
  empresa: string;
  periodo: string;
}

export interface SpecialistCertificate {
  id_certificado: string;
  nombre: string;
  organizacion_emisora?: string;
  anio_obtencion?: string;
  fecha_vencimiento?: string | null;
}

export interface SpecialistProfile {
  biografia: string;
  email: string;
  especialidad: string;
  anios_experiencia: number | null;
  ciudad_pais: string;
  telefono: string;
  estado_cuenta: string;
  tipo_documento: string;
  numero_documento: string;
  url_doc_frente: string | null;
  url_doc_dorso: string | null;
  historial_laboral: SpecialistWorkHistory[];
  certificados: SpecialistCertificate[];
}

export interface UpdateSpecialistProfilePayload {
  email: string;
  biografia: string;
  especialidad: string;
  anios_experiencia: number;
  ciudad: string;
  pais: string;
  telefono_contacto: string;
  tipo_documento: string;
  numero_documento: string;
  historial_laboral: SpecialistWorkHistory[];
}

export interface CreateAppointmentPayload {
  tipo_cita: string;
  id_especialista: number;
  id_usuario: string;
  id_seguimiento: number;
  fecha: string; // YYYY-MM-DD
  hora_inicio: string; // "03:50:29.635Z"
  duracion_minutos: number;
  estado: string; // "Programado"
  motivo: string;
  notas_adicionales: string;
  link_videollamada: string;
  time_zone: string; // "America/Managua"
}

export interface CreateSpecialistAppointmentPayload {
  tipo_cita: string;
  id_usuario: string;
  id_seguimiento: number;
  fecha: string;
  hora_inicio: string;
  duracion_minutos: number;
  estado: string;
  motivo: string;
  notas_adicionales: string;
  link_videollamada: string;
  time_zone: string;
}

export interface ModifyWorkoutPayload {
  tipo_entrenamiento: string;
  zona_esfuerzo: string;
  fecha_programada: string;
  calorias_objetivo: number;
  descripcion: string;
  estado: string;
}

export interface ModifyWorkoutCommentPayload {
  texto: string;
}

export interface BaseExerciseItem {
  id_ejercicio: string;
  nombre: string;
  tipo: string;
}

export interface DetailedExerciseInfo {
  id_ejercicio: string;
  nombre: string;
  tipo: string;
  descripcion: string;
  multimedia_url: string;
  instrucciones: {
    objetivo: string;
    ejecucion: string;
    errores_comunes: string;
    posicion_inicial: string;
    consejos_tecnicos: string[];
  };
  necesita_mapa: boolean;
}

export interface AddExerciseToWorkoutPayload {
  id_ejercicio: string;
  orden: number;
  series: number;
  descanso_segundos: number;
  repeticiones: number;
  peso_objetivo: number;
  duracion_segundos: number;
  comentario: string;
  estado: string;
}

export interface EditWorkoutExercisePayload {
  orden: number;
  series: number;
  descanso_segundos: number;
  repeticiones: number;
  peso_objetivo: number;
  duracion_segundos: number;
  comentario: string;
  estado: string;
}

export interface CreateMealPayload {
  entrenamiento_id: string;
  tipo: string;
  descripcion: string;
  instrucciones: string;
  kcal: number;
  etiquetas: string[];
  ch: number;
  proteina: number;
  grasas: number;
}

export interface EditMealCommentPayload {
  comentario_seguimiento: string;
}

export interface EditHydrationPayload {
  meta_ml: number;
  justificacion_ajuste_profesional: string;
}

export interface SpecialistNotificationStats {
  enviados_hoy: number;
  apertura_promedio: number;
  clic_promedio: number;
  total_campanias: number;
}

export interface SpecialistRecentCampaign {
  id_campania: number;
  titulo: string;
  destinatarios_filtro: string;
  estado: string;
  fecha_programada: string;
  tiempo_transcurrido: string;
  porcentaje_apertura: number;
}

export interface SpecialistRecipientCounts {
  todos_los_usuarios: number;
  solo_pacientes: number;
  inactivos_mas_de_7_dias: number;
  sin_checkin_hoy: number;
  onboarding_incompleto: number;
}

export interface SendSpecialistNotificationPayload {
  titulo: string;
  mensaje: string;
  destinatarios_filtro: string;
  fecha_programada: string | null;
}

export interface SendPatientNotificationPayload {
  id_usuario: string;
  titulo: string;
  tipo: string;
  mensaje: string;
}

export interface SpecialistReceivedNotification {
  id_notificacion: string;
  id_campania: number;
  id_usuario: string;
  tipo: string;
  mensaje: string;
  enviada: boolean;
  leido: boolean;
  created_at: string;
  tiempo_transcurrido: string;
}

export const specialistsService = {
  getPatients: async (filtro: string): Promise<SpecialistPatientsResponse> => {
    const { data } = await apiClient.get<SpecialistPatientsResponse>('/specialist/specialist/pacientes', {
      params: { filtro }
    })
    return data
  },

  getDashboard: async (): Promise<SpecialistDashboardResponse> => {
    const { data } = await apiClient.get<SpecialistDashboardResponse>('/specialist/specialist/dashboard')
    return data
  },

  getDashboardTab: async (id_especialista: string, tab: string): Promise<SpecialistDashboardTabResponse> => {
    const { data } = await apiClient.get<SpecialistDashboardTabResponse>(`/specialist/specialist/${id_especialista}/dashboard-tab`, {
      params: { tab }
    })
    return data
  },

  getWeeklyAgendaSummary: async (fecha_inicio: string, fecha_fin: string): Promise<SpecialistAgendaSummary> => {
    if (USE_MOCK) {
      // Mock data logic
      const appointmentsInPeriod = MOCK_APPOINTMENTS.filter(apt => {
        const aptDate = new Date(apt.fecha)
        const start = new Date(fecha_inicio)
        const end = new Date(fecha_fin)
        return aptDate >= start && aptDate <= end
      })
      return {
        citas_esta_semana: appointmentsInPeriod.length,
        confirmadas: appointmentsInPeriod.filter(apt => apt.estado === 'confirmada').length,
        pendientes: appointmentsInPeriod.filter(apt => apt.estado === 'pendiente').length,
        canceladas: appointmentsInPeriod.filter(apt => apt.estado === 'cancelada').length,
        programadas: appointmentsInPeriod.length // In mock, all are "programadas"
      }
    } else {
      const { data } = await apiClient.get<SpecialistAgendaSummary>('/specialist/specialist/agenda-global/resumen-semana-actual', {
        params: { fecha_inicio, fecha_fin }
      })
      return data
    }
  },

  getSpecialistAppointments: async (fecha_inicio: string, fecha_fin: string, estado?: string): Promise<SpecialistAppointment[]> => {
    if (USE_MOCK) {
      // Mock data logic - return a filtered and adapted subset
      return MOCK_APPOINTMENTS
        .filter(apt => {
          const aptDate = new Date(apt.fecha)
          const start = new Date(fecha_inicio)
          const end = new Date(fecha_fin)
          const dateMatch = aptDate >= start && aptDate <= end
          const statusMatch = !estado || apt.estado === estado
          return dateMatch && statusMatch
        })
        .map(apt => ({
          estado_cita: apt.estado,
          fecha_hora: `${apt.fecha}T${apt.hora_inicio}:00`,
          id_cita_agenda_especialista: apt.id,
          id_especialista: apt.profesional.id,
          id_usuario: apt.paciente.id,
          motivo: apt.motivo,
          tipo_cita: apt.tipo,
        }))
    } else {
      const { data } = await apiClient.post<SpecialistAppointment[]>('/specialist/specialist/agenda-global/obtener-citas-especialistas', null, {
        params: { fecha_inicio, fecha_fin, ...(estado && { estado }) }
      })
      return data
    }
  },

  getAdminWeeklyAgendaSummary: async (fecha_inicio: string, fecha_fin: string): Promise<AdminWeeklyAgendaSummary> => {
    const { data } = await apiClient.get<AdminWeeklyAgendaSummary>('/admin/agenda-global/resumen-semana-actual', {
      params: { fecha_inicio, fecha_fin }
    });
    return data;
  },

  getAdminSpecialistWeeklyAgendaSummary: async (id_especialista: number, fecha_inicio: string, fecha_fin: string): Promise<AdminWeeklyAgendaSummary> => {
    const { data } = await apiClient.get<AdminWeeklyAgendaSummary>('/admin/especialista/agenda/resumen-semana-actual', {
      params: { id_especialista, fecha_inicio, fecha_fin }
    });
    return data;
  },

  getAdminSpecialistAppointments: async (
    id_especialista: number,
    fecha_inicio: string | null,
    fecha_fin: string | null,
    estado?: string | null
  ): Promise<SpecialistAppointment[]> => {
    const { data } = await apiClient.post<SpecialistAppointment[]>('/admin/obtener-citas-especialista', 
      { id_especialista }, 
      {
        params: {
          fecha_inicio,
          fecha_fin,
          ...(estado && { estado })
        }
      }
    );
    return data;
  },

  createAppointment: async (payload: CreateAppointmentPayload): Promise<string> => {
    const { data } = await apiClient.post<string>('/admin/citas', payload);
    return data;
  },

  createSpecialistAppointment: async (payload: CreateSpecialistAppointmentPayload): Promise<string> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        console.log('MOCK: Creating specialist appointment with payload:', payload);
        setTimeout(() => resolve('Specialist appointment created successfully (MOCK)'), 500);
      });
    } else {
      const { data } = await apiClient.post<string>('/specialist/specialist/agenda-global/crear-cita', payload);
      return data;
    }
  },


  getSpecialistProfile: async (): Promise<SpecialistProfile> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            biografia: 'Especialista en nutrición deportiva y bienestar integral con más de 10 años de experiencia. Ayudo a mis pacientes a alcanzar sus metas de salud y rendimiento a través de planes personalizados.',
            email: 'especialista.mock@fitnflai.com',
            especialidad: 'Nutrición Deportiva',
            anios_experiencia: 12,
            ciudad_pais: 'Buenos Aires, Argentina',
            telefono: '+54 9 11 1234 5678',
            estado_cuenta: 'activo',
            tipo_documento: 'DNI',
            numero_documento: '98765432',
            url_doc_frente: null,
            url_doc_dorso: null,
            historial_laboral: [
              { puesto: 'Nutricionista Principal', empresa: 'FitLife Center', periodo: '2018-Presente' },
              { puesto: 'Asesor Nutricional', empresa: 'Gimnasio Power', periodo: '2014-2018' },
            ],
            certificados: [
              { id_certificado: 'cert-1', nombre: 'Certificación en Nutrición Deportiva Avanzada', organizacion_emisora: 'Instituto de Salud y Deporte', anio_obtencion: '2016' },
              { id_certificado: 'cert-2', nombre: 'Master en Dietética y Nutrición', organizacion_emisora: 'Universidad Nacional', anio_obtencion: '2013', fecha_vencimiento: null },
            ],
          });
        }, 500);
      });
    } else {
      const { data } = await apiClient.get<SpecialistProfile>('/specialist/specialist/profile/perfil-especialista');
      return data;
    }
  },

  updateSpecialistProfile: async (payload: UpdateSpecialistProfilePayload): Promise<any> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        console.log('MOCK: Updating specialist profile with payload:', payload);
        setTimeout(() => resolve({ message: 'Profile updated successfully (MOCK)' }), 500);
      });
    } else {
      const { data } = await apiClient.put<any>('/specialist/specialist/profile/modificar-perfil', payload);
      return data;
    }
  },

  uploadSpecialistDocument: async (file: File, tipo: 'frente' | 'dorso'): Promise<any> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        console.log(`MOCK: Uploading document type ${tipo} with file:`, file);
        setTimeout(() => resolve({ message: 'Document uploaded successfully (MOCK)', url: `mock-url-${tipo}-${file.name}` }), 500);
      });
    } else {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await apiClient.post<any>('/specialist/specialist/profile/documento/subir', formData, {
        params: { tipo },
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    }
  },

  deleteSpecialistDocument: async (tipo: 'frente' | 'dorso'): Promise<any> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        console.log(`MOCK: Deleting document type ${tipo}`);
        setTimeout(() => resolve({ message: 'Document deleted successfully (MOCK)' }), 500);
      });
    } else {
      const { data } = await apiClient.delete<any>(`/specialist/specialist/profile/documento/eliminar/${tipo}`);
      return data;
    }
  },

  uploadSpecialistCertificate: async (file: File): Promise<any> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        console.log('MOCK: Uploading certificate with file:', file);
        setTimeout(() => resolve({ message: 'Certificate uploaded successfully (MOCK)', id_certificado: `mock-cert-${Date.now()}`, url: `mock-url-cert-${file.name}` }), 500);
      });
    } else {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await apiClient.post<any>('/specialist/specialist/profile/certificado/subir', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    }
  },

  deleteSpecialistCertificate: async (certificado_id: string): Promise<any> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        console.log(`MOCK: Deleting certificate with ID: ${certificado_id}`);
        setTimeout(() => resolve({ message: 'Certificate deleted successfully (MOCK)' }), 500);
      });
    } else {
      const { data } = await apiClient.delete<any>(`/specialist/specialist/profile/certificado/eliminar/${certificado_id}`);
      return data;
    }
  },

  modifyWorkout: async (id_entrenamiento: string, payload: ModifyWorkoutPayload): Promise<string> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        console.log(`MOCK: Modifying workout ${id_entrenamiento} with payload:`, payload);
        setTimeout(() => resolve('Workout modified successfully (MOCK)'), 500);
      });
    } else {
      const { data } = await apiClient.put<string>(`/specialist/specialist/pacientes/modificar-entrenamiento/${id_entrenamiento}`, payload);
      return data;
    }
  },

  modifyWorkoutComment: async (id_entrenamiento: string, payload: ModifyWorkoutCommentPayload): Promise<string> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        console.log(`MOCK: Modifying workout comment ${id_entrenamiento} with payload:`, payload);
        setTimeout(() => resolve('Workout comment modified successfully (MOCK)'), 500);
      });
    } else {
      const { data } = await apiClient.put<string>(`/specialist/specialist/pacientes/modificar-comentario/${id_entrenamiento}`, payload);
      return data;
    }
  },

  deleteWorkoutExercise: async (id_entrenamiento_ejercicio: string): Promise<any> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        console.log(`MOCK: Deleting workout exercise ${id_entrenamiento_ejercicio}`);
        setTimeout(() => resolve({ message: 'Workout exercise deleted successfully (MOCK)' }), 500);
      });
    } else {
      const { data } = await apiClient.delete<any>(`/specialist/specialist/pacientes/eliminar-ejercicio-de-entrenamiento/${id_entrenamiento_ejercicio}`);
      return data;
    }
  },

  getExerciseTypes: async (): Promise<string[]> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        console.log('MOCK: Getting exercise types');
        setTimeout(() => resolve(['Cardio', 'Fuerza', 'Flexibilidad', 'Equilibrio', 'Resistencia']), 500);
      });
    } else {
      const { data } = await apiClient.get<string[]>('/specialist/specialist/pacientes/agregar-ejercicio-de-entrenamiento/tipos-ejercicios');
      return data;
    }
  },

  getExercisesByType: async (tipo?: string | null, nombre?: string | null): Promise<BaseExerciseItem[]> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        console.log(`MOCK: Getting exercises by type ${tipo || ''} and name ${nombre || ''}`);
        const mockExercises: BaseExerciseItem[] = [
          { id_ejercicio: 'ej-1', nombre: 'Sentadillas', tipo: 'Fuerza' },
          { id_ejercicio: 'ej-2', nombre: 'Flexiones', tipo: 'Fuerza' },
          { id_ejercicio: 'ej-3', nombre: 'Correr', tipo: 'Cardio' },
          { id_ejercicio: 'ej-4', nombre: 'Estiramiento de isquiotibiales', tipo: 'Flexibilidad' },
        ];
        let filtered = mockExercises;
        if (tipo) {
          filtered = filtered.filter(e => e.tipo === tipo);
        }
        if (nombre) {
          filtered = filtered.filter(e => e.nombre.toLowerCase().includes(nombre.toLowerCase()));
        }
        setTimeout(() => resolve(filtered), 500);
      });
    } else {
      const { data } = await apiClient.get<BaseExerciseItem[]>('/specialist/specialist/pacientes/agregar-ejercicio-de-entrenamiento/ejercicios-segun-tipo', {
        params: { tipo, nombre }
      });
      return data;
    }
  },

  getExerciseDetailById: async (id_ejercicio: string): Promise<DetailedExerciseInfo> => {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        console.log(`MOCK: Getting exercise detail for ID: ${id_ejercicio}`);
        const mockDetails: DetailedExerciseInfo = {
          id_ejercicio: id_ejercicio,
          nombre: 'Sentadillas',
          tipo: 'Fuerza',
          descripcion: 'Ejercicio compuesto para fortalecer piernas y glúteos.',
          multimedia_url: 'https://www.youtube.com/watch?v=some_video_id',
          instrucciones: {
            objetivo: 'Desarrollar fuerza en las piernas y glúteos.',
            ejecucion: 'De pie, con los pies al ancho de los hombros, baja la cadera como si fueras a sentarte en una silla. Mantén la espalda recta y el core activado.',
            errores_comunes: 'Arquear la espalda baja, rodillas hacia adentro, no bajar lo suficiente.',
            posicion_inicial: 'De pie, pies al ancho de hombros, puntas ligeramente hacia afuera.',
            consejos_tecnicos: ['Mantén el peso en los talones', 'Mira al frente', 'Controla el descenso'],
          },
          necesita_mapa: false,
        };
        if (id_ejercicio === 'ej-1') {
          setTimeout(() => resolve(mockDetails), 500);
        } else {
          setTimeout(() => reject(new Error('Exercise not found (MOCK)')), 500);
        }
      });
    } else {
      const { data } = await apiClient.get<DetailedExerciseInfo>(`/specialist/specialist/pacientes/agregar-ejercicio-de-entrenamiento/datos-ejercicio-seleccionado/${id_ejercicio}`);
      return data;
    }
  },

  addExerciseToWorkout: async (id_entrenamiento: string, payload: AddExerciseToWorkoutPayload): Promise<any> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        console.log(`MOCK: Adding exercise to workout ${id_entrenamiento} with payload:`, payload);
        setTimeout(() => resolve({ message: 'Exercise added to workout successfully (MOCK)' }), 500);
      });
    } else {
      const { data } = await apiClient.post<any>(`/specialist/specialist/pacientes/agregar-ejercicio-de-entrenamiento/agregar/${id_entrenamiento}`, payload);
      return data;
    }
  },

  editWorkoutExercise: async (id_entrenamiento_ejercicio: string, payload: EditWorkoutExercisePayload): Promise<string> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        console.log(`MOCK: Editing workout exercise ${id_entrenamiento_ejercicio} with payload:`, payload);
        setTimeout(() => resolve('Workout exercise updated successfully (MOCK)'), 500);
      });
    } else {
      const { data } = await apiClient.put<string>(`/specialist/specialist/pacientes/editar-ejercicio-de-entrenamiento/editar/${id_entrenamiento_ejercicio}`, payload);
      return data;
    }
  },

  deleteMeal: async (id_comida: number): Promise<any> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        console.log(`MOCK: Deleting meal with ID: ${id_comida}`);
        setTimeout(() => resolve({ message: 'Meal deleted successfully (MOCK)' }), 500);
      });
    } else {
      const { data } = await apiClient.delete<any>(`/specialist/specialist/pacientes/nutricion/eliminar-comida/${id_comida}`);
      return data;
    }
  },

  createMeal: async (payload: CreateMealPayload): Promise<any> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        console.log('MOCK: Creating meal with payload:', payload);
        setTimeout(() => resolve({ message: 'Meal created successfully (MOCK)' }), 500);
      });
    } else {
      const { data } = await apiClient.post<any>('/specialist/specialist/pacientes/nutricion/crear-comida', payload);
      return data;
    }
  },

  editMealComment: async (id_comida: number, payload: EditMealCommentPayload): Promise<any> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        console.log(`MOCK: Editing meal comment for ID: ${id_comida} with payload:`, payload);
        setTimeout(() => resolve({ message: 'Meal comment updated successfully (MOCK)' }), 500);
      });
    } else {
      const { data } = await apiClient.patch<any>(`/specialist/specialist/pacientes/nutricion/editar-comentario-seguimiento/${id_comida}`, payload);
      return data;
    }
  },

  editHydration: async (id_comida: string, payload: EditHydrationPayload): Promise<any> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        console.log(`MOCK: Editing hydration for meal ID: ${id_comida} with payload:`, payload);
        setTimeout(() => resolve({ message: 'Hydration updated successfully (MOCK)' }), 500);
      });
    } else {
      const { data } = await apiClient.put<any>(`/specialist/specialist/pacientes/nutricion/hidratacion-editar/${id_comida}`, payload);
      return data;
    }
  },

  getSpecialistNotificationStats: async (): Promise<SpecialistNotificationStats> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => resolve({
          enviados_hoy: 15,
          apertura_promedio: 0.75,
          clic_promedio: 0.30,
          total_campanias: 120,
        }), 500);
      });
    } else {
      const { data } = await apiClient.get<SpecialistNotificationStats>('/specialist/specialist/notifications/estadisticas-campania-notificaciones');
      return data;
    }
  },

  getSpecialistRecentNotifications: async (): Promise<SpecialistRecentCampaign[]> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => resolve([
          { id_campania: 1, titulo: 'Campaña de Bienvenida', destinatarios_filtro: 'todos_los_usuarios', estado: 'Enviada', fecha_programada: '2026-06-01T10:00:00Z', tiempo_transcurrido: '3 días', porcentaje_apertura: 0.80 },
          { id_campania: 2, titulo: 'Recordatorio de Consulta', destinatarios_filtro: 'solo_pacientes', estado: 'Programada', fecha_programada: '2026-06-05T14:30:00Z', tiempo_transcurrido: '1 día restante', porcentaje_apertura: 0.0 },
        ]), 500);
      });
    } else {
      const { data } = await apiClient.get<SpecialistRecentCampaign[]>('/specialist/specialist/notifications/enviadas-recientes');
      return data;
    }
  },

  sendSpecialistNotifications: async (payload: SendSpecialistNotificationPayload): Promise<string> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        console.log('MOCK: Sending specialist notifications with payload:', payload);
        setTimeout(() => resolve('Notifications sent successfully (MOCK)'), 500);
      });
    } else {
      const { data } = await apiClient.post<string>('/specialist/specialist/notifications/enviar-notificaciones', payload);
      return data;
    }
  },

  getSpecialistRecipientCounts: async (): Promise<SpecialistRecipientCounts> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => resolve({
          todos_los_usuarios: 1000,
          solo_pacientes: 750,
          inactivos_mas_de_7_dias: 100,
          sin_checkin_hoy: 50,
          onboarding_incompleto: 200,
        }), 500);
      });
    } else {
      const { data } = await apiClient.get<SpecialistRecipientCounts>('/specialist/specialist/notifications/conteo-tipos-destinatarios');
      return data;
    }
  },

  getSpecialistReceivedNotifications: async (): Promise<SpecialistReceivedNotification[]> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => resolve([
          { id_notificacion: 'notif-1', id_campania: 1, id_usuario: 'user-1', tipo: 'info', mensaje: '¡Bienvenido a Fitnflai!', enviada: true, leido: false, created_at: '2026-06-01T10:00:00Z', tiempo_transcurrido: '3 días' },
          { id_notificacion: 'notif-2', id_campania: 2, id_usuario: 'user-2', tipo: 'warning', mensaje: 'Tu consulta está programada para mañana.', enviada: true, leido: true, created_at: '2026-06-04T14:00:00Z', tiempo_transcurrido: '1 día' },
        ]), 500);
      });
    } else {
      const { data } = await apiClient.get<SpecialistReceivedNotification[]>('/specialist/specialist/notifications/notificaciones-recibidas-especialista');
      return data;
    }
  },

  sendPatientNotification: async (payload: SendPatientNotificationPayload): Promise<string> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        console.log('MOCK: Sending patient notification with payload:', payload);
        setTimeout(() => resolve('Patient notification sent successfully (MOCK)'), 500);
      });
    } else {
      const { data } = await apiClient.post<string>('/specialist/specialist/pacientes/enviar-notificacion', payload);
      return data;
    }
  },

}
