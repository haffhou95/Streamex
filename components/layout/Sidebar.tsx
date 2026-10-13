'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Film, Tv, Radio, Search, Settings } from 'lucide-react'

const links = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/movies', label: 'Movies', icon: Film },
  { href: '/series', label: 'Series', icon: Tv },
  { href: '/live-tv', label: 'Live TV', icon: Radio },
  { href: '/search', label: 'Search', icon: Search },
]

export default function Sidebar({ siteName }: { siteName: string }) {
  const pathname = usePathname()
  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 z-50 pt-6 pb-4 px-3">
      <Link href="/" className="flex items-center justify-center mb-8 px-2">
        <span className="text-2xl font-black gradient-text tracking-tight">{siteName}</span>
      </Link>
      <nav className="flex flex-col gap-1 flex-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                       : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>
      <Link href="/admin"
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-white hover:bg-white/5 transition-all mt-4"
      >
        <Settings className="w-5 h-5 shrink-0" />
        Admin
      </Link>
    </aside>
  )
}
