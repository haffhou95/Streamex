import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getSeriesBySlug, getSeries, getSettings } from '../data/db'
import { Play, Star, Calendar, Tag } from 'lucide-react'
import { Metadata } from 'next'

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = getSeriesBySlug(params.slug)
  if (!s) return {}
  const settings = getSettings()
  const title = s.customTitle || `Watch ${s.title} Free Online`
  const description = s.customDescription || s.description
  return {
    title, description,
    robots: { index: !s.noindex, follow: true },
    openGraph: { title, description, images: [s.backdrop], type: 'video.tv_show' },
    twitter: { card: 'summary_large_image', title, description, images: [s.poster] },
  }
}

export default function SeriesPage({ params }: Props) {
  const series = getSeriesBySlug(params.slug)
  if (!series) notFound()

  const seasons = [...new Set(series.episodes.map(e => e.season))].sort((a, b) => a - b)
  const firstEp = series.episodes[0]

  return (
    <div className="max-w-screen-xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'TVSeries',
        name: series.title,
        description: series.description,
        image: series.poster,
        dateCreated: String(series.year),
        aggregateRating: { '@type': 'AggregateRating', ratingValue: series.rating, bestRating: 10 },
      })}} />

      <div className="relative w-full aspect-[21/9] max-h-[360px] rounded-2xl overflow-hidden mb-6">
        <Image src={series.backdrop} alt={series.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d] via-transparent to-transparent" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="shrink-0 w-36 sm:w-44 mx-auto lg:mx-0 -mt-24 relative z-10">
          <div className="relative aspect-[2/3] rounded-xl overflow-hidden border-2 border-purple-500/30 shadow-2xl">
            <Image src={series.poster} alt={series.title} fill className="object-cover" />
          </div>
        </div>
        <div className="flex-1 lg:-mt-8">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">{series.title}</h1>
          <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
            <div className="flex items-center gap-1 text-yellow-400">
              <Star className="w-4 h-4 fill-yellow-400" /><span className="font-bold">{series.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <Calendar className="w-4 h-4" />{series.year}
            </div>
            <span className="text-gray-400">{series.seasons} Season{series.seasons > 1 ? 's' : ''}</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {series.genres.map(g => (
              <span key={g} className="px-2.5 py-1 bg-purple-600/20 text-purple-400 rounded-lg text-xs font-semibold border border-purple-500/20">{g}</span>
            ))}
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl">{series.description}</p>
          {firstEp && (
            <Link href={`/watch/tv/${series.imdbId}/${firstEp.season}/${firstEp.episode}`}
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl transition-colors">
              <Play className="w-5 h-5 fill-white" /> Watch S1 E1
            </Link>
          )}
        </div>
      </div>

      {/* Episodes by season */}
      {seasons.map(season => (
        <div key={season} className="mt-8">
          <h2 className="text-lg font-bold text-white mb-3">Season {season}</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {series.episodes.filter(e => e.season === season).map(e => (
              <Link key={e.episode} href={`/watch/tv/${series.imdbId}/${season}/${e.episode}`}
                className="py-2.5 bg-white/5 hover:bg-purple-600/20 hover:text-purple-400 border border-white/5 hover:border-purple-500/30 text-gray-400 rounded-lg text-xs font-semibold text-center transition-all">
                E{e.episode}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
