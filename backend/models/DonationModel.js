import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true
    },

    rescueCase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rescues",
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    donorDetails: {
      name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        required: true
      },
      address: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      panNumber: {
        type: String,
        required: true
      }
    },

    razorpayOrderId: {
      type: String,
      required: true
    },

    razorpayPaymentId: {
      type: String
    },

    razorpaySignature: {
      type: String
    },

    paymentStatus: {
      type: String,
      enum: [
        "PENDING",
        "SUCCESS",
        "FAILED"
      ],
      default: "PENDING"
    }
  },
  {
    timestamps: true,
    versionKey: false,
    strict: "throw"
  }
);

const DonationModel = mongoose.model(
  "donations",
  donationSchema
);

export default DonationModel;
