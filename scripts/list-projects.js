import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "./app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const prisma = new PrismaClient({
     adapter: new PrismaPg(new Pool({ connectionString: process.env.DATABASE_URL })),
});

async function main() {
     const projects = await prisma.project.findMany({ select: { id: true, name: true, apiKey: true } });
     if (!projects || projects.length === 0) {
          console.log("No projects found.");
          return;
     }
     console.table(projects);
}

main()
     .catch((e) => {
          console.error("Error listing projects:", e);
          process.exit(1);
     })
     .finally(async () => {
          await prisma.$disconnect();
          process.exit(0);
     });
