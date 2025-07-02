import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

const client = neon("postgresql://neondb_owner:npg_Mv52VZHBFRjr@ep-snowy-cake-a1vstnv2-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require");
const db = drizzle(client);

async function migrate() {
  try {
    console.log("Starting migration...");

    // Alter the selling_price column to integer
    await db.execute(`
      ALTER TABLE car_listing
      ALTER COLUMN selling_price TYPE INTEGER USING selling_price::integer;
    `);

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    client.end(); // Close the database connection
  }
}

migrate();