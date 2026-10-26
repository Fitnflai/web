import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { blogService } from '@/services/endpoints/blog'
import type { BlogPost, BlogCategory } from '@/types/blog'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { Footer } from '@/components/layout/Footer'
import { useSeo } from '@/hooks/useSeo'
import { useAppStore } from '@/store/useAppStore'
import { IconSearch, IconClock, IconCalendar, IconArrowRight, IconTag, IconFlame } from '@tabler/icons-react'

export function BlogPage() {
  const navigate = useNavigate()
  const { language } = useAppStore()
  const isSpanish = language === 'ES'

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // SEO configuration
  useSeo({
    title: isSpanish
      ? 'Blog de Salud, Nutrición y Entrenamiento Deportivo | Fitnflai'
      : 'Sports Science, Nutrition & Training Blog | Fitnflai',
    description: isSpanish
      ? 'Aprende sobre zonas de frecuencia cardíaca, nutrición peri-entreno, prevención de lesiones y rendimiento deportivo con artículos de deportólogos certificados.'
      : 'Learn about heart rate zones, sports nutrition, injury prevention, and athletic performance backed by certified sports medicine doctors.',
    keywords: [
      'blog fitness',
      'entrenamiento cientifico',
      'deportologia',
      'fisioterapia deportiva',
      'nutricion deportiva',
      'fitnflai blog',
    ],
    canonicalUrl: 'https://fitnflai.com/blog',
    ogImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Fitnflai Blog',
      url: 'https://fitnflai.com/blog',
      description:
        'Blog de medicina deportiva, nutrición y entrenamiento físico de alta precisión.',
      publisher: {
        '@type': 'Organization',
        name: 'Fitnflai',
        logo: {
          '@type': 'ImageObject',
          url: 'https://fitnflai.com/images/logo.png',
        },
      },
    },
  })

  // Data fetching
  const { data, isLoading } = useQuery({
    queryKey: ['publicBlogPosts', selectedCategory, search],
    queryFn: () =>
      blogService.getPosts({
        status: 'published',
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        search: search.trim() || undefined,
      }),
  })

  const posts = data?.posts || []
  const featuredPost = posts.find((p) => p.featured) || posts[0]
  const otherPosts = featuredPost ? posts.filter((p) => p.id !== featuredPost.id) : posts

  const categories = ['all', ...blogService.getCategories()]

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans selection:bg-brand-orange selection:text-white">
      <PublicHeader />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 border-b border-gray-900 overflow-hidden bg-gradient-to-b from-gray-900/60 to-gray-950">
        <div className="absolute inset-0 bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-orange/15 border border-brand-orange/30 text-brand-orange text-xs font-bold uppercase tracking-wider mb-6">
            <IconFlame size={14} />
            <span>{isSpanish ? 'Ciencia & Rendimiento' : 'Science & Performance'}</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            {isSpanish ? (
              <>
                Conocimiento médico para potenciar tu{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400">
                  entrenamiento
                </span>
              </>
            ) : (
              <>
                Medical science to power your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400">
                  performance
                </span>
              </>
            )}
          </h1>

          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-10">
            {isSpanish
              ? 'Artículos, protocolos y recomendaciones basadas en evidencia, redactadas por deportólogos, fisioterapeutas y nutricionistas certificados de Fitnflai.'
              : 'Evidence-based articles, protocols, and guides created by certified sports physicians, physical therapists, and nutritionists.'}
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <div className="relative flex items-center">
              <IconSearch className="absolute left-4 text-gray-400 pointer-events-none" size={20} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                  isSpanish
                    ? 'Buscar por tema, palabra clave o especialista...'
                    : 'Search by topic, keyword, or specialist...'
                }
                className="w-full bg-gray-900/90 border border-gray-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition shadow-xl"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-4 text-xs text-gray-400 hover:text-white"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {categories.map((cat) => {
              const active = selectedCategory === cat
              const label =
                cat === 'all'
                  ? isSpanish
                    ? 'Todos los temas'
                    : 'All Topics'
                  : cat
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                    active
                      ? 'bg-brand-orange text-white shadow-md shadow-orange-500/25'
                      : 'bg-gray-900/70 text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="container mx-auto px-6 py-12 flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="w-10 h-10 border-4 border-brand-orange/30 border-t-brand-orange rounded-full animate-spin mb-4" />
            <p className="text-sm">Cargando publicaciones...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/30 rounded-3xl border border-gray-800 p-8 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-gray-800/80 flex items-center justify-center mx-auto mb-4 text-gray-400">
              <IconSearch size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {isSpanish ? 'No se encontraron artículos' : 'No articles found'}
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              {isSpanish
                ? 'Intenta con otros términos de búsqueda o selecciona otra categoría.'
                : 'Try searching with different keywords or select another category.'}
            </p>
            <button
              onClick={() => {
                setSearch('')
                setSelectedCategory('all')
              }}
              className="px-5 py-2 rounded-xl bg-brand-orange text-white text-xs font-bold hover:bg-orange-600 transition"
            >
              {isSpanish ? 'Ver todos los artículos' : 'View all articles'}
            </button>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Featured Post Card (Hero Card) */}
            {featuredPost && !search && selectedCategory === 'all' && (
              <section aria-label="Artículo destacado">
                <article
                  onClick={() => navigate(`/blog/${featuredPost.slug}`)}
                  className="group relative cursor-pointer rounded-3xl bg-gray-900/70 border border-gray-800 hover:border-gray-700 overflow-hidden transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 shadow-2xl hover:shadow-orange-500/5"
                >
                  <div className="lg:col-span-7 relative h-72 lg:h-[440px] overflow-hidden">
                    <img
                      src={featuredPost.coverImage}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-orange text-white shadow-md">
                        {featuredPost.category}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-950/80 backdrop-blur-md text-amber-400 border border-amber-400/30 flex items-center gap-1">
                        <IconFlame size={13} />
                        {isSpanish ? 'Destacado' : 'Featured'}
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                        <span className="flex items-center gap-1">
                          <IconCalendar size={14} />
                          {featuredPost.publishedAt
                            ? new Date(featuredPost.publishedAt).toLocaleDateString(
                                isSpanish ? 'es-ES' : 'en-US',
                                { day: 'numeric', month: 'short', year: 'numeric' }
                              )
                            : 'Reciente'}
                        </span>
                        <span className="flex items-center gap-1">
                          <IconClock size={14} />
                          {featuredPost.readingTime} min de lectura
                        </span>
                      </div>

                      <h2 className="text-2xl lg:text-3xl font-extrabold text-white group-hover:text-orange-400 transition-colors leading-snug mb-4">
                        {featuredPost.title}
                      </h2>

                      <p className="text-gray-400 text-sm line-clamp-3 mb-6">
                        {featuredPost.excerpt}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-gray-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={featuredPost.author.avatar}
                          alt={featuredPost.author.name}
                          className="w-10 h-10 rounded-full object-cover border border-gray-700"
                        />
                        <div>
                          <p className="text-xs font-bold text-white">
                            {featuredPost.author.name}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            {featuredPost.author.role}
                          </p>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-orange group-hover:translate-x-1 transition-transform">
                        <span>{isSpanish ? 'Leer artículo' : 'Read article'}</span>
                        <IconArrowRight size={15} />
                      </span>
                    </div>
                  </div>
                </article>
              </section>
            )}

            {/* Articles Grid */}
            <section aria-label="Lista de artículos">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-orange" />
                  {search
                    ? `Resultados para "${search}" (${posts.length})`
                    : selectedCategory !== 'all'
                    ? `Artículos de ${selectedCategory}`
                    : 'Últimas publicaciones'}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(search || selectedCategory !== 'all' ? posts : otherPosts).map((post) => (
                  <article
                    key={post.id}
                    onClick={() => navigate(`/blog/${post.slug}`)}
                    className="group cursor-pointer rounded-2xl bg-gray-900/60 border border-gray-800/80 hover:border-gray-700 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-orange-500/5"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <div className="relative h-48 overflow-hidden bg-gray-800">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-gray-950/80 backdrop-blur-md text-orange-400 border border-orange-500/30">
                            {post.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-3">
                          <span className="flex items-center gap-1">
                            <IconCalendar size={13} />
                            {post.publishedAt
                              ? new Date(post.publishedAt).toLocaleDateString(
                                  isSpanish ? 'es-ES' : 'en-US',
                                  { day: 'numeric', month: 'short', year: 'numeric' }
                                )
                              : 'Reciente'}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <IconClock size={13} />
                            {post.readingTime} min
                          </span>
                        </div>

                        <h4 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-2 mb-3 leading-snug">
                          {post.title}
                        </h4>

                        <p className="text-gray-400 text-xs line-clamp-3 leading-relaxed mb-4">
                          {post.excerpt}
                        </p>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] text-gray-400 bg-gray-800/60 px-2 py-0.5 rounded"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer Author Row */}
                    <div className="px-6 py-4 border-t border-gray-800/60 flex items-center justify-between bg-gray-950/30">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-7 h-7 rounded-full object-cover border border-gray-700"
                        />
                        <div className="text-left">
                          <p className="text-xs font-semibold text-gray-200">
                            {post.author.name}
                          </p>
                          <p className="text-[10px] text-gray-500">{post.author.role}</p>
                        </div>
                      </div>

                      <span className="text-xs text-brand-orange group-hover:translate-x-1 transition-transform">
                        <IconArrowRight size={15} />
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Newsletter / CTA Section */}
            <section className="rounded-3xl bg-gradient-to-r from-orange-600/20 via-gray-900 to-gray-900 border border-orange-500/30 p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-orange mb-2 block">
                  {isSpanish ? 'Fitnflai Pro & Elite' : 'Fitnflai Pro & Elite'}
                </span>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
                  {isSpanish
                    ? 'Lleva la ciencia de estos artículos a tu día a día'
                    : 'Bring the science from these articles into your training'}
                </h3>
                <p className="text-gray-400 text-sm">
                  {isSpanish
                    ? 'Chatea con deportólogos y nutricionistas que planifican tus cargas, analizan tus métricas cardíacas y cuidan tu salud.'
                    : 'Connect directly with sports physicians and dietitians who program your training and supervise your physiological data.'}
                </p>
              </div>

              <button
                onClick={() => navigate('/descargar')}
                className="shrink-0 px-7 py-3.5 rounded-xl bg-brand-orange hover:bg-orange-600 text-white font-bold text-sm shadow-xl shadow-orange-500/25 transition duration-200"
              >
                {isSpanish ? 'Comenzar ahora' : 'Get Started Now'}
              </button>
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
