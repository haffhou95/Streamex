import fs from 'fs'
import path from 'path'
import { Movie, Series, LiveChannel, EmbedProvider, SiteSettings } from '@/types'

const DATA_DIR = path.join(process.cwd(), 'data')

const FILES = {
  movies: path.join(DATA_DIR, 'movies.json'),
  series: path.join(DATA_DIR, 'series.json'),
  channels: path.join(DATA_DIR, 'channels.json'),
  providers: path.join(DATA_DIR, 'providers.json'),
  settings: path.join(DATA_DIR, 'settings.json'),
}

function read<T>(file: string, fallback: T): T {
  try {
    if (!fs.existsSync(file)) return fallback
    return JSON.parse(fs.readFileSync(file, 'utf-8')) as T
  } catch {
    return fallback
  }
}

function write<T>(file: string, data: T): void {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8')
}

// Movies
export const getMovies = (): Movie[] => read(FILES.movies, [])
export const saveMovies = (data: Movie[]) => write(FILES.movies, data)
export const getMovieBySlug = (slug: string) => getMovies().find(m => m.slug === slug || m.customSlug === slug)
export const getMovieByImdb = (imdbId: string) => getMovies().find(m => m.imdbId === imdbId)

// Series
export const getSeries = (): Series[] => read(FILES.series, [])
export const saveSeries = (data: Series[]) => write(FILES.series, data)
export const getSeriesBySlug = (slug: string) => getSeries().find(s => s.slug === slug || s.customSlug === slug)
export const getSeriesByImdb = (imdbId: string) => getSeries().find(s => s.imdbId === imdbId)

// Live Channels
export const getChannels = (): LiveChannel[] => read(FILES.channels, [])
export const saveChannels = (data: LiveChannel[]) => write(FILES.channels, data)

// Embed Providers
export const getProviders = (): EmbedProvider[] => {
  const saved = read<EmbedProvider[]>(FILES.providers, [])
  if (saved.length > 0) return saved
  // defaults
  return [
    { id: '1', name: 'VidSrc', movieUrl: 'https://vidsrc.to/embed/movie/{imdb_id}', tvUrl: 'https://vidsrc.to/embed/tv/{imdb_id}/{season}/{episode}', active: true, order: 1, isCustom: false },
    { id: '2', name: 'VidSrc.me', movieUrl: 'https://vidsrc.me/embed/movie?imdb={imdb_id}', tvUrl: 'https://vidsrc.me/embed/tv?imdb={imdb_id}&season={season}&episode={episode}', active: true, order: 2, isCustom: false },
    { id: '3', name: 'Embed.su', movieUrl: 'https://embed.su/embed/movie/{imdb_id}', tvUrl: 'https://embed.su/embed/tv/{imdb_id}/{season}/{episode}', active: true, order: 3, isCustom: false },
    { id: '4', name: '2Embed', movieUrl: 'https://www.2embed.cc/embed/{imdb_id}', tvUrl: 'https://www.2embed.cc/embedtv/{imdb_id}&s={season}&e={episode}', active: true, order: 4, isCustom: false },
    { id: '5', name: 'AutoEmbed', movieUrl: 'https://autoembed.co/movie/imdb/{imdb_id}', tvUrl: 'https://autoembed.co/tv/imdb/{imdb_id}-{season}-{episode}', active: true, order: 5, isCustom: false },
    { id: '6', name: 'MultiEmbed', movieUrl: 'https://multiembed.mov/?video_id={imdb_id}', tvUrl: 'https://multiembed.mov/?video_id={imdb_id}&s={season}&e={episode}', active: true, order: 6, isCustom: false },
    { id: '7', name: 'SmashyStream', movieUrl: 'https://player.smashystream.com/movie/{imdb_id}', tvUrl: 'https://player.smashystream.com/tv/{imdb_id}/{season}/{episode}', active: true, order: 7, isCustom: false },
    { id: '8', name: 'MoviesAPI', movieUrl: 'https://moviesapi.club/movie/{imdb_id}', tvUrl: 'https://moviesapi.club/tv/{imdb_id}-{season}-{episode}', active: true, order: 8, isCustom: false },
  ]
}
export const saveProviders = (data: EmbedProvider[]) => write(FILES.providers, data)

// Settings
export const getSettings = (): SiteSettings => read(FILES.settings, {
  siteName: 'StreameX',
  siteDescription: 'Discover and watch movies, TV shows and live TV for free.',
  siteUrl: 'https://yourdomain.com',
  tmdbApiKey: '',
  adminUsername: 'admin',
  adminPasswordHash: '',
  banner: {
    active: false,
    text: '📺 Premium IPTV Service',
    subtext: '10,000+ channels, movies & series. Cancel anytime.',
    link: '#',
    linkText: 'Get Started',
    bgColor: '#7b2ff7',
    textColor: '#ffffff',
    dismissable: true,
  }
})
export const saveSettings = (data: SiteSettings) => write(FILES.settings, data)
