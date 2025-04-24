'use client'

import Image from 'next/image'
import Link from 'next/link'
import { StrapiPost } from '@/types/strapi'

interface BlogPostCardProps {
  post: StrapiPost
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/blog/${post.slug}`}>
        <div className="relative h-48">
          {post.cover && post.cover.url && (
            <Image
              src={post.cover.url}
              alt={post.cover.alternativeText || post.title}
              fill
              className="object-cover"
            />
          )}
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 text-sm text-text/60 mb-2">
            <span>
              {new Date(post.publishedAt).toLocaleDateString()}
            </span>
            <span>•</span>
            <span>{post.category?.name}</span>
          </div>
          <h2 className="text-xl font-bold mb-2">{post.title}</h2>
          <p className="text-text/80 line-clamp-2">{post.excerpt}</p>
        </div>
      </Link>
    </article>
  )
} 