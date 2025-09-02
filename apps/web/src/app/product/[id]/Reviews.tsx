"use client"
import { useEffect, useState } from 'react'
import { API_BASE_URL } from '@/lib/api'

type Review = { id: string; rating: number; comment?: string; createdAt: string; user?: { name: string } }

export function Reviews({ perfumeId }: { perfumeId: string }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [email, setEmail] = useState('cliente@example.com')
  const [name, setName] = useState('Cliente')

  async function load() {
    const res = await fetch(`${API_BASE_URL}/perfumes/${perfumeId}/reviews`)
    const json = await res.json()
    setReviews(json)
  }

  useEffect(() => { load() }, [perfumeId])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    await fetch(`${API_BASE_URL}/reviews`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ perfumeId, rating, comment, user: { name, email } }) })
    setComment('')
    await load()
  }

  return (
    <section className="mt-12">
      <h2 className="font-semibold">Avaliações</h2>
      <ul className="mt-3 space-y-3">
        {reviews.map((r) => (
          <li key={r.id} className="border rounded p-3">
            <div className="text-sm text-gray-500">{r.user?.name ?? 'Anônimo'} – {new Date(r.createdAt).toLocaleDateString()}</div>
            <div className="text-yellow-600">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
            {r.comment && <div className="mt-1">{r.comment}</div>}
          </li>
        ))}
      </ul>
      <form onSubmit={submit} className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-2">
        <input className="border rounded px-3 py-2" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <select className="border rounded px-3 py-2" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
        <input className="md:col-span-3 border rounded px-3 py-2" placeholder="Comentário (opcional)" value={comment} onChange={(e) => setComment(e.target.value)} />
        <div className="md:col-span-1">
          <button className="w-full px-4 py-2 rounded bg-gray-900 text-white">Enviar avaliação</button>
        </div>
      </form>
    </section>
  )
}

