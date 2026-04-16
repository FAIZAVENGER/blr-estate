const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

/* ================= MIDDLEWARE ================= */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5000",
  // Add your Vercel frontend URL here after deployment, e.g.:
  // "https://blr-estate.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Increase payload size limit for file uploads
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

/* ================= DATABASE ================= */
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB error:", err);
  }
};

connectDB();

/* ================= ROUTES ================= */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/properties", require("./routes/properties"));

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.json({ message: "A1 Builders API is running 🚀" });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Server is running",
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

/* ================= SERVER ================= */
// Only start the server locally (not on Vercel serverless)
if (process.env.NODE_ENV !== "production" || process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📍 Properties API: http://localhost:${PORT}/api/properties`);
  });
}

// Export for Vercel serverless
module.exports = app;