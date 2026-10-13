import { getMovies, getSeries, getChannels, getProviders } from '../../data/db'
import { Film, Tv, Radio, Server } from 'lucide-react'
import Link from 'next/link'
export default function AdminDashboard() {
  const movies = getMovies()
  const series = getSeries()
  const channels = getChannels()
  const providers = getProviders().filter(p => p.active)
  const stats = [
    { label: 'Movies', value: movies.length, icon: Film, href: '/admin/movies', color: 'from-purple-600 to-purple-800' },
    { label: 'Series', value: series.length, icon: Tv, href: '/admin/series', color: 'from-blue-600 to-blue-800' },
    { label: 'Live Channels', value: channels.length, icon: Radio, href: '/admin/live-tv', color: 'from-red-600 to-red-800' },
    { label: 'Active Providers', value: providers.length, icon: Server, href: '/admin/providers', color: 'from-green-600 to-green-800' },
  ]
  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, href, color }) => (
          <Link key={label} href={href} className={`relative overflow-hidden bg-gradient-to-br ${color} rounded-2xl p-5 hover:scale-[1.02] transition-transform`}>
            <Icon className="w-8 h-8 text-white/30 absolute right-4 top-4" />
            <p className="text-3xl font-black text-white">{value}</p>
            <p className="text-sm text-white/70 mt-1">{label}</p>
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-4">Recent Movies</h2>
          {movies.length === 0 ? <p className="text-gray-600 text-sm">No movies added yet</p> : (
            <div className="flex flex-col gap-2">
              {movies.slice(-5).reverse().map(m => (
                <div key={m.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-300 truncate">{m.title}</span>
                  <span className="text-gray-600 shrink-0 ml-2">{m.year}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-4">Recent Series</h2>
          {series.length === 0 ? <p className="text-gray-600 text-sm">No series added yet</p> : (
            <div className="flex flex-col gap-2">
              {series.slice(-5).reverse().map(s => (
                <div key={s.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-300 truncate">{s.title}</span>
                  <span className="text-gray-600 shrink-0 ml-2">{s.year}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
