export type SignatureStatus = 'pending' | 'signed' | 'rejected' | 'expired'

export interface SignatureRequest {
  id: string
  document_id: string
  document_name: string
  document_url: string
  signer_id: string
  signer_name: string
  requester_id: string
  status: SignatureStatus
  method: 'otp' | 'biometric' | 'advanced'
  otp_sent_to?: string // email o teléfono ofuscado
  signed_at?: string
  expires_at: string
  created_at: string
}
