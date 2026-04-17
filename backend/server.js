const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

/* ================= MIDDLEWARE ================= */
// Allow all origins for production (you can restrict later)
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      // Allow all origins for now
      callback(null, true);
    },
    credentials: true,
  })
);

// Increase payload size limit for file uploads
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

/* ================= DATABASE CONNECTION ================= */
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB error:", err);
    console.error("Please check your MONGODB_URI environment variable");
  }
};

// Connect to database
connectDB();

// Handle connection events
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
  isConnected = false;
});

/* ================= ROUTES ================= */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/properties", require("./routes/properties"));
app.use("/api/portfolio", require("./routes/portfolio"));

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.json({ message: "A1 Builders API is running 🚀" });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Server is running",
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

/* ================= SEED DATA ENDPOINT ================= */
// Visit https://blr-estate-api.onrender.com/api/seed to add properties

const seedProperties = [
  {
    title: "Luxury Villa in Whitefield",
    description: "Spacious luxury villa with modern amenities, private garden, and premium fixtures",
    location: "Whitefield, Bangalore",
    price: 25000000,
    type: "Villa",
    bedrooms: 4,
    bathrooms: 4,
    area: 3500,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    featured: true,
    listingType: "buy",
  },
  {
    title: "Modern Apartment in Koramangala",
    location: "Koramangala, Bangalore",
    description: "Contemporary apartment in prime location with all amenities",
    price: 12500000,
    type: "Apartment",
    bedrooms: 3,
    bathrooms: 3,
    area: 1850,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    featured: true,
    listingType: "buy",
  },
  {
    title: "Premium Penthouse in Indiranagar",
    location: "Indiranagar, Bangalore",
    description: "Exclusive penthouse with panoramic city views",
    price: 35000000,
    type: "Penthouse",
    bedrooms: 4,
    bathrooms: 5,
    area: 4200,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    featured: false,
    listingType: "buy",
  },
  {
    title: "Spacious Villa in HSR Layout",
    location: "HSR Layout, Bangalore",
    description: "Family-friendly villa with beautiful garden and play area",
    price: 18000000,
    type: "Villa",
    bedrooms: 3,
    bathrooms: 3,
    area: 2800,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    featured: false,
    listingType: "buy",
  },
  {
    title: "Contemporary Flat in Electronic City",
    location: "Electronic City, Bangalore",
    description: "Perfect for young professionals, near tech parks",
    price: 8500000,
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
    featured: true,
    listingType: "buy",
  },
  {
    title: "Elegant Apartment in Jayanagar",
    location: "Jayanagar, Bangalore",
    description: "Classic design meets modern comfort in serene locality",
    price: 15000000,
    type: "Apartment",
    bedrooms: 3,
    bathrooms: 3,
    area: 2100,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    featured: false,
    listingType: "buy",
  },
  {
    title: "Luxury Duplex in Sarjapur Road",
    location: "Sarjapur Road, Bangalore",
    description: "Modern duplex with smart home features and premium amenities",
    price: 22000000,
    type: "Villa",
    bedrooms: 4,
    bathrooms: 4,
    area: 3200,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    featured: true,
    listingType: "rent",
  },
  {
    title: "Cozy Apartment in Bellandur",
    location: "Bellandur, Bangalore",
    description: "Affordable luxury near major tech parks and shopping centers",
    price: 9500000,
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 1400,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    featured: false,
    listingType: "rent",
  },
  {
    title: "Premium Villa in Hennur",
    location: "Hennur, Bangalore",
    description: "Serene location with all modern amenities and green surroundings",
    price: 19500000,
    type: "Villa",
    bedrooms: 3,
    bathrooms: 3,
    area: 2900,
    image: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&q=80",
    featured: false,
    listingType: "rent",
  },
  {
    title: "Prime Residential Plot in Whitefield",
    location: "Whitefield, Bangalore",
    description: "Prime residential plot in a gated community, perfect for building your dream home",
    price: 45000000,
    type: "Plot",
    bedrooms: 0,
    bathrooms: 0,
    area: 4800,
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    featured: true,
    listingType: "buy",
  },
  {
    title: "Commercial Plot in Electronic City",
    location: "Electronic City, Bangalore",
    description: "Commercial plot ideal for building offices or retail space, excellent location",
    price: 65000000,
    type: "Plot",
    bedrooms: 0,
    bathrooms: 0,
    area: 7200,
    image: "https://images.unsplash.com/photo-1448630360428-65456885c650?w=800&q=80",
    featured: false,
    listingType: "buy",
  },
];

app.get("/api/seed", async (req, res) => {
  try {
    const Property = require("./models/Property");

    // Check if already seeded
    const existingCount = await Property.countDocuments();
    if (existingCount > 0) {
      return res.json({
        message: `Database already has ${existingCount} properties. Use /api/seed-reset to reset.`,
        count: existingCount,
      });
    }

    // Insert new properties
    const result = await Property.insertMany(seedProperties);
    console.log(`✅ Seeded ${result.length} properties`);

    res.json({
      message: `Successfully added ${result.length} properties!`,
      count: result.length,
      properties: result.map((p) => ({ title: p.title, type: p.listingType })),
    });
  } catch (error) {
    console.error("Seed error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Reset and reseed (use with caution)
app.get("/api/seed-reset", async (req, res) => {
  try {
    const Property = require("./models/Property");

    await Property.deleteMany({});
    console.log("🗑️ Cleared all properties");

    const result = await Property.insertMany(seedProperties);
    console.log(`✅ Reseeded ${result.length} properties`);

    res.json({
      message: `Reset and added ${result.length} properties!`,
      count: result.length,
    });
  } catch (error) {
    console.error("Reset seed error:", error);
    res.status(500).json({ error: error.message });
  }
});

/* ================= SERVER ================= */
// Only start the server locally (not on Vercel serverless)
if (process.env.NODE_ENV !== "production" || process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📍 Properties API: http://localhost:${PORT}/api/properties`);
    console.log(`📍 Portfolio API: http://localhost:${PORT}/api/portfolio`);
    console.log(`📍 Seed endpoint: http://localhost:${PORT}/api/seed`);
  });
}

// Export for Vercel serverless
module.exports = app;
