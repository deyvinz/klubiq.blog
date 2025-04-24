'use client'

import { useStrapi } from '@/hooks/useStrapi'
import { StrapiCategory } from '@/types/strapi'
import Link from 'next/link'

export default function CategoriesContent() {
  const { data: categoriesData, loading: categoriesLoading, error } = useStrapi<{ data: StrapiCategory[] }>('/categories', {
    populate: {
      posts: {
        fields: ['id', 'title', 'slug', 'publishedAt'],
      },
    },
  })

  console.log('Categories Data:', categoriesData)
  console.log('Loading:', categoriesLoading)
  console.log('Error:', error)

  if (error) {
    return (
      <div className="py-8">
        <div className="text-red-500">
          Error loading categories: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div className="py-12">
      <h1 className="text-4xl font-bold mb-8">Categories</h1>
      
      {categoriesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : categoriesData?.data && categoriesData.data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categoriesData.data.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600">
                {category.name}
              </h3>
              <p className="text-gray-600">
                {category.posts?.length || 0} posts
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-gray-500">No categories found</div>
      )}
    </div>
  )
} 