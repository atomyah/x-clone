import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // マイグレーション用は直接接続を使用（poolerではなくポート5432）
    url: process.env["DIRECT_URL"] || process.env["DATABASE_URL"],
  },
});
