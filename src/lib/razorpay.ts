import Razorpay from 'razorpay'

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export type PlanType = 'monthly' | 'quarterly' | 'yearly'

export const PLANS = {
  monthly: {
    name: 'Monthly',
    amount: 49900,
    duration: 30,
    description: 'Perfect for getting started',
  },
  quarterly: {
    name: 'Quarterly',
    amount: 129900,
    duration: 90,
    description: 'Best for growing teams',
    savings: '13%',
  },
  yearly: {
    name: 'Yearly',
    amount: 399900,
    duration: 365,
    description: 'Best value - 2 months free',
    savings: '33%',
  },
} as const

export function formatPrice(paise: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(paise / 100)
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}