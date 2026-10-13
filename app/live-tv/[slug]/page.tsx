import { notFound } from 'next/navigation'
import { getChannels } from '../../../data/db'
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Radio } from 'lucide-react'
import Image from 'next/image'
type Props = { params: { slug: string } }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ch = getChannels().find(c => c.slug === params.slug)
  if (!ch) return {}
  return { title: `Watch ${ch.name} Live`, robots: { index: false, follow: false } }
}
export default function WatchChannelPage({ params }: Props) {
  const channel = getChannels().find(c => c.slug === params.slug)
  if (!channel) notFound()
  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Link href="/live-tv" className="flex items-center gap-1 text-gray-400 hover:text-white text-sm"><ArrowLeft className="w-4 h-4" /> Live TV</Link>
        <div className="flex items-center gap-2">
          {channel.logo && <div className="relative w-6 h-6 rounded overflow-hidden"><Image src={channel.logo} alt={channel.name} fill className="object-contain" /></div>}
          <h1 className="text-lg font-bold text-white">{channel.name}</h1>
          <span className="flex items-center gap-1 text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-semibold"><span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE</span>
        </div>
      </div>
      <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden">
        <iframe src={channel.streamUrl} className="w-full h-full border-0" allowFullScreen allow="autoplay; fullscreen" />
      </div>
    </div>
  )
}
