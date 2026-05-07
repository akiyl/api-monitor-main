import dotenv from "dotenv";
import prismaConfig from "./prisma.config.js";

dotenv.config({ path: ".env.local" });

console.log("DATABASE_URL:", JSON.stringify(process.env.DATABASE_URL));
console.log(
  "DATABASE_PROVIDER:",
  JSON.stringify(process.env.DATABASE_PROVIDER),
);
console.log("prismaConfig:", JSON.stringify(prismaConfig, null, 2));
