import { NextResponse } from 'next/server'
import { fetchStrapiData } from '@/lib/strapi'
import { StrapiResponse, StrapiPost } from '@/types/strapi'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const response: StrapiResponse<StrapiPost[]> = await fetchStrapiData<StrapiResponse<StrapiPost[]>>('/posts', {
      filters: {
        slug: {
          $eq: params.slug,
        },
      },
      populate: ['cover', 'category', 'author', 'author.avatar'],
    })

    if (!response.data.length) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(response.data[0])
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
} 