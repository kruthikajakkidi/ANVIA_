import mongoose from "mongoose";

const rescueSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true
    },

    animalImage: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    contactNumber: {
      type: String,
      required: true
    },

    address: {
      type: String,
      required: true
    },

    latitude: {
      type: Number,
      required: true
    },

    longitude: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "CLAIMED",
        "IN_PROGRESS",
        "COMPLETED"
      ],
      default: "PENDING"
    },

    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    },

    claimedAt: {
      type: Date
    },

    volunteerLocation: {
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
    },

    totalDonations: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    versionKey: false,
    strict: "throw"
  }
);

const RescueModel = mongoose.model(
  "rescues",
  rescueSchema
);

export default RescueModel;
