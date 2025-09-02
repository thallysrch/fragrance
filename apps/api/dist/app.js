import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import multer from 'multer';
import { z } from 'zod';
import prisma from './lib/prisma.js';
import { identifyPerfumeFromImage } from './lib/vision.js';
import { runSeed } from './seed/run.js';
export function createApp() {
    const app = express();
    const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });
    app.use(cors({ origin: '*' }));
    app.use(express.json({ limit: '2mb' }));
    app.use(morgan('dev'));
    app.get('/health', (_req, res) => res.json({ ok: true }));
    app.get('/perfumes', async (req, res) => {
        try {
            const search = req.query.search ?? undefined;
            const brand = req.query.brand ?? undefined;
            const gender = req.query.gender ?? undefined;
            const notes = typeof req.query.notes === 'string' ? req.query.notes.split(',').map((s) => s.trim()).filter(Boolean) : [];
            const where = {};
            if (search) {
                where.OR = [
                    { name: { contains: search, mode: 'insensitive' } },
                    { brand: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ];
            }
            if (brand)
                where.brand = { contains: brand, mode: 'insensitive' };
            if (gender)
                where.gender = gender.toUpperCase();
            if (notes.length > 0)
                where.notes = { hasSome: notes };
            const perfumes = await prisma.perfume.findMany({ where, take: 60, orderBy: { createdAt: 'desc' } });
            res.json(perfumes);
        }
        catch {
            res.status(500).json({ error: 'Failed to list perfumes' });
        }
    });
    app.get('/perfumes/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const perfume = await prisma.perfume.findUnique({ where: { id } });
            if (!perfume)
                return res.status(404).json({ error: 'Not found' });
            const agg = await prisma.review.aggregate({ where: { perfumeId: id }, _avg: { rating: true }, _count: { rating: true } });
            res.json({ ...perfume, rating: agg._avg.rating ?? 0, ratingCount: agg._count.rating });
        }
        catch {
            res.status(500).json({ error: 'Failed to get perfume' });
        }
    });
    app.get('/recomendacoes/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const sims = await prisma.similarity.findMany({
                where: { originalPerfumeId: id },
                orderBy: { similarityScore: 'desc' },
                include: { alternative: true },
                take: 10,
            });
            res.json(sims.map((s) => ({ perfume: s.alternative, score: s.similarityScore })));
        }
        catch {
            res.status(500).json({ error: 'Failed to get recommendations' });
        }
    });
    app.post('/upload', upload.single('image'), async (req, res) => {
        try {
            if (!req.file)
                return res.status(400).json({ error: 'Missing image' });
            const vision = await identifyPerfumeFromImage(req.file);
            let matches = [];
            if (vision.brand) {
                matches = await prisma.perfume.findMany({ where: { brand: { contains: vision.brand, mode: 'insensitive' } }, take: 10 });
            }
            if (matches.length === 0 && vision.name) {
                matches = await prisma.perfume.findMany({ where: { name: { contains: vision.name, mode: 'insensitive' } }, take: 10 });
            }
            res.json({ detected: vision, matches });
        }
        catch {
            res.status(500).json({ error: 'Failed to process image' });
        }
    });
    const checkoutSchema = z.object({
        user: z.object({ name: z.string().min(1), email: z.string().email() }),
        items: z.array(z.object({ perfumeId: z.string(), quantity: z.number().int().positive() })),
        paymentMethod: z.enum(['pix', 'card', 'boleto']).default('pix'),
    });
    app.post('/checkout', async (req, res) => {
        try {
            const parsed = checkoutSchema.safeParse(req.body);
            if (!parsed.success)
                return res.status(400).json({ error: 'Invalid body' });
            const { user, items, paymentMethod } = parsed.data;
            const dbUser = await prisma.user.upsert({ where: { email: user.email }, update: { name: user.name }, create: { name: user.name, email: user.email, passwordHash: 'placeholder', favoriteNotes: [] } });
            const perfumes = await prisma.perfume.findMany({ where: { id: { in: items.map((i) => i.perfumeId) } } });
            const priceMap = new Map(perfumes.map((p) => [p.id, p.price]));
            const total = items.reduce((sum, i) => sum + Number(priceMap.get(i.perfumeId) ?? 0) * i.quantity, 0);
            const order = await prisma.order.create({ data: { userId: dbUser.id, totalAmount: total, status: 'PENDING', items: { create: items.map((i) => ({ perfumeId: i.perfumeId, quantity: i.quantity, unitPrice: Number(priceMap.get(i.perfumeId) ?? 0) })) } }, include: { items: true } });
            const paymentReference = paymentMethod === 'pix' ? `PIX-${order.id.slice(0, 8)}` : paymentMethod === 'boleto' ? `BOL-${order.id.slice(0, 8)}` : `CARD-${order.id.slice(0, 8)}`;
            res.json({ orderId: order.id, status: order.status, totalAmount: order.totalAmount, paymentReference });
        }
        catch {
            res.status(500).json({ error: 'Checkout failed' });
        }
    });
    app.get('/perfumes/:id/reviews', async (req, res) => {
        try {
            const id = req.params.id;
            const reviews = await prisma.review.findMany({ where: { perfumeId: id }, orderBy: { createdAt: 'desc' }, take: 20, include: { user: { select: { name: true, email: true } } } });
            res.json(reviews.map((r) => ({ id: r.id, rating: r.rating, comment: r.comment, createdAt: r.createdAt, user: r.user })));
        }
        catch {
            res.status(500).json({ error: 'Failed to get reviews' });
        }
    });
    const reviewSchema = z.object({ perfumeId: z.string().min(1), rating: z.number().int().min(1).max(5), comment: z.string().optional(), user: z.object({ name: z.string().min(1), email: z.string().email() }) });
    app.post('/reviews', async (req, res) => {
        try {
            const parsed = reviewSchema.safeParse(req.body);
            if (!parsed.success)
                return res.status(400).json({ error: 'Invalid body' });
            const { perfumeId, rating, comment, user } = parsed.data;
            const dbUser = await prisma.user.upsert({ where: { email: user.email }, update: { name: user.name }, create: { name: user.name, email: user.email, passwordHash: 'placeholder', favoriteNotes: [] } });
            const created = await prisma.review.create({ data: { perfumeId, rating, comment: comment ?? null, userId: dbUser.id } });
            res.json({ id: created.id });
        }
        catch {
            res.status(500).json({ error: 'Failed to create review' });
        }
    });
    app.post('/admin/seed', async (req, res) => {
        try {
            const token = req.headers['x-seed-token'];
            if (!process.env.SEED_TOKEN || token !== process.env.SEED_TOKEN)
                return res.status(401).json({ error: 'unauthorized' });
            await runSeed(prisma);
            res.json({ ok: true });
        }
        catch {
            res.status(500).json({ error: 'seed failed' });
        }
    });
    return app;
}
//# sourceMappingURL=app.js.map