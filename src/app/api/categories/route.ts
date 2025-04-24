import { NextResponse } from 'next/server'
import { fetchStrapiData } from '@/lib/strapi'
import { StrapiResponse, StrapiCategory } from '@/types/strapi'

export async function GET() {
  try {
    const response: StrapiResponse<StrapiCategory[]> = await fetchStrapiData<StrapiResponse<StrapiCategory[]>>('/categories', {
      populate: ['posts'],
    })

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
} 