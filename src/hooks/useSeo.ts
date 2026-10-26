import { useEffect } from 'react'

export interface SeoConfig {
  title?: string
  description?: string
  keywords?: string[]
  canonicalUrl?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  jsonLd?: Record<string, any>
}

export function useSeo({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  jsonLd,
}: SeoConfig) {
  useEffect(() => {
    // 1. Title
    const originalTitle = document.title
    if (title) {
      document.title = title
    }

    // Helper para actualizar o crear meta tags
    const setMetaTag = (attrName: 'name' | 'property', attrValue: string, content?: string) => {
      if (!content) return
      let tag = document.querySelector(`meta[${attrName}="${attrValue}"]`)
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute(attrName, attrValue)
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', content)
    }

    // 2. Meta description & keywords
    if (description) {
      setMetaTag('name', 'description', description)
      setMetaTag('property', 'og:description', description)
      setMetaTag('name', 'twitter:description', description)
    }
    if (keywords && keywords.length > 0) {
      setMetaTag('name', 'keywords', keywords.join(', '))
    }

    // 3. OpenGraph & Twitter tags
    if (title) {
      setMetaTag('property', 'og:title', title)
      setMetaTag('name', 'twitter:title', title)
    }
    setMetaTag('property', 'og:type', ogType)
    setMetaTag('name', 'twitter:card', 'summary_large_image')

    if (ogImage) {
      setMetaTag('property', 'og:image', ogImage)
      setMetaTag('name', 'twitter:image', ogImage)
    }

    // 4. Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (canonicalUrl) {
      if (!canonicalLink) {
        canonicalLink = document.createElement('link')
        canonicalLink.setAttribute('rel', 'canonical')
        document.head.appendChild(canonicalLink)
      }
      canonicalLink.setAttribute('href', canonicalUrl)
      setMetaTag('property', 'og:url', canonicalUrl)
    }

    // 5. JSON-LD structured data
    let jsonLdScript: HTMLScriptElement | null = null
    if (jsonLd) {
      jsonLdScript = document.createElement('script')
      jsonLdScript.type = 'application/ld+json'
      jsonLdScript.text = JSON.stringify(jsonLd)
      document.head.appendChild(jsonLdScript)
    }

    // Cleanup
    return () => {
      document.title = originalTitle
      if (jsonLdScript && jsonLdScript.parentNode) {
        jsonLdScript.parentNode.removeChild(jsonLdScript)
      }
    }
  }, [title, description, keywords, canonicalUrl, ogImage, ogType, jsonLd])
}
