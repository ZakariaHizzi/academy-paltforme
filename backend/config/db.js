const mongoose = require("mongoose");

// Cache the connection across serverless invocations (Vercel) and reuse it
// locally. Without this, every cold start opens a new MongoDB connection.
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  const mongoURI = process.env.MONGO_URL || process.env.MONGO_URI;

  if (!mongoURI) {
    throw new Error("MONGO_URL (or MONGO_URI) is not configured");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log(`MongoDB Connected: ${cached.conn.connection.host}`);
    return cached.conn;
  } catch (error) {
    // Reset so the next invocation can retry instead of caching a rejection.
    cached.promise = null;
    throw error;
  }
};

module.exports = connectDB;
