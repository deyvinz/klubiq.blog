'use client'

import { useState, useEffect } from 'react'
import { fetchStrapiData } from '@/lib/strapi'

interface UseStrapiOptions {
  populate?: string | string[] | Record<string, any>
  filters?: Record<string, any>
  sort?: string | string[]
  pagination?: {
    page?: number
    pageSize?: number
  }
}

export function useStrapi<T>(endpoint: string, options: UseStrapiOptions = {}) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data from:', endpoint)
        console.log('Options:', options)
        const response = await fetchStrapiData<T>(endpoint, options)
        console.log('Response:', response)
        setData(response)
        setError(null)
      } catch (err) {
        console.error('Error fetching data from Strapi:', err)
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [endpoint, JSON.stringify(options)])

  return { data, loading, error }
} 