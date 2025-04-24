import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received form data:', body)
    
    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Log environment variables (excluding sensitive values)
    console.log('Environment check:', {
      hasApiUrl: !!process.env.NEXT_PUBLIC_STRAPI_API_URL,
      hasApiToken: !!process.env.NEXT_PUBLIC_STRAPI_API_TOKEN,
      hasRecipientEmail: !!process.env.CONTACT_FORM_RECIPIENT_EMAIL,
      hasEmailFrom: !!process.env.EMAIL_FROM,
      hasEmailServerPassword: !!process.env.EMAIL_SERVER_PASSWORD,
    })

    // Submit to Strapi
    try {
      const strapiUrl = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/contact-forms`
      console.log('Submitting to Strapi:', strapiUrl)
      
      const response = await fetch(strapiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            name: body.name,
            email: body.email,
            subject: body.subject,
            message: body.message,
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error('Strapi submission failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        })
        throw new Error(`Failed to submit to Strapi: ${response.status} ${response.statusText}`)
      }

      console.log('Successfully submitted to Strapi')
    } catch (strapiError) {
      console.error('Strapi submission error:', strapiError)
      return NextResponse.json(
        { error: 'Failed to submit form to CMS' },
        { status: 500 }
      )
    }

    // Send email notification
    try {
      const emailData = {
        to: process.env.CONTACT_FORM_RECIPIENT_EMAIL,
        from: process.env.EMAIL_FROM,
        subject: `New Contact Form Submission: ${body.subject}`,
        text: `
          Name: ${body.name}
          Email: ${body.email}
          Subject: ${body.subject}
          Message: ${body.message}
        `,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${body.name}</p>
          <p><strong>Email:</strong> ${body.email}</p>
          <p><strong>Subject:</strong> ${body.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${body.message.replace(/\n/g, '<br>')}</p>
        `,
      }

      console.log('Sending email notification')
      const emailResponse = await fetch('https://smtppro.zoho.com/api/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.EMAIL_SERVER_PASSWORD}`,
        },
        body: JSON.stringify(emailData),
      })

      if (!emailResponse.ok) {
        const errorData = await emailResponse.text()
        console.error('Email notification failed:', {
          status: emailResponse.status,
          statusText: emailResponse.statusText,
          error: errorData
        })
      } else {
        console.log('Email notification sent successfully')
      }
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      // Continue execution even if email fails
    }

    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form submission error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
} 