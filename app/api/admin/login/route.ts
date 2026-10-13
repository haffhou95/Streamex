import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getSettings } from '../../../../data/db'
import { signToken } from '../../../../lib/auth'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()
  const settings = getSettings()

  const storedHash = settings.adminPasswordHash || await bcrypt.hash('admin', 10)
  const validUser = username === (settings.adminUsername || 'admin')
  const validPass = await bcrypt.compare(password, storedHash)

  if (!validUser || !validPass) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const token = await signToken({ username })
  const res = NextResponse.json({ ok: true })
  res.cookies.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  return res
}
