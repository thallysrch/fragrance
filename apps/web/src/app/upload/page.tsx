"use client"
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { API_BASE_URL } from '@/lib/api'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return
    const form = new FormData()
    form.append('image', file)
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/upload`, { method: 'POST', body: form })
      const json = await res.json()
      setResult(json)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold">Identificar perfume por imagem</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <button disabled={!file || loading} className="px-4 py-2 rounded bg-rose-600 text-white disabled:opacity-50">
          {loading ? 'Processando...' : 'Enviar'}
        </button>
      </form>
      {result && (
        <div className="mt-8">
          <h2 className="font-semibold">Detectado</h2>
          <div className="text-sm text-gray-600">Marca: {result.detected?.brand ?? '—'} {result.detected?.name ? `• ${result.detected.name}` : ''}</div>
          <h3 className="mt-4 font-semibold">Possíveis correspondências</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-3">
            {result.matches?.map((p: any) => (
              <Link key={p.id} href={`/product/${p.id}`} className="border rounded-lg overflow-hidden hover:shadow">
                <div className="relative aspect-square bg-gray-100">
                  {p.imageUrl ? <Image src={p.imageUrl} alt={p.name} fill className="object-cover" /> : null}
                </div>
                <div className="p-3">
                  <div className="text-sm text-gray-500">{p.brand}</div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-rose-700 font-semibold mt-1">R$ {Number(p.price).toFixed(2)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}

