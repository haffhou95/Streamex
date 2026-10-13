'use client'
import { useState } from 'react'
import { EmbedProvider } from '@/types'
import { buildEmbedUrl } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

type Props = {
  providers: EmbedProvider[]
  imdbId: string
  type: 'movie' | 'tv'
  season?: number
  episode?: number
}

export default function EmbedPlayer({ providers, imdbId, type, season = 1, episode = 1 }: Props) {
  const active = providers.filter(p => p.active).sort((a, b) => a.order - b.order)
  const [current, setCurrent] = useState(0)
  const [error, setError] = useState(false)

  const provider = active[current]
  if (!provider) return (
    <div className="aspect-video w-full bg-[#1a1a1a] rounded-2xl flex items-center justify-center">
      <p className="text-gray-500">No embed providers available</p>
    </div>
  )

  const url = buildEmbedUrl(
    type === 'movie' ? provider.movieUrl : provider.tvUrl,
    imdbId, season, episode
  )

  const tryNext = () => {
    if (current < active.length - 1) { setCurrent(c => c + 1); setError(false) }
    else setError(true)
  }

  return (
    <div className="w-full">
      {/* Server selector */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="text-sm text-gray-400 font-medium">Server:</span>
        {active.map((p, i) => (
          <button key={p.id} onClick={() => { setCurrent(i); setError(false) }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              i === current ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}>
            {p.name}
          </button>
        ))}
      </div>

      {/* Player */}
      <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <p className="text-gray-400">All servers failed. Please try again later.</p>
          </div>
        ) : (
          <iframe
            key={`${provider.id}-${imdbId}-${season}-${episode}`}
            src={url}
            className="w-full h-full border-0"
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture"
            onError={tryNext}
          />
        )}
      </div>

      {current < active.length - 1 && (
        <button onClick={tryNext}
          className="mt-2 text-xs text-gray-500 hover:text-purple-400 transition-colors flex items-center gap-1">
          <ChevronDown className="w-3 h-3" /> Try next server
        </button>
      )}
    </div>
  )
}
