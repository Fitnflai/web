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
  }
}
