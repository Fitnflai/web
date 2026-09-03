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
}

