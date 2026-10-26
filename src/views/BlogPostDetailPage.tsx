import { useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { blogService } from '@/services/endpoints/blog'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { Footer } from '@/components/layout/Footer'
import { useSeo } from '@/hooks/useSeo'
import { useAppStore } from '@/store/useAppStore'
import {
  IconCalendar,
  IconClock,
  IconArrowLeft,
  IconShare,
  IconBrandX,
  IconBrandWhatsapp,
  IconBrandLinkedin,
  IconCheck,
  IconTag,
  IconUserCheck,
} from '@tabler/icons-react'

// Simple Markdown / Formatted content parser
function MarkdownRenderer({ content }: { content: string }) {
  const renderedElements = useMemo(() => {
    const lines = content.split('\n')
    const elements: React.ReactNode[] = []
    let currentParagraph: string[] = []

    const flushParagraph = (key: string) => {
      if (currentParagraph.length > 0) {
        const text = currentParagraph.join(' ')
        elements.push(
          <p key={key} className="text-gray-300 leading-relaxed text-base md:text-lg mb-6">
            {parseInlineStyles(text)}
          </p>
        )
        currentParagraph = []
      }
    }

    // Helper for bold and italic
    const parseInlineStyles = (str: string) => {
      const parts = str.split(/(\*\*.*?\*\*|\`.*?\`)/g)
      return parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={idx} className="font-bold text-white">
              {part.slice(2, -2)}
            </strong>
          )
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code
              key={idx}
              className="px-1.5 py-0.5 rounded bg-gray-800 text-amber-400 font-mono text-sm"
            >
              {part.slice(1, -1)}
            </code>
          )
        }
        return part
      })
    }

    lines.forEach((line, idx) => {
      const trimmed = line.trim()

      if (!trimmed) {
        flushParagraph(`p-${idx}`)
        return
      }

      // H2
      if (trimmed.startsWith('## ')) {
        flushParagraph(`before-h2-${idx}`)
        const headingText = trimmed.replace('## ', '')
        const id = headingText
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
        elements.push(
          <h2
            key={`h2-${idx}`}
            id={id}
            className="text-2xl md:text-3xl font-extrabold text-white mt-12 mb-4 scroll-mt-24 pb-2 border-b border-gray-800"
          >
            {headingText}
          </h2>
        )
        return
      }

      // H3
      if (trimmed.startsWith('### ')) {
        flushParagraph(`before-h3-${idx}`)
        elements.push(
          <h3
            key={`h3-${idx}`}
            className="text-xl md:text-2xl font-bold text-orange-400 mt-8 mb-3 scroll-mt-24"
          >
            {trimmed.replace('### ', '')}
          </h3>
        )
        return
      }

      // Blockquote
      if (trimmed.startsWith('> ')) {
        flushParagraph(`before-bq-${idx}`)
        elements.push(
          <blockquote
            key={`bq-${idx}`}
            className="border-l-4 border-brand-orange bg-orange-950/20 px-6 py-4 my-6 rounded-r-xl text-orange-200 italic font-medium"
          >
            {parseInlineStyles(trimmed.replace('> ', ''))}
          </blockquote>
        )
        return
      }

      // Divider
      if (trimmed === '---' || trimmed === '***') {
        flushParagraph(`before-hr-${idx}`)
        elements.push(<hr key={`hr-${idx}`} className="border-gray-800 my-8" />)
        return
      }

      // Lists
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        flushParagraph(`before-li-${idx}`)
        elements.push(
          <li key={`li-${idx}`} className="text-gray-300 ml-6 list-disc mb-2 text-base md:text-lg">
            {parseInlineStyles(trimmed.slice(2))}
          </li>
        )
        return
      }

      // Numbered lists
      if (/^\d+\.\s/.test(trimmed)) {
        flushParagraph(`before-oli-${idx}`)
        const text = trimmed.replace(/^\d+\.\s/, '')
        elements.push(
          <li key={`oli-${idx}`} className="text-gray-300 ml-6 list-decimal mb-2 text-base md:text-lg">
            {parseInlineStyles(text)}
          </li>
        )
        return
      }

      // Regular text
      currentParagraph.push(trimmed)
    })

    flushParagraph('final')
    return elements
  }, [content])

  return <div className="prose-content">{renderedElements}</div>
}

export function BlogPostDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { language } = useAppStore()
  const isSpanish = language === 'ES'

  const [copied, setCopied] = useState(false)

  // Fetch article
  const { data: post, isLoading } = useQuery({
    queryKey: ['blogPost', slug],
    queryFn: () => (slug ? blogService.getPostBySlug(slug) : null),
  })

  // Fetch related articles
  const { data: relatedData } = useQuery({
    queryKey: ['relatedPosts', post?.category, post?.id],
    queryFn: () =>
      blogService.getPosts({
        status: 'published',
        category: post?.category,
        limit: 3,
      }),
    enabled: !!post,
  })

  const relatedPosts = (relatedData?.posts || []).filter((p) => p.id !== post?.id).slice(0, 3)

  // Dynamic SEO & Structured Data
  useSeo({
    title: post?.seo?.metaTitle || (post ? `${post.title} | Fitnflai Blog` : 'Fitnflai Blog'),
    description: post?.seo?.metaDescription || post?.excerpt,
    keywords: post?.seo?.keywords || post?.tags,
    canonicalUrl: post?.seo?.canonicalUrl || `https://fitnflai.com/blog/${slug}`,
    ogImage: post?.coverImage,
    ogType: 'article',
    jsonLd: post
      ? {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.excerpt,
          image: [post.coverImage],
          datePublished: post.publishedAt || post.updatedAt,
          dateModified: post.updatedAt,
          author: {
            '@type': 'Person',
            name: post.author.name,
            jobTitle: post.author.role,
          },
          publisher: {
            '@type': 'Organization',
            name: 'Fitnflai',
            logo: {
              '@type': 'ImageObject',
              url: 'https://fitnflai.com/images/logo.png',
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://fitnflai.com/blog/${post.slug}`,
          },
        }
      : undefined,
  })

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
        <PublicHeader />
        <div className="flex-1 flex flex-col items-center justify-center py-32">
          <div className="w-10 h-10 border-4 border-brand-orange/30 border-t-brand-orange rounded-full animate-spin mb-4" />
          <p className="text-sm text-gray-400">Cargando artículo...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
        <PublicHeader />
        <div className="flex-1 flex flex-col items-center justify-center py-32 px-6 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">Artículo no encontrado</h2>
          <p className="text-gray-400 mb-8 max-w-md">
            El artículo que buscas ha sido modificado o no se encuentra disponible.
          </p>
          <button
            onClick={() => navigate('/blog')}
            className="px-6 py-3 rounded-xl bg-brand-orange text-white font-bold text-sm hover:bg-orange-600 transition"
          >
            Volver al Blog
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans selection:bg-brand-orange selection:text-white">
      <PublicHeader />

      <main className="flex-1">
        {/* Breadcrumb Navigation (SEO Breadcrumbs) */}
        <nav aria-label="Breadcrumb" className="border-b border-gray-900 bg-gray-950/80 py-4">
          <div className="container mx-auto px-6 max-w-4xl flex items-center gap-2 text-xs text-gray-500">
            <Link to="/" className="hover:text-orange-400 transition">
              Inicio
            </Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-orange-400 transition">
              Blog
            </Link>
            <span>/</span>
            <span className="text-gray-400">{post.category}</span>
          </div>
        </nav>

        {/* Article Header */}
        <header className="container mx-auto px-6 pt-10 pb-8 max-w-4xl">
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-orange-400 transition mb-6"
          >
            <IconArrowLeft size={16} />
            <span>{isSpanish ? 'Volver al catálogo del blog' : 'Back to blog catalog'}</span>
          </button>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-orange text-white shadow">
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <IconCalendar size={14} />
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString(
                    isSpanish ? 'es-ES' : 'en-US',
                    { day: 'numeric', month: 'long', year: 'numeric' }
                  )
                : 'Borrador'}
            </span>
            <span className="text-gray-600">•</span>
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <IconClock size={14} />
              {post.readingTime} min de lectura
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-6">
            {post.title}
          </h1>

          <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-light mb-8">
            {post.excerpt}
          </p>

          {/* Author Byline */}
          <div className="flex items-center justify-between flex-wrap gap-4 pt-6 border-t border-gray-900">
            <div className="flex items-center gap-3.5">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-brand-orange/40"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white">{post.author.name}</span>
                  <IconUserCheck size={16} className="text-brand-orange" title="Especialista Verificado" />
                </div>
                <p className="text-xs text-gray-400">{post.author.role}</p>
              </div>
            </div>

            {/* Share buttons */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-semibold mr-1">
                {isSpanish ? 'Compartir:' : 'Share:'}
              </span>

              <button
                onClick={handleCopyLink}
                className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white transition border border-gray-800"
                title="Copiar enlace"
              >
                {copied ? <IconCheck size={16} className="text-green-400" /> : <IconShare size={16} />}
              </button>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  post.title
                )}&url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white transition border border-gray-800"
                title="Compartir en X"
              >
                <IconBrandX size={16} />
              </a>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `${post.title} ${currentUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-emerald-400 transition border border-gray-800"
                title="Compartir en WhatsApp"
              >
                <IconBrandWhatsapp size={16} />
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  currentUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-blue-400 transition border border-gray-800"
                title="Compartir en LinkedIn"
              >
                <IconBrandLinkedin size={16} />
              </a>
            </div>
          </div>
        </header>

        {/* Featured Cover Image */}
        <div className="container mx-auto px-6 max-w-4xl mb-12">
          <div className="rounded-3xl overflow-hidden border border-gray-800/80 shadow-2xl bg-gray-900">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-[360px] md:h-[480px] object-cover object-center"
            />
          </div>
        </div>

        {/* Article Content */}
        <div className="container mx-auto px-6 max-w-4xl mb-16">
          <article className="prose prose-invert prose-orange max-w-none">
            <MarkdownRenderer content={post.content} />
          </article>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-900 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 flex items-center gap-1 mr-2">
                <IconTag size={14} />
                Tags:
              </span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-lg bg-gray-900 text-gray-300 text-xs font-medium border border-gray-800"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Medical Disclaimer Callout */}
          <div className="mt-10 p-6 rounded-2xl bg-gray-900/60 border border-gray-800 text-xs text-gray-400 leading-relaxed">
            <p className="font-bold text-gray-300 mb-1">
              {isSpanish ? 'Aviso médico y científico:' : 'Medical and scientific disclaimer:'}
            </p>
            {isSpanish
              ? 'Este contenido tiene fines puramente educativos y de divulgación. Las planificaciones deportivas y nutricionales deben ser supervisadas individualmente por profesionales certificados según la historia clínica de cada usuario.'
              : 'This article is for informational purposes only. Training and nutrition plans should be individually supervised by certified professionals based on each user’s health history.'}
          </div>
        </div>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-gray-900 bg-gray-900/30 py-16">
            <div className="container mx-auto px-6 max-w-5xl">
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-orange" />
                {isSpanish ? 'Artículos recomendados' : 'Recommended articles'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((rel) => (
                  <article
                    key={rel.id}
                    onClick={() => {
                      navigate(`/blog/${rel.slug}`)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className="group cursor-pointer rounded-2xl bg-gray-950 border border-gray-800/80 hover:border-gray-700 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
                  >
                    <div>
                      <div className="h-40 overflow-hidden">
                        <img
                          src={rel.coverImage}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 mb-2 block">
                          {rel.category}
                        </span>
                        <h4 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-2 mb-2">
                          {rel.title}
                        </h4>
                        <p className="text-gray-400 text-xs line-clamp-2">{rel.excerpt}</p>
                      </div>
                    </div>
                    <div className="px-5 py-3 border-t border-gray-900 text-[11px] text-gray-500 flex justify-between">
                      <span>{rel.readingTime} min</span>
                      <span className="text-brand-orange font-semibold">Leer →</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
