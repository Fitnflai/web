import { useState, useMemo } from 'react'
import {
  FileText,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  Tag,
  Globe,
  Share2,
  Check,
  AlertCircle,
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { blogService, generateSlug } from '@/services/endpoints/blog'
import type { BlogPost, BlogCategory, BlogStatus, SaveBlogPostPayload } from '@/types/blog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { StatCard } from '@/components/ui/StatCard'
import { toast } from '@/components/ui/Toast'
import { cn } from '@/utils'

export function BlogAdminPage() {
  const queryClient = useQueryClient()

  // Filters & State
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  // Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'preview'>('content')

  // Form State
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [category, setCategory] = useState<BlogCategory>('Entrenamiento')
  const [tagsInput, setTagsInput] = useState('')
  const [status, setStatus] = useState<BlogStatus>('published')
  const [featured, setFeatured] = useState(false)
  const [authorName, setAuthorName] = useState('Dr. Alejandro Morales')
  const [authorRole, setAuthorRole] = useState('Médico Deportólogo')
  const [authorAvatar, setAuthorAvatar] = useState(
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&auto=format&fit=crop'
  )

  // SEO Fields
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [keywordsInput, setKeywordsInput] = useState('')
  const [canonicalUrl, setCanonicalUrl] = useState('')

  // Delete Modal State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null)

  // Fetch posts
  const { data, isLoading } = useQuery({
    queryKey: ['adminBlogPosts', statusFilter, categoryFilter, search],
    queryFn: () =>
      blogService.getPosts({
        status: statusFilter,
        category: categoryFilter === 'all' ? undefined : categoryFilter,
        search: search.trim() || undefined,
      }),
  })

  const posts = data?.posts || []

  // Stats
  const totalCount = posts.length
  const publishedCount = posts.filter((p) => p.status === 'published').length
  const draftCount = posts.filter((p) => p.status === 'draft').length

  // Save Mutation
  const saveMutation = useMutation({
    mutationFn: blogService.savePost,
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogPosts'] })
      queryClient.invalidateQueries({ queryKey: ['publicBlogPosts'] })
      queryClient.invalidateQueries({ queryKey: ['blogPost', saved.slug] })
      toast.show(
        editingPost ? 'Artículo actualizado correctamente' : 'Artículo creado y guardado',
        'success'
      )
      setIsEditorOpen(false)
    },
    onError: (err: any) => {
      toast.show(err?.message || 'Error al guardar el artículo', 'error')
    },
  })

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: blogService.deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogPosts'] })
      queryClient.invalidateQueries({ queryKey: ['publicBlogPosts'] })
      toast.show('Artículo eliminado del blog', 'success')
      setIsDeleteOpen(false)
      setPostToDelete(null)
    },
  })

  // Toggle Status Mutation
  const toggleStatusMutation = useMutation({
    mutationFn: blogService.toggleStatus,
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogPosts'] })
      queryClient.invalidateQueries({ queryKey: ['publicBlogPosts'] })
      toast.show(
        `Estado cambiado a: ${updated.status === 'published' ? 'Publicado' : 'Borrador'}`,
        'success'
      )
    },
  })

  // Open Create Form
  const handleOpenCreate = () => {
    setEditingPost(null)
    setTitle('')
    setSlug('')
    setExcerpt('')
    setContent(
      `## Introducción\n\nEscribe aquí la introducción respaldada con evidencia científica.\n\n---\n\n### Puntos Clave\n\n- Punto 1\n- Punto 2\n\n> Consejo del especialista: Aplica este protocolo gradualmente.\n`
    )
    setCoverImage(
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop'
    )
    setCategory('Entrenamiento')
    setTagsInput('Entrenamiento, Salud, Rendimiento')
    setStatus('published')
    setFeatured(false)
    setAuthorName('Dr. Alejandro Morales')
    setAuthorRole('Médico Deportólogo')
    setAuthorAvatar(
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&auto=format&fit=crop'
    )
    setMetaTitle('')
    setMetaDescription('')
    setKeywordsInput('')
    setCanonicalUrl('')
    setActiveTab('content')
    setIsEditorOpen(true)
  }

  // Open Edit Form
  const handleOpenEdit = (post: BlogPost) => {
    setEditingPost(post)
    setTitle(post.title)
    setSlug(post.slug)
    setExcerpt(post.excerpt)
    setContent(post.content)
    setCoverImage(post.coverImage)
    setCategory(post.category)
    setTagsInput(post.tags.join(', '))
    setStatus(post.status)
    setFeatured(Boolean(post.featured))
    setAuthorName(post.author.name)
    setAuthorRole(post.author.role)
    setAuthorAvatar(post.author.avatar)
    setMetaTitle(post.seo?.metaTitle || '')
    setMetaDescription(post.seo?.metaDescription || '')
    setKeywordsInput((post.seo?.keywords || []).join(', '))
    setCanonicalUrl(post.seo?.canonicalUrl || '')
    setActiveTab('content')
    setIsEditorOpen(true)
  }

  // Auto-generate slug when title changes (if creating or user wants)
  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!editingPost || !slug) {
      setSlug(generateSlug(val))
    }
  }

  // Submit Save
  const handleSave = () => {
    if (!title.trim()) {
      toast.show('El título del artículo es obligatorio', 'error')
      return
    }
    if (!content.trim()) {
      toast.show('El contenido del artículo no puede estar vacío', 'error')
      return
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    const keywords = keywordsInput
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean)

    const finalSlug = slug.trim() || generateSlug(title)

    const payload: SaveBlogPostPayload = {
      id: editingPost?.id,
      title: title.trim(),
      slug: finalSlug,
      excerpt: excerpt.trim() || title.trim(),
      content,
      coverImage:
        coverImage.trim() ||
        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
      category,
      tags,
      status,
      featured,
      author: {
        name: authorName.trim() || 'Staff Fitnflai',
        role: authorRole.trim() || 'Especialista',
        avatar:
          authorAvatar.trim() ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      },
      seo: {
        metaTitle: metaTitle.trim() || `${title.trim()} | Fitnflai Blog`,
        metaDescription: metaDescription.trim() || excerpt.trim().slice(0, 160),
        keywords: keywords.length > 0 ? keywords : tags,
        canonicalUrl: canonicalUrl.trim() || `https://fitnflai.com/blog/${finalSlug}`,
      },
    }

    saveMutation.mutate(payload)
  }

  // Cover Image Presets
  const coverPresets = [
    {
      label: 'Cardio / Running',
      url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
    },
    {
      label: 'Nutrición / Salud',
      url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1200&auto=format&fit=crop',
    },
    {
      label: 'Fuerza / Gimnasio',
      url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
    },
    {
      label: 'Ciclismo / Montaña',
      url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=1200&auto=format&fit=crop',
    },
  ]

  // Calculated SERP Preview Values
  const serpTitle = metaTitle.trim() || (title ? `${title} | Fitnflai` : 'Título del artículo en Google')
  const serpUrl = `https://fitnflai.com > blog > ${slug || 'slug-del-articulo'}`
  const serpDesc =
    metaDescription.trim() ||
    excerpt.trim() ||
    'Aquí se visualizará el fragmento descriptivo que los motores de búsqueda como Google mostrarán a los usuarios en los resultados orgánicos.'

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-surface-text flex items-center gap-2">
            <Globe className="w-5 h-5 text-brand-orange" />
            <span>Gestión de Blog & SEO</span>
          </h1>
          <p className="text-xs text-surface-muted mt-0.5">
            Redacta, optimiza para motores de búsqueda y administra los artículos del blog público.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open('/blog', '_blank')}
            className="flex items-center gap-1.5 text-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Ver Blog Público</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 text-xs bg-brand-orange hover:bg-orange-600 text-white"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Artículo</span>
          </Button>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Artículos"
          value={totalCount}
          delta="En sistema"
        />
        <StatCard
          label="Publicados"
          value={publishedCount}
          delta="Visibles en la web"
          deltaUp={true}
          valueColor="#10b981"
        />
        <StatCard
          label="Borradores"
          value={draftCount}
          delta="Pendientes"
          valueColor="#f59e0b"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-card border border-surface-border rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-surface-bg p-1 rounded-lg border border-surface-border w-fit">
          <button
            onClick={() => setStatusFilter('all')}
            className={cn(
              'px-3 py-1 rounded text-xs font-semibold transition',
              statusFilter === 'all'
                ? 'bg-brand-orange text-white'
                : 'text-surface-muted hover:text-surface-text'
            )}
          >
            Todos ({totalCount})
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={cn(
              'px-3 py-1 rounded text-xs font-semibold transition',
              statusFilter === 'published'
                ? 'bg-brand-orange text-white'
                : 'text-surface-muted hover:text-surface-text'
            )}
          >
            Publicados ({publishedCount})
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={cn(
              'px-3 py-1 rounded text-xs font-semibold transition',
              statusFilter === 'draft'
                ? 'bg-brand-orange text-white'
                : 'text-surface-muted hover:text-surface-text'
            )}
          >
            Borradores ({draftCount})
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex items-center gap-3 flex-1 md:max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-surface-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título o tag..."
              className="w-full bg-surface-bg border border-surface-border rounded-lg pl-9 pr-3 py-1.5 text-xs text-surface-text placeholder-surface-muted focus:outline-none focus:border-brand-orange"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-surface-bg border border-surface-border rounded-lg px-2.5 py-1.5 text-xs text-surface-text focus:outline-none focus:border-brand-orange"
          >
            <option value="all">Todas las Categorías</option>
            {blogService.getCategories().map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-surface-card border border-surface-border rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-surface-muted">
            <div className="w-8 h-8 border-2 border-brand-orange/30 border-t-brand-orange rounded-full animate-spin mx-auto mb-2" />
            Cargando artículos...
          </div>
        ) : posts.length === 0 ? (
          <div className="py-16 text-center text-surface-muted">
            <FileText className="w-10 h-10 mx-auto mb-2 text-surface-muted/50" />
            <p className="text-sm font-semibold text-surface-text">No hay artículos que coincidan</p>
            <p className="text-xs text-surface-muted mt-1">
              Prueba cambiando los filtros o crea tu primera publicación.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenCreate}
              className="mt-4 bg-brand-orange hover:bg-orange-600 text-white text-xs"
            >
              + Crear primer artículo
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-bg border-b border-surface-border text-surface-muted uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Artículo</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4">Autor</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4">Lectura</th>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-surface-bg/50 transition">
                    {/* Title + Thumbnail + Slug */}
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-12 h-12 rounded-lg object-cover border border-surface-border shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-surface-text truncate text-xs">
                            {post.title}
                          </p>
                          <p className="text-[10px] text-surface-muted font-mono truncate">
                            /blog/{post.slug}
                          </p>
                          {post.featured && (
                            <span className="inline-block mt-1 text-[9px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.2 rounded border border-amber-400/30">
                              ★ Destacado
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-bg text-surface-text border border-surface-border">
                        {post.category}
                      </span>
                    </td>

                    {/* Author */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="text-surface-text text-[11px] font-medium">
                          {post.author.name}
                        </span>
                      </div>
                    </td>

                    {/* Status Pill (Clickable) */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleStatusMutation.mutate(post.id)}
                        title="Click para alternar estado"
                        className={cn(
                          'px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1',
                          post.status === 'published'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25'
                        )}
                      >
                        <span
                          className={cn(
                            'w-1.5 h-1.5 rounded-full',
                            post.status === 'published' ? 'bg-emerald-400' : 'bg-amber-400'
                          )}
                        />
                        <span>{post.status === 'published' ? 'Publicado' : 'Borrador'}</span>
                      </button>
                    </td>

                    {/* Reading time */}
                    <td className="py-3.5 px-4 text-surface-muted">
                      {post.readingTime} min
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-surface-muted text-[11px]">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'No publicado'}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                          title="Ver en la web pública"
                          className="p-1.5 rounded hover:bg-surface-bg text-surface-muted hover:text-brand-orange transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleOpenEdit(post)}
                          title="Editar artículo"
                          className="p-1.5 rounded hover:bg-surface-bg text-surface-muted hover:text-surface-text transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            setPostToDelete(post)
                            setIsDeleteOpen(true)
                          }}
                          title="Eliminar artículo"
                          className="p-1.5 rounded hover:bg-red-500/10 text-surface-muted hover:text-red-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Editor Modal */}
      <Modal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        title={editingPost ? 'Editar Artículo de Blog' : 'Nuevo Artículo de Blog'}
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="space-y-6">
          {/* Editor Sub-nav Tabs */}
          <div className="flex items-center gap-2 border-b border-surface-border pb-3">
            <button
              onClick={() => setActiveTab('content')}
              className={cn(
                'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5',
                activeTab === 'content'
                  ? 'bg-brand-orange text-white'
                  : 'text-surface-muted hover:text-surface-text bg-surface-bg'
              )}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Contenido & Redacción</span>
            </button>

            <button
              onClick={() => setActiveTab('seo')}
              className={cn(
                'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5',
                activeTab === 'seo'
                  ? 'bg-brand-orange text-white'
                  : 'text-surface-muted hover:text-surface-text bg-surface-bg'
              )}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Optimización SEO (Google SERP)</span>
            </button>
          </div>

          {/* TAB 1: Content Editor */}
          {activeTab === 'content' && (
            <div className="space-y-4">
              {/* Title & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-surface-text mb-1">
                    Título del Artículo *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Ej: Cómo entrenar por zonas de frecuencia cardíaca..."
                    className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-xs text-surface-text focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-surface-text mb-1">
                    Slug URL (limpio para indexación) *
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-surface-muted">/blog/</span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="zonas-frecuencia-cardiaca-resultados"
                      className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-xs text-surface-text focus:outline-none focus:border-brand-orange font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-semibold text-surface-text mb-1">
                  Resumen / Excerpt (se usa para las tarjetas y meta description de SEO)
                </label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Breve resumen de 1 a 2 oraciones que enganche al lector..."
                  className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-xs text-surface-text focus:outline-none focus:border-brand-orange leading-relaxed"
                />
              </div>

              {/* Category, Status, Featured */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-surface-text mb-1">
                    Categoría
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as BlogCategory)}
                    className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-xs text-surface-text focus:outline-none focus:border-brand-orange"
                  >
                    {blogService.getCategories().map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-surface-text mb-1">
                    Estado
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as BlogStatus)}
                    className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-xs text-surface-text focus:outline-none focus:border-brand-orange"
                  >
                    <option value="published">Publicado (Visible en web)</option>
                    <option value="draft">Borrador (Oculto)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-surface-text mb-1">
                    Destacado
                  </label>
                  <label className="flex items-center gap-2 mt-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="rounded border-surface-border text-brand-orange focus:ring-brand-orange"
                    />
                    <span className="text-xs text-surface-text">Mostrar como Banner Principal</span>
                  </label>
                </div>
              </div>

              {/* Cover Image & Presets */}
              <div>
                <label className="block text-xs font-semibold text-surface-text mb-1">
                  URL de Imagen de Portada
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-xs text-surface-text focus:outline-none focus:border-brand-orange"
                  />
                  {coverImage && (
                    <img
                      src={coverImage}
                      alt="Preview"
                      className="w-10 h-10 rounded-lg object-cover border border-surface-border shrink-0"
                    />
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-2 items-center">
                  <span className="text-[10px] text-surface-muted">Presets rápidos:</span>
                  {coverPresets.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setCoverImage(p.url)}
                      className="text-[10px] bg-surface-bg hover:bg-surface-card border border-surface-border px-2 py-0.5 rounded text-surface-muted hover:text-surface-text transition"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-semibold text-surface-text mb-1">
                  Tags / Etiquetas (separadas por comas)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Cardio, Zonas FC, Resistencia, Deportología"
                  className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-xs text-surface-text focus:outline-none focus:border-brand-orange"
                />
              </div>

              {/* Author Info */}
              <div className="p-3 bg-surface-bg/60 border border-surface-border rounded-xl">
                <p className="text-xs font-bold text-surface-text mb-2">Firma del Especialista</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-surface-muted mb-0.5">Nombre</label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full bg-surface-bg border border-surface-border rounded px-2.5 py-1 text-xs text-surface-text"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-surface-muted mb-0.5">Rol / Especialidad</label>
                    <input
                      type="text"
                      value={authorRole}
                      onChange={(e) => setAuthorRole(e.target.value)}
                      className="w-full bg-surface-bg border border-surface-border rounded px-2.5 py-1 text-xs text-surface-text"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-surface-muted mb-0.5">Avatar URL</label>
                    <input
                      type="text"
                      value={authorAvatar}
                      onChange={(e) => setAuthorAvatar(e.target.value)}
                      className="w-full bg-surface-bg border border-surface-border rounded px-2.5 py-1 text-xs text-surface-text"
                    />
                  </div>
                </div>
              </div>

              {/* Markdown Content Area */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-surface-text">
                    Cuerpo del Artículo (Formato Markdown) *
                  </label>

                  {/* Format shortcuts */}
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setContent((prev) => prev + '\n## Nuevo Subtítulo\n')}
                      className="px-2 py-0.5 text-[10px] bg-surface-bg hover:bg-surface-border rounded text-surface-muted font-bold"
                      title="Agregar H2"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => setContent((prev) => prev + '\n### Sección\n')}
                      className="px-2 py-0.5 text-[10px] bg-surface-bg hover:bg-surface-border rounded text-surface-muted font-bold"
                      title="Agregar H3"
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      onClick={() => setContent((prev) => prev + '**texto en negrita**')}
                      className="px-2 py-0.5 text-[10px] bg-surface-bg hover:bg-surface-border rounded text-surface-muted font-bold"
                      title="Negrita"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={() => setContent((prev) => prev + '\n> Consejo del especialista: \n')}
                      className="px-2 py-0.5 text-[10px] bg-surface-bg hover:bg-surface-border rounded text-surface-muted italic"
                      title="Cita"
                    >
                      Quote
                    </button>
                    <button
                      type="button"
                      onClick={() => setContent((prev) => prev + '\n- Item de lista\n')}
                      className="px-2 py-0.5 text-[10px] bg-surface-bg hover:bg-surface-border rounded text-surface-muted"
                      title="Lista"
                    >
                      • Lista
                    </button>
                    <button
                      type="button"
                      onClick={() => setContent((prev) => prev + '\n---\n')}
                      className="px-2 py-0.5 text-[10px] bg-surface-bg hover:bg-surface-border rounded text-surface-muted"
                      title="Separador"
                    >
                      HR
                    </button>
                  </div>
                </div>

                <textarea
                  rows={10}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Escribe el artículo usando Markdown..."
                  className="w-full bg-surface-bg border border-surface-border rounded-lg p-3 text-xs text-surface-text font-mono focus:outline-none focus:border-brand-orange leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 2: SEO Settings & Google SERP Simulator */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              {/* Google SERP Live Simulation */}
              <div className="p-4 rounded-xl bg-white text-gray-900 shadow-md border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Vista Previa en Google Search (SERP Snippet)
                  </span>
                  <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded">
                    Simulación en vivo
                  </span>
                </div>

                <div className="space-y-1 font-sans">
                  {/* Google site info line */}
                  <div className="flex items-center gap-2 text-xs text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold">
                      F
                    </div>
                    <div>
                      <p className="text-[12px] font-medium leading-none text-gray-800">Fitnflai</p>
                      <p className="text-[11px] text-gray-500 font-mono leading-none">{serpUrl}</p>
                    </div>
                  </div>

                  {/* Google Blue Link Title */}
                  <h4 className="text-lg font-medium text-blue-800 hover:underline cursor-pointer leading-tight pt-1">
                    {serpTitle}
                  </h4>

                  {/* Google Snippet Text */}
                  <p className="text-xs text-gray-600 leading-snug line-clamp-2">{serpDesc}</p>
                </div>
              </div>

              {/* Meta Title Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-surface-text">
                    Meta Title (Título para el tag &lt;title&gt;)
                  </label>
                  <span
                    className={cn(
                      'text-[10px] font-mono',
                      metaTitle.length >= 40 && metaTitle.length <= 60
                        ? 'text-emerald-400 font-bold'
                        : metaTitle.length > 60
                        ? 'text-red-400 font-bold'
                        : 'text-surface-muted'
                    )}
                  >
                    {metaTitle.length} / 60 caracteres recomendados
                  </span>
                </div>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder={`${title ? title + ' | Fitnflai' : 'Título optimizado para Google...'}`}
                  className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-xs text-surface-text focus:outline-none focus:border-brand-orange"
                />
              </div>

              {/* Meta Description Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-surface-text">
                    Meta Description (Descripción para el tag &lt;meta name="description"&gt;)
                  </label>
                  <span
                    className={cn(
                      'text-[10px] font-mono',
                      metaDescription.length >= 120 && metaDescription.length <= 160
                        ? 'text-emerald-400 font-bold'
                        : metaDescription.length > 160
                        ? 'text-red-400 font-bold'
                        : 'text-surface-muted'
                    )}
                  >
                    {metaDescription.length} / 160 caracteres recomendados
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Descripción concisa con llamada a la acción para aumentar el CTR en Google..."
                  className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-xs text-surface-text focus:outline-none focus:border-brand-orange leading-relaxed"
                />
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-xs font-semibold text-surface-text mb-1">
                  Keywords Objetivo (separadas por comas)
                </label>
                <input
                  type="text"
                  value={keywordsInput}
                  onChange={(e) => setKeywordsInput(e.target.value)}
                  placeholder="frecuencia cardiaca, entrenamiento deportivo, zonas de cardio"
                  className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-xs text-surface-text focus:outline-none focus:border-brand-orange"
                />
              </div>

              {/* Canonical URL */}
              <div>
                <label className="block text-xs font-semibold text-surface-text mb-1">
                  URL Canónica (Opcional — para prevenir contenido duplicado)
                </label>
                <input
                  type="text"
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  placeholder={`https://fitnflai.com/blog/${slug || 'slug'}`}
                  className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-xs text-surface-text focus:outline-none focus:border-brand-orange font-mono"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-surface-border flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditorOpen(false)}
              className="text-xs"
            >
              Cancelar
            </Button>

            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className="bg-brand-orange hover:bg-orange-600 text-white text-xs font-bold"
              >
                {saveMutation.isPending ? 'Guardando...' : editingPost ? 'Actualizar Artículo' : 'Publicar / Guardar'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirmar Eliminación"
        className="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-amber-400">
            <AlertCircle className="w-8 h-8 shrink-0" />
            <p className="text-xs text-surface-text">
              ¿Estás seguro de que deseas eliminar permanentemente el artículo{' '}
              <strong className="text-white">"{postToDelete?.title}"</strong>?
            </p>
          </div>
          <p className="text-[11px] text-surface-muted">
            Esta acción quitará el artículo tanto del panel de administración como de la vista pública del blog.
          </p>

          <div className="pt-4 border-t border-surface-border flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDeleteOpen(false)}
              className="text-xs"
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => postToDelete && deleteMutation.mutate(postToDelete.id)}
              disabled={deleteMutation.isPending}
              className="text-xs"
            >
              {deleteMutation.isPending ? 'Eliminando...' : 'Sí, eliminar'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
