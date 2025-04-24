import { StrapiResponse } from '@/types/strapi'

export function formatStrapiResponse<T>(response: StrapiResponse<T>) {
  return {
    data: response.data,
    meta: response.meta,
  }
}

export function getStrapiUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'}${path}`
}

export function getStrapiMediaUrl(url: string | null) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'}${url}`
}

export function formatStrapiDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function getStrapiImageAttributes(image: any) {
  if (!image?.data?.attributes) return null

  const { url, alternativeText, caption, formats } = image.data.attributes

  return {
    url: getStrapiMediaUrl(url),
    alt: alternativeText || '',
    caption: caption || '',
    formats: formats || {},
  }
}

export function getStrapiSeoAttributes(seo: any) {
  if (!seo) return null

  return {
    metaTitle: seo.metaTitle || '',
    metaDescription: seo.metaDescription || '',
    metaImage: seo.metaImage ? getStrapiImageAttributes(seo.metaImage) : null,
    keywords: seo.keywords || '',
    structuredData: seo.structuredData || null,
  }
} 