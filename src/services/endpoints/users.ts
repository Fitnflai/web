import { apiClient } from '@/services/api/client'
import type { User } from '@/types'
import { MOCK_USERS } from '@/services/mocks/users.mock'
import { MOCK_PLAN } from '@/services/mocks/plan.mock'

const USE_MOCK = false // flip to false when backend ready

const isMockId = (id: string): boolean => {
  if (!id) return false
  return id.startsWith('uid-') || id.startsWith('pro-') || id.startsWith('esp-') || id.length < 10
}

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
  getUserTabDetalle: async (id_usuario: string, tab: string): Promise<any> => {
    if (USE_MOCK || isMockId(id_usuario)) {
      if (tab === 'plan') {
        return {
          semana_numero: 1,
          semana_rango: {
            inicio: '2026-06-01',
            fin: '2026-06-07'
          },
          entrenamientos: MOCK_PLAN
        }
      }
      return MOCK_USERS.find(user => user.id_usuario === id_usuario);
    }
    const apiTab = tab === 'reporte-clinico' ? 'reporte_clinico' : tab;
    const { data } = await apiClient.get(`/admin/usuarios/detalle/${id_usuario}/detalle`, {
      params: { tab: apiTab }
    });
    return data;
  },
  getUserHeaderDetalle: async (id_usuario: string): Promise<any> => {
    if (USE_MOCK || isMockId(id_usuario)) {
      return MOCK_USERS.find(user => user.id_usuario === id_usuario);
    }
    const { data } = await apiClient.get(`/admin/usuarios/detalle/${id_usuario}/cabecera`);
    return data;
  }
}
