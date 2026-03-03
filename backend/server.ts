import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getPool } from "./db";

dotenv.config();

const app = express();
app.use(express.json());

// ✅ CORS: allow your Static Web App + local dev
const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:5173",
  process.env.FRONTEND_ORIGIN || ""
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // allow server-to-server/no-origin calls
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked for origin: ${origin}`));
    }
  })
);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

// ---------- helpers ----------
function signToken(user: { id: number; email: string; full_name: string }) {
  return jwt.sign(
    { userId: user.id, email: user.email, name: user.full_name },
    JWT_SECRET,
    { expiresIn: "2h" }
  );
}

// ---------- routes ----------
app.get("/", (_req, res) => {
  res.send("Hotel Backend Running 🚀");
});

app.get("/api/dbtest", async (_req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query("SELECT GETDATE() as now");
    res.json(result.recordset[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "DB error" });
  }
});

// Create tables if not exist
async function ensureTables() {
  const pool = await getPool();

  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
    CREATE TABLE dbo.Users (
      id INT IDENTITY(1,1) PRIMARY KEY,
      full_name NVARCHAR(200) NOT NULL,
      email NVARCHAR(255) NOT NULL UNIQUE,
      password_hash NVARCHAR(255) NOT NULL,
      created_at DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    );
  `);

  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Rooms' AND xtype='U')
    CREATE TABLE dbo.Rooms (
      id INT IDENTITY(1,1) PRIMARY KEY,
      room_number NVARCHAR(50) NOT NULL UNIQUE,
      type NVARCHAR(100) NOT NULL,
      price INT NOT NULL,
      is_available BIT NOT NULL DEFAULT 1
    );
  `);
}

// Seed rooms (demo)
app.post("/api/rooms/seed", async (_req, res) => {
  try {
    const pool = await getPool();

    await pool.request().query(`
      IF NOT EXISTS (SELECT 1 FROM dbo.Rooms)
      BEGIN
        INSERT INTO dbo.Rooms (room_number, type, price, is_available) VALUES
          ('101', 'Single', 50, 1),
          ('102', 'Double', 80, 1),
          ('201', 'Suite', 150, 1);
      END
    `);

    res.json({ message: "Rooms seeded successfully ✅" });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Seed error" });
  }
});

app.get("/api/rooms", async (_req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query("SELECT * FROM dbo.Rooms ORDER BY id DESC");
    res.json(result.recordset);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Rooms error" });
  }
});

// AUTH: Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body || {};

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: "fullName, email and password are required" });
    }

    const pool = await getPool();

    // check if email already exists
    const existing = await pool
      .request()
      .input("email", email)
      .query("SELECT TOP 1 id FROM dbo.Users WHERE email = @email");

    if (existing.recordset.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const inserted = await pool
      .request()
      .input("full_name", fullName)
      .input("email", email)
      .input("password_hash", passwordHash)
      .query(`
        INSERT INTO dbo.Users (full_name, email, password_hash)
        OUTPUT INSERTED.id, INSERTED.full_name, INSERTED.email, INSERTED.created_at
        VALUES (@full_name, @email, @password_hash)
      `);

    return res.json({ message: "Registered successfully", user: inserted.recordset[0] });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Register error" });
  }
});

// AUTH: Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const pool = await getPool();

    const result = await pool
      .request()
      .input("email", email)
      .query(`
        SELECT TOP 1 id, full_name, email, password_hash
        FROM dbo.Users
        WHERE email = @email
      `);

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result.recordset[0];

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Invalid email or password" });

    const token = signToken(user);

    return res.json({
      message: "Login successful",
      token,
      user: { id: user.id, full_name: user.full_name, email: user.email }
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Login error" });
  }
});

// ---------- start ----------
(async () => {
  try {
    await getPool();
    console.log("✅ Connected to Azure SQL Database");
    await ensureTables();
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();