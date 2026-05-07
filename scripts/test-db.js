import dotenv from "dotenv";
import { Client } from "pg";

dotenv.config();

const url = process.env.DATABASE_URL;

if (!url) {
     console.error("DATABASE_URL not set. Copy .env.local.example to .env.local and fill values.");
     process.exit(1);
}

const client = new Client({ connectionString: url });

(async () => {
     try {
          await client.connect();
          const res = await client.query("SELECT now() as now");
          console.log("Connected, current time:", res.rows[0].now);
          await client.end();
          process.exit(0);
     } catch (err) {
          console.error("DB connection failed:", err.message || err);
          process.exit(2);
     }
})();
