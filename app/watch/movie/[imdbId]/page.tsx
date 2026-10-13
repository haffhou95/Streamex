import { notFound } from 'next/navigation'
import { getMovieByImdb, getProviders } from '../../data/db'
import EmbedPlayer from '../../components/player/EmbedPlayer'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Metadata } from 'next'

type Props = { params: { imdbId: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const movie = getMovieByImdb(params.imdbId)
  if (!movie) return {}
  return { title: `Watch ${movie.title}`, robots: { index: false, follow: false } }
}

export default function WatchMoviePage({ params }: Props) {
  const movie = getMovieByImdb(params.imdbId)
  if (!movie) notFound()
  const providers = getProviders()

  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Link href={`/movies/${movie.slug}`} className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <h1 className="text-lg font-bold text-white truncate">{movie.title}</h1>
      </div>
      <EmbedPlayer providers={providers} imdbId={movie.imdbId} type="movie" />
    </div>
  )
}
