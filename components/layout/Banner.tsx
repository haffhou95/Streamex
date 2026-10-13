'use client'
import { useState } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
import { Banner as BannerType } from '@/types'

export default function Banner({ banner }: { banner: BannerType }) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null
  return (
    <div style={{ background: banner.bgColor, color: banner.textColor }}
      className="relative w-full px-4 py-3 flex items-center justify-center gap-4 text-center z-50">
      <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
        <span className="font-bold text-sm">{banner.text}</span>
        <span className="text-xs opacity-80">{banner.subtext}</span>
        {banner.link && (
          <Link href={banner.link} target="_blank"
            className="text-xs font-bold underline underline-offset-2 whitespace-nowrap">
            {banner.linkText}
          </Link>
        )}
      </div>
      {banner.dismissable && (
        <button onClick={() => setDismissed(true)}
          className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
