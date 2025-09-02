"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { fetchJson } from '@/lib/api'

const ALL_NOTES = ['baunilha','cítrico','amadeirado','floral','ambroxan','pimenta','incenso','doce','hortelã','cacau']

type Perfume = { id: string; name: string; brand: string }

export default function ProfilePage() {
  const [notes, setNotes] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<Perfume[]>([])

  useEffect(() => {
    try {
      const s = localStorage.getItem('preferred_notes')
      if (s) setNotes(JSON.parse(s))
    } catch {}
  }, [])

  useEffect(() => {
    async function load() {
      if (notes.length === 0) { setSuggestions([]); return }
      const qs = new URLSearchParams({ notes: notes.join(',') })
      const res = await fetchJson<Perfume[]>(`/perfumes?${qs.toString()}`)
      setSuggestions(res)
    }
    load()
  }, [notes])

  function toggle(n: string) {
    const next = notes.includes(n) ? notes.filter((x) => x !== n) : [...notes, n]
    setNotes(next)
    localStorage.setItem('preferred_notes', JSON.stringify(next))
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold">Perfil Olfativo</h1>
      <p className="text-gray-600 mt-2">Selecione suas notas favoritas e veja sugestões.</p>
      <div className="flex flex-wrap gap-2 mt-4">
        {ALL_NOTES.map((n) => (
          <button key={n} onClick={() => toggle(n)} className={`px-3 py-1 rounded border ${notes.includes(n) ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-gray-800'}`}>{n}</button>
        ))}
      </div>
      <h2 className="mt-8 font-semibold">Sugestões</h2>
      <ul className="mt-3 space-y-2">
        {suggestions.map((p) => (
          <li key={p.id} className="border rounded p-3 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">{p.brand}</div>
              <div className="font-medium">{p.name}</div>
            </div>
            <Link href={`/product/${p.id}`} className="text-rose-600 underline">Ver</Link>
          </li>
        ))}
      </ul>
    </main>
  )
}