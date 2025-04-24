import { NextResponse } from 'next/server'
import { fetchStrapiData } from '@/lib/strapi'
import { StrapiResponse, StrapiTag } from '@/types/strapi'

export async function GET() {
  try {
    const response: StrapiResponse<StrapiTag[]> = await fetchStrapiData<StrapiResponse<StrapiTag[]>>('/tags', {
      populate: ['posts'],
    })

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    )
  }
} 