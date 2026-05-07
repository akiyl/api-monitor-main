import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "./prisma/generated/client";
import fs from "fs";
import process from "process";
import { generateApiKey } from "./lib/apiKey";

const prisma = new PrismaClient();

// Load seed data
let dataRaw = null;
try {
  dataRaw = JSON.parse(fs.readFileSync("./info.json", "utf8"));
} catch (err) {
  console.error("Could not parse info.json:", err.message || err);
  process.exit(1);
}
const data = Array.isArray(dataRaw) ? dataRaw : [dataRaw];
// const itineraryData = JSON.parse(fs.readFileSync("./prisma/itnary.json", "utf8"));

function randomHeight() {
  const heights = [250, 200, 600];
  return heights[Math.floor(Math.random() * heights.length)];
}

async function seedProjects() {
  const now = new Date();

  const withTimestamps = data.map((d) => ({
    ...d,
    apiKey:
      d.apiKey && !d.apiKey.startsWith("tf_xxxxx")
        ? d.apiKey
        : generateApiKey(),
    userId: d.userId ?? process.env.SEED_USER_ID ?? "seed_user",
    createdAt: now,
  }));

  console.log(`⛰️  Inserting ${withTimestamps.length} destinations...`);

  try {
    const inserted = await prisma.project.createMany({
      data: withTimestamps,
    });
    console.log(`✅ Inserted ${inserted.count} treks successfully!`);
  } catch (err: any) {
    // If record exists, silently continue (duplicates are okay during seeding)
    if (err.code === "P2002") {
      console.log(`✅ Project already exists, skipping...`);
    } else {
      throw err;
    }
  }
}

async function seed() {
  try {
    await seedProjects();
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
