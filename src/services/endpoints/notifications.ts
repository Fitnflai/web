import { apiClient } from '@/services/api/client'
import type {
  NotificationStats,
  RecentCampaign,
  RecipientCounts,
  SendNotificationPayload
} from '@/types'

export interface AdminReceivedNotification {
  id_notificacion: string
  id_campania: number
  id_usuario: string
  tipo: string
  mensaje: string
  enviada: boolean
  leido: boolean
  created_at: string
  tiempo_transcurrido: string
}

export const notificationsService = {
  getStats: async (): Promise<NotificationStats> => {
    const { data } = await apiClient.get<NotificationStats | NotificationStats[]>('/admin/notifications/estadisticas-campania-notificaciones')
    return Array.isArray(data) ? data[0] : data
  },

  getRecent: async (): Promise<RecentCampaign[]> => {
    const { data } = await apiClient.get<RecentCampaign[]>('/admin/notifications/enviadas-recientes')
    return data
  },

  getCounts: async (): Promise<RecipientCounts> => {
    const { data } = await apiClient.get<RecipientCounts>('/admin/notifications/conteo-tipos-destinatarios')
    return data
  },

  send: async (payload: SendNotificationPayload): Promise<void> => {
    await apiClient.post('/admin/notifications/enviar-notificaciones', payload)
  },

  getReceivedNotifications: async (): Promise<AdminReceivedNotification[]> => {
    const { data } = await apiClient.get<AdminReceivedNotification[]>('/admin/notifications/notificaciones-recibidas-admin')
    return data
  }
}