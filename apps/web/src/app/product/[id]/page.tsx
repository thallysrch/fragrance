import Image from 'next/image'
import Link from 'next/link'
import { AddToCartButton } from '@/components/AddToCartButton'
import { fetchJson } from '@/lib/api'

type Perfume = {
  id: string
  name: string
  brand: string
  description?: string
  notes: string[]
  price: number
  imageUrl?: string
  gender: 'MASCULINO' | 'FEMININO' | 'UNISSEX'
  rating?: number
  ratingCount?: number
}

type Rec = { perfume: Perfume; score: number }

async function getPerfume(id: string): Promise<Perfume> {
  return await fetchJson<Perfume>(`/perfumes/${id}`)
}
async function getRecs(id: string): Promise<Rec[]> {
  return await fetchJson<Rec[]>(`/recomendacoes/${id}`)
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const [perfume, recs] = await Promise.all([getPerfume(params.id), getRecs(params.id)])
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative aspect-square bg-gray-100 rounded">
          {perfume.imageUrl ? <Image src={perfume.imageUrl} alt={perfume.name} fill className="object-cover rounded" /> : null}
        </div>
        <div>
          <div className="text-sm text-gray-500">{perfume.brand}</div>
          <h1 className="text-2xl font-semibold">{perfume.name}</h1>
          <div className="mt-2 text-gray-600">{perfume.description}</div>
          <div className="mt-3 text-sm">Notas: {perfume.notes.join(', ')}</div>
          <div className="mt-3 text-sm">Gênero: {perfume.gender}</div>
          {typeof perfume.rating === 'number' && (
            <div className="mt-2 text-sm">Avaliação média: {perfume.rating?.toFixed(1)} ({perfume.ratingCount})</div>
          )}
          <div className="mt-6 text-rose-700 font-bold text-xl">R$ {Number(perfume.price).toFixed(2)}</div>
          <div className="mt-4">
            <AddToCartButton perfumeId={perfume.id} />
          </div>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="font-semibold">Semelhantes</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
          {recs.map((r) => (
            <Link key={r.perfume.id} href={`/product/${r.perfume.id}`} className="border rounded-lg overflow-hidden">
              <div className="relative aspect-square bg-gray-100">
                {r.perfume.imageUrl ? <Image src={r.perfume.imageUrl} alt={r.perfume.name} fill className="object-cover" /> : null}
              </div>
              <div className="p-3">
                <div className="text-sm text-gray-500">{r.perfume.brand}</div>
                <div className="font-medium">{r.perfume.name}</div>
                <div className="text-xs text-gray-500 mt-1">Similaridade: {(r.score * 100).toFixed(0)}%</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

