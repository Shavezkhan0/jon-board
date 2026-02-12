import PaymentSuccessClient from './PaymentSuccessClient'

export async function generateMetadata() {
  return {
    title: 'Payment Successful - JobBoard Pro',
    description:
      'Your subscription has been activated successfully. Start exploring premium job features now.',
    keywords: 'payment success, subscription activated, job board',
    noindex: true, // Prevent indexing of success pages
  }
}

export default function PaymentSuccessPage() {
  return (
    <div className="relative">
      <PaymentSuccessClient />
    </div>
  )
}
