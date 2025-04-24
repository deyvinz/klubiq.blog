import { fetchStrapiData, getStrapiMedia, formatStrapiDate } from '@/lib/strapi'
import { StrapiResponse, StrapiPost } from '@/types/strapi'
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 3600 // Revalidate every hour

async function getPosts() {
  const response = await fetchStrapiData<StrapiResponse<StrapiPost[]>>('/posts', {
    populate: ['cover', 'category', 'author'],
    sort: ['publishedAt:desc'],
    pagination: {
      pageSize: 9,
    },
  })
  return response.data
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-h1 font-heading font-bold text-secondary mb-8">
        Blog Posts
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <Link href={`/blog/${post.slug}`}>
              <div className="relative h-48">
                <Image
                  src={getStrapiMedia(post.cover?.url || '')}
                  alt={post.cover?.alternativeText || post.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-text/60 mb-2">
                  <span>{formatStrapiDate(post.publishedAt)}</span>
                  <span>•</span>
                  <span>{post.category?.name}</span>
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
    </main>
  )
} 