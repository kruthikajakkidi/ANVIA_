import exp from "express";
import path from "path";

import RescueModel from "../models/RescueModel.js";

import uploadImage from "../middlewares/uploadImage.js";
import verifyToken from "../middlewares/verifyToken.js";

const rescueApp = exp.Router();

// converts an absolute/OS-specific multer path into "uploads/animals/123.png"
function toWebPath(filePath) {
  const uploadsIndex = filePath
    .replace(/\\/g, "/")
    .indexOf("/uploads/");

  if (uploadsIndex === -1) {
    return path.basename(filePath);
  }

  return filePath
    .replace(/\\/g, "/")
    .slice(uploadsIndex + 1);
}


// create rescue

rescueApp.post(
  "/",
  verifyToken(
    "USER",
    "VOLUNTEER"
  ),
  uploadImage.single(
    "animalImage"
  ),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message:
            "animal image required"
        });
      }

      const rescueObj = {
        reportedBy:
          req.user.userId,

        animalImage:
          toWebPath(req.file.path),

        description:
          req.body.description,

        contactNumber:
          req.body.contactNumber,

        address:
          req.body.address,

        latitude:
          req.body.latitude,

        longitude:
          req.body.longitude
      };

      const rescueDocument =
        new RescueModel(
          rescueObj
        );

      await rescueDocument.save();

      res.status(201).json({
        message:
          "rescue created",

        payload:
          rescueDocument
      });
    } catch (err) {
      res.status(500).json({
        message:
          err.message
      });
    }
  }
);


// my rescues

rescueApp.get(
  "/user/my-rescues",
  verifyToken(
    "USER",
    "VOLUNTEER"
  ),
  async (req, res) => {
    try {
      const rescueList =
        await RescueModel.find({
          reportedBy:
            req.user.userId
        })
          .populate(
            "claimedBy",
            "firstName lastName email"
          )
          .sort({
            createdAt: -1
          });

      res.status(200).json({
        message:
          "my rescues",

        payload:
          rescueList
      });
    } catch (err) {
      res.status(500).json({
        message:
          err.message
      });
    }
  }
);


// pending rescues

rescueApp.get(
  "/pending",
  async (req, res) => {
    try {
      const rescueList =
        await RescueModel.find({
          status: "PENDING"
        })
          .populate(
            "reportedBy",
            "firstName lastName"
          );

      res.status(200).json({
        message:
          "rescues",

        payload:
          rescueList
      });
    } catch (err) {
      res.status(500).json({
        message:
          err.message
      });
    }
  }
);


// in progress rescues

rescueApp.get(
  "/in-progress",
  async (req, res) => {
    try {
      const rescueList =
        await RescueModel.find({
          status:
            "IN_PROGRESS"
        })
          .populate(
            "reportedBy",
            "firstName lastName"
          )
          .populate(
            "claimedBy",
            "firstName lastName"
          );

      res.status(200).json({
        message:
          "rescues",

        payload:
          rescueList
      });
    } catch (err) {
      res.status(500).json({
        message:
          err.message
      });
    }
  }
);


// completed rescues

rescueApp.get(
  "/completed",
  async (req, res) => {
    try {
      const rescueList =
        await RescueModel.find({
          status:
            "COMPLETED"
        })
          .populate(
            "reportedBy",
            "firstName lastName"
          )
          .populate(
            "claimedBy",
            "firstName lastName"
          );

      res.status(200).json({
        message:
          "rescues",

        payload:
          rescueList
      });
    } catch (err) {
      res.status(500).json({
        message:
          err.message
      });
    }
  }
);


// get all rescues

rescueApp.get(
  "/",
  async (req, res) => {
    try {
      const filterObj = {};

      if (
        req.query.status
      ) {
        filterObj.status =
          req.query.status;
      }

      const rescueList =
        await RescueModel.find(
          filterObj
        )
          .populate(
            "reportedBy",
            "firstName lastName email"
          )
          .populate(
            "claimedBy",
            "firstName lastName email"
          )
          .sort({
            createdAt: -1
          });

      res.status(200).json({
        message:
          "rescues",

        payload:
          rescueList
      });
    } catch (err) {
      res.status(500).json({
        message:
          err.message
      });
    }
  }
);


// get rescue by id

rescueApp.get(
  "/:id",
  async (req, res) => {
    try {
      const rescueDocument =
        await RescueModel.findById(
          req.params.id
        )
          .populate(
            "reportedBy",
            "firstName lastName email"
          )
          .populate(
            "claimedBy",
            "firstName lastName email"
          );

      if (
        !rescueDocument
      ) {
        return res.status(404).json({
          message:
            "rescue not found"
        });
      }

      res.status(200).json({
        message:
          "rescue",

        payload:
          rescueDocument
      });
    } catch (err) {
      res.status(500).json({
        message:
          err.message
      });
    }
  }
);


// delete rescue

rescueApp.delete(
  "/:id",
  verifyToken(
    "USER",
    "VOLUNTEER",
    "ADMIN"
  ),
  async (req, res) => {
    try {
      const rescueDocument =
        await RescueModel.findById(
          req.params.id
        );

      if (
        !rescueDocument
      ) {
        return res.status(404).json({
          message:
            "rescue not found"
        });
      }

      if (
        rescueDocument.reportedBy.toString() !==
          req.user.userId &&
        req.user.role !==
          "ADMIN"
      ) {
        return res.status(403).json({
          message:
            "access denied"
        });
      }

      await RescueModel.findByIdAndDelete(
        req.params.id
      );

      res.status(200).json({
        message:
          "rescue deleted"
      });
    } catch (err) {
      res.status(500).json({
        message:
          err.message
      });
    }
  }
);

export default rescueApp;