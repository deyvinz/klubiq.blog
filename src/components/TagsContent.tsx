'use client'

import { useStrapi } from '@/hooks/useStrapi'
import BlogPostList from '@/components/BlogPostList'
import { StrapiTag } from '@/types/strapi'

export default function TagsContent() {
  const { data: tags, error } = useStrapi<{ data: StrapiTag[] }>('/tags', {
    populate: {
      posts: {
        populate: ['cover', 'author', 'category'],
      },
    },
  })

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Tags</h1>
        <div className="text-red-500">Error loading tags: {error.message}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tags</h1>
      <div className="grid gap-8">
        {tags?.data.map((tag) => (
          <div key={tag.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">{tag.attributes.name}</h2>
            <p className="text-gray-600 mb-4">
              {tag.attributes.posts?.data.length || 0} posts
            </p>
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Recent Posts</h3>
              <BlogPostList
                tag={tag.attributes.slug}
                limit={3}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 