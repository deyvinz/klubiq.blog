'use client'

import { useState } from 'react'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

interface SubmitStatus {
  type: 'success' | 'error'
  message: string
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      setSubmitStatus({
        type: 'success',
        message: 'Thank you for your message. We will get back to you soon!',
      })
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Failed to submit form. Please try again later.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {submitStatus && (
        <div
          className={`rounded-md p-4 ${
            submitStatus.type === 'success'
              ? 'bg-success-light text-success-dark'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 px-2 py-1 block w-full h-10 rounded-md border border-black-600 focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 px-2 py-1 block w-full h-10 rounded-md border border-black-600 focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700"
          >
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            className="mt-1 px-2 py-1 block w-full h-10 rounded-md border border-black-600 focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            required
            value={formData.message}
            onChange={handleChange}
            className="mt-1 px-2 py-1 block w-full rounded-md border border-black-600 focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-black-600 bg-primary px-4 py-2 text-sm font-medium text-black"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </form>
  )
} 