import Image from 'next/image'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface PostCardProps {
  title: string
  excerpt: string
  slug: string
  imageUrl: string
  date: string
  category?: string
  author?: {
    name: string
    avatar?: string
  }
}

export default function PostCard({
  title,
  excerpt,
  slug,
  imageUrl,
  date,
  category,
  author,
}: PostCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/posts/${slug}`} className="block">
        <div className="relative aspect-video">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-6">
          {category && (
            <span className="inline-block px-3 py-1 text-small font-medium text-secondary bg-secondary/10 rounded-full mb-3">
              {category}
            </span>
          )}
          <h3 className="text-h2 font-heading font-bold text-primary mb-3 line-clamp-2">
            {title}
          </h3>
          <p className="text-body text-text/80 mb-4 line-clamp-3">{excerpt}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {author?.avatar && (
                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={author.avatar}
                    alt={author.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                {author?.name && (
                  <p className="text-small font-medium text-text">{author.name}</p>
                )}
                <time className="text-small text-text/60">
                  {formatDate(date)}
                </time>
              </div>
            </div>
            <span className="text-small font-medium text-secondary">
              Read More →
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
} 