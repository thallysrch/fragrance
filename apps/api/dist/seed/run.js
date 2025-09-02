import { PrismaClient, Gender } from '@prisma/client';
export async function runSeed(prisma) {
    const data = [
        { name: 'Bleu de Chanel', brand: 'Chanel', description: 'Amadeirado aromático, fresco e elegante', notes: ['cítrico', 'amadeirado', 'incenso'], price: 899.9, gender: Gender.MASCULINO, imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop', durability: 10 },
        { name: 'Sauvage', brand: 'Dior', description: 'Fresco especiado com ambroxan marcante', notes: ['cítrico', 'ambroxan', 'pimenta'], price: 799.9, gender: Gender.MASCULINO, imageUrl: 'https://images.unsplash.com/photo-1585386959984-a4155223168f?q=80&w=800&auto=format&fit=crop', durability: 9 },
        { name: 'Eros', brand: 'Versace', description: 'Aromático doce com hortelã e maçã verde', notes: ['doce', 'hortelã', 'baunilha'], price: 549.9, gender: Gender.MASCULINO, imageUrl: 'https://images.unsplash.com/photo-1585386959984-a4155223168f?q=80&w=800&auto=format&fit=crop', durability: 8 },
        { name: 'Good Girl', brand: 'Carolina Herrera', description: 'Oriental floral com cacau e baunilha', notes: ['baunilha', 'cacau', 'floral'], price: 629.9, gender: Gender.FEMININO, imageUrl: 'https://images.unsplash.com/photo-1599733589046-10ebf0d9b0eb?q=80&w=800&auto=format&fit=crop', durability: 9 },
        { name: 'Cítrico Urbano', brand: 'Essenza Brasil', description: 'Contratipo inspirado em Dior Sauvage com toque cítrico', notes: ['cítrico', 'ambroxan'], price: 129.9, gender: Gender.UNISSEX, imageUrl: 'https://images.unsplash.com/photo-1491333540236-ef9a3f0fb94b?q=80&w=800&auto=format&fit=crop', durability: 7 },
        { name: 'Azul Clássico', brand: 'Rio Fragrances', description: 'Alternativo com a vibe de Bleu de Chanel', notes: ['amadeirado', 'incenso'], price: 139.9, gender: Gender.MASCULINO, imageUrl: 'https://images.unsplash.com/photo-1470309864661-68328b2cd0a5?q=80&w=800&auto=format&fit=crop', durability: 8 },
    ];
    const created = {};
    for (const p of data) {
        const found = await prisma.perfume.findFirst({ where: { name: p.name, brand: p.brand } });
        if (found) {
            created[p.name] = found.id;
            continue;
        }
        const c = await prisma.perfume.create({ data: p });
        created[p.name] = c.id;
    }
    // Similarities
    const bleuId = created['Bleu de Chanel'];
    const sauvageId = created['Sauvage'];
    const erosId = created['Eros'];
    const goodId = created['Good Girl'];
    const citricoId = created['Cítrico Urbano'];
    const azulId = created['Azul Clássico'];
    const simPairs = [
        { originalPerfumeId: bleuId, alternativePerfumeId: azulId, similarityScore: 0.86 },
        { originalPerfumeId: sauvageId, alternativePerfumeId: citricoId, similarityScore: 0.82 },
        { originalPerfumeId: erosId, alternativePerfumeId: citricoId, similarityScore: 0.65 },
        { originalPerfumeId: goodId, alternativePerfumeId: citricoId, similarityScore: 0.5 },
    ];
    for (const s of simPairs) {
        const exists = await prisma.similarity.findFirst({ where: { originalPerfumeId: s.originalPerfumeId, alternativePerfumeId: s.alternativePerfumeId } });
        if (!exists)
            await prisma.similarity.create({ data: s });
    }
    // Minimal reviews
    const u = await prisma.user.upsert({ where: { email: 'seed@example.com' }, update: { name: 'Seed' }, create: { name: 'Seed', email: 'seed@example.com', passwordHash: 'x', favoriteNotes: [] } });
    const r1 = await prisma.review.findFirst({ where: { userId: u.id, perfumeId: azulId } });
    if (!r1)
        await prisma.review.create({ data: { userId: u.id, perfumeId: azulId, rating: 5, comment: 'Lembra bastante o Bleu!' } });
    const r2 = await prisma.review.findFirst({ where: { userId: u.id, perfumeId: citricoId } });
    if (!r2)
        await prisma.review.create({ data: { userId: u.id, perfumeId: citricoId, rating: 4, comment: 'Excelente custo-benefício.' } });
}
//# sourceMappingURL=run.js.map