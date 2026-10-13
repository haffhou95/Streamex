import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '../../../../lib/auth'
import { getMovies, saveMovies, getMovieByImdb, getMovieBySlug } from '../../../../data/db'
import { generateSlug } from '../../../../lib/utils'

export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ movies: getMovies() })
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json()

  const movies = getMovies()
  if (getMovieByImdb(data.imdbId)) {
    return NextResponse.json({ error: 'Movie already exists' }, { status: 400 })
  }

  const slug = generateSlug(data.title, data.imdbId)
  const movie = {
    ...data,
    id: Math.random().toString(36).slice(2),
    slug,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  movies.push(movie)
  saveMovies(movies)
  return NextResponse.json({ movie })
}

export async function PUT(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json()
  const movies = getMovies()
  const idx = movies.findIndex(m => m.id === data.id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  movies[idx] = { ...movies[idx], ...data, updatedAt: new Date().toISOString() }
  saveMovies(movies)
  return NextResponse.json({ movie: movies[idx] })
}

export async function DELETE(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  const movies = getMovies().filter(m => m.id !== id)
  saveMovies(movies)
  return NextResponse.json({ ok: true })
}
