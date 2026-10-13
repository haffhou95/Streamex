import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '../../../../lib/auth'
import { getChannels, saveChannels } from '../../../../data/db'

export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ channels: getChannels() })
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const ch = await req.json()
  const channels = getChannels()
  const newCh = { ...ch, id: Math.random().toString(36).slice(2), slug: ch.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), createdAt: new Date().toISOString(), active: true }
  channels.push(newCh)
  saveChannels(channels)
  return NextResponse.json({ channel: newCh })
}

export async function PUT(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json()
  const channels = getChannels().map(c => c.id === data.id ? { ...c, ...data } : c)
  saveChannels(channels)
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const channels = getChannels().filter(c => c.id !== id)
  saveChannels(channels)
  return NextResponse.json({ ok: true })
}
