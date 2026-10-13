'use client'
import { useEffect, useState } from 'react'
import { Movie } from '../../../types/index'
import { Upload, Trash2 } from 'lucide-react'
export default function AdminMovies() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [imdbIds, setImdbIds] = useState('')
  const [type, setType] = useState<'auto'|'movie'|'series'>('auto')
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState('')
  const load = async () => {
    const res = await fetch('/api/admin/movies', { credentials: 'include' })
    const data = await res.json()
    setMovies(data.movies || [])
  }
  useEffect(() => { load() }, [])
  const bulkImport = async () => {
    if (!imdbIds.trim()) return
    setBusy(true); setResult('')
    const ids = imdbIds.split(/[\s,\n]+/).filter(Boolean)
    const res = await fetch('/api/admin/import', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ imdbIds: ids, type }) })
    const data = await res.json()
    const summary = data.results?.map((r: any) => `${r.status === 'imported' ? '✅' : r.status === 'skipped' ? '⏭️' : '❌'} ${r.imdbId}${r.title ? ` — ${r.title}` : ''}${r.error ? ` (${r.error})` : ''}`).join('\n')
    setResult(summary || 'Done')
    setBusy(false); load()
  }
  const del = async (id: string) => {
    if (!confirm('Delete this movie?')) return
    await fetch(`/api/admin/movies?id=${id}`, { method: 'DELETE', credentials: 'include' })
    load()
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-white">Movies</h1>
        <span className="text-sm text-gray-500">{movies.length} titles</span>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
        <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Upload className="w-4 h-4" /> Bulk Import by IMDB ID</h2>
        <div className="flex gap-3 mb-3">
          {(['auto','movie','series'] as const).map(t => (
            <button key={t} onClick={() => setType(t)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${type === t ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>{t}</button>
          ))}
        </div>
        <textarea value={imdbIds} onChange={e => setImdbIds(e.target.value)} placeholder={"tt0111161\ntt0068646\ntt0468569"} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-gray-200 min-h-24 mb-3 focus:outline-none focus:border-purple-500" />
        <button onClick={bulkImport} disabled={busy} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-xl text-sm disabled:opacity-50">
          {busy ? 'Importing...' : 'Import'}
        </button>
        {result && <pre className="mt-3 bg-black/60 border border-white/10 rounded-xl p-3 text-xs text-gray-400 overflow-auto max-h-48 whitespace-pre-wrap">{result}</pre>}
      </div>
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-gray-400">
            <tr><th className="text-left p-3">Title</th><th className="text-left p-3">IMDB</th><th className="text-left p-3">Year</th><th className="text-left p-3">Rating</th><th className="text-right p-3">Actions</th></tr>
          </thead>
          <tbody>
            {movies.length === 0 ? (
              <tr><td colSpan={5} className="p-6 text-center text-gray-600">No movies yet — use bulk import above</td></tr>
            ) : movies.map(m => (
              <tr key={m.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                <td className="p-3 text-white">{m.title}</td>
                <td className="p-3 text-gray-400 font-mono text-xs">{m.imdbId}</td>
                <td className="p-3 text-gray-400">{m.year}</td>
                <td className="p-3 text-gray-400">{m.rating}</td>
                <td className="p-3 text-right"><button onClick={() => del(m.id)} className="text-gray-500 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4 inline" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
