import { NextResponse } from 'next/server'
import { fetchStrapiData } from '@/lib/strapi'
import { StrapiResponse, StrapiPost } from '@/types/strapi'

interface RouteParams {
  params: Promise<{ slug: string }>
}

export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { data: posts } = await fetchStrapiData<{ data: StrapiPost[] }>('/posts', {
      filters: {
        slug: (await params).slug,
      },
      populate: ['cover', 'category', 'author', 'author.avatar'],
    })

    if (!posts.length) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(posts[0])
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
} 