export type ServiceGroup =
  | 'Học thuật'
  | 'Trình bày'
  | 'Dữ liệu'
  | 'Lập trình'
  | 'Mô hình hệ thống'
  | 'Nghề nghiệp'
  | 'Ôn tập'

export interface Service {
  id: string
  name: string
  group: ServiceGroup
  summary: string
  deliverables: string[]
  requirements: string[]
  turnaround: string
  price: string
  keywords: string[]
  icon: IconName
}

export type PortfolioKind =
  | 'document'
  | 'slides'
  | 'diagram'
  | 'website'
  | 'resume'
  | 'spreadsheet'

export interface PortfolioItem {
  id: string
  title: string
  category: string
  description: string
  tags: string[]
  kind: PortfolioKind
}

export type IconName =
  | 'arrow-right'
  | 'book'
  | 'briefcase'
  | 'check'
  | 'chevron-down'
  | 'clock'
  | 'close'
  | 'code'
  | 'database'
  | 'document'
  | 'external'
  | 'facebook'
  | 'filter'
  | 'instagram'
  | 'mail'
  | 'menu'
  | 'message'
  | 'palette'
  | 'search'
  | 'send'
  | 'shield'
  | 'sparkle'
  | 'table'
  | 'user'
  | 'zalo'
