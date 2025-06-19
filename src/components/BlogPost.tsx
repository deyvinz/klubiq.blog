'use client'

import { StrapiPost } from '@/types/strapi'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'

interface BlogPostProps {
  post: StrapiPost
}

export default function BlogPost({ post }: BlogPostProps) {
  const getImageUrl = (url: string) => {
    // Decode the URL
    const decodedUrl = decodeURIComponent(url)
    // Remove query parameters if they exist
    return decodedUrl.split('?')[0];
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
        <h1 className="text-h1 font-heading font-bold text-secondary mb-6">{post.title}</h1>
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

      <div className="prose prose-lg max-w-content mx-auto">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </article>
  )
} 