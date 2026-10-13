import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '../../../../lib/auth'
import { getSettings, saveSettings } from '../../../../data/db'

export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const settings = getSettings()
  const { adminPasswordHash, ...publicSettings } = settings
  return NextResponse.json({ settings: publicSettings })
}

export async function PUT(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json()
  const current = getSettings()
  saveSettings({ ...current, ...data })
  return NextResponse.json({ ok: true })
}
