"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importStar(require("./db"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const PORT = Number(process.env.PORT) || 5000;
function mustEnv(name) {
    const v = process.env[name];
    if (!v)
        throw new Error(`Missing environment variable: ${name}`);
    return v;
}
const JWT_SECRET = mustEnv("JWT_SECRET");
// Root
app.get("/", (req, res) => {
    res.send("Hotel Backend Running 🚀");
});
// DB test
app.get("/api/dbtest", async (req, res) => {
    try {
        const result = await db_1.default.query `SELECT GETDATE() as now`;
        res.json(result.recordset[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB query failed" });
    }
});
// Create Users table if missing (demo-safe)
async function ensureUsersTable() {
    await db_1.default.query `
    IF OBJECT_ID('dbo.Users', 'U') IS NULL
    BEGIN
      CREATE TABLE dbo.Users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        full_name NVARCHAR(100) NOT NULL,
        email NVARCHAR(150) NOT NULL UNIQUE,
        password_hash NVARCHAR(255) NOT NULL,
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
      );
    END
  `;
}
// ---------- AUTH: REGISTER ----------
app.post("/api/auth/register", async (req, res) => {
    try {
        await ensureUsersTable();
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({ error: "fullName, email, password are required" });
        }
        const existing = await db_1.default.query `
      SELECT TOP 1 id FROM dbo.Users WHERE email = ${email}
    `;
        if (existing.recordset.length > 0) {
            return res.status(409).json({ error: "Email already registered" });
        }
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        const inserted = await db_1.default.query `
      INSERT INTO dbo.Users (full_name, email, password_hash)
      OUTPUT INSERTED.id, INSERTED.full_name, INSERTED.email, INSERTED.created_at
      VALUES (${fullName}, ${email}, ${passwordHash})
    `;
        return res.status(201).json({
            message: "Registered successfully",
            user: inserted.recordset[0]
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Register failed", details: err?.message || String(err) });
    }
});
// ---------- AUTH: LOGIN ----------
app.post("/api/auth/login", async (req, res) => {
    try {
        await ensureUsersTable();
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "email and password are required" });
        }
        const result = await db_1.default.query `
      SELECT TOP 1 id, full_name, email, password_hash
      FROM dbo.Users
      WHERE email = ${email}
    `;
        if (result.recordset.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const user = result.recordset[0];
        const ok = await bcrypt_1.default.compare(password, user.password_hash);
        if (!ok) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, name: user.full_name }, JWT_SECRET, { expiresIn: "1h" });
        return res.json({
            message: "Login successful",
            token,
            user: { id: user.id, fullName: user.full_name, email: user.email }
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Login failed", details: err?.message || String(err) });
    }
});
// ---------- ROOMS (optional demo endpoints) ----------
async function ensureRoomsTable() {
    await db_1.default.query `
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
}
app.get("/api/rooms", async (req, res) => {
    try {
        await ensureRoomsTable();
        const rooms = await db_1.default.query `
      SELECT id, room_number, type, price, is_available
      FROM dbo.Rooms
      ORDER BY id DESC
    `;
        res.json(rooms.recordset);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch rooms", details: err?.message || String(err) });
    }
});
app.post("/api/rooms/seed", async (req, res) => {
    try {
        await ensureRoomsTable();
        await db_1.default.query `
      INSERT INTO dbo.Rooms (room_number, type, price, is_available)
      VALUES
        ('101', 'Single', 50.00, 1),
        ('102', 'Double', 80.00, 1),
        ('201', 'Suite', 150.00, 1)
    `;
        res.json({ message: "Rooms seeded successfully ✅" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Seed failed", details: err?.message || String(err) });
    }
});
// Start server after DB connect
(0, db_1.connectDB)()
    .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
    .catch(() => {
    console.log("Server not started because DB connection failed.");
});
