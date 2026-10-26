export type BlogCategory = 'Entrenamiento' | 'Nutrición' | 'Salud' | 'Rendimiento' | 'Bienestar'

export type BlogStatus = 'published' | 'draft' | 'archived'

export interface BlogAuthor {
  name: string
  avatar: string
  role: string
}

export interface BlogSEO {
  metaTitle?: string
  metaDescription?: string
  keywords?: string[]
  canonicalUrl?: string
  ogImage?: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  category: BlogCategory
  tags: string[]
  author: BlogAuthor
  status: BlogStatus
  publishedAt: string | null
  updatedAt: string
  readingTime: number // minutos estimados
  featured?: boolean
  seo: BlogSEO
}

export interface SaveBlogPostPayload {
  id?: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  category: BlogCategory
  tags: string[]
  author?: BlogAuthor
  status: BlogStatus
  featured?: boolean
  seo?: BlogSEO
}

export interface BlogQueryParams {
  category?: string
  tag?: string
  search?: string
  status?: BlogStatus | 'all'
  page?: number
  limit?: number
}
