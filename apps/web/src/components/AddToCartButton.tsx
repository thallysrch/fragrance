"use client"
import { useState } from 'react'

export function AddToCartButton({ perfumeId }: { perfumeId: string }) {
  const [added, setAdded] = useState(false)
  function add() {
    const s = typeof window !== 'undefined' ? window.localStorage.getItem('cart') : null
    let items: { perfumeId: string; quantity: number }[] = []
    try { items = s ? JSON.parse(s) : [] } catch {}
    const ex = items.find((i) => i.perfumeId === perfumeId)
    if (ex) ex.quantity += 1
    else items.push({ perfumeId, quantity: 1 })
    window.localStorage.setItem('cart', JSON.stringify(items))
    setAdded(true)
  }
  return (
    <button onClick={add} className="px-4 py-2 rounded bg-rose-600 text-white">
      {added ? 'Adicionado!' : 'Adicionar ao carrinho'}
    </button>
  )
}

