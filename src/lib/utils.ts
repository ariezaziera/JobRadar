import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// DYNAMIC URL HELPER — guna NEXT_PUBLIC_APP_URL
export const getURL = () => {
  let url = process?.env?.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  
  // Pastikan ada http:// atau https://
  url = url.startsWith('http') ? url : `https://${url}`
  // Pastikan takde trailing slash
  url = url.endsWith('/') ? url.slice(0, -1) : url
  
  return url
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