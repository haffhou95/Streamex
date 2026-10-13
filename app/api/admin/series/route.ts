import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '../../../../lib/auth'
import { getSeries, saveSeries, getSeriesByImdb } from '../../../../data/db'
import { generateSlug } from '../../../../lib/utils'

export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ series: getSeries() })
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json()
  const series = getSeries()
  if (getSeriesByImdb(data.imdbId)) {
    return NextResponse.json({ error: 'Series already exists' }, { status: 400 })
  }
  const slug = generateSlug(data.title, data.imdbId)
  const item = { ...data, id: Math.random().toString(36).slice(2), slug, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  series.push(item)
  saveSeries(series)
  return NextResponse.json({ series: item })
}

export async function PUT(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json()
  const series = getSeries()
  const idx = series.findIndex(s => s.id === data.id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  series[idx] = { ...series[idx], ...data, updatedAt: new Date().toISOString() }
  saveSeries(series)
  return NextResponse.json({ series: series[idx] })
}

export async function DELETE(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  const series = getSeries().filter(s => s.id !== id)
  saveSeries(series)
  return NextResponse.json({ ok: true })
}
