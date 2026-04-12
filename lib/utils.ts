import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind class names with clsx support.
 * Prefer `cn` from `@clasing/ui/utils` when inside UI components.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a full name from parts
 */
export function formatFullName(firstName: string, lastName?: string): string {
  return [firstName, lastName].filter(Boolean).join(' ')
}

/**
 * Get initials from a name (up to 2 chars)
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

/**
 * Format duration in seconds to HH:MM:SS
 */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':')
}

/**
 * Format a date to locale string (es-ES by default)
 */
export function formatDate(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions,
  locale = 'es-ES'
): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString(locale, options ?? { day: '2-digit', month: 'short', year: 'numeric' })
}

/**
 * Format a time to locale string
 */
export function formatTime(date: string | Date, locale = 'es-ES'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
}

/**
 * Check if an addon is installed for the current tenant
 */
export function isAddonInstalled(installedAddons: string[], addonSlug: string): boolean {
  return installedAddons.includes(addonSlug)
}

/**
 * Delay utility for async operations
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
