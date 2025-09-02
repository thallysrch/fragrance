import { PrismaClient, Gender } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    await prisma.review.deleteMany();
    await prisma.similarity.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.perfume.deleteMany();
    await prisma.user.deleteMany();
    const bleu = await prisma.perfume.create({ data: { name: 'Bleu de Chanel', brand: 'Chanel', description: 'Amadeirado aromático, fresco e elegante', notes: ['cítrico', 'amadeirado', 'incenso'], price: 899.9, gender: Gender.MASCULINO, imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop', durability: 10 } });
    const sauvage = await prisma.perfume.create({ data: { name: 'Sauvage', brand: 'Dior', description: 'Fresco especiado com ambroxan marcante', notes: ['cítrico', 'ambroxan', 'pimenta'], price: 799.9, gender: Gender.MASCULINO, imageUrl: 'https://images.unsplash.com/photo-1585386959984-a4155223168f?q=80&w=800&auto=format&fit=crop', durability: 9 } });
    const eros = await prisma.perfume.create({ data: { name: 'Eros', brand: 'Versace', description: 'Aromático doce com hortelã e maçã verde', notes: ['doce', 'hortelã', 'baunilha'], price: 549.9, gender: Gender.MASCULINO, imageUrl: 'https://images.unsplash.com/photo-1585386959984-a4155223168f?q=80&w=800&auto=format&fit=crop', durability: 8 } });
    const good = await prisma.perfume.create({ data: { name: 'Good Girl', brand: 'Carolina Herrera', description: 'Oriental floral com cacau e baunilha', notes: ['baunilha', 'cacau', 'floral'], price: 629.9, gender: Gender.FEMININO, imageUrl: 'https://images.unsplash.com/photo-1599733589046-10ebf0d9b0eb?q=80&w=800&auto=format&fit=crop', durability: 9 } });
    const citrico = await prisma.perfume.create({ data: { name: 'Cítrico Urbano', brand: 'Essenza Brasil', description: 'Contratipo inspirado em Dior Sauvage com toque cítrico', notes: ['cítrico', 'ambroxan'], price: 129.9, gender: Gender.UNISSEX, imageUrl: 'https://images.unsplash.com/photo-1491333540236-ef9a3f0fb94b?q=80&w=800&auto=format&fit=crop', durability: 7 } });
    const azul = await prisma.perfume.create({ data: { name: 'Azul Clássico', brand: 'Rio Fragrances', description: 'Alternativo com a vibe de Bleu de Chanel', notes: ['amadeirado', 'incenso'], price: 139.9, gender: Gender.MASCULINO, imageUrl: 'https://images.unsplash.com/photo-1470309864661-68328b2cd0a5?q=80&w=800&auto=format&fit=crop', durability: 8 } });
    await prisma.similarity.createMany({
        data: [
            { originalPerfumeId: bleu.id, alternativePerfumeId: azul.id, similarityScore: 0.86 },
            { originalPerfumeId: sauvage.id, alternativePerfumeId: citrico.id, similarityScore: 0.82 },
            { originalPerfumeId: eros.id, alternativePerfumeId: citrico.id, similarityScore: 0.65 },
            { originalPerfumeId: good.id, alternativePerfumeId: citrico.id, similarityScore: 0.5 },
        ],
        skipDuplicates: true,
    });
    await prisma.review.createMany({
        data: [
            { userId: 'seed-u1', perfumeId: azul.id, rating: 5, comment: 'Lembra bastante o Bleu!' },
            { userId: 'seed-u1', perfumeId: citrico.id, rating: 4, comment: 'Excelente custo-benefício.' },
        ],
        skipDuplicates: true,
    });
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map