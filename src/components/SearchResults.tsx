'use client'

import { StrapiPost } from '@/types/strapi'
import Link from 'next/link'
import Image from 'next/image'
import { getStrapiMedia, formatStrapiDate } from '@/lib/strapi'

interface SearchResultsProps {
  posts: StrapiPost[]
  query: string
}

export default function SearchResults({ posts, query }: SearchResultsProps) {
  if (!query) {
    return (
      <div className="text-center text-text/60 mt-8">
        <p className="mb-2">Enter a search term to find blog posts</p>
        <p className="text-sm">Search through titles, content, excerpts, and categories</p>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center text-text/60 mt-8">
        <p className="mb-2">No results found for "{query}"</p>
        <p className="text-sm">Try different keywords or check your spelling</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-8 mt-8">
      {posts.map((post) => (
        <article
          key={post.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <Link href={`/blog/${post.slug}`} className="flex items-start gap-6 p-6">
            {post.cover?.url && (
              <div className="relative w-48 h-32 flex-shrink-0">
                <Image
                  src={getStrapiMedia(post.cover.url)}
                  alt={post.cover.alternativeText || post.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )}
            <div className="flex-grow">
              <div className="flex items-center gap-2 text-sm text-text/60 mb-2">
                <span>{formatStrapiDate(post.publishedAt)}</span>
                {post.category?.name && (
                  <>
                    <span>•</span>
                    <span>{post.category.name}</span>
                  </>
                )}
              </div>
              <h2 className="text-h3 font-heading font-bold text-secondary mb-2">
                {post.title}
              </h2>
              <p className="text-body text-text/80 line-clamp-2">
                {post.excerpt}
              </p>
            </div>
          </Link>
        </article>
      ))}
    </div>
  )
} 