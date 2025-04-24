export interface StrapiResponse<T> {
  data: T
  meta: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export interface StrapiImage {
  data: {
    id: number
    attributes: {
      name: string
      alternativeText: string | null
      caption: string | null
      width: number
      height: number
      formats: {
        thumbnail: {
          url: string
          width: number
          height: number
        }
        small: {
          url: string
          width: number
          height: number
        }
        medium: {
          url: string
          width: number
          height: number
        }
        large: {
          url: string
          width: number
          height: number
        }
      }
      url: string
    }
  }
}

export interface StrapiCategory {
  id: number
  documentId: string
  name: string
  slug: string
  description: string | null
  createdAt: string
  updatedAt: string
  publishedAt: string
  posts?: StrapiPost[]
}

export interface StrapiAuthor {
  id: number
  name: string
  bio?: string
  avatar?: {
    data: {
      attributes: {
        url: string
        alternativeText?: string
      }
    }
  }
}

export interface StrapiPost {
  id: number
  documentId: string
  title: string
  slug: string
  content: string
  excerpt: string
  publishedAt: string
  createdAt: string
  updatedAt: string
  cover?: {
    url: string
    alternativeText: string
  }
  category?: {
    id: number
    name: string
    slug: string
  }
  author?: {
    data: {
      id: number
      attributes: StrapiAuthor
    }
  }
  tags?: {
    data: Array<{
      id: number
      attributes: {
        name: string
        slug: string
      }
    }>
  }
  seo?: {
    metaTitle: string
    metaDescription: string
    keywords: string
  }
}

export interface StrapiContactForm {
  name: string
  email: string
  subject: string
  message: string
}

export interface StrapiTag {
  id: number
  attributes: {
    name: string
    slug: string
    posts?: {
      data: StrapiPost[]
    }
  }
}

export interface StrapiAboutPage {
  id: number
  documentId: string
  title: string
  introduction: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  seo: {
    metaTitle: string
    metaDescription: string
    keywords?: string
  } | null
  vision: {
    id: number
    title: string
    content: string
  }
  blog: {
    id: number
    title: string
    content: string
  }
  team: {
    id: number
    title: string
    content: string
  }
  contactSection: {
    id: number
    title: string
    content: string
  }
} 