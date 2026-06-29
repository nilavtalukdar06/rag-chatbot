import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";

export const pool = mysql.createPool(process.env.DATABASE_URL!);

export const db = drizzle({ client: pool });
