export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="bg-gradient-to-r from-rose-100 to-rose-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900">Descubra perfumes importados por um preço acessível</h1>
          <p className="mt-4 text-gray-600 max-w-2xl">Envie uma foto do perfume desejado e nossa IA sugere alternativas similares com excelente custo-benefício.</p>
          <div className="mt-8">
            <a href="/upload" className="inline-flex items-center px-6 py-3 rounded-md bg-rose-600 text-white hover:bg-rose-700">Enviar foto do perfume</a>
            <a href="/catalog" className="ml-3 inline-flex items-center px-6 py-3 rounded-md border border-rose-600 text-rose-700 hover:bg-rose-50">Ver catálogo</a>
            <a href="/profile" className="ml-3 inline-flex items-center px-6 py-3 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">Perfil olfativo</a>
          </div>
        </div>
      </section>
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-xl font-semibold">Destaques</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
            {[1,2,3,4].map((n) => (
              <div key={n} className="border rounded-lg p-4">
                <div className="h-36 bg-gray-100 rounded" />
                <div className="mt-3 h-4 bg-gray-200 rounded w-2/3" />
                <div className="mt-2 h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
