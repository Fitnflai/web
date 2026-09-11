import { apiClient } from '@/services/api/client'
import type {
  MembershipStats,
  MembershipPlan,
  MembershipBenefit,
  LinkBenefitPayload,
  UpdatePlanPayload
} from '@/types'

export const membershipsService = {
  getMembershipStats: async (): Promise<MembershipStats> => {
    const { data } = await apiClient.get<MembershipStats>('/admin/memberships/estadisticas')
    return data
  },

  getPlansInfo: async (): Promise<MembershipPlan[]> => {
    const { data } = await apiClient.get<MembershipPlan[]>('/admin/memberships/plans-info')
    return data
  },

  getBenefitsInfo: async (): Promise<MembershipBenefit[]> => {
    const { data } = await apiClient.get<MembershipBenefit[]>('/admin/memberships/benefits-info')
    return data
  },

  linkBenefit: async (payload: LinkBenefitPayload): Promise<void> => {
    const body = {
      id_plan: payload.id_plan,
      id_beneficio: payload.id_beneficio || undefined,
      nombre: payload.nuevo_nombre || undefined,
      nueva_descripcion: payload.nueva_descripcion || undefined
    };
    await apiClient.post('/admin/memberships/plans/link-benefit', body);
  },

  updatePlan: async (payload: any): Promise<any> => {
    const { id_plan, ...body } = payload;
    const { data } = await apiClient.patch(`/admin/memberships/plans/${id_plan}`, body);
    return data;
  }
}
