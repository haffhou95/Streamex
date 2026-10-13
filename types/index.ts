export interface Movie {
  id: string
  imdbId: string
  tmdbId?: string
  title: string
  slug: string
  description: string
  poster: string
  backdrop: string
  year: number
  rating: number
  genres: string[]
  cast: string[]
  director: string
  duration: number // minutes
  type: 'movie'
  featured: boolean
  noindex: boolean
  customTitle?: string
  customDescription?: string
  focusKeyword?: string
  customSlug?: string
  createdAt: string
  updatedAt: string
}

export interface Series {
  id: string
  imdbId: string
  tmdbId?: string
  title: string
  slug: string
  description: string
  poster: string
  backdrop: string
  year: number
  rating: number
  genres: string[]
  cast: string[]
  director: string
  seasons: number
  episodes: Episode[]
  type: 'series'
  featured: boolean
  noindex: boolean
  customTitle?: string
  customDescription?: string
  focusKeyword?: string
  customSlug?: string
  createdAt: string
  updatedAt: string
}

export interface Episode {
  season: number
  episode: number
  title: string
  description?: string
  duration?: number
}

export interface LiveChannel {
  id: string
  name: string
  slug: string
  logo: string
  streamUrl: string
  category: 'sports' | 'news' | 'entertainment' | 'kids' | 'movies' | 'music' | 'other'
  country: string
  countryFlag: string
  featured: boolean
  active: boolean
  createdAt: string
}

export interface EmbedProvider {
  id: string
  name: string
  movieUrl: string   // e.g. https://vidsrc.to/embed/movie/{imdb_id}
  tvUrl: string      // e.g. https://vidsrc.to/embed/tv/{imdb_id}/{season}/{episode}
  active: boolean
  order: number
  isCustom: boolean
}

export interface Banner {
  active: boolean
  text: string
  subtext: string
  link: string
  linkText: string
  bgColor: string
  textColor: string
  dismissable: boolean
}

export interface SiteSettings {
  siteName: string
  siteDescription: string
  siteUrl: string
  tmdbApiKey: string
  adminUsername: string
  adminPasswordHash: string
  banner: Banner
}

export interface TMDBMovie {
  id: number
  imdb_id: string
  title: string
  overview: string
  poster_path: string
  backdrop_path: string
  release_date: string
  vote_average: number
  genres: { id: number; name: string }[]
  credits: {
    cast: { name: string }[]
    crew: { name: string; job: string }[]
  }
  runtime: number
}

export interface TMDBSeries {
  id: number
  external_ids: { imdb_id: string }
  name: string
  overview: string
  poster_path: string
  backdrop_path: string
  first_air_date: string
  vote_average: number
  genres: { id: number; name: string }[]
  credits: {
    cast: { name: string }[]
    crew: { name: string; job: string }[]
  }
  number_of_seasons: number
  seasons: { season_number: number; episode_count: number }[]
}
