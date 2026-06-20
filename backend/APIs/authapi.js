import exp from "express";
import bcryptjs from "bcryptjs";
import passport from "passport";
import jwt from "jsonwebtoken";

import UserModel from "../models/UserModel.js";
import verifyToken from "../middlewares/verifyToken.js";

const authApp = exp.Router();

function buildAuthPayload(userDocument) {
  return {
    _id: userDocument._id,
    firstName: userDocument.firstName,
    lastName: userDocument.lastName,
    email: userDocument.email,
    role: userDocument.role,
    profileImage: userDocument.profileImage,
    volunteerStatus: userDocument.volunteerStatus,
    volunteerPoints: userDocument.volunteerPoints,
    liveLocation: userDocument.liveLocation,
  };
}

function signToken(user) {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function getClientUrl() {
  return (
    process.env.CLIENT_URL ||
    process.env.FRONTEND_URL ||
    "http://localhost:5173"
  ).replace(/\/+$/, "");
}

/* ================= REGISTER ================= */

authApp.post("/register", async (req, res) => {
  try {
    const userObj = { ...req.body };

    const existingUser = await UserModel.findOne({ email: userObj.email });

    if (existingUser) {
      return res.status(409).json({ message: "user already exists" });
    }

    const hashedPassword = await bcryptjs.hash(userObj.password, 7);
    userObj.password = hashedPassword;

    const allowedSelfRoles = ["USER", "VOLUNTEER"];
    userObj.role = allowedSelfRoles.includes(userObj.role)
      ? userObj.role
      : "USER";

    userObj.volunteerStatus =
      userObj.role === "VOLUNTEER" ? "APPROVED" : "NOT_APPLIED";

    const newUser = new UserModel(userObj);
    await newUser.save();

    const token = signToken(newUser);

    return res.status(201).json({
      message: "user created",
      token,
      payload: buildAuthPayload(newUser),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

/* ================= LOGIN ================= */

authApp.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userDocument = await UserModel.findOne({ email });

    if (!userDocument) {
      return res.status(404).json({ message: "invalid email" });
    }

    if (!userDocument.password) {
      return res.status(400).json({ message: "please login with google" });
    }

    const isPasswordMatched = await bcryptjs.compare(
      password,
      userDocument.password
    );

    if (!isPasswordMatched) {
      return res.status(401).json({ message: "invalid password" });
    }

    const token = signToken(userDocument);

    return res.status(200).json({
      message: "login success",
      token,
      payload: buildAuthPayload(userDocument),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

/* ================= GOOGLE LOGIN ================= */

authApp.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

authApp.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      const token = signToken(req.user);

      const redirectUrl = new URL("/auth/google/success", getClientUrl());

      redirectUrl.searchParams.set("token", token);
      redirectUrl.searchParams.set("role", req.user.role);

      return res.redirect(redirectUrl.toString());
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
);

/* ================= CHECK AUTH ================= */

authApp.get(
  "/check-auth",
  verifyToken("USER", "VOLUNTEER", "ADMIN"),
  async (req, res) => {
    try {
      const userDocument = await UserModel.findById(req.user.userId).select(
        "-password"
      );

      if (!userDocument) {
        return res.status(404).json({ message: "user not found" });
      }

      return res.status(200).json({
        message: "authorized",
        payload: userDocument,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
);

/* ================= LOGOUT ================= */

authApp.post("/logout", (req, res) => {
  return res.status(200).json({ message: "logout success" });
});

export default authApp;
