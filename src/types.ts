export interface PipelineNode {
  id: string
  label: string
  description: string
}

export interface DecisionNode {
  id: string
  label: string
  x: number
  y: number
  rationale: string
  features: string[]
  next: string
}

export interface SummaryItem {
  text: string
  highlight: string
  spans?: string[]
}

export interface DemoSummary {
  problems: SummaryItem[]
  medications: SummaryItem[]
  assessment: SummaryItem[]
  plan: SummaryItem[]
}

export interface CohortCriterion {
  code?: string
  name?: string
  label: string
  active: boolean
}

export interface CohortCriteria {
  icd: CohortCriterion[]
  labs: CohortCriterion[]
  meds: CohortCriterion[]
}

export interface Project {
  id: string
  title: string
  subtitle: string
  status: string
  tags: string[]
  problem: string
  approach: string
  impact: string
  myRole: string
  tools: string[]
  pipeline: PipelineNode[]
  demoNote?: string
  demoSummary?: DemoSummary
  decisionNodes?: DecisionNode[]
  cohortCriteria?: CohortCriteria
}
