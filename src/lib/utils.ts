import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const STATUS_LABELS: Record<string, string> = {
  applied: 'Applied',
  response: 'Response',
  interview: 'Interview',
  tech_test: 'Tech Test',
  offer: 'Offer',
  rejected: 'Rejected',
  ghosted: 'Ghosted',
}

export const STATUS_COLORS: Record<string, string> = {
  applied: '#6366F1',
  response: '#22D3EE',
  interview: '#F59E0B',
  tech_test: '#8B5CF6',
  offer: '#10B981',
  rejected: '#EF4444',
  ghosted: '#6B7280',
}