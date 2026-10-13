import { getSettings } from '@/data/db'
import { Movie, Series, Episode } from '@/types'
import { generateSlug, generateId } from '@/lib/utils'

const TMDB_BASE = 'https://api.themoviedb.org/3'
const IMG_BASE = 'https://image.tmdb.org/t/p'

export function poster(path: string | null, size = 'w500') {
  return path ? `${IMG_BASE}/${size}${path}` : '/images/no-poster.png'
}

export function backdrop(path: string | null, size = 'original') {
  return path ? `${IMG_BASE}/${size}${path}` : '/images/no-backdrop.png'
}

async function tmdbFetch(endpoint: string, apiKey: string) {
  const res = await fetch(`${TMDB_BASE}${endpoint}?api_key=${apiKey}&append_to_response=credits,external_ids`, {
    next: { revalidate: 3600 }
  })
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`)
  return res.json()
}

export async function fetchMovieByImdb(imdbId: string): Promise<Movie> {
  const { tmdbApiKey } = getSettings()
  if (!tmdbApiKey) throw new Error('TMDB API key not set')

  // find by imdb id
  const findRes = await fetch(`${TMDB_BASE}/find/${imdbId}?api_key=${tmdbApiKey}&external_source=imdb_id`)
  const findData = await findRes.json()
  const tmdbId = findData.movie_results?.[0]?.id
  if (!tmdbId) throw new Error(`No TMDB movie found for ${imdbId}`)

  const data = await tmdbFetch(`/movie/${tmdbId}`, tmdbApiKey)

  const director = data.credits?.crew?.find((c: any) => c.job === 'Director')?.name || ''
  const cast = data.credits?.cast?.slice(0, 10).map((c: any) => c.name) || []
  const title = data.title || ''
  const slug = generateSlug(title, imdbId)

  return {
    id: generateId(),
    imdbId,
    tmdbId: String(tmdbId),
    title,
    slug,
    description: data.overview || '',
    poster: poster(data.poster_path),
    backdrop: backdrop(data.backdrop_path),
    year: Number(data.release_date?.split('-')[0]) || 0,
    rating: Math.round(data.vote_average * 10) / 10,
    genres: data.genres?.map((g: any) => g.name) || [],
    cast,
    director,
    duration: data.runtime || 0,
    type: 'movie',
    featured: false,
    noindex: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export async function fetchSeriesByImdb(imdbId: string): Promise<Series> {
  const { tmdbApiKey } = getSettings()
  if (!tmdbApiKey) throw new Error('TMDB API key not set')

  const findRes = await fetch(`${TMDB_BASE}/find/${imdbId}?api_key=${tmdbApiKey}&external_source=imdb_id`)
  const findData = await findRes.json()
  const tmdbId = findData.tv_results?.[0]?.id
  if (!tmdbId) throw new Error(`No TMDB series found for ${imdbId}`)

  const data = await tmdbFetch(`/tv/${tmdbId}`, tmdbApiKey)

  const director = data.credits?.crew?.find((c: any) => c.job === 'Director')?.name || ''
  const cast = data.credits?.cast?.slice(0, 10).map((c: any) => c.name) || []
  const title = data.name || ''
  const slug = generateSlug(title, imdbId)

  // build episode list
  const episodes: Episode[] = []
  for (const season of (data.seasons || [])) {
    if (season.season_number === 0) continue
    for (let ep = 1; ep <= season.episode_count; ep++) {
      episodes.push({ season: season.season_number, episode: ep, title: `Episode ${ep}` })
    }
  }

  return {
    id: generateId(),
    imdbId,
    tmdbId: String(tmdbId),
    title,
    slug,
    description: data.overview || '',
    poster: poster(data.poster_path),
    backdrop: backdrop(data.backdrop_path),
    year: Number(data.first_air_date?.split('-')[0]) || 0,
    rating: Math.round(data.vote_average * 10) / 10,
    genres: data.genres?.map((g: any) => g.name) || [],
    cast,
    director,
    seasons: data.number_of_seasons || 1,
    episodes,
    type: 'series',
    featured: false,
    noindex: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export async function searchTMDB(query: string) {
  const { tmdbApiKey } = getSettings()
  if (!tmdbApiKey) return { movies: [], series: [] }
  const res = await fetch(`${TMDB_BASE}/search/multi?api_key=${tmdbApiKey}&query=${encodeURIComponent(query)}`)
  const data = await res.json()
  return data.results || []
}
