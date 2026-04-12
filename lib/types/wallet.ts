export type KYCStatus = 'not_started' | 'pending' | 'verified' | 'rejected'
export type KYCStep = 'personal_data' | 'id_document' | 'selfie' | 'verification'

export interface WalletAccount {
  id: string
  employee_id: string
  balance: number
  currency: string
  kyc_status: KYCStatus
  kyc_completed_steps: KYCStep[]
  iban?: string // si ha añadido cuenta bancaria
  card_last_four?: string
  created_at: string
}

export interface WalletTransaction {
  id: string
  wallet_id: string
  type: 'salary_advance' | 'refund' | 'charge' | 'transfer'
  amount: number
  description: string
  status: 'pending' | 'completed' | 'failed'
  created_at: string
}
