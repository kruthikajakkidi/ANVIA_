import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },

    lastName: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String
    },

    role: {
      type: String,
      enum: [
        "USER",
        "VOLUNTEER",
        "ADMIN"
      ],
      default: "USER"
    },

    googleId: {
      type: String
    },

    profileImage: {
      type: String,
      default: ""
    },

    volunteerStatus: {
      type: String,
      enum: [
        "NOT_APPLIED",
        "PENDING",
        "APPROVED",
        "REJECTED"
      ],
      default: "NOT_APPLIED"
    },

    volunteerPoints: {
      type: Number,
      default: 0
    },

    liveLocation: {
      latitude: {
        type: Number
      },
      longitude: {
        type: Number
      },
      address: {
        type: String,
        default: ""
      },
      updatedAt: {
        type: Date
      }
    }
  },
  {
    timestamps: true,
    versionKey: false,
    strict: "throw"
  }
);

const UserModel = mongoose.model(
  "users",
  userSchema
);

export default UserModel;
