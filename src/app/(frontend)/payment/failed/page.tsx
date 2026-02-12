import PaymentFailedClient from './PaymentFailedClient'

export async function generateMetadata() {
  return {
    title: 'Payment Failed - JobBoard Pro',
    description: 'Payment could not be processed. Try again or contact support for assistance.',
    keywords: 'payment failed, payment issue, subscription error',
    noindex: true, // Prevent indexing of error pages
  }
}

export default function PaymentFailedPage() {
  return <PaymentFailedClient />
}
