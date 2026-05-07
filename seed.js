import dotenv from "dotenv";
dotenv.config();
import { PrismaClient } from "./app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import fs from "fs";
import process from "process";

const prisma = new PrismaClient({
     adapter: new PrismaPg(new Pool({ connectionString: process.env.DATABASE_URL })),
});


// Load seed data
const data = JSON.parse(fs.readFileSync("./info.json", "utf8"));
const itineraryData = JSON.parse(fs.readFileSync("./prisma/itnary.json", "utf8"));

function randomHeight() {
     const heights = [250, 200, 600];
     return heights[Math.floor(Math.random() * heights.length)];
}

async function seedProjects() {
     const now = new Date();

     // Add timestamps to each record
     const withTimestamps = data.map((d) => ({
          ...d,
          height: randomHeight(),
          createdAt: now,
          updatedAt: now,
     }));

     console.log(`⛰️  Inserting ${withTimestamps.length} destinations...`);

     const inserted = await prisma.project.createMany({
          data: withTimestamps,
          skipDuplicates: true,
     });

     console.log(`✅ Inserted ${inserted.count} treks successfully!`);
}

// async function seedItineraries() {
//      console.log(`📌 Seeding ${itineraryData.length} itinerary records...`);

//      let insertedCount = 0;
//      for (const item of itineraryData) {
//           const exists = await prisma.itienary.findFirst({ where: { trek: item.trek } });
//           if (exists) continue;

//           await prisma.itienary.create({ data: item });
//           insertedCount += 1;
//      }

//      console.log(`✅ Inserted ${insertedCount} itinerary records.`);
// }

async function seed() {
     try {
          await seedProjects();
          // await seedItineraries();
     } catch (error) {
          console.error("❌ Error inserting:", error.message || error);
          throw error;
     }
}

seed()
     .catch((e) => {
          console.error("❌ Unexpected error:", e);
          process.exit(1);
     })
     .finally(async () => {
          await prisma.$disconnect();
          process.exit(0);
     });
