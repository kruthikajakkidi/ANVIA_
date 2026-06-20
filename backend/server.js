import dotenv from "dotenv";
dotenv.config();

import exp from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import configurePassport from "./config/passport.js";

configurePassport(); 

import passport from "passport";

import authApp from "./APIs/authapi.js";
import rescueApp from "./APIs/rescueapi.js";
import volunteerApp from "./APIs/volunteerapi.js";
import donationApp from "./APIs/donationapi.js";
import adminApp from "./APIs/adminapi.js";

console.log("CWD:", process.cwd());
console.log("CLIENT ID:", process.env.GOOGLE_CLIENT_ID);

const app = exp();

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://anvia-rescue-network.vercel.app",
  process.env.CLIENT_URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. server-to-server, curl, mobile apps)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true
  })
);

// JSON parser
app.use(exp.json());

// Passport init
app.use(passport.initialize());

// Static uploads folder (absolute path so it works no matter where node was launched from)
app.use("/uploads", exp.static(path.join(__dirname, "uploads")));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log(err);
  });

// Routes
app.use("/auth", authApp);
app.use("/rescue", rescueApp);
app.use("/volunteer", volunteerApp);
app.use("/donation", donationApp);
app.use("/admin", adminApp);

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message
  });
});

// Server start
app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});
