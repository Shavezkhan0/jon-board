export interface SubscriptionResponse {
  status: 'none' | 'active' | 'expired' | 'cancelled'
  plan: 'monthly' | 'quarterly' | 'yearly' | null
  expiryDate: string | null
  daysRemaining: number
  isActive: boolean
}

export interface PaymentHistoryItem {
  id: string
  date: string
  plan: 'monthly' | 'quarterly' | 'yearly'
  amount: number
  currency: 'INR' | 'USD'
  status: 'active' | 'expired' | 'pending'
  invoiceUrl?: string
}

export interface PaymentHistoryResponse {
  docs: PaymentHistoryItem[]
  totalDocs: number
  totalPages: number
  page: number
}