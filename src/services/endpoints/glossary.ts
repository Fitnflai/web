import { apiClient } from '@/services/api/client'

export interface GlossaryTerm {
  id: string
  termino: string
  descripcion_es: string
  descripcion_en: string
}

export interface SaveGlossaryTermPayload {
  id?: string
  termino: string
  descripcion_es: string
  descripcion_en: string
}

export interface SearchInTextPayload {
  texto: string
  lang: 'es' | 'en'
}

export interface SearchInTextResult {
  id: string
  termino: string
  descripcion: string
}

export const glossaryService = {
  /**
   * Obtiene la lista completa de términos del glosario
   */
  getTerms: async (): Promise<GlossaryTerm[]> => {
    const { data } = await apiClient.get<GlossaryTerm[]>('/admin/obtener-terminos-glosario')
    return data
  },

  /**
   * Guarda un término (crear o modificar)
   */
  saveTerm: async (payload: SaveGlossaryTermPayload): Promise<GlossaryTerm> => {
    const { data } = await apiClient.post<GlossaryTerm>('/admin/guardar-termino-glosario', payload)
    return data
  },

  /**
   * Elimina un término por su ID UUID
   */
  deleteTerm: async (id_termino: string): Promise<{ message: string }> => {
    const { data } = await apiClient.delete<{ message: string }>(`/admin/eliminar-termino-glosario/${id_termino}`)
    return data
  },

  /**
   * Busca términos del glosario dentro de un texto según idioma
   */
  searchTermsInText: async (payload: SearchInTextPayload): Promise<SearchInTextResult[]> => {
    const { data } = await apiClient.post<SearchInTextResult[]>('/admin/buscar-terminos-glosario', payload)
    return data
  },
}
