import dotenv from "dotenv";
dotenv.config();

import exp from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import passport from "passport";

import configurePassport from "./config/passport.js";

// Routes
import authApp from "./APIs/authapi.js";
import rescueApp from "./APIs/rescueapi.js";
import volunteerApp from "./APIs/volunteerapi.js";
import donationApp from "./APIs/donationapi.js";
import adminApp from "./APIs/adminapi.js";

configurePassport(); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = exp();

/* ================= MIDDLEWARE ================= */

// CORS (IMPORTANT for frontend + Google redirect)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  })
);

app.use(exp.json());
app.use(passport.initialize());

/* ================= STATIC FILES ================= */
app.use("/uploads", exp.static(path.join(__dirname, "uploads")));

/* ================= DATABASE ================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB error:", err));

/* ================= ROUTES ================= */

// AUTH (IMPORTANT: this decides /auth/google route)
app.use("/auth", authApp);

app.use("/rescue", rescueApp);
app.use("/volunteer", volunteerApp);
app.use("/donation", donationApp);
app.use("/admin", adminApp);

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.send("ANVIA backend running ");
});

/* ================= ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message
  });
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
