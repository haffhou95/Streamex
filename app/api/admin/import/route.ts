import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '../../../../lib/auth'
import { fetchMovieByImdb, fetchSeriesByImdb } from '../../../../lib/tmdb'
import { getMovies, saveMovies, getSeries, saveSeries, getMovieByImdb, getSeriesByImdb } from '../../../../data/db'

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { imdbIds, type } = await req.json() as { imdbIds: string[]; type: 'movie' | 'series' | 'auto' }

  const results: { imdbId: string; title?: string; status: 'imported' | 'skipped' | 'error'; error?: string }[] = []

  for (const rawId of imdbIds) {
    const imdbId = rawId.trim()
    if (!imdbId.match(/^tt\d+$/)) {
      results.push({ imdbId, status: 'error', error: 'Invalid IMDB ID format' })
      continue
    }

    try {
      if (type === 'movie' || type === 'auto') {
        if (getMovieByImdb(imdbId)) { results.push({ imdbId, status: 'skipped' }); continue }
        try {
          const movie = await fetchMovieByImdb(imdbId)
          const movies = getMovies()
          movies.push(movie)
          saveMovies(movies)
          results.push({ imdbId, title: movie.title, status: 'imported' })
          continue
        } catch {
          if (type === 'movie') { results.push({ imdbId, status: 'error', error: 'Not found as movie' }); continue }
        }
      }

      if (type === 'series' || type === 'auto') {
        if (getSeriesByImdb(imdbId)) { results.push({ imdbId, status: 'skipped' }); continue }
        const series = await fetchSeriesByImdb(imdbId)
        const allSeries = getSeries()
        allSeries.push(series)
        saveSeries(allSeries)
        results.push({ imdbId, title: series.title, status: 'imported' })
      }
    } catch (err: any) {
      results.push({ imdbId, status: 'error', error: err.message || 'Unknown error' })
    }
  }

  return NextResponse.json({ results })
}
