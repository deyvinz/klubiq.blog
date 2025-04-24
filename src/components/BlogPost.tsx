'use client'

import { useStrapi } from '@/hooks/useStrapi'
import { StrapiPost } from '@/types/strapi'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'

interface BlogPostProps {
  slug: string
}

export default function BlogPost({ slug }: BlogPostProps) {
  const { data, loading, error } = useStrapi<{ data: StrapiPost[] }>('/posts', {
    filters: {
      slug: slug,
    },
    populate: ['cover', 'category', 'author', 'tags'],
  })

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error loading post: {error.message}
      </div>
    )
  }

  const post = data?.data?.[0]

  if (!post) {
    return (
      <div className="text-gray-500">
        Post not found
      </div>
    )
  }

  const getImageUrl = (url: string) => {
    if (url.startsWith('http')) return url
    return `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${url}`
  }

  return (
    <article className="container mx-auto px-4 py-12">
      {post.cover && (
        <div className="relative aspect-video mb-12 rounded-lg overflow-hidden">
          <Image
            src={getImageUrl(post.cover.url)}
            alt={post.cover.alternativeText || post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <header className="max-w-content mx-auto mb-12">
        <h1 className="text-h1 font-heading font-bold text-primary mb-6">{post.title}</h1>
        <div className="flex items-center gap-4 text-text/60">
          {post.author && (
            <div className="flex items-center gap-2">
              {post.author.data.attributes.avatar?.data && (
                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={getImageUrl(post.author.data.attributes.avatar.data.attributes.url)}
                    alt={post.author.data.attributes.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <span className="font-medium">{post.author.data.attributes.name}</span>
            </div>
          )}
          <time dateTime={post.publishedAt} className="text-small">
            {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
          </time>
          {post.category && (
            <Link
              href={`/category/${post.category.slug}`}
              className="badge-primary"
            >
              {post.category.name}
            </Link>
          )}
        </div>
      </header>

      <div className="blog-content">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      {post.tags?.data && post.tags.data.length > 0 && (
        <div className="max-w-content mx-auto mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-h4 font-heading font-bold text-secondary mb-4">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {post.tags.data.map((tag) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.attributes.slug}`}
                className="badge-secondary"
              >
                {tag.attributes.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  )
} 