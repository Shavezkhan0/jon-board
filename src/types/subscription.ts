export interface SubscriptionResponse {
  status: 'none' | 'active' | 'expired' | 'cancelled'
  plan: 'monthly' | 'quarterly' | 'yearly' | null
  expiryDate: string | null
  daysRemaining: number
  isActive: boolean
}

export interface PaymentHistoryItem {
  id: string
  userEmail?: string
  plan: 'monthly' | 'quarterly' | 'yearly'
  status: 'active' | 'expired' | 'pending' | 'cancelled'
  amount: number
  currency: 'INR' | 'USD'
  startedAt?: string
  expiresAt?: string
  razorpayOrderId?: string
  razorpayPaymentId?: string
  isVerified?: boolean
  createdAt?: string
  date?: string
  invoiceUrl?: string
}

export interface PaymentHistoryResponse {
  docs: PaymentHistoryItem[]
  totalDocs: number
  totalPages: number
  page: number
}
