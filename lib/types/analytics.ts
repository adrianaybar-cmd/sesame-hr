export interface HeadcountData {
  total: number
  by_department: { name: string; count: number }[]
  by_contract_type: { type: string; count: number; percentage: number }[]
  new_hires_this_month: number
  terminations_this_month: number
  growth_rate: number
}

export interface TurnoverData {
  rate: number
  by_department: { name: string; rate: number }[]
  avg_tenure_months: number
  voluntary_vs_involuntary: { voluntary: number; involuntary: number }
}

export interface AbsenteeismData {
  rate: number
  by_type: { type: string; days: number; percentage: number }[]
  trend: { month: string; rate: number }[]
  cost_estimate: number
}

export interface CompensationData {
  avg_salary: number
  median_salary: number
  by_department: { name: string; avg: number }[]
  distribution: { range: string; count: number }[]
}

export interface DiversityData {
  gender: { label: string; count: number; percentage: number }[]
  age_groups: { range: string; count: number; percentage: number }[]
  tenure_groups: { range: string; count: number; percentage: number }[]
}

export interface EngagementData {
  score: number
  nps: number
  trend: { month: string; score: number }[]
  by_department: { name: string; score: number }[]
}

export interface RecruitmentAnalyticsData {
  open_positions: number
  time_to_hire_avg: number
  cost_per_hire: number
  sources: { source: string; candidates: number; hired: number }[]
  pipeline: { stage: string; count: number }[]
}

export interface TrainingAnalyticsData {
  hours_per_employee: number
  completed_vs_planned: { completed: number; planned: number }
  by_department: { name: string; hours: number }[]
  top_courses: { name: string; completions: number }[]
}

export interface PerformanceData {
  avg_score: number
  distribution: { range: string; count: number; percentage: number }[]
  by_department: { name: string; avg: number }[]
  completed_reviews_pct: number
}

export interface PeopleAnalyticsData {
  headcount: HeadcountData
  turnover: TurnoverData
  absenteeism: AbsenteeismData
  compensation: CompensationData
  diversity: DiversityData
  engagement: EngagementData
  recruitment: RecruitmentAnalyticsData
  training: TrainingAnalyticsData
  performance: PerformanceData
}
