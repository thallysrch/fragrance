"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { API_BASE_URL, fetchJson } from '@/lib/api'

type CartItem = { perfumeId: string; quantity: number }
type Perfume = { id: string; name: string; brand: string; price: number }

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [perfumes, setPerfumes] = useState<Map<string, Perfume>>(new Map())

  useEffect(() => {
    const s = localStorage.getItem('cart')
    if (s) setItems(JSON.parse(s))
  }, [])

  useEffect(() => {
    async function load() {
      if (items.length === 0) return
      const ids = items.map((i) => i.perfumeId)
      const qs = new URLSearchParams({ search: '' })
      const list = await fetchJson<Perfume[]>(`/perfumes`)
      const map = new Map(list.filter((p) => ids.includes(p.id)).map((p) => [p.id, p]))
      setPerfumes(map)
    }
    load()
  }, [items])

  const total = items.reduce((sum, i) => sum + (perfumes.get(i.perfumeId)?.price ?? 0) * i.quantity, 0)

  function updateItem(id: string, quantity: number) {
    const next = items.map((it) => (it.perfumeId === id ? { ...it, quantity } : it)).filter((it) => it.quantity > 0)
    setItems(next)
    localStorage.setItem('cart', JSON.stringify(next))
  }

  async function checkout() {
    const body = {
      user: { name: 'Cliente', email: `cliente${Math.floor(Math.random() * 10000)}@exemplo.com` },
      items: items.map((i) => ({ perfumeId: i.perfumeId, quantity: i.quantity })),
      paymentMethod: 'pix',
    }
    const res = await fetch(`${API_BASE_URL}/checkout`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const json = await res.json()
    alert(`Pedido criado: ${json.orderId}\nTotal: R$ ${Number(json.totalAmount).toFixed(2)}\nRef: ${json.paymentReference}`)
    localStorage.removeItem('cart')
    setItems([])
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold">Carrinho</h1>
      {items.length === 0 ? (
        <div className="mt-6">Seu carrinho está vazio. <Link href="/catalog" className="text-rose-600 underline">Ver produtos</Link></div>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((it) => {
            const p = perfumes.get(it.perfumeId)
            if (!p) return null
            return (
              <div key={it.perfumeId} className="flex items-center justify-between border rounded p-3">
                <div>
                  <div className="text-sm text-gray-500">{p.brand}</div>
                  <div className="font-medium">{p.name}</div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="number" min={1} className="w-16 border rounded px-2 py-1" value={it.quantity} onChange={(e) => updateItem(it.perfumeId, Number(e.target.value))} />
                  <div className="w-24 text-right">R$ {(p.price * it.quantity).toFixed(2)}</div>
                </div>
              </div>
            )
          })}
          <div className="flex items-center justify-between mt-6">
            <div className="font-semibold">Total</div>
            <div className="font-semibold">R$ {total.toFixed(2)}</div>
          </div>
          <div className="text-right">
            <button onClick={checkout} className="px-4 py-2 rounded bg-rose-600 text-white">Finalizar compra (Pix)</button>
          </div>
        </div>
      )}
    </main>
  )
}

