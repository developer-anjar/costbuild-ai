import { Estimate } from './estimate.model';

export type ProjectStatus =
  | 'planning'
  | 'estimation_completed'
  | 'in_progress'
  | 'on_hold'
  | 'completed';

export interface Project {
  id: string;
  estimateId: string;
  name: string;
  description: string;
  category: string;
  status: ProjectStatus;
  budget: number;
  timelineWeeks: number;
  startDate?: string;
  targetDate?: string;
  completedFeatures: string[]; // List of completed feature IDs
  notes: string;
  createdAt: string;
  updatedAt: string;
  estimate?: Estimate;
}

export type UserRole = 'Founder' | 'Developer' | 'Freelancer' | 'Agency' | 'Student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface AppSettings {
  defaultCurrency: 'INR' | 'USD' | 'EUR' | 'GBP';
  defaultRegion: string;
  defaultHiringModel: string;
  emailNotifications: boolean;
  weeklyReports: boolean;
  autoSaveDrafts: boolean;
}

