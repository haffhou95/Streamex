import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getMovieBySlug, getMovies, getProviders, getSettings } from '../../data/db'
import { Play, Star, Clock, Calendar, Tag } from 'lucide-react'
import { formatRuntime } from '@/lib/utils'
import { Metadata } from 'next'
import ContentCard from '@/components/ui/ContentCard'

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const movie = getMovieBySlug(params.slug)
  if (!movie) return {}
  const settings = getSettings()
  const title = movie.customTitle || `Watch ${movie.title} Free Online`
  const description = movie.customDescription || movie.description
  const url = `${settings.siteUrl}/movies/${movie.slug}`
  return {
    title,
    description,
    robots: { index: !movie.noindex, follow: true },
    openGraph: { title, description, images: [movie.backdrop], url, type: 'video.movie' },
    twitter: { card: 'summary_large_image', title, description, images: [movie.poster] },
  }
}

export default function MoviePage({ params }: Props) {
  const movie = getMovieBySlug(params.slug)
  if (!movie) notFound()
  const related = getMovies().filter(m => m.id !== movie.id && m.genres.some(g => movie.genres.includes(g))).slice(0, 6)

  return (
    <div className="max-w-screen-xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Movie',
        name: movie.title,
        description: movie.description,
        image: movie.poster,
        dateCreated: String(movie.year),
        director: { '@type': 'Person', name: movie.director },
        aggregateRating: { '@type': 'AggregateRating', ratingValue: movie.rating, bestRating: 10 },
      })}} />

      <div className="relative w-full aspect-[21/9] max-h-[360px] rounded-2xl overflow-hidden mb-6">
        <Image src={movie.backdrop} alt={movie.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d] via-transparent to-transparent" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="shrink-0 w-36 sm:w-44 mx-auto lg:mx-0 -mt-24 relative z-10">
          <div className="relative aspect-[2/3] rounded-xl overflow-hidden border-2 border-purple-500/30 shadow-2xl">
            <Image src={movie.poster} alt={movie.title} fill className="object-cover" />
          </div>
        </div>
        <div className="flex-1 lg:-mt-8">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">{movie.title}</h1>
          <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
            <div className="flex items-center gap-1 text-yellow-400">
              <Star className="w-4 h-4 fill-yellow-400" />
              <span className="font-bold">{movie.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <Calendar className="w-4 h-4" />{movie.year}
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <Clock className="w-4 h-4" />{formatRuntime(movie.duration)}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {movie.genres.map(g => (
              <span key={g} className="px-2.5 py-1 bg-purple-600/20 text-purple-400 rounded-lg text-xs font-semibold border border-purple-500/20">{g}</span>
            ))}
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl">{movie.description}</p>
          <Link href={`/watch/movie/${movie.imdbId}`}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl transition-colors">
            <Play className="w-5 h-5 fill-white" /> Watch Now
          </Link>
        </div>
      </div>

      {movie.cast.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-white mb-3">Cast</h2>
          <div className="flex flex-wrap gap-2">
            {movie.cast.map(c => (
              <span key={c} className="px-3 py-1.5 bg-white/5 text-gray-400 rounded-lg text-xs">{c}</span>
            ))}
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-bold text-white mb-4">Related Movies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {related.map(m => <ContentCard key={m.id} item={m} />)}
          </div>
        </div>
      )}
    </div>
  )
}
