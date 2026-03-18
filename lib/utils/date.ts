// -----------------------------------------------------------------------------
// File: date.ts
// Path: lib/utils/date.ts
// Centralised date/time formatting helpers.
// -----------------------------------------------------------------------------

/**
 * Short date — used in order lists, cards, etc.
 * @example formatDate('2024-03-15T10:00:00Z') → "15 Mar"
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })
}

/**
 * Full date — used in detail views, settings.
 * @example formatDateFull('2024-03-15T10:00:00Z') → "15 Mar 2024"
 */
export function formatDateFull(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
}

/**
 * Relative time — "2 hours ago", "3 days ago", etc.
 */
export function formatRelativeTime(date: string | Date): string {
  const diff = Date.now() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1)   return 'Just now'
  if (minutes < 60)  return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24)    return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30)     return `${days}d ago`
  return formatDate(date)
}

/**
 * Month + year — useful for billing / analytics period labels.
 * @example formatMonthYear('2024-03-15') → "March 2024"
 */
export function formatMonthYear(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })
}
