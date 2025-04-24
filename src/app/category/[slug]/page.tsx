import CategoryPostsContent from '@/components/CategoryPostsContent'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps) {
  return {
    title: `${(await params).slug} - KlubIQ Blog`,
    description: `Browse all posts in the ${(await params).slug} category`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  return <CategoryPostsContent categorySlug={(await params).slug} />
} 