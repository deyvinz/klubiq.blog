import { Metadata } from 'next'
import TagsContent from '@/components/TagsContent'

export const metadata: Metadata = {
  title: 'Tags | Klubiq Blog',
  description: 'Browse blog posts by tags',
}

export default function TagsPage() {
  return <TagsContent />
} 