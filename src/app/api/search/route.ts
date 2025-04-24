import { NextResponse } from 'next/server'
import { fetchStrapiData } from '@/lib/strapi'
import { StrapiResponse, StrapiPost } from '@/types/strapi'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')?.toLowerCase() || ''

  if (!query) {
    return NextResponse.json([])
  }

  try {
    const response = await fetchStrapiData<StrapiResponse<StrapiPost[]>>('/posts', {
      filters: {
        $or: [
          {
            title: {
              $containsi: query,
            },
          },
          {
            content: {
              $containsi: query,
            },
          },
          {
            excerpt: {
              $containsi: query,
            },
          },
          {
            category: {
              name: {
                $containsi: query,
              },
            },
          },
        ],
      },
      populate: ['cover', 'category', 'author'],
      sort: ['publishedAt:desc'],
      pagination: {
        pageSize: 10,
      },
    })

    const searchResults = response.data.map((post) => ({
      title: post.title,
      excerpt: post.excerpt,
      slug: post.slug,
      date: post.publishedAt,
      category: post.category?.name,
      coverUrl: post.cover?.url,
    }))

    return NextResponse.json(searchResults)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Failed to search posts' },
      { status: 500 }
    )
  }
} 