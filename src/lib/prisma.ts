import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// prisma.config.ts と同じ優先順位: DIRECT_URL（直接5432）→ DATABASE_URL
// ローカルで Pooler(6543) が ETIMEDOUT になり、db execute だけ通る場合はここが原因になりやすい
const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL または DIRECT_URL が設定されていません。");
}

// Prisma 7では、アダプターが必須
const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

