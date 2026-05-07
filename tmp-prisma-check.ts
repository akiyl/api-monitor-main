import { prisma } from "./lib/prisma.js";

async function main() {
  try {
    const projects = await prisma.project.findMany({ take: 1 });
    console.log("OK", projects.length);
  } catch (error) {
    console.error("ERR", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
