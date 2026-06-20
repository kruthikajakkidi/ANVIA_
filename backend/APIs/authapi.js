import exp from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";

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
    liveLocation: userDocument.liveLocation
  };
}

function signToken(userDocument) {
  return jwt.sign(
    {
      userId: userDocument._id,
      email: userDocument.email,
      role: userDocument.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );
}

// register
authApp.post(
  "/register",
  async (req, res) => {
    try {
      const userObj = { ...req.body };
      const isConfiguredAdmin =
        process.env.ADMIN_EMAIL &&
        process.env.ADMIN_PASSWORD &&
        userObj.email === process.env.ADMIN_EMAIL &&
        userObj.password === process.env.ADMIN_PASSWORD;

      const userDocument =
        await UserModel.findOne({
          email: userObj.email
        });

      if (userDocument) {
        return res.status(409).json({
          message:
            "user already exists"
        });
      }

      const hashedPassword =
        await bcryptjs.hash(
          userObj.password,
          7
        );

      userObj.password =
        hashedPassword;

      const allowedSelfRoles = ["USER", "VOLUNTEER"];
      const requestedRole = allowedSelfRoles.includes(userObj.role)
        ? userObj.role
        : "USER";

      userObj.role = isConfiguredAdmin ? "ADMIN" : requestedRole;
      userObj.volunteerStatus =
        userObj.role === "VOLUNTEER" ? "APPROVED" : "NOT_APPLIED";

      const newUserDocument =
        new UserModel(userObj);

      await newUserDocument.save();

      const token = signToken(newUserDocument);

      res.status(201).json({
        message: "user created",
        token,
        payload: buildAuthPayload(newUserDocument)
      });
    } catch (err) {
      res.status(500).json({
        message: err.message
      });
    }
  }
);

// login

authApp.post(
  "/login",
  async (req, res) => {
    try {
      const {
        email,
        password
      } = req.body;

      const userDocument =
        await UserModel.findOne({
          email
        });

      if (!userDocument) {
        return res.status(404).json({
          message: "invalid email"
        });
      }

      if (
        !userDocument.password
      ) {
        return res.status(400).json({
          message:
            "please login with google"
        });
      }

      const isPasswordMatched =
        await bcryptjs.compare(
          password,
          userDocument.password
        );

      if (
        !isPasswordMatched
      ) {
        return res.status(401).json({
          message:
            "invalid password"
        });
      }

      const token = signToken(userDocument);

      res.status(200).json({
        message:
          "login success",

        token,

        payload: buildAuthPayload(userDocument)
      });
    } catch (err) {
      res.status(500).json({
        message: err.message
      });
    }
  }
);


// google login

authApp.get(
  "/google",
  passport.authenticate(
    "google",
    {
      scope: [
        "profile",
        "email"
      ]
    }
  )
);


// google callback

authApp.get(
  "/google/callback",
  passport.authenticate(
    "google",
    {
      session: false
    }
  ),
  async (req, res) => {
    try {
      const token = signToken(req.user);
      const redirectUrl = new URL(
        "/auth/google/success",
        process.env.CLIENT_URL || "http://localhost:5173"
      );

      redirectUrl.searchParams.set("token", token);
      redirectUrl.searchParams.set("role", req.user.role);
      res.redirect(redirectUrl.toString());
    } catch (err) {
      res.status(500).json({
        message: err.message
      });
    }
  }
);


// check auth

authApp.get(
  "/check-auth",
  verifyToken(
    "USER",
    "VOLUNTEER",
    "ADMIN"
  ),
  async (req, res) => {
    try {
      const userDocument =
        await UserModel.findById(
          req.user.userId
        ).select("-password");

      if (!userDocument) {
        return res.status(404).json({
          message:
            "user not found"
        });
      }

      res.status(200).json({
        message:
          "authorized",

        payload:
          userDocument
      });
    } catch (err) {
      res.status(500).json({
        message: err.message
      });
    }
  }
);


// logout

authApp.post(
  "/logout",
  (req, res) => {
    try {
      res.status(200).json({
        message:
          "logout success"
      });
    } catch (err) {
      res.status(500).json({
        message: err.message
      });
    }
  }
);

export default authApp;
