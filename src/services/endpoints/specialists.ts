import { apiClient } from '@/services/api/client'
import type { SpecialistPatientsResponse, SpecialistDashboardResponse, SpecialistDashboardTabResponse } from '@/types'

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
  }
}
