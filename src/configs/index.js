import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { pgTable, serial, varchar, integer, json } from 'drizzle-orm/pg-core';
import * as schema from './schema.js';

const sql = "postgresql://neondb_owner:npg_Mv52VZHBFRjr@ep-snowy-cake-a1vstnv2-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";


export const db = drizzle(sql, { schema });
