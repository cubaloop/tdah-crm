export type LeadStatus =
  | 'CREATED'
  | 'CONTACTED'
  | 'FOLLOW_UP'
  | 'APPOINTMENT'
  | 'RESERVATION'
  | 'CLOSED'
  | 'UNQUALIFIED';

export type PurchaseTimeline =
  | 'within_a_month'
  | 'within_3_-_6_months'
  | 'after_6_months'
  | 'not_sure';

export type InvestmentGoal =
  | 'investment_purpose'
  | 'relocation/residency'
  | string;

export interface LeadNote {
  id: string;
  createdAt: string;
  author: string;
  content: string;
  type?: 'call' | 'whatsapp' | 'email' | 'meeting' | 'note';
}

export interface Lead {
  id: string;
  platform: string;
  investment_goal: InvestmentGoal;
  purchase_timeline: PurchaseTimeline | string;
  preferred_time_to_call: string;
  full_name: string;
  phone: string;
  work_phone_number: string;
  email: string;
  lead_status: LeadStatus;
  comments: string | null;
  notes: LeadNote[];
  created_at: string;
  last_contact_date?: string;
  next_reminder_date?: string | null;
  budget_aed?: number | null;
  ad_name?: string;
  campaign_name?: string;
}

export interface KanbanColumn {
  id: LeadStatus;
  title: string;
  badgeColor: string;
  description: string;
}

export interface ProjectUnit {
  unitNo: string;
  typology: '1-BR' | '2-BR' | '3-BR';
  sqft: number;
  priceAED: number;
  psf: number;
  floor: number;
  available: boolean;
}

export interface PaymentMilestone {
  event: string;
  percentage: number;
  dueDate: string;
}
