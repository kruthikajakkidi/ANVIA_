import exp from "express";
import jwt from "jsonwebtoken";
import path from "path";

import UserModel from "../models/UserModel.js";
import RescueModel from "../models/RescueModel.js";
import RescueUpdateModel from "../models/RescueUpdateModel.js";

import verifyToken from "../middlewares/verifyToken.js";
import uploadImage from "../middlewares/uploadImage.js";

const volunteerApp = exp.Router();

function toWebPath(filePath) {
  if (!filePath) return "";
  if (filePath.startsWith("http")) return filePath;

  const uploadsIndex = filePath.replace(/\\/g, "/").indexOf("/uploads/");

  if (uploadsIndex === -1) {
    return path.basename(filePath);
  }

  return filePath.replace(/\\/g, "/").slice(uploadsIndex + 1);
}

volunteerApp.post("/apply", verifyToken("USER"), async (req, res) => {
  try {
    const { pledge } = req.body;

    if (!pledge) {
      return res.status(400).json({
        message: "volunteer pledge confirmation required",
      });
    }

    const userDocument = await UserModel.findById(req.user.userId);

    if (!userDocument) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    if (userDocument.volunteerStatus === "APPROVED") {
      return res.status(400).json({
        message: "already a volunteer",
      });
    }

    userDocument.role = "VOLUNTEER";
    userDocument.volunteerStatus = "APPROVED";

    await userDocument.save();

    const token = jwt.sign(
      {
        userId: userDocument._id,
        email: userDocument.email,
        role: userDocument.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      message: "volunteer access enabled",
      token,
      payload: {
        _id: userDocument._id,
        firstName: userDocument.firstName,
        lastName: userDocument.lastName,
        email: userDocument.email,
        role: userDocument.role,
        profileImage: userDocument.profileImage,
        volunteerStatus: userDocument.volunteerStatus,
        volunteerPoints: userDocument.volunteerPoints,
        liveLocation: userDocument.liveLocation,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
});

volunteerApp.get("/rescues", verifyToken("VOLUNTEER"), async (req, res) => {
  try {
    const rescueList = await RescueModel.find({
      status: "PENDING",
    })
      .populate("reportedBy", "firstName lastName email")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      message: "rescues",
      payload: rescueList,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
});

volunteerApp.post(
  "/claim/:rescueId",
  verifyToken("VOLUNTEER"),
  async (req, res) => {
    try {
      const rescueDocument = await RescueModel.findById(req.params.rescueId);

      if (!rescueDocument) {
        return res.status(404).json({
          message: "rescue not found",
        });
      }

      if (rescueDocument.reportedBy.toString() === req.user.userId) {
        return res.status(400).json({
          message: "cannot claim your own rescue",
        });
      }

      if (rescueDocument.status !== "PENDING") {
        return res.status(400).json({
          message: "rescue already claimed",
        });
      }

      const { latitude, longitude, address } = req.body;

      if (!latitude || !longitude) {
        return res.status(400).json({
          message: "live location required",
        });
      }

      rescueDocument.claimedBy = req.user.userId;
      rescueDocument.claimedAt = new Date();
      rescueDocument.status = "CLAIMED";

      rescueDocument.volunteerLocation = {
        latitude,
        longitude,
        address: address || "",
        updatedAt: new Date(),
      };

      await UserModel.findByIdAndUpdate(req.user.userId, {
        liveLocation: rescueDocument.volunteerLocation,
      });

      await rescueDocument.save();

      return res.status(200).json({
        message: "rescue claimed",
        payload: rescueDocument,
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  }
);

volunteerApp.patch("/location", verifyToken("VOLUNTEER"), async (req, res) => {
  try {
    const { latitude, longitude, address } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        message: "live location required",
      });
    }

    const liveLocation = {
      latitude,
      longitude,
      address: address || "",
      updatedAt: new Date(),
    };

    const userDocument = await UserModel.findByIdAndUpdate(
      req.user.userId,
      { liveLocation },
      { new: true }
    ).select("-password");

    await RescueModel.updateMany(
      {
        claimedBy: req.user.userId,
        status: {
          $in: ["CLAIMED", "IN_PROGRESS"],
        },
      },
      {
        volunteerLocation: liveLocation,
      }
    );

    return res.status(200).json({
      message: "location updated",
      payload: userDocument,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
});

volunteerApp.get("/my-rescues", verifyToken("VOLUNTEER"), async (req, res) => {
  try {
    const rescueList = await RescueModel.find({
      claimedBy: req.user.userId,
    })
      .populate("reportedBy", "firstName lastName email")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      message: "my rescues",
      payload: rescueList,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
});

volunteerApp.post(
  "/update/:rescueId",
  verifyToken("VOLUNTEER"),
  uploadImage.single("image"),
  async (req, res) => {
    try {
      const rescueDocument = await RescueModel.findById(req.params.rescueId);

      if (!rescueDocument) {
        return res.status(404).json({
          message: "rescue not found",
        });
      }

      const updateObj = {
        rescueId: req.params.rescueId,
        volunteerId: req.user.userId,
        image: req.file?.path ? toWebPath(req.file.path) : "",
        message: req.body.message,
      };

      const updateDocument = new RescueUpdateModel(updateObj);

      await updateDocument.save();

      return res.status(201).json({
        message: "update added",
        payload: updateDocument,
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  }
);

volunteerApp.get(
  "/updates/:rescueId",
  verifyToken("USER", "VOLUNTEER", "ADMIN"),
  async (req, res) => {
    try {
      const updateList = await RescueUpdateModel.find({
        rescueId: req.params.rescueId,
      })
        .populate("volunteerId", "firstName lastName")
        .sort({
          createdAt: -1,
        });

      return res.status(200).json({
        message: "updates",
        payload: updateList,
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  }
);

volunteerApp.get("/history", verifyToken("VOLUNTEER"), async (req, res) => {
  try {
    const rescueList = await RescueModel.find({
      claimedBy: req.user.userId,
      status: {
        $in: ["CLAIMED", "IN_PROGRESS", "COMPLETED"],
      },
    })
      .populate("reportedBy", "firstName lastName email")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      message: "history",
      payload: rescueList,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
});

export default volunteerApp;