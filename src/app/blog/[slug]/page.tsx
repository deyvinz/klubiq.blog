import { Metadata } from 'next'
import { fetchStrapiData } from '@/lib/strapi'
import { StrapiPost } from '@/types/strapi'
import BlogPost from '@/components/BlogPost'
import { notFound } from 'next/navigation'

export const revalidate = 3600 // Revalidate every hour

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  // First find the post by slug
  const { data: posts } = await fetchStrapiData<{ data: StrapiPost[] }>('/posts', {
    filters: {
      slug: params.slug,
    },
    populate: ['cover', 'category', 'author', 'tags'],
  })

  const post = posts?.[0]

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: post.author?.data.attributes.name ? [post.author.data.attributes.name] : [],
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string }
}) {
  // First find the post by slug
  const { data: posts } = await fetchStrapiData<{ data: StrapiPost[] }>('/posts', {
    filters: {
      slug: params.slug,
    },
    populate: ['cover', 'category', 'author', 'tags'],
  })

  const post = posts?.[0]

  if (!post) {
    notFound()
  }

  return <BlogPost slug={params.slug} />
} 