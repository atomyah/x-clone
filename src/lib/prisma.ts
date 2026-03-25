import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// ランタイムは DATABASE_URL（Transaction pooler / 6543）を優先する。
// DIRECT_URL（db.*.supabase.co:5432）は AAAA 解決され、WSL 等で IPv6 未到達（ENETUNREACH）になりやすい。
// マイグレーションは prisma.config.ts の datasource が DIRECT_URL を使用する。
const databaseUrl = process.env.DATABASE_URL || process.env.DIRECT_URL;
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

