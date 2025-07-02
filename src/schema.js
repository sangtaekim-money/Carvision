import { integer, json, pgTable, serial, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless"; // Use Neon client directly

// Car Listing Table
export const CarListing = pgTable("car_listing", {
  id: serial("id").primaryKey(),
  comment: varchar("comment", 1000),
  sellingPrice: varchar("selling_price", 255),
  fuelType: varchar("fuel_type", 255),
  make: varchar("make", 255),
  year: integer("year"),
  mileage: integer("mileage"),
  category: varchar("category", 255),
  pictures: json("pictures"), // Keep pictures for image uploads
  soldOut: boolean("sold_out"),
  createdAt: varchar("created_at", 255),
  updatedAt: varchar("updated_at", 255),
});

// Anonymous Comments Table
export const AnonymousComments = pgTable("anonymous_comments", {
  id: serial("id").primaryKey(),
  carId: integer("car_id").notNull(), // Foreign key to associate with a car
  comment: varchar("comment", 255).notNull(), // Limit to 40 words
  likes: integer("likes").default(0), // Track likes for each comment
  createdAt: timestamp("created_at").defaultNow(), // Timestamp for when the comment was added
});

// Create a Neon client for the database connection
const client = neon("postgresql://neondb_owner:npg_Mv52VZHBFRjr@ep-snowy-cake-a1vstnv2-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require");

export const db = drizzle(client);
