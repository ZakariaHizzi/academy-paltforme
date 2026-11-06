const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const facultyRoutes = require("./routes/facultyRoutes");

const app = express();

const isDevelopment = process.env.NODE_ENV !== "production";

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (no Origin header) and any origin in development.
      if (isDevelopment || !origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  }),
);

app.use(express.json());

// Ensure MongoDB is connected before handling any request. The connection is
// cached, so this is a no-op after the first request in a warm invocation.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    res.status(503).json({ message: "Database unavailable" });
  }
});

// Internal API secret verification (X-Internal-Secret) has been removed so the
// API can be called directly. JWT authentication (verifyToken) and role checks
// (authorizeRoles) are still applied per route.

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/faculty", facultyRoutes);

const PORT = process.env.PORT || 5000;

// On Vercel the app is imported as a serverless handler, so it must not call
// app.listen(). Only start a local HTTP server when this file is run directly.
if (require.main === module) {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error(`MongoDB connection error: ${error.message}`);
      process.exit(1);
    });
}

module.exports = app;
