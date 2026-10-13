import { getMovies } from '../../data/db'
import ContentCard from '../../components/ui/ContentCard'
import { Metadata } from 'next'
export const metadata: Metadata = { title: 'Movies' }
export default function MoviesPage({ searchParams }: { searchParams: { genre?: string } }) {
  const movies = getMovies()
  const genres = [...new Set(movies.flatMap(m => m.genres))].sort()
  const filtered = searchParams.genre ? movies.filter(m => m.genres.includes(searchParams.genre!)) : movies
  return (
    <div className="max-w-screen-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-white">Movies</h1>
        <span className="text-sm text-gray-500">{filtered.length} titles</span>
      </div>
      {genres.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-6">
          <a href="/movies" className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${!searchParams.genre ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>All</a>
          {genres.map(g => (<a key={g} href={`/movies?genre=${encodeURIComponent(g)}`} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${searchParams.genre === g ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>{g}</a>))}
        </div>
      )}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-600"><p className="text-lg font-semibold">No movies yet</p></div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filtered.map(m => <ContentCard key={m.id} item={m} />)}
        </div>
      )}
    </div>
  )
}
