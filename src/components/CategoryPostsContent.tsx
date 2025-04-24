'use client'

import { useStrapi } from '@/hooks/useStrapi'
import { StrapiPost } from '@/types/strapi'
import Link from 'next/link'
import Image from 'next/image'

interface CategoryPostsContentProps {
  categorySlug: string
}

export default function CategoryPostsContent({ categorySlug }: CategoryPostsContentProps) {
  const { data: postsData, loading: postsLoading, error } = useStrapi<{ data: StrapiPost[] }>('/posts', {
    filters: {
      category: {
        slug: {
          $eq: categorySlug
        }
      }
    },
    populate: {
      cover: true,
      category: true,
      author: true
    },
    sort: ['publishedAt:desc'],
  })

  console.log('Category Posts Data:', postsData)
  console.log('Loading:', postsLoading)
  console.log('Error:', error)

  if (error) {
    return (
      <div className="py-8">
        <div className="text-red-500">
          Error loading posts: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div className="py-12">
      <h1 className="text-4xl font-bold mb-8">Posts in {categorySlug}</h1>
      
      {postsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : postsData?.data && postsData.data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {postsData.data.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group block"
            >
              <div className="relative h-48 mb-4 overflow-hidden rounded-lg bg-gray-100">
                {post.cover?.url && (
                  <Image
                    src={post.cover.url}
                    alt={post.cover.alternativeText || post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    unoptimized={process.env.NODE_ENV === 'development'}
                  />
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600">
                {post.title}
              </h3>
              <p className="text-gray-600 line-clamp-2">
                {post.excerpt}
              </p>
              <div className="mt-4 text-sm text-gray-500">
                {new Date(post.publishedAt).toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-gray-500">No posts found in this category</div>
      )}
    </div>
  )
} 