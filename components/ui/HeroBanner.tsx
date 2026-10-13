'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Play, Info, Star } from 'lucide-react'
import { Movie, Series } from '@/types'

export default function HeroBanner({ items }: { items: (Movie | Series)[] }) {
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    if (items.length <= 1) return
    const t = setInterval(() => setCurrent(i => (i + 1) % items.length), 6000)
    return () => clearInterval(t)
  }, [items.length])

  if (!items.length) return null
  const item = items[current]
  const href = item.type === 'movie' ? `/movies/${item.slug}` : `/series/${item.slug}`
  const watchHref = item.type === 'movie' ? `/watch/movie/${item.imdbId}` : `/watch/tv/${item.imdbId}/1/1`

  return (
    <div className="relative w-full aspect-[16/9] max-h-[500px] rounded-2xl overflow-hidden">
      <Image src={item.backdrop} alt={item.title} fill className="object-cover" priority sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 p-6 max-w-lg">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold bg-purple-600 px-2 py-0.5 rounded-full">
            {item.type === 'movie' ? 'Movie' : 'Series'}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-sm text-yellow-400 font-semibold">{item.rating}</span>
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white mb-2 leading-tight">{item.title}</h1>
        <p className="text-sm text-gray-300 line-clamp-2 mb-4">{item.description}</p>
        <div className="flex items-center gap-3">
          <Link href={watchHref}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            <Play className="w-4 h-4 fill-white" /> Watch Now
          </Link>
          <Link href={href}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm backdrop-blur-sm">
            <Info className="w-4 h-4" /> Details
          </Link>
        </div>
      </div>
      {items.length > 1 && (
        <div className="absolute bottom-4 right-4 flex gap-1.5">
          {items.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-purple-500 w-5' : 'bg-white/30'}`} />
          ))}
        </div>
      )}
    </div>
  )
}
