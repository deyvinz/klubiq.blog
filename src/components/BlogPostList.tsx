'use client'

import { useStrapi } from '@/hooks/useStrapi'
import { StrapiPost } from '@/types/strapi'
import BlogPostCard from './BlogPostCard'

interface BlogPostListProps {
  limit?: number
  category?: string
  tag?: string
}

export default function BlogPostList({ limit = 6, category, tag }: BlogPostListProps) {
  const { data, loading, error } = useStrapi<{ data: StrapiPost[] }>('/posts', {
    populate: ['cover', 'category', 'author', 'tags'],
    sort: ['publishedAt:desc'],
    pagination: {
      pageSize: limit,
    },
    filters: {
      ...(category && { category: { slug: category } }),
      ...(tag && { tags: { slug: tag } }),
    },
  })

  console.log('BlogPostList data:', data)
  console.log('BlogPostList loading:', loading)
  console.log('BlogPostList error:', error)

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error loading posts: {error.message}
      </div>
    )
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="text-gray-500">
        No posts found
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.data.map((post) => (
        <BlogPostCard key={post.id} post={post} />
      ))}
    </div>
  )
} 