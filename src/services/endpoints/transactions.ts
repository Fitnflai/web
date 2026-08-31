import { apiClient } from '@/services/api/client'
import type { TransactionSummary, APITransaction } from '@/types'

export interface GetHistoryParams {
  tab: 'todas' | 'membresias' | 'citas'
  search?: string
  limit: number
  offset: number
}

export const transactionsService = {
  getSummary: async (): Promise<TransactionSummary> => {
    const { data } = await apiClient.get<TransactionSummary>('/admin/transactions/summary')
    return data
  },

  getHistory: async (params: GetHistoryParams): Promise<APITransaction[]> => {
    const { data } = await apiClient.get<APITransaction[]>('/admin/transactions/history', {
      params
    })
    return data
  }
}