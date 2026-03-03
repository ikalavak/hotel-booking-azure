import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sql, { connectDB } from "./db";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT) || 5000;

// Health root
app.get("/", (req, res) => {
  res.send("Hotel Backend Running 🚀");
});

// DB connectivity test
app.get("/api/dbtest", async (req, res) => {
  try {
    const result = await sql.query`SELECT GETDATE() as now`;
    res.json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB query failed" });
  }
});

// ✅ GET Rooms (expects a Rooms table)
app.get("/api/rooms", async (req, res) => {
  try {
    const result = await sql.query`
      SELECT id, room_number, type, price, is_available
      FROM Rooms
      ORDER BY id DESC
    `;
    res.json(result.recordset);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch rooms",
      details: err?.message || String(err),
    });
  }
});

// ✅ Seed Rooms once (optional)
app.post("/api/rooms/seed", async (req, res) => {
  try {
    // Create table if it doesn't exist (safe)
    await sql.query`
      IF OBJECT_ID('dbo.Rooms', 'U') IS NULL
      BEGIN
        CREATE TABLE Rooms (
          id INT IDENTITY(1,1) PRIMARY KEY,
          room_number NVARCHAR(10) NOT NULL,
          type NVARCHAR(50) NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          is_available BIT DEFAULT 1
        );
      END
    `;

    // Insert sample data
    await sql.query`
      INSERT INTO Rooms (room_number, type, price, is_available)
      VALUES
        ('101', 'Single', 50.00, 1),
        ('102', 'Double', 80.00, 1),
        ('201', 'Suite', 150.00, 1)
    `;

    res.json({ message: "Rooms seeded successfully ✅" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      error: "Failed to seed rooms",
      details: err?.message || String(err),
    });
  }
});

// Start server only after DB connects
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(() => {
    console.log("Server not started because DB connection failed.");
  });