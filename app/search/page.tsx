import { getMovies, getSeries } from '../../data/db'
import ContentCard from '../../components/ui/ContentCard'
import { Search } from 'lucide-react'
import { Metadata } from 'next'
export const metadata: Metadata = { title: 'Search' }
export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q?.toLowerCase().trim() || ''
  const all = [...getMovies(), ...getSeries()]
  const results = q ? all.filter(i => i.title.toLowerCase().includes(q) || i.genres.some(g => g.toLowerCase().includes(q)) || i.description.toLowerCase().includes(q)) : []
  return (
    <div className="max-w-screen-2xl mx-auto">
      <h1 className="text-2xl font-black text-white mb-6">Search</h1>
      <form method="GET" action="/search" className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input name="q" defaultValue={q} placeholder="Search movies, series, genres..." className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-purple-500" />
        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg">Search</button>
      </form>
      {q && <p className="text-sm text-gray-500 mb-4">{results.length} result{results.length !== 1 ? 's' : ''} for <span className="text-white font-semibold">"{q}"</span></p>}
      {results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">{results.map(item => <ContentCard key={item.id} item={item} />)}</div>
      ) : q ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-600"><p className="text-lg font-semibold">No results found</p></div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-gray-600"><Search className="w-12 h-12 mb-3 opacity-20" /><p className="text-base">Start typing to search</p></div>
      )}
    </div>
  )
}
