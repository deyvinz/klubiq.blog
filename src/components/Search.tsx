'use client'

import { useState } from 'react'
import { useStrapi } from '@/hooks/useStrapi'
import { StrapiPost } from '@/types/strapi'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getStrapiMedia } from '@/lib/strapi'

export default function Search() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const { data } = useStrapi<{ data: StrapiPost[] }>('/posts', {
    populate: ['cover', 'category'],
    filters: {
      $or: [
        { title: { $containsi: query } },
        { content: { $containsi: query } },
        { excerpt: { $containsi: query } },
      ],
    },
    pagination: {
      pageSize: 5,
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles..."
          className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Search
        </button>
      </form>

      {query && data?.data && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {data.data.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
            >
              {post.cover && (
                <div className="relative w-16 h-16 rounded overflow-hidden">
                  {post.cover.url && (
                    <Image
                      src={getStrapiMedia(post.cover.url)}
                      alt={post.cover.alternativeText || post.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
              )}
              <div>
                <h3 className="font-medium">{post.title}</h3>
                <p className="text-sm text-text/60">
                  {post.category?.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
} 