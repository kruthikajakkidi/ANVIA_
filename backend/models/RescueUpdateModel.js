import mongoose from "mongoose";

const rescueUpdateSchema =
  new mongoose.Schema(
    {
      rescueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "rescues",
        required: true
      },

      volunteerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
      },

      image: {
        type: String,
        default: ""
      },

      message: {
        type: String,
        required: true
      }
    },
    {
      timestamps: true,
      versionKey: false,
      strict: "throw"
    }
  );

const RescueUpdateModel =
  mongoose.model(
    "rescueupdates",
    rescueUpdateSchema
  );

export default RescueUpdateModel;