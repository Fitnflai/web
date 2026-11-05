import { apiClient } from '@/services/api/client'
import { MOCK_APPOINTMENTS } from '@/services/mocks/agenda.mock'

const USE_MOCK = false // TODO: Change to false when integrating with real backend

export interface AdminAvailabilitySlot {
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado: string;
  id: number;
}

export interface AdminSaveAvailabilityPayload {
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado: string;
}
import type { SpecialistPatientsResponse, SpecialistDashboardResponse, SpecialistDashboardTabResponse } from '@/types'

export interface SpecialistAgendaSummary {
  citas_esta_semana: number;
  confirmadas: number;
  pendientes: number;
  canceladas: number;
  programadas: number;
  terminadas: number;
}

export interface SpecialistAppointment {
  estado_cita: string;
  fecha_hora: string;
  id_cita_agenda_especialista: string;
  id_especialista: string;
  id_usuario: string;
  motivo: string;
  tipo_cita: string;
  nombre_especialista?: string;
  disciplinas_especialista?: string[];
  nombre_paciente?: string;
  disciplinas_paciente?: string[];
  descripcion_cita?: string | null;
  notas_cita?: string | null;
  notas_adicionales?: string | null;
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
  biografia: string | null;
  nombre: string;
  email: string;
  especialidad: string | null;
  anios_experiencia: number | null;
  ciudad_pais: string | null;
  telefono: string | null;
  estado_cuenta: string;
  tipo_documento: string | null;
  numero_documento: string | null;
  url_doc_frente: string | null;
  url_doc_dorso: string | null;
  historial_laboral: SpecialistWorkHistory[];
  certificados: SpecialistCertificate[];
  avatar_url: string | null;
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

export interface ExerciseListItem {
  id_ejercicio: string;
  nombre: string;
  tipo: string;
  grupo_muscular?: string;
}

export interface ExerciseInstructions {
  objetivo: string;
  posicion_inicial: string;
  ejecucion: string;
  errores_comunes: string;
  consejos_tecnicos: string[];
}

export interface ExerciseDetailResponse {
  id_ejercicio: string;
  nombre: string;
  tipo: string;
  grupo_muscular?: string;
  descripcion: string;
  multimedia_url: string;
  multimedia_url_femenino?: string;
  instrucciones: ExerciseInstructions;
  necesita_mapa: boolean;
}

export interface AddExerciseToWorkoutPayload {
  id_ejercicio: string;
  orden: number;
  series: number;
  descanso_segundos: number;
  repeticiones: number;
  distancia_metros?: number;
  peso_objetivo: number;
  duracion_segundos: number;
  comentario: string;
  estado: string;
}

export interface UpdateWorkoutParametersPayload {
  nombre?: string;
  numero_sesion?: string;
  tipo_entrenamiento: string;
  zona_esfuerzo: string;
  fecha_programada: string;
  calorias_objetivo: number;
  descripcion: string;
  estado: string;
}

export interface UpdateWorkoutCommentPayload {
  texto: string;
}

export interface AddWorkoutSessionPayload {
  id_plan_entrenamiento?: string | null;
  fecha_programada: string;
  tipo: string;
  nombre: string;
  numero_sesion: string | number;
  descripcion?: string;
  zona_esfuerzo?: string;
  calorias_objetivo?: number;
  nivel?: string;
}

export interface DeleteWorkoutSessionResponse {
  message: string;
  id_entrenamiento: string;
}

export interface RegisterNewExercisePayload {
  nombre: string;
  descripcion: string;
  tipo: string;
  necesita_mapa: boolean;
  instrucciones: {
    objetivo: string;
    ejecucion: string;
    errores_comunes: string;
    posicion_inicial: string;
    consejos_tecnicos: string[];
  };
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

export interface UpdateExerciseInWorkoutPayload {
  orden: number;
  series: number;
  descanso_segundos: number;
  repeticiones: number;
  distancia_metros?: number;
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
  title?: string;
  subject?: string;
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
  title?: string;
  subject?: string;
  mensaje: string;
  message?: string;
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

export interface DetallesObjetivo {
  nombre_competencia?: string;
  fecha_competencia?: string;
  distancia_objetivo?: number;
  unidad_distancia?: string;
  desnivel_m?: number;
  altitud_destino_m?: number;
  requiere_aclimatacion_calor?: boolean;
  prueba_preconfigurada?: string;
  modalidad_mejora_tiempo?: string;
  tiempo_actual?: string;
  tiempo_meta?: string;
  que_quieres_mejorar_cg?: string;
  objetivo_especifico_cg?: string;
  descripcion_otro_objetivo?: string;
}

export interface DetalleLesion {
  zona_afectada: string;
  descripcion_molestia: string;
  nivel_dolor_eva: number;
  tipo_lesion: string;
}

export interface DisciplinaItem {
  id_disciplina: number;
  nombre: string;
  descripcion: string;
  imagen_url?: string;
}

export interface EquipmentItem {
  id_implemento: number;
  nombre: string;
  imagen_url?: string;
}

export interface ObjectiveItem {
  id_objetivo: string | number;
  nombre: string;
  descripcion?: string;
  imagen_url?: string;
}

export interface RegisterPatientPayload {
  nombre: string;
  email: string;
  apodo?: string;
  telefono?: string;
  genero?: string;
  fecha_nacimiento?: string;
  peso?: number;
  unidad_peso?: string;
  altura?: number;
  unidad_altura?: string;
  ciudad?: string;
  altitud_msnm?: number;
  timezone?: string;
  id_disciplina?: number;
  nivel_dificultad?: string;
  fecha_inicio_deseada?: string;
  tiempo_por_sesion?: number;
  dias_disponibles?: string[];
  equipamiento_ids?: number[];
  id_objetivo?: number | string;
  detalles_objetivo?: DetallesObjetivo;
  detalles_lesiones?: DetalleLesion[];
  adaptacion_ciclo_menstrual?: boolean;
  notas?: string;
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
        programadas: appointmentsInPeriod.length, // In mock, all are "programadas"
        terminadas: appointmentsInPeriod.filter(apt => (apt.estado as any) === 'completada' || (apt.estado as any) === 'terminada').length
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
      const mappedEstado = estado ? (estado.charAt(0).toUpperCase() + estado.slice(1)) : undefined;
      const { data } = await apiClient.post<SpecialistAppointment[]>('/specialist/specialist/agenda-global/obtener-citas-especialista', null, {
        params: { fecha_inicio, fecha_fin, ...(mappedEstado && { estado: mappedEstado }) }
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
            nombre: 'Dr. Carlos Mendoza',
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
            avatar_url: null,
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

  uploadSpecialistAvatar: async (file: File): Promise<string> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        console.log('MOCK: Uploading specialist avatar with file:', file);
        const mockUrl = URL.createObjectURL(file);
        setTimeout(() => resolve(mockUrl), 500);
      });
    } else {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await apiClient.post<any>('/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (typeof data === 'string') {
        return data;
      }
      return data?.foto_url || data?.avatar_url || data?.url || '';
    }
  },

  updateWorkoutParameters: async (id_entrenamiento: string, payload: UpdateWorkoutParametersPayload): Promise<string> => {
    if (USE_MOCK) {
      console.log('MOCK: Updating workout parameters:', id_entrenamiento, payload);
      return id_entrenamiento;
    }
    const { data } = await apiClient.put<string>(`/specialist/specialist/pacientes/modificar-entrenamiento/${id_entrenamiento}`, payload);
    return data;
  },

  updateWorkoutComment: async (id_entrenamiento: string, payload: UpdateWorkoutCommentPayload): Promise<string> => {
    if (USE_MOCK) {
      console.log('MOCK: Updating workout comment:', id_entrenamiento, payload);
      return id_entrenamiento;
    }
    const { data } = await apiClient.put<string>(`/specialist/specialist/pacientes/modificar-comentario/${id_entrenamiento}`, payload);
    return data;
  },

  addWorkoutSession: async (id_usuario: string, payload: AddWorkoutSessionPayload): Promise<any> => {
    if (USE_MOCK) {
      console.log('MOCK: Adding workout session for user:', id_usuario, payload);
      return {
        id_entrenamiento: `wk-${Date.now()}`,
        ...payload,
        message: 'Sesión agregada correctamente'
      };
    }
    const { data } = await apiClient.post(`/specialist/specialist/pacientes/agregar-entrenamiento/${id_usuario}`, payload);
    return data;
  },

  deleteWorkoutSession: async (id_entrenamiento: string): Promise<DeleteWorkoutSessionResponse> => {
    if (USE_MOCK) {
      console.log('MOCK: Deleting workout session:', id_entrenamiento);
      return {
        message: 'Sesión de entrenamiento eliminada correctamente',
        id_entrenamiento
      };
    }
    const { data } = await apiClient.delete<DeleteWorkoutSessionResponse>(`/specialist/specialist/pacientes/eliminar-entrenamiento/${id_entrenamiento}`);
    return data;
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



  updateExerciseInWorkout: async (id_entrenamiento_ejercicio: string, payload: UpdateExerciseInWorkoutPayload): Promise<string> => {
    if (USE_MOCK) {
      console.log('MOCK: Updating exercise in workout:', id_entrenamiento_ejercicio, payload);
      return id_entrenamiento_ejercicio;
    }
    const { data } = await apiClient.put<string>(`/specialist/specialist/pacientes/editar-ejercicio-en-entrenamiento/editar/${id_entrenamiento_ejercicio}`, payload);
    return data;
  },

  deleteExerciseFromWorkout: async (id_entrenamiento_ejercicio: string): Promise<any> => {
    if (USE_MOCK) {
      console.log('MOCK: Deleting exercise from workout:', id_entrenamiento_ejercicio);
      return { success: true };
    }
    const { data } = await apiClient.delete(`/specialist/specialist/pacientes/eliminar-ejercicio-de-entrenamiento/${id_entrenamiento_ejercicio}`);
    return data;
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

  getExerciseTypes: async (): Promise<string[]> => {
    if (USE_MOCK) {
      return ["Activación", "Movilidad", "Fuerza", "Cardio", "Ciclismo", "Global", "Running", "Básico", "Estiramiento", "Respiración", "HIIT", "Evaluación", "Flexibilidad", "Core", "Bici"];
    }
    const { data } = await apiClient.get<string[]>('/specialist/specialist/pacientes/agregar-ejercicio-en-entrenamiento/tipos-ejercicios');
    return data;
  },

  getMuscleGroups: async (tipo?: string | null): Promise<string[]> => {
    if (USE_MOCK) {
      return ["Bíceps", "Tríceps", "Core", "Espalda", "Pecho", "Piernas", "Pantorrillas"];
    }
    const params: { tipo?: string } = {};
    if (tipo) params.tipo = tipo;
    const { data } = await apiClient.get<string[]>('/specialist/specialist/pacientes/agregar-ejercicio-en-entrenamiento/grupos-musculares', {
      params
    });
    return data;
  },

  getExercisesByType: async (tipo?: string | null, nombre?: string | null, grupo_muscular?: string | null): Promise<ExerciseListItem[]> => {
    if (USE_MOCK) {
      const mockList: ExerciseListItem[] = [
        // Fuerza - Piernas
        { id_ejercicio: 'ex-001', nombre: 'Sentadillas con barra (Piernas)', tipo: 'Fuerza', grupo_muscular: 'Piernas' },
        { id_ejercicio: 'ex-002', nombre: 'Peso Muerto Rumano (Piernas/Glúteos)', tipo: 'Fuerza', grupo_muscular: 'Piernas' },
        { id_ejercicio: 'ex-006', nombre: 'Prensa Inclinada 45° (Piernas)', tipo: 'Fuerza', grupo_muscular: 'Piernas' },
        { id_ejercicio: 'ex-007', nombre: 'Zancadas Búlgaras con Mancuernas (Piernas)', tipo: 'Fuerza', grupo_muscular: 'Piernas' },
        // Fuerza - Pantorrillas
        { id_ejercicio: 'ex-008', nombre: 'Elevación de Talones de Pie (Pantorrillas)', tipo: 'Fuerza', grupo_muscular: 'Pantorrillas' },
        { id_ejercicio: 'ex-009', nombre: 'Elevación de Talones Sentado (Pantorrillas/Sóleo)', tipo: 'Fuerza', grupo_muscular: 'Pantorrillas' },
        // Fuerza - Pecho
        { id_ejercicio: 'ex-003', nombre: 'Press de Banca Plano (Pecho)', tipo: 'Fuerza', grupo_muscular: 'Pecho' },
        { id_ejercicio: 'ex-010', nombre: 'Press Inclinado con Mancuernas (Pecho)', tipo: 'Fuerza', grupo_muscular: 'Pecho' },
        { id_ejercicio: 'ex-011', nombre: 'Flexiones de Pecho / Push-ups (Pecho)', tipo: 'Fuerza', grupo_muscular: 'Pecho' },
        { id_ejercicio: 'ex-012', nombre: 'Aperturas con Mancuernas (Pecho)', tipo: 'Fuerza', grupo_muscular: 'Pecho' },
        // Fuerza - Espalda
        { id_ejercicio: 'ex-013', nombre: 'Remo con Barra Prono (Espalda)', tipo: 'Fuerza', grupo_muscular: 'Espalda' },
        { id_ejercicio: 'ex-014', nombre: 'Dominadas Pronas (Espalda)', tipo: 'Fuerza', grupo_muscular: 'Espalda' },
        { id_ejercicio: 'ex-015', nombre: 'Jalón al Pecho en Polea (Espalda)', tipo: 'Fuerza', grupo_muscular: 'Espalda' },
        { id_ejercicio: 'ex-016', nombre: 'Remo Unilateral con Mancuerna (Espalda)', tipo: 'Fuerza', grupo_muscular: 'Espalda' },
        // Fuerza - Bíceps
        { id_ejercicio: 'ex-017', nombre: 'Curl de Bíceps con Barra Z', tipo: 'Fuerza', grupo_muscular: 'Bíceps' },
        { id_ejercicio: 'ex-018', nombre: 'Curl Martillo con Mancuernas (Bíceps)', tipo: 'Fuerza', grupo_muscular: 'Bíceps' },
        { id_ejercicio: 'ex-019', nombre: 'Curl Concentrado en Banco (Bíceps)', tipo: 'Fuerza', grupo_muscular: 'Bíceps' },
        // Fuerza - Tríceps
        { id_ejercicio: 'ex-020', nombre: 'Fondos en Paralelas (Tríceps)', tipo: 'Fuerza', grupo_muscular: 'Tríceps' },
        { id_ejercicio: 'ex-021', nombre: 'Extensión de Tríceps en Polea Alta', tipo: 'Fuerza', grupo_muscular: 'Tríceps' },
        { id_ejercicio: 'ex-022', nombre: 'Press Francés con Mancuernas (Tríceps)', tipo: 'Fuerza', grupo_muscular: 'Tríceps' },
        // Fuerza - Core
        { id_ejercicio: 'ex-023', nombre: 'Plancha Frontal Isométrica (Core)', tipo: 'Fuerza', grupo_muscular: 'Core' },
        { id_ejercicio: 'ex-024', nombre: 'Rueda Abdominal (Core)', tipo: 'Fuerza', grupo_muscular: 'Core' },
        { id_ejercicio: 'ex-025', nombre: 'Elevación de Piernas Colgado (Core)', tipo: 'Fuerza', grupo_muscular: 'Core' },
        { id_ejercicio: 'ex-026', nombre: 'Pallof Press con Banda (Core)', tipo: 'Fuerza', grupo_muscular: 'Core' },
        // Cardio y otros
        { id_ejercicio: 'ex-004', nombre: 'Carrera Continua', tipo: 'Cardio' },
        { id_ejercicio: 'ex-005', nombre: 'Estiramientos Activos', tipo: 'Estiramiento' },
      ];
      return mockList.filter(item => {
        if (tipo && item.tipo.toLowerCase() !== tipo.toLowerCase()) return false;
        if (nombre && !item.nombre.toLowerCase().includes(nombre.toLowerCase())) return false;
        if (grupo_muscular && item.grupo_muscular && item.grupo_muscular.toLowerCase() !== grupo_muscular.toLowerCase()) return false;
        return true;
      });
    }
    const params: { tipo?: string; nombre?: string; grupo_muscular?: string } = {};
    if (tipo) params.tipo = tipo;
    if (nombre) params.nombre = nombre;
    if (grupo_muscular) params.grupo_muscular = grupo_muscular;
    const { data } = await apiClient.get<ExerciseListItem[]>('/specialist/specialist/pacientes/agregar-ejercicio-en-entrenamiento/ejercicios-segun-tipo', {
      params
    });
    return data;
  },

  getExerciseDetail: async (id_ejercicio: string): Promise<ExerciseDetailResponse> => {
    if (USE_MOCK) {
      return {
        id_ejercicio,
        nombre: 'Sentadillas',
        tipo: 'Fuerza',
        grupo_muscular: 'Piernas',
        descripcion: 'Ejercicio multiarticular de fuerza inferior.',
        multimedia_url: '',
        multimedia_url_femenino: '',
        instrucciones: {
          objetivo: 'Desarrollar fuerza en cuádriceps y glúteos.',
          posicion_inicial: 'De pie con pies a ancho de hombros.',
          ejecucion: 'Bajar flexionando caderas y rodillas manteniendo la espalda recta.',
          errores_comunes: 'Flexionar la columna lumbar o levantar talones.',
          consejos_tecnicos: ['Mantén el peso en el medio del pie', 'Empuja el piso con fuerza']
        },
        necesita_mapa: false
      };
    }
    const { data } = await apiClient.get<ExerciseDetailResponse>(`/specialist/specialist/pacientes/agregar-ejercicio-en-entrenamiento/datos-ejercicio-seleccionado/${id_ejercicio}`);
    return data;
  },

  addExerciseToWorkout: async (id_entrenamiento: string, payload: AddExerciseToWorkoutPayload): Promise<any> => {
    if (USE_MOCK) {
      console.log('MOCK: Adding exercise to workout:', id_entrenamiento, payload);
      return { success: true };
    }
    const { data } = await apiClient.post(`/specialist/specialist/pacientes/agregar-ejercicio-en-entrenamiento/agregar/${id_entrenamiento}`, payload);
    return data;
  },

  registerNewExercise: async (payload: RegisterNewExercisePayload, files?: { multimedia_masculino?: File; multimedia_femenino?: File }): Promise<string> => {
    if (USE_MOCK) {
      console.log('MOCK: Creating new exercise:', payload);
      return 'new-exercise-uuid';
    }
    const formData = new FormData();
    formData.append('data', JSON.stringify(payload));
    if (files?.multimedia_masculino) {
      formData.append('multimedia_masculino', files.multimedia_masculino);
    }
    if (files?.multimedia_femenino) {
      formData.append('multimedia_femenino', files.multimedia_femenino);
    }
    const { data } = await apiClient.post<any>('/specialist/specialist/pacientes/registrar-nuevo-ejercicio', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return typeof data === 'string' ? data : data?.id_ejercicio || data?.id || '';
  },

  getAdminAvailability: async (id_especialista: number, fecha_inicio: string, fecha_fin: string): Promise<AdminAvailabilitySlot[]> => {
    const { data } = await apiClient.get<AdminAvailabilitySlot[]>('/admin/agenda-global/disponibilidad/obtener', {
      params: { id_especialista, fecha_inicio, fecha_fin }
    });
    return data;
  },

  saveAdminAvailability: async (id_especialista: number, payload: AdminSaveAvailabilityPayload[]): Promise<AdminAvailabilitySlot[]> => {
    const { data } = await apiClient.post<AdminAvailabilitySlot[]>('/admin/agenda-global/disponibilidad/guardar', payload, {
      params: { id_especialista }
    });
    return data;
  },

  updateAdminAvailabilityState: async (id_horario_especialista: number, estado: string): Promise<AdminAvailabilitySlot> => {
    const { data } = await apiClient.put<AdminAvailabilitySlot>(`/admin/agenda-global/disponibilidad/actualizar/${id_horario_especialista}`, null, {
      params: { estado }
    });
    return data;
  },

  copyAdminAvailability: async (id_especialista: number, fecha_inicio_origen: string, fecha_inicio_destino: string): Promise<any> => {
    const { data } = await apiClient.post('/admin/agenda-global/disponibilidad/copiar', null, {
      params: { id_especialista, fecha_inicio_origen, fecha_inicio_destino }
    });
    return data;
  },

  getSpecialistRealAvailability: async (fecha_inicio: string, fecha_fin: string): Promise<AdminAvailabilitySlot[]> => {
    const { data } = await apiClient.get<AdminAvailabilitySlot[]>('/specialist/specialist/agenda-global/disponibilidad/obtener', {
      params: { fecha_inicio, fecha_fin }
    });
    return data;
  },

  saveSpecialistRealAvailability: async (payload: AdminSaveAvailabilityPayload[]): Promise<AdminAvailabilitySlot[]> => {
    const { data } = await apiClient.post<AdminAvailabilitySlot[]>('/specialist/specialist/agenda-global/disponibilidad/guardar', payload);
    return data;
  },

  updateSpecialistRealAvailabilityState: async (id_horario_especialista: number, estado: string): Promise<AdminAvailabilitySlot> => {
    const { data } = await apiClient.put<AdminAvailabilitySlot>(`/specialist/specialist/agenda-global/disponibilidad/actualizar/${id_horario_especialista}`, null, {
      params: { estado }
    });
    return data;
  },

  copySpecialistRealAvailability: async (fecha_inicio_origen: string, fecha_inicio_destino: string): Promise<any> => {
    const { data } = await apiClient.post('/specialist/specialist/agenda-global/disponibilidad/copiar', null, {
      params: { fecha_inicio_origen, fecha_inicio_destino }
    });
    return data;
  },

  registerSpecialistSelfRegistration: async (formData: any): Promise<any> => {
    const formDataObject = new FormData();

    const requestJson = {
      nombre_completo: formData.nombre,
      email: formData.email,
      password: formData.contrasena,
      telefono_contacto: formData.tel,
      idiomas: formData.idiomas,
      especialidad: formData.especialidad_label || formData.especialidad,
      anios_experiencia: parseInt(formData.experiencia, 10) || 0,
      ciudad: formData.ciudad,
      pais: 'Colombia',
      biografia: formData.bio,
      linkedin: formData.linkedin,
      web: formData.web,
      tipo_documento: formData.docTipo,
      numero_documento: formData.docNumero,
      trayectos: (formData.trayectos || []).map((t: any) => ({
        titulo: t.titulo,
        organizacion: t.org,
        fecha_inicio: t.inicio,
        fecha_fin: t.fin || null,
        descripcion: t.desc || ''
      })),
      certificados: (formData.certificados || []).map((c: any) => ({
        nombre: c.nombre,
        organizacion_emisora: c.org,
        anio_obtencion: c.año,
        fecha_vencimiento: c.venc || null
      }))
    };

    formDataObject.append('data_json', JSON.stringify(requestJson));
    if (formData.docDelantero) {
      formDataObject.append('file_frente', formData.docDelantero);
    }
    if (formData.docTrasero) {
      formDataObject.append('file_dorso', formData.docTrasero);
    }

    const { data } = await apiClient.post('/specialist/registrar-especialista', formDataObject, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  registerPatient: async (payload: RegisterPatientPayload): Promise<any> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: 'Paciente registrado exitosamente',
            id_usuario: 'pac-' + Date.now(),
            ...payload
          });
        }, 500);
      });
    }
    const { data } = await apiClient.post('/specialist/specialist/pacientes/registrar', payload);
    return data;
  },

  getDisciplines: async (): Promise<DisciplinaItem[]> => {
    if (USE_MOCK) {
      return [
        { id_disciplina: 1, nombre: 'Trail running', descripcion: 'Carrera de montaña y senderos' },
        { id_disciplina: 2, nombre: 'Triatlón', descripcion: 'Natación, ciclismo y carrera' },
        { id_disciplina: 3, nombre: 'Ciclismo de ruta', descripcion: 'Ciclismo en ruta y fondo' },
        { id_disciplina: 4, nombre: 'MTB', descripcion: 'Ciclismo de montaña y cross-country' },
        { id_disciplina: 5, nombre: 'Senderismo', descripcion: 'Senderismo y trekking' },
        { id_disciplina: 6, nombre: 'Acondicionamiento', descripcion: 'Acondicionamiento físico general y fuerza' },
      ];
    }
    const { data } = await apiClient.get<DisciplinaItem[]>('/onboarding/obtener-disciplinas');
    return data;
  },

  getEquipments: async (): Promise<EquipmentItem[]> => {
    if (USE_MOCK) {
      return [
        { id_implemento: 1, nombre: 'Cuerda para saltar' },
        { id_implemento: 2, nombre: 'Bandas de resistencia' },
        { id_implemento: 3, nombre: 'Pesa rusa (Kettlebell)' },
        { id_implemento: 4, nombre: 'Colchoneta de Yoga' },
        { id_implemento: 5, nombre: 'Rodillo de espuma (Foam roller)' },
        { id_implemento: 6, nombre: 'Mancuernas' },
        { id_implemento: 7, nombre: 'Barra y discos' },
        { id_implemento: 8, nombre: 'Bicicleta estática / Rodillo' },
      ];
    }
    const { data } = await apiClient.get<EquipmentItem[]>('/onboarding/equipments');
    return data;
  },

  getObjectives: async (): Promise<ObjectiveItem[]> => {
    if (USE_MOCK) {
      return [
        { id_objetivo: 'competencia', nombre: 'Competencia (Preparar un evento / carrera)', descripcion: 'Entrenamiento enfocado a eventos y carreras' },
        { id_objetivo: 'mejorar_tiempo', nombre: 'Mejorar tiempo', descripcion: 'Optimizar ritmo y crono en distancias clave' },
        { id_objetivo: 'condicion_general', nombre: 'Condición general', descripcion: 'Fuerza, movilidad o cardio general' },
        { id_objetivo: 'otro', nombre: 'Otro', descripcion: 'Objetivo personalizado' },
      ];
    }
    const { data } = await apiClient.get<ObjectiveItem[]>('/onboarding/objectives');
    return data;
  },

}
