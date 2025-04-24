import CategoryPostsContent from '@/components/CategoryPostsContent'

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps) {
  return {
    title: `${params.slug} - KlubIQ Blog`,
    description: `Browse all posts in the ${params.slug} category`,
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return <CategoryPostsContent categorySlug={params.slug} />
} 