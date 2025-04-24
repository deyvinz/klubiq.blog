import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  html: string
  replyTo?: string
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST || 'smtppro.zoho.com',
  port: Number(process.env.EMAIL_SERVER_PORT) || 587,
  secure: false, // TLS is required for Zoho
  auth: {
    user: process.env.EMAIL_SERVER_USER || 'admin@glumia.com',
    pass: process.env.EMAIL_SERVER_PASSWORD || '',
  },
})

export async function sendEmail({ to, subject, html, replyTo }: EmailOptions) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'info@klubiq.com',
      to,
      subject,
      html,
      replyTo,
    })
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
} 