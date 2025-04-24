import { Metadata } from 'next'
import { marked } from 'marked'
import { fetchStrapiData } from '@/lib/strapi'
import { Container } from '@/components/Container'
import { PageHeader } from '@/components/PageHeader'
import { StrapiAboutPage } from '@/types/strapi'

export async function generateMetadata(): Promise<Metadata> {
  const response = await fetchStrapiData<{ data: StrapiAboutPage }>('/about-page', {
    populate: ['seo', 'vision', 'blog', 'team', 'contactSection']
  })
  
  const aboutData = response?.data
  
  return {
    title: aboutData?.seo?.metaTitle || 'About Us',
    description: aboutData?.seo?.metaDescription || 'Learn more about our team and mission'
  }
}

export default async function AboutPage() {
  const response = await fetchStrapiData<{ data: StrapiAboutPage }>('/about-page', {
    populate: ['seo', 'vision', 'blog', 'team', 'contactSection']
  })
  
  const aboutData = response?.data
  
  if (!aboutData) {
    return (
      <Container>
        <div className="py-16 text-center">
          <h1 className="text-3xl font-bold">About Us</h1>
          <p className="mt-4">Content is currently unavailable.</p>
        </div>
      </Container>
    )
  }

  return (
    <>
      <PageHeader
        title={aboutData.title}
        description={aboutData.introduction}
      />

      <Container>
        <div className="prose prose-lg mx-auto max-w-4xl">

          {/* Vision Section */}
          {aboutData.vision && (
            <section className="mb-16 rounded-2xl bg-gray-50 p-8">
              <h2 className="mb-6 text-2xl font-bold">{aboutData.vision.title}</h2>
              <div dangerouslySetInnerHTML={{ __html: marked(aboutData.vision.content) }} />
            </section>
          )}

          {/* Blog Section */}
          {aboutData.blog && (
            <section className="mb-16">
              <h2 className="mb-6 text-2xl font-bold">{aboutData.blog.title}</h2>
              <div dangerouslySetInnerHTML={{ __html: marked(aboutData.blog.content) }} />
            </section>
          )}

          {/* Team Section */}
          {aboutData.team && (
            <section className="mb-16">
              <h2 className="mb-8 text-2xl font-bold">{aboutData.team.title}</h2>
              <div dangerouslySetInnerHTML={{ __html: marked(aboutData.team.content) }} />
            </section>
          )}

          {/* Contact Section */}
          {aboutData.contactSection && (
            <section className="rounded-2xl bg-primary/5 p-8">
              <h2 className="mb-6 text-2xl font-bold">{aboutData.contactSection.title}</h2>
              <div dangerouslySetInnerHTML={{ __html: marked(aboutData.contactSection.content) }} />
            </section>
          )}
        </div>
      </Container>
    </>
  )
} 