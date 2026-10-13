import { getChannels } from '../../data/db'
import Link from 'next/link'
import Image from 'next/image'
import { Radio } from 'lucide-react'
import { Metadata } from 'next'
export const metadata: Metadata = { title: 'Live TV' }
const CATEGORIES = ['all','sports','news','entertainment','kids','movies','music','other']
export default function LiveTVPage({ searchParams }: { searchParams: { cat?: string } }) {
  const channels = getChannels().filter(c => c.active)
  const cat = searchParams.cat || 'all'
  const filtered = cat === 'all' ? channels : channels.filter(c => c.category === cat)
  return (
    <div className="max-w-screen-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-white">Live TV</h1>
        <span className="text-sm text-gray-500">{filtered.length} channels</span>
      </div>
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map(c => (<a key={c} href={c === 'all' ? '/live-tv' : `/live-tv?cat=${c}`} className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${cat === c ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>{c}</a>))}
      </div>
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-600"><Radio className="w-12 h-12 mb-3 opacity-30" /><p className="text-lg font-semibold">No channels yet</p></div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filtered.map(ch => (
            <Link key={ch.id} href={`/live-tv/${ch.slug}`} className="group flex flex-col items-center gap-3 p-4 bg-[#1a1a1a] border border-white/5 hover:border-purple-500/40 rounded-xl transition-all">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-black/40 flex items-center justify-center">
                {ch.logo ? <Image src={ch.logo} alt={ch.name} fill className="object-contain p-1" /> : <Radio className="w-8 h-8 text-gray-600" />}
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white truncate max-w-full">{ch.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{ch.countryFlag} {ch.category}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
