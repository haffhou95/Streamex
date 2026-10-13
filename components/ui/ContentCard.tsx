import Link from 'next/link'
import Image from 'next/image'
import { Star, Play } from 'lucide-react'
import { Movie, Series } from '@/types'

type Props = { item: Movie | Series }

export default function ContentCard({ item }: Props) {
  const href = item.type === 'movie' ? `/movies/${item.slug}` : `/series/${item.slug}`
  return (
    <Link href={href} className="group relative block rounded-xl overflow-hidden bg-[#1a1a1a] border border-white/5 hover:border-purple-500/40 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-900/20">
      <div className="relative aspect-[2/3] w-full">
        <Image src={item.poster} alt={item.title} fill className="object-cover" sizes="(max-width:640px)50vw,25vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
          <div className="bg-purple-600 rounded-full p-3">
            <Play className="w-5 h-5 text-white fill-white" />
          </div>
        </div>
      </div>
      <div className="p-2.5">
        <p className="text-xs font-semibold text-white truncate">{item.title}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-500">{item.year}</span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-gray-400">{item.rating}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
