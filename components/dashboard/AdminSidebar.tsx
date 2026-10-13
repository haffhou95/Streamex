'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Film, Tv, Radio, Server, Settings, Tag, Megaphone, LogOut } from 'lucide-react'

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/movies', label: 'Movies', icon: Film },
  { href: '/admin/series', label: 'Series', icon: Tv },
  { href: '/admin/live-tv', label: 'Live TV', icon: Radio },
  { href: '/admin/providers', label: 'Providers', icon: Server },
  { href: '/admin/banner', label: 'IPTV Banner', icon: Megaphone },
  { href: '/admin/seo', label: 'SEO', icon: Tag },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-60 bg-black/60 border-r border-white/10 z-50 pt-6 pb-4 px-3">
      <Link href="/admin" className="flex items-center justify-center mb-8 px-2">
        <span className="text-xl font-black gradient-text">Admin Panel</span>
      </Link>
      <nav className="flex flex-col gap-1 flex-1">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                       : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}>
              <Icon className="w-4 h-4 shrink-0" />{label}
            </Link>
          )
        })}
      </nav>
      <form action="/api/admin/logout" method="POST">
        <button type="submit" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all mt-2">
          <LogOut className="w-4 h-4 shrink-0" /> Logout
        </button>
      </form>
    </aside>
  )
}
