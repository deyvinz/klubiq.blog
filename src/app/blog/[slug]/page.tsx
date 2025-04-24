import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchStrapiData } from '@/lib/strapi'
import { StrapiPost } from '@/types/strapi'
import BlogPost from '@/components/BlogPost'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export const revalidate = 3600 // Revalidate every hour

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  // First find the post by slug
  const { data: posts } = await fetchStrapiData<{ data: StrapiPost[] }>('/posts', {
    filters: {
      slug: (await params).slug,
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

export default async function Page(props: PageProps) {
  // First find the post by slug
  const { data: posts } = await fetchStrapiData<{ data: StrapiPost[] }>('/posts', {
    filters: {
      slug: (await props.params).slug,
    },
    populate: ['cover', 'category', 'author', 'tags'],
  })

  const post = posts?.[0]

  if (!post) {
    notFound()
  }

  return <BlogPost post={post} />
} 