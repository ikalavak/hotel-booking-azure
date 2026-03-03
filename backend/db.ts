import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const config: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || "",
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT) || 1433,
  options: {
    encrypt: true,               // required for Azure SQL
    trustServerCertificate: false
  },
};

export const connectDB = async () => {
  try {
    await sql.connect(config);
    console.log("✅ Connected to Azure SQL Database");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
};

export default sql;