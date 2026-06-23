import mongoose from 'mongoose';
import { env } from './env.js';

// Why cache on the global object?
// Vercel runs the API as serverless functions. A "warm" function reuses the
// same Node process across requests, so we keep a single Mongoose connection
// and reuse it instead of reconnecting on every request (which would quickly
// exhaust the Atlas M0 connection limit). The cache survives warm invocations.
let cached = global._mongoose;
if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (!env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set. Add it to .env (see .env.example).');
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    mongoose.set('strictQuery', true);
    cached.promise = mongoose
      .connect(env.MONGODB_URI, {
        // Fail fast instead of hanging the serverless function if the DB is unreachable.
        serverSelectionTimeoutMS: 8000,
        maxPoolSize: 5,
      })
      .then((m) => m.connection);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null; // allow a retry on the next request
    throw err;
  }

  return cached.conn;
}

export function dbState() {
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  return mongoose.connection.readyState;
}
