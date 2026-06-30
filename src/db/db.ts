import mysql from "mysql2";
import { drizzle } from "drizzle-orm/mysql2";

export const pool = mysql.createPool({ uri: process.env.DATABASE_URL });

export const db = drizzle({ client: pool });
