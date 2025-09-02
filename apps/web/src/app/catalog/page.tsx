import Link from 'next/link'
import Image from 'next/image'
import { fetchJson } from '@/lib/api'

type Perfume = {
  id: string
  name: string
  brand: string
  price: number
  imageUrl?: string
}

async function getPerfumes(searchParams: URLSearchParams): Promise<Perfume[]> {
  const query = searchParams.toString()
  return await fetchJson<Perfume[]>(`/perfumes${query ? `?${query}` : ''}`)
}

export default async function CatalogPage({ searchParams }: { searchParams: { [k: string]: string | string[] | undefined } }) {
  const usp = new URLSearchParams()
  for (const [k, v] of Object.entries(searchParams)) {
    if (Array.isArray(v)) v.forEach((vv) => usp.append(k, vv))
    else if (v) usp.set(k, v)
  }
  const perfumes = await getPerfumes(usp)
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold">Catálogo</h1>
      <form action="/catalog" className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-3">
        <input className="border rounded px-3 py-2" name="search" placeholder="Buscar por nome, marca ou nota" defaultValue={usp.get('search') ?? ''} />
        <select className="border rounded px-3 py-2" name="gender" defaultValue={usp.get('gender') ?? ''}>
          <option value="">Todos</option>
          <option value="MASCULINO">Masculino</option>
          <option value="FEMININO">Feminino</option>
          <option value="UNISSEX">Unissex</option>
        </select>
        <input className="border rounded px-3 py-2" name="notes" placeholder="Notas (vírgula)" defaultValue={usp.get('notes') ?? ''} />
        <button className="px-4 py-2 rounded bg-gray-900 text-white">Filtrar</button>
      </form>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
        {perfumes.map((p) => (
          <Link key={p.id} href={`/product/${p.id}`} className="border rounded-lg overflow-hidden hover:shadow">
            <div className="aspect-square bg-gray-100 relative">
              {p.imageUrl ? (
                <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
              ) : null}
            </div>
            <div className="p-3">
              <div className="text-sm text-gray-500">{p.brand}</div>
              <div className="font-medium">{p.name}</div>
              <div className="text-rose-700 font-semibold mt-1">R$ {Number(p.price).toFixed(2)}</div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}

