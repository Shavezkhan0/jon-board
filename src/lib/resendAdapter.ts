import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const resendAdapter = {
  defaultFromAddress: process.env.EMAIL_FROM || 'onboarding@resend.dev',
  defaultFromName: process.env.EMAIL_FROM_NAME || 'Job Board',

  sendEmail: async (message: any) => {
    try {
      const from = message.from
        ? `${message.from.name || 'Job Board'} <${message.from.address}>`
        : `${process.env.EMAIL_FROM_NAME || 'Job Board'} <${process.env.EMAIL_FROM || 'onboarding@resend.dev'}>`

      await resend.emails.send({
        from,
        to: message.to,
        subject: message.subject,
        html: message.html,
        text: message.text,
      })

      console.log('✅ Email sent successfully to:', message.to)
      return { messageId: 'success' }
    } catch (error) {
      console.error('❌ Error sending email:', error)
      // Don't throw error to prevent blocking registration
      return { messageId: 'error' }
    }
  },
}
