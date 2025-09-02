"use client"
import { useState } from 'react'
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
          <h2 className="font-medium">Resultado</h2>
          <pre className="mt-2 bg-gray-50 p-3 rounded border text-sm overflow-auto">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </main>
  )
}

