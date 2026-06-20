import exp from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

import UserModel from "../models/UserModel.js";

const authApp = exp.Router();

// JWT helper
function signToken(user) {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

/* ================= GOOGLE LOGIN ================= */

// Step 1: Redirect to Google
authApp.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

// Step 2: Google callback
authApp.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      const token = signToken(req.user);

      const redirectUrl = new URL(
        "http://localhost:5173/auth/google/success"
      );

      // production auto switch
      if (process.env.CLIENT_URL) {
        redirectUrl.origin = process.env.CLIENT_URL;
      }

      redirectUrl.searchParams.set("token", token);
      redirectUrl.searchParams.set("role", req.user.role);

      return res.redirect(redirectUrl.toString());
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
);

export default authApp;
