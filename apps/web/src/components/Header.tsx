"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'

export function Header() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    function refresh() {
      try {
        const s = localStorage.getItem('cart')
        const items: { quantity: number }[] = s ? JSON.parse(s) : []
        setCount(items.reduce((n, i) => n + i.quantity, 0))
      } catch {}
    }
    refresh()
    const id = setInterval(refresh, 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <header className="border-b bg-white/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold">Perfume AI</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/catalog" className="hover:underline">Catálogo</Link>
          <Link href="/upload" className="hover:underline">Upload</Link>
          <Link href="/cart" className="hover:underline">Carrinho ({count})</Link>
        </nav>
      </div>
    </header>
  )
}

