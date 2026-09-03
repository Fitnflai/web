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
    const { data } = await apiClient.get<any>('/admin/transactions/summary')
    let resolvedData = data
    if (typeof resolvedData === 'string') {
      try {
        resolvedData = JSON.parse(resolvedData)
      } catch (e) {
        console.error('Failed to parse transaction summary stringified JSON:', e)
      }
    }
    if (resolvedData && resolvedData.data !== undefined) {
      resolvedData = resolvedData.data
    }
    return resolvedData as TransactionSummary
  },

  getHistory: async (params: GetHistoryParams): Promise<APITransaction[]> => {
    const { data } = await apiClient.get<any>('/admin/transactions/history', {
      params
    })
    
    let resolvedData = data
    
    // 1. If response is a string (Stringified JSON), parse it safely
    if (typeof resolvedData === 'string') {
      try {
        resolvedData = JSON.parse(resolvedData)
      } catch (e) {
        console.error('Failed to parse transaction history stringified JSON:', e)
      }
    }
    
    // 2. If it has an inner wrapper like .data or .items, unpack it
    if (resolvedData && typeof resolvedData === 'object' && !Array.isArray(resolvedData)) {
      if (Array.isArray(resolvedData.data)) {
        resolvedData = resolvedData.data
      } else if (Array.isArray(resolvedData.items)) {
        resolvedData = resolvedData.items
      } else if (Array.isArray(resolvedData.history)) {
        resolvedData = resolvedData.history
      } else if (Array.isArray(resolvedData.transactions)) {
        resolvedData = resolvedData.transactions
      } else {
        const firstArrayKey = Object.keys(resolvedData).find(key => Array.isArray(resolvedData[key]))
        if (firstArrayKey) {
          resolvedData = resolvedData[firstArrayKey]
        }
      }
    }
    
    if (Array.isArray(resolvedData)) {
      return resolvedData as APITransaction[]
    }
    
    return []
  }
}