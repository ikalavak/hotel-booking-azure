import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql, { connectDB } from "./db";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT) || 5000;

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

const JWT_SECRET = requireEnv("JWT_SECRET");

// Root
app.get("/", (req, res) => {
  res.send("Hotel Backend Running 🚀");
});

// DB test
app.get("/api/dbtest", async (req, res) => {
  try {
    const result = await sql.query`SELECT GETDATE() as now`;
    res.json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB query failed" });
  }
});

// ---------- AUTH: REGISTER ----------
app.post("/api/auth/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body as {
      fullName?: string;
      email?: string;
      password?: string;
    };

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: "fullName, email, password are required" });
    }

    // check if exists
    const existing = await sql.query`
      SELECT TOP 1 id FROM dbo.Users WHERE email = ${email}
    `;
    if (existing.recordset.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const inserted = await sql.query`
      INSERT INTO dbo.Users (full_name, email, password_hash)
      OUTPUT INSERTED.id, INSERTED.full_name, INSERTED.email, INSERTED.created_at
      VALUES (${fullName}, ${email}, ${passwordHash})
    `;

    return res.status(201).json({
      message: "Registered successfully",
      user: inserted.recordset[0],
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: "Register failed", details: err?.message || String(err) });
  }
});

// ---------- AUTH: LOGIN ----------
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const result = await sql.query`
      SELECT TOP 1 id, full_name, email, password_hash
      FROM dbo.Users
      WHERE email = ${email}
    `;

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result.recordset[0] as {
      id: number;
      full_name: string;
      email: string;
      password_hash: string;
    };

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.full_name },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: { id: user.id, fullName: user.full_name, email: user.email },
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: "Login failed", details: err?.message || String(err) });
  }
});

// ---------- ROOMS ----------
app.get("/api/rooms", async (req, res) => {
  try {
    // Create table if missing (demo-friendly)
    await sql.query`
      IF OBJECT_ID('dbo.Rooms', 'U') IS NULL
      BEGIN
        CREATE TABLE dbo.Rooms (
          id INT IDENTITY(1,1) PRIMARY KEY,
          room_number NVARCHAR(10) NOT NULL,
          type NVARCHAR(50) NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          is_available BIT DEFAULT 1
        );
      END
    `;

    const rooms = await sql.query`
      SELECT id, room_number, type, price, is_available
      FROM dbo.Rooms
      ORDER BY id DESC
    `;
    res.json(rooms.recordset);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch rooms", details: err?.message || String(err) });
  }
});

app.post("/api/rooms/seed", async (req, res) => {
  try {
    await sql.query`
      IF OBJECT_ID('dbo.Rooms', 'U') IS NULL
      BEGIN
        CREATE TABLE dbo.Rooms (
          id INT IDENTITY(1,1) PRIMARY KEY,
          room_number NVARCHAR(10) NOT NULL,
          type NVARCHAR(50) NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          is_available BIT DEFAULT 1
        );
      END
    `;

    await sql.query`
      INSERT INTO dbo.Rooms (room_number, type, price, is_available)
      VALUES
        ('101', 'Single', 50.00, 1),
        ('102', 'Double', 80.00, 1),
        ('201', 'Suite', 150.00, 1)
    `;
    res.json({ message: "Rooms seeded successfully ✅" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Seed failed", details: err?.message || String(err) });
  }
});

// Start server after DB connect
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(() => {
    console.log("Server not started because DB connection failed.");
  });