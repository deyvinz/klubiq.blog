import { Metadata } from 'next'
import { fetchStrapiData } from '@/lib/strapi'
import { StrapiPost, StrapiResponse } from '@/types/strapi'
import Link from 'next/link'
import Image from 'next/image'
import { getStrapiMedia } from '@/lib/strapi'

export const revalidate = 3600 // Revalidate every hour

async function getLatestPosts() {
  try {
    const response = await fetchStrapiData<StrapiResponse<StrapiPost[]>>('/posts', {
      sort: ['publishedAt:desc'],
      populate: ['cover', 'category', 'author'],
      pagination: {
        pageSize: 9,
      },
    })
    return response.data
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    throw new Error(
      'Unable to fetch blog posts. Please check your Strapi configuration.'
    )
  }
}

export const metadata: Metadata = {
  title: 'Klubiq Blog - Latest Posts',
  description: 'Discover the latest articles and insights on our blog',
}

export default async function HomePage() {
  const posts = await getLatestPosts()

  if (!posts || posts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">No Posts Found</h1>
        <p className="text-gray-600">
          There are no blog posts available at the moment. Please check back later.
        </p>
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Latest Posts</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {post.cover && (
              <div className="relative h-48 w-full">
                <Image
                  src={getStrapiMedia(post.cover.url) || ''}
                  alt={post.cover.alternativeText || post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}
            
            <div className="p-6">
              <Link
                href={`/blog/${post.slug}`}
                className="block group"
                aria-label={`Read more about ${post.title}`}
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
              </Link>
              
              <p className="text-gray-600 mb-4 line-clamp-2">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {new Date(post.publishedAt || '').toLocaleDateString()}
                </span>
                {post.category && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {post.category.name}
                  </span>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
} 