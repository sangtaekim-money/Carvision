import pkg from "pg";
import { drizzle } from "drizzle-orm/node-postgres"; // Import drizzle for PostgreSQL

const { Pool } = pkg;

// Configure the PostgreSQL connection
const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_Mv52VZHBFRjr@ep-snowy-cake-a1vstnv2-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require", // Replace with your database credentials
});

// Initialize Drizzle ORM with the PostgreSQL connection
export const db = drizzle(pool);