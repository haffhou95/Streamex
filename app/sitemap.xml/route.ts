import { NextResponse } from 'next/server'
import { getMovies, getSeries, getSettings } from '../../../data/db'
export async function GET() {
  const settings = getSettings()
  const movies = getMovies()
  const series = getSeries()
  const base = settings.siteUrl || 'http://localhost:3000'
  const urls = [`${base}/`,`${base}/movies`,`${base}/series`,`${base}/live-tv`,`${base}/search`]
  movies.forEach(m => urls.push(`${base}/movies/${m.slug}`))
  series.forEach(s => urls.push(`${base}/series/${s.slug}`))
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(u => `<url><loc>${u}</loc><changefreq>weekly</changefreq></url>`).join('')}</urlset>`
  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } })
}
