import exp from "express";
import path from "path";

import RescueModel from "../models/RescueModel.js";
import uploadImage from "../middlewares/uploadImage.js";
import verifyToken from "../middlewares/verifyToken.js";

const rescueApp = exp.Router();

function toWebPath(filePath) {
  if (!filePath) return "";
  if (filePath.startsWith("http")) return filePath;

  const uploadsIndex = filePath.replace(/\\/g, "/").indexOf("/uploads/");

  if (uploadsIndex === -1) {
    return path.basename(filePath);
  }

  return filePath.replace(/\\/g, "/").slice(uploadsIndex + 1);
}

rescueApp.post(
  "/",
  verifyToken("USER", "VOLUNTEER"),
  uploadImage.single("animalImage"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "animal image required",
        });
      }

      const rescueObj = {
        reportedBy: req.user.userId,
        animalImage: toWebPath(req.file.path),
        description: req.body.description,
        contactNumber: req.body.contactNumber,
        address: req.body.address,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
      };

      const rescueDocument = new RescueModel(rescueObj);
      await rescueDocument.save();

      return res.status(201).json({
        message: "rescue created",
        payload: rescueDocument,
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  }
);

rescueApp.get(
  "/user/my-rescues",
  verifyToken("USER", "VOLUNTEER"),
  async (req, res) => {
    try {
      const rescueList = await RescueModel.find({
        reportedBy: req.user.userId,
      })
        .populate("claimedBy", "firstName lastName email")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        message: "my rescues",
        payload: rescueList,
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  }
);

rescueApp.get("/pending", async (req, res) => {
  try {
    const rescueList = await RescueModel.find({
      status: "PENDING",
    }).populate("reportedBy", "firstName lastName");

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

rescueApp.get("/in-progress", async (req, res) => {
  try {
    const rescueList = await RescueModel.find({
      status: "IN_PROGRESS",
    })
      .populate("reportedBy", "firstName lastName")
      .populate("claimedBy", "firstName lastName");

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

rescueApp.get("/completed", async (req, res) => {
  try {
    const rescueList = await RescueModel.find({
      status: "COMPLETED",
    })
      .populate("reportedBy", "firstName lastName")
      .populate("claimedBy", "firstName lastName");

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

rescueApp.get("/", async (req, res) => {
  try {
    const filterObj = {};

    if (req.query.status) {
      filterObj.status = req.query.status;
    }

    const rescueList = await RescueModel.find(filterObj)
      .populate("reportedBy", "firstName lastName email")
      .populate("claimedBy", "firstName lastName email")
      .sort({ createdAt: -1 });

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

rescueApp.get("/:id", async (req, res) => {
  try {
    const rescueDocument = await RescueModel.findById(req.params.id)
      .populate("reportedBy", "firstName lastName email")
      .populate("claimedBy", "firstName lastName email");

    if (!rescueDocument) {
      return res.status(404).json({
        message: "rescue not found",
      });
    }

    return res.status(200).json({
      message: "rescue",
      payload: rescueDocument,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
});

rescueApp.delete(
  "/:id",
  verifyToken("USER", "VOLUNTEER", "ADMIN"),
  async (req, res) => {
    try {
      const rescueDocument = await RescueModel.findById(req.params.id);

      if (!rescueDocument) {
        return res.status(404).json({
          message: "rescue not found",
        });
      }

      if (
        rescueDocument.reportedBy.toString() !== req.user.userId &&
        req.user.role !== "ADMIN"
      ) {
        return res.status(403).json({
          message: "access denied",
        });
      }

      await RescueModel.findByIdAndDelete(req.params.id);

      return res.status(200).json({
        message: "rescue deleted",
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  }
);

export default rescueApp;