import type { Metadata } from 'next'
import './globals.css'
import { getSettings } from './data/db'
import Navbar from '../components/layout/Navbar'
import Sidebar from '../components/layout/Sidebar'
import Banner from '../components/layout/Banner'

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSettings()
  return {
    title: { default: settings.siteName, template: `%s | ${settings.siteName}` },
    description: settings.siteDescription,
    metadataBase: new URL(settings.siteUrl || 'http://localhost:3000'),
    openGraph: {
      siteName: settings.siteName,
      type: 'website',
    },
    robots: { index: true, follow: true },
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = getSettings()
  return (
    <html lang="en">
      <body>
        {settings.banner.active && <Banner banner={settings.banner} />}
        <div className="flex min-h-screen">
          <Sidebar siteName={settings.siteName} />
          <div className="flex-1 flex flex-col lg:ml-64">
            <Navbar siteName={settings.siteName} />
            <main className="flex-1 p-4 lg:p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}
