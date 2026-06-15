export type WorkType = 'remote' | 'hybrid' | 'onsite'

export type ApplicationStatus =
  | 'applied'
  | 'response'
  | 'interview'
  | 'tech_test'
  | 'offer'
  | 'rejected'
  | 'ghosted'

export type ExperienceLevel = 'junior' | 'mid' | 'senior' | 'lead'

export interface Profile {
  id: string
  full_name: string | null
  skills: string[]
  target_role: string | null
  target_salary: number | null
  work_type: WorkType | null
  created_at: string
  updated_at: string
}

export interface Application {
  id: string
  user_id: string
  url: string | null
  platform: string | null
  position: string
  company: string
  location: string | null
  salary_range: string | null
  experience_level: ExperienceLevel | null
  required_skills: string[]
  summary: string | null
  status: ApplicationStatus
  match_score: number | null
  notes: string | null
  applied_date: string
  interview_date: string | null
  created_at: string
  updated_at: string
}

export type ReminderType = 'follow_up' | 'interview' | 'deadline' | 'custom'
export type ReminderStatus = 'pending' | 'sent' | 'cancelled'

export interface Reminder {
  id: string
  user_id: string
  application_id: string
  type: ReminderType
  message: string | null
  remind_at: string
  status: ReminderStatus
  created_at: string
}