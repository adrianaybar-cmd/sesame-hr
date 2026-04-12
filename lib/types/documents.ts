export type DocumentFolder =
  | 'contracts'       // Contratos
  | 'payslips'        // Nóminas
  | 'training'        // Formación
  | 'evaluations'     // Evaluaciones
  | 'id_documents'    // Documentos de identidad
  | 'medical'         // Documentos médicos
  | 'certificates'    // Certificados
  | 'benefits'        // Beneficios
  | 'policies'        // Políticas de empresa
  | 'onboarding'      // Onboarding
  | 'offboarding'     // Offboarding
  | 'other'           // Otros

export interface Document {
  id: string
  name: string
  folder: DocumentFolder
  employee_id: string
  employee_name: string
  file_type: 'pdf' | 'docx' | 'xlsx' | 'jpg' | 'png' | 'other'
  file_size_kb: number
  uploaded_by: string
  uploaded_at: string
  is_shared: boolean // admin compartió al employee
  requires_signature: boolean
  signed_at?: string
}
