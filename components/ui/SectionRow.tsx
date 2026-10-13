import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import ContentCard from './ContentCard'
import { Movie, Series } from '@/types'

type Props = {
  title: string
  items: (Movie | Series)[]
  viewAllHref?: string
}

export default function SectionRow({ title, items, viewAllHref }: Props) {
  if (!items.length) return null
  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        {viewAllHref && (
          <Link href={viewAllHref} className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 transition-colors">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {items.slice(0, 12).map(item => (
          <ContentCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}
