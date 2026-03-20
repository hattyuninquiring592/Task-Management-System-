import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { TaskStatus, Priority } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
}

export const STATUS_COLORS: Record<TaskStatus, string> = {
  PENDING: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  IN_PROGRESS: 'bg-brand-500/15 text-brand-400 border-brand-500/30',
  COMPLETED: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
}

export const PRIORITY_COLORS: Record<Priority, string> = {
  LOW: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  MEDIUM: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  HIGH: 'bg-red-500/15 text-red-400 border-red-500/30',
}

export const PRIORITY_DOT: Record<Priority, string> = {
  LOW: 'bg-slate-400',
  MEDIUM: 'bg-orange-400',
  HIGH: 'bg-red-400',
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export function isOverdue(dueDate: string | null | undefined, status: TaskStatus): boolean {
  if (!dueDate || status === 'COMPLETED') return false
  return new Date(dueDate) < new Date()
}

export function getApiError(error: unknown): string {
  const e = error as { response?: { data?: { message?: string; errors?: { msg: string }[] } } }
  if (e?.response?.data?.errors?.length) {
    return e.response.data.errors.map((x) => x.msg).join('. ')
  }
  return e?.response?.data?.message || 'Something went wrong. Please try again.'
}
