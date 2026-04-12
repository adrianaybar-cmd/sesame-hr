export type FlexBenefitCategory =
  | 'restaurant'  // Cheque restaurante (IRPF exento hasta 11€/día)
  | 'transport'   // Transporte (hasta 136.36€/mes)
  | 'childcare'   // Guardería (sin límite IRPF)
  | 'health'      // Seguro médico (hasta 500€/año persona)
  | 'training'    // Formación (sin límite)

export interface FlexBenefit {
  id: string
  category: FlexBenefitCategory
  name: string
  provider: string
  max_monthly: number
  irpf_exempt: boolean
  annual_limit?: number
  description: string
}

export interface EmployeeFlexBenefit {
  id: string
  employee_id: string
  benefit_id: string
  benefit_name: string
  category: FlexBenefitCategory
  monthly_amount: number
  start_date: string
  is_active: boolean
}
