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
    await apiClient.post('/admin/memberships/plans/link-benefit', payload)
  },

  updatePlan: async (payload: UpdatePlanPayload): Promise<MembershipPlan> => {
    const { id_plan, ...body } = payload
    const { data } = await apiClient.patch<MembershipPlan>(`/admin/memberships/plans/${id_plan}`, body)
    return data
  }
}
