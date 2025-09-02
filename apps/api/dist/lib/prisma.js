import { PrismaClient } from '@prisma/client';
export const prisma = globalThis.prismaGlobal ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') {
    globalThis.prismaGlobal = prisma;
}
export default prisma;
//# sourceMappingURL=prisma.js.map