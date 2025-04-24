import { Metadata } from 'next'
import HomeContent from '@/components/HomeContent'

export const metadata: Metadata = {
  title: 'Klubiq Blog',
  description: 'A modern blog built with Next.js and Strapi',
}

export default function HomePage() {
  return <HomeContent />
} 