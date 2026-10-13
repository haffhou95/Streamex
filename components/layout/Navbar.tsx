'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Menu, X, Home, Film, Tv, Radio } from 'lucide-react'

const links = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/movies', label: 'Movies', icon: Film },
  { href: '/series', label: 'Series', icon: Tv },
  { href: '/live-tv', label: 'Live TV', icon: Radio },
]

export default function Navbar({ siteName }: { siteName: string }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-xl border-b border-white/10 px-4 h-14 flex items-center justify-between lg:hidden">
        <Link href="/" className="text-xl font-black gradient-text">{siteName}</Link>
        <div className="flex items-center gap-3">
          <Link href="/search"><Search className="w-5 h-5 text-gray-400" /></Link>
          <button onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5 text-gray-400" /> : <Menu className="w-5 h-5 text-gray-400" />}
          </button>
        </div>
      </header>
      {open && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/95 pt-14 px-4 flex flex-col gap-2">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href))
            return (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  active ? 'bg-purple-600/20 text-purple-400' : 'text-gray-300 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />{label}
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}
