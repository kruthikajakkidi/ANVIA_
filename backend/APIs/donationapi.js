import exp from "express";
import crypto from "crypto";
import Razorpay from "razorpay";

import DonationModel from "../models/DonationModel.js";
import RescueModel from "../models/RescueModel.js";
import verifyToken from "../middlewares/verifyToken.js";

const donationApp = exp.Router();

/* =========================
   CREATE ORDER
========================= */
donationApp.post(
  "/create-order",
  verifyToken("USER", "VOLUNTEER"),
  async (req, res) => {
    try {
      const { rescueCase, amount, donorDetails } = req.body;

      const rescueDocument = await RescueModel.findById(rescueCase);
if (rescueCase) {
  const rescueDocument = await RescueModel.findById(rescueCase);

  if (!rescueDocument) {
    return res.status(404).json({
      message: "rescue not found"
    });
  }
}

      if (!amount || amount <= 0) {
        return res.status(400).json({
          message: "invalid amount"
        });
      }

      const requiredFields = [
        "name",
        "email",
        "phone",
        "address",
        "city",
        "state",
        "panNumber"
      ];

      const missingField = requiredFields.find(
        (field) => !donorDetails?.[field]
      );

      if (missingField) {
        return res.status(400).json({
          message: `${missingField} is required`
        });
      }

      // 🔥 CREATE RAZORPAY INSTANCE INSIDE ROUTE (FIXED CRASH)
      const razorpayInstance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
      });

      const order = await razorpayInstance.orders.create({
        amount: amount * 100,
        currency: "INR"
      });

      const donationDocument = new DonationModel({
        user: req.user.userId,
        rescueCase,
        amount,
        donorDetails,
        razorpayOrderId: order.id,
        paymentStatus: "PENDING"
      });

      await donationDocument.save();

      res.status(200).json({
        message: "order created",
        payload: {
          order,
          donationId: donationDocument._id
        }
      });
    } catch (err) {
      res.status(500).json({
        message: err.message
      });
    }
  }
);

/* =========================
   VERIFY PAYMENT
========================= */
donationApp.post(
  "/verify-payment",
  verifyToken("USER", "VOLUNTEER"),
  async (req, res) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      } = req.body;

      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

      const donationDocument = await DonationModel.findOne({
        razorpayOrderId: razorpay_order_id
      });

      if (!donationDocument) {
        return res.status(404).json({
          message: "donation not found"
        });
      }

      if (generatedSignature !== razorpay_signature) {
        donationDocument.paymentStatus = "FAILED";
        await donationDocument.save();

        return res.status(400).json({
          message: "payment verification failed"
        });
      }

      donationDocument.paymentStatus = "SUCCESS";
      donationDocument.razorpayPaymentId = razorpay_payment_id;
      donationDocument.razorpaySignature = razorpay_signature;

      await donationDocument.save();

      const rescueDocument = await RescueModel.findById(
        donationDocument.rescueCase
      );

      if (rescueDocument) {
        rescueDocument.totalDonations += donationDocument.amount;
        await rescueDocument.save();
      }

      res.status(200).json({
        message: "payment verified successfully",
        payload: donationDocument
      });
    } catch (err) {
      res.status(500).json({
        message: err.message
      });
    }
  }
);

/* =========================
   DONATION HISTORY
========================= */
donationApp.get(
  "/history",
  verifyToken("USER", "VOLUNTEER"),
  async (req, res) => {
    try {
      const donationList = await DonationModel.find({
        user: req.user.userId
      })
        .populate("rescueCase")
        .sort({ createdAt: -1 });

      res.status(200).json({
        message: "donations",
        payload: donationList
      });
    } catch (err) {
      res.status(500).json({
        message: err.message
      });
    }
  }
);

/* =========================
   RESCUE DONATIONS
========================= */
donationApp.get("/rescue/:rescueId", async (req, res) => {
  try {
    const donationList = await DonationModel.find({
      rescueCase: req.params.rescueId,
      paymentStatus: "SUCCESS"
    })
      .populate("user", "firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "donations",
      payload: donationList
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

export default donationApp;
