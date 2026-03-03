import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const config: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || "",
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 1433,
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

let pool: sql.ConnectionPool | null = null;

export async function getPool(): Promise<sql.ConnectionPool> {
  if (pool) return pool;
  pool = await sql.connect(config);
  return pool;
}