import { PrismaClient } from "../prisma/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient | undefined = global.prisma;

if (!prisma) {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  if (dbUrl.startsWith("postgresql://")) {
    // Use PostgreSQL adapter
    const pool = new Pool({ connectionString: dbUrl });
    prisma = new PrismaClient({
      adapter: new PrismaPg(pool),
    });
  } else {
    // Fallback for other databases (like SQLite in development)
    prisma = new PrismaClient({
      datasources: {
        db: { url: dbUrl },
      },
    });
  }

  if (process.env.NODE_ENV !== "production") global.prisma = prisma;
}

export { prisma };
