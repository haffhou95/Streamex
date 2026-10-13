import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(' ')
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 11) + Date.now().toString(36)
}

export function generateSlug(title: string, imdbId: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
  return `${base}-${imdbId}`
}

export function formatRuntime(minutes: number): string {
  if (!minutes) return 'N/A'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

export function buildEmbedUrl(
  urlPattern: string,
  imdbId: string,
  season?: number,
  episode?: number
): string {
  return urlPattern
    .replace('{imdb_id}', imdbId)
    .replace('{season}', String(season ?? 1))
    .replace('{episode}', String(episode ?? 1))
}

export function countryFlag(countryCode: string): string {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    )
}
