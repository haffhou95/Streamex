import { getMovies, getSeries, getSettings } from './data/db'
import HeroBanner from '../components/ui/HeroBanner'
import SectionRow from '../components/ui/SectionRow'

export default function HomePage() {
  const movies = getMovies()
  const series = getSeries()
  const settings = getSettings()

  const featured = [...movies, ...series].filter(i => i.featured).slice(0, 5)
  const latest = [...movies, ...series].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  const latestMovies = movies.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  const latestSeries = series.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  const topRated = [...movies, ...series].sort((a, b) => b.rating - a.rating)

  return (
    <div className="max-w-screen-2xl mx-auto">
      {featured.length > 0 && <HeroBanner items={featured} />}

      {!featured.length && (
        <div className="w-full aspect-[16/9] max-h-[400px] rounded-2xl bg-gradient-to-br from-purple-900/30 to-black border border-purple-500/20 flex flex-col items-center justify-center gap-4">
          <h2 className="text-2xl font-black gradient-text">Welcome to {settings.siteName}</h2>
          <p className="text-gray-500 text-sm">Add content from the admin dashboard to get started</p>
        </div>
      )}

      <SectionRow title="Latest" items={latest} viewAllHref="/movies" />
      <SectionRow title="Latest Movies" items={latestMovies} viewAllHref="/movies" />
      <SectionRow title="Latest Series" items={latestSeries} viewAllHref="/series" />
      <SectionRow title="Top Rated" items={topRated} />
    </div>
  )
}
