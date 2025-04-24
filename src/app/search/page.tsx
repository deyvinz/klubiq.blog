import { Metadata } from 'next'
import { fetchStrapiData } from '@/lib/strapi'
import { StrapiResponse, StrapiPost } from '@/types/strapi'
import SearchForm from '@/components/SearchForm'
import SearchResults from '@/components/SearchResults'

interface SearchPageProps {
  searchParams: { q?: string }
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const query = searchParams.q || ''
  return {
    title: query ? `Search results for "${query}" - KlubIQ Blog` : 'Search - KlubIQ Blog',
    description: query
      ? `Search results for "${query}" in KlubIQ Blog`
      : 'Search through KlubIQ Blog posts',
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ''
  let posts: StrapiPost[] = []
  let error = null

  if (query) {
    try {
      const response = await fetchStrapiData<StrapiResponse<StrapiPost[]>>('/posts', {
        filters: {
          $or: [
            {
              title: {
                $containsi: query,
              },
            },
            {
              content: {
                $containsi: query,
              },
            },
            {
              excerpt: {
                $containsi: query,
              },
            },
            {
              category: {
                name: {
                  $containsi: query,
                },
              },
            },
          ],
        },
        populate: ['cover', 'category', 'author'],
        sort: ['publishedAt:desc'],
      })
      posts = response.data
    } catch (e) {
      error = 'Failed to fetch search results'
      console.error('Search error:', e)
    }
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-h1 font-heading font-bold text-secondary mb-8">
        {query ? `Search results for "${query}"` : 'Search Blog'}
      </h1>

      <SearchForm />

      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <SearchResults posts={posts} query={query} />
      )}
    </main>
  )
} 