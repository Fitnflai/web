import type { BlogPost, SaveBlogPostPayload, BlogQueryParams, BlogCategory } from '@/types/blog'
import { INITIAL_BLOG_POSTS } from '@/services/mocks/blog.mock'

const STORAGE_KEY = 'fitnflai_blog_posts_v1'

// Helper para calcular tiempo de lectura en minutos
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200
  const wordCount = text.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

// Helper para generar slug a partir de un título
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quita acentos
    .replace(/[^a-z0-9]+/g, '-') // Reemplaza no-alfanuméricos con guión
    .replace(/^-+|-+$/g, '') // Quita guiones iniciales o finales
}

function getStoredPosts(): BlogPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BLOG_POSTS))
      return INITIAL_BLOG_POSTS
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_BLOG_POSTS
  } catch (e) {
    console.error('Error al leer blog de localStorage:', e)
    return INITIAL_BLOG_POSTS
  }
}

function saveStoredPosts(posts: BlogPost[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
  } catch (e) {
    console.error('Error al guardar blog en localStorage:', e)
  }
}

export const blogService = {
  /**
   * Obtiene la lista de artículos según filtros
   */
  getPosts: async (params?: BlogQueryParams): Promise<{ posts: BlogPost[]; total: number }> => {
    // Simula latencia de red
    await new Promise((r) => setTimeout(r, 100))

    let posts = getStoredPosts()

    // Filtro por estado
    if (params?.status && params.status !== 'all') {
      posts = posts.filter((p) => p.status === params.status)
    }

    // Filtro por categoría
    if (params?.category && params.category !== 'all') {
      posts = posts.filter((p) => p.category.toLowerCase() === params.category!.toLowerCase())
    }

    // Filtro por tag
    if (params?.tag) {
      posts = posts.filter((p) => p.tags.some((t) => t.toLowerCase() === params.tag!.toLowerCase()))
    }

    // Búsqueda por texto (título, excerpt, contenido)
    if (params?.search && params.search.trim()) {
      const q = params.search.trim().toLowerCase()
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
    }

    // Ordenar: más recientes primero
    posts = [...posts].sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.updatedAt).getTime()
      const dateB = new Date(b.publishedAt || b.updatedAt).getTime()
      return dateB - dateA
    })

    const total = posts.length

    // Paginación si corresponde
    if (params?.page && params?.limit) {
      const start = (params.page - 1) * params.limit
      posts = posts.slice(start, start + params.limit)
    }

    return { posts, total }
  },

  /**
   * Obtiene un artículo por su slug
   */
  getPostBySlug: async (slug: string): Promise<BlogPost | null> => {
    await new Promise((r) => setTimeout(r, 80))
    const posts = getStoredPosts()
    const found = posts.find((p) => p.slug === slug)
    return found || null
  },

  /**
   * Obtiene un artículo por su ID
   */
  getPostById: async (id: string): Promise<BlogPost | null> => {
    await new Promise((r) => setTimeout(r, 50))
    const posts = getStoredPosts()
    const found = posts.find((p) => p.id === id)
    return found || null
  },

  /**
   * Guarda o actualiza un artículo
   */
  savePost: async (payload: SaveBlogPostPayload): Promise<BlogPost> => {
    await new Promise((r) => setTimeout(r, 120))
    const posts = getStoredPosts()
    const now = new Date().toISOString()
    const readingTime = calculateReadingTime(payload.content)

    let savedPost: BlogPost

    if (payload.id) {
      // Actualizar existente
      const index = posts.findIndex((p) => p.id === payload.id)
      if (index === -1) {
        throw new Error('Artículo no encontrado para actualizar')
      }
      const existing = posts[index]
      savedPost = {
        ...existing,
        ...payload,
        id: payload.id,
        slug: payload.slug || generateSlug(payload.title),
        readingTime,
        updatedAt: now,
        publishedAt:
          payload.status === 'published' && !existing.publishedAt
            ? now
            : payload.status === 'draft'
            ? null
            : existing.publishedAt,
        author: payload.author || existing.author,
        seo: payload.seo || existing.seo,
      }
      posts[index] = savedPost
    } else {
      // Crear nuevo
      const newId = `post-${Date.now()}`
      savedPost = {
        id: newId,
        title: payload.title,
        slug: payload.slug || generateSlug(payload.title),
        excerpt: payload.excerpt,
        content: payload.content,
        coverImage:
          payload.coverImage ||
          'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
        category: payload.category,
        tags: payload.tags || [],
        author: payload.author || {
          name: 'Equipo Fitnflai',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
          role: 'Staff Especialista',
        },
        status: payload.status,
        publishedAt: payload.status === 'published' ? now : null,
        updatedAt: now,
        readingTime,
        featured: payload.featured || false,
        seo: payload.seo || {
          metaTitle: `${payload.title} | Fitnflai`,
          metaDescription: payload.excerpt.slice(0, 160),
          keywords: payload.tags,
        },
      }
      posts.unshift(savedPost)
    }

    saveStoredPosts(posts)
    return savedPost
  },

  /**
   * Elimina un artículo por su ID
   */
  deletePost: async (id: string): Promise<{ success: boolean }> => {
    await new Promise((r) => setTimeout(r, 100))
    const posts = getStoredPosts()
    const filtered = posts.filter((p) => p.id !== id)
    saveStoredPosts(filtered)
    return { success: true }
  },

  /**
   * Alterna estado entre publicado y borrador
   */
  toggleStatus: async (id: string): Promise<BlogPost> => {
    const post = await blogService.getPostById(id)
    if (!post) throw new Error('Post no encontrado')
    const nextStatus = post.status === 'published' ? 'draft' : 'published'
    return blogService.savePost({
      ...post,
      status: nextStatus,
    })
  },

  /**
   * Obtiene todas las categorías disponibles
   */
  getCategories: (): BlogCategory[] => {
    return ['Entrenamiento', 'Nutrición', 'Salud', 'Rendimiento', 'Bienestar']
  },

  /**
   * Restablece los datos mock a su estado inicial
   */
  resetToInitial: (): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BLOG_POSTS))
  },
}
