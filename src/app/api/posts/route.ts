import { NextResponse } from 'next/server'
import { fetchStrapiData } from '@/lib/strapi'
import { StrapiResponse, StrapiPost } from '@/types/strapi'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = searchParams.get('limit')

    const params: any = {
      populate: ['cover', 'category', 'author', 'author.avatar'],
      sort: ['publishedAt:desc'],
    }

    if (category) {
      params.filters = {
        category: {
          slug: {
            $eq: category,
          },
        },
      }
    }

    if (limit) {
      params.pagination = {
        pageSize: parseInt(limit),
      }
    }

    const response = await fetchStrapiData<StrapiResponse<StrapiPost[]>>('/posts', params)

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
} 