import type { NextApiRequest, NextApiResponse } from 'next'
import { sendEmail } from '@/lib/email'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { email } = req.body

    // Store in Strapi
    const strapiResponse = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/newsletter-subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            email,
            subscriptionStatus: 'active',
            subscribedAt: new Date().toISOString(),
          },
        }),
      }
    )

    if (!strapiResponse.ok) {
      throw new Error('Failed to store newsletter subscription')
    }

    // Send welcome email
    const emailSent = await sendEmail({
      to: email,
      subject: 'Welcome to Our Newsletter!',
      html: `
        <h2>Welcome to Our Newsletter!</h2>
        <p>Thank you for subscribing to our newsletter!</p>
        <p>You'll now receive updates about our latest articles and insights.</p>
        <p>If you wish to unsubscribe at any time, simply click the unsubscribe link in any of our emails.</p>
      `,
    })

    if (!emailSent) {
      throw new Error('Failed to send welcome email')
    }

    res.status(200).json({ message: 'Subscribed successfully' })
  } catch (error) {
    console.error('Error processing newsletter subscription:', error)
    res.status(500).json({ message: 'Error processing newsletter subscription' })
  }
} 