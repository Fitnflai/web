import { apiClient } from '@/services/api/client';
import type { AdminDashboardStats } from '@/core/domain/types';

export const dashboardService = {
  getStats: async (): Promise<AdminDashboardStats> => {
    const { data } = await apiClient.get<AdminDashboardStats>('/admin/dashboard/stats');
    return data;
  },
  getListData: async (tab: string): Promise<any[]> => {
    const { data } = await apiClient.get<any[]>('/admin/dashboard/list', {
      params: { tab },
    });
    return data;
  },
};
