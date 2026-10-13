import { notFound } from 'next/navigation'
import { getSeriesByImdb, getProviders } from '../../../../../../data/db'
import EmbedPlayer from '../../../../../../components/player/EmbedPlayer'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Metadata } from 'next'
type Props = { params: { imdbId: string; season: string; episode: string } }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = getSeriesByImdb(params.imdbId)
  if (!s) return {}
  return { title: `Watch ${s.title} S${params.season}E${params.episode}`, robots: { index: false, follow: false } }
}
export default function WatchTVPage({ params }: Props) {
  const series = getSeriesByImdb(params.imdbId)
  if (!series) notFound()
  const providers = getProviders()
  const season = Number(params.season)
  const episode = Number(params.episode)
  const episodes = series.episodes.filter(e => e.season === season)
  const prevEp = series.episodes.find(e => e.season === season && e.episode === episode - 1)
  const nextEp = series.episodes.find(e => e.season === season && e.episode === episode + 1) || series.episodes.find(e => e.season === season + 1 && e.episode === 1)
  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Link href={`/series/${series.slug}`} className="flex items-center gap-1 text-gray-400 hover:text-white text-sm"><ArrowLeft className="w-4 h-4" /> Back</Link>
        <h1 className="text-lg font-bold text-white truncate">{series.title} — S{season} E{episode}</h1>
      </div>
      <EmbedPlayer providers={providers} imdbId={series.imdbId} type="tv" season={season} episode={episode} />
      <div className="flex items-center justify-between mt-4 gap-3">
        {prevEp ? (<Link href={`/watch/tv/${series.imdbId}/${prevEp.season}/${prevEp.episode}`} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-sm">← S{prevEp.season} E{prevEp.episode}</Link>) : <div />}
        {nextEp && (<Link href={`/watch/tv/${series.imdbId}/${nextEp.season}/${nextEp.episode}`} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold">S{nextEp.season} E{nextEp.episode} →</Link>)}
      </div>
      <div className="mt-6">
        <h2 className="text-base font-bold text-white mb-3">Season {season} Episodes</h2>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
          {episodes.map(e => (<Link key={e.episode} href={`/watch/tv/${series.imdbId}/${season}/${e.episode}`} className={`py-2 rounded-lg text-xs font-semibold text-center transition-all ${e.episode === episode ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>E{e.episode}</Link>))}
        </div>
      </div>
    </div>
  )
}
