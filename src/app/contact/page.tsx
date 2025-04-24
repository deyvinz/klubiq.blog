import { Metadata } from 'next'
import { ContactForm } from '@/components/ContactForm'
import { PageHeader } from '@/components/PageHeader'

export const metadata: Metadata = {
  title: 'Contact Us | Klubiq Blog',
  description: "Get in touch with us. We'd love to hear from you!",
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Contact Us"
        description="Have a question or want to get in touch? Fill out the form below and we'll get back to you as soon as possible."
      />
      <div className="mt-8 max-w-2xl mx-auto">
        <ContactForm />
      </div>
    </div>
  )
} 