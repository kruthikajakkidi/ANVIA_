import exp from "express";

import UserModel from "../models/UserModel.js";
import RescueModel from "../models/RescueModel.js";
import DonationModel from "../models/DonationModel.js";

import verifyToken from "../middlewares/verifyToken.js";

const adminApp = exp.Router();


// dashboard stats

adminApp.get(
  "/dashboard",
  verifyToken("ADMIN"),
  async (req, res) => {
    try {
      const totalUsers =
        await UserModel.countDocuments();

      const totalVolunteers =
        await UserModel.countDocuments({
          role: "VOLUNTEER"
        });

      const totalDonors =
        await DonationModel.distinct(
          "user",
          {
            paymentStatus: "SUCCESS"
          }
        );

      const pendingVolunteerRequests =
        await UserModel.countDocuments({
          volunteerStatus: "PENDING"
        });

      const totalRescues =
        await RescueModel.countDocuments();

      const pendingRescues =
        await RescueModel.countDocuments({
          status: "PENDING"
        });

      const emergencyCases =
        await RescueModel.countDocuments({
          status: {
            $in: [
              "PENDING",
              "CLAIMED",
              "IN_PROGRESS"
            ]
          }
        });

      const inProgressRescues =
        await RescueModel.countDocuments({
          status: "IN_PROGRESS"
        });

      const completedRescues =
        await RescueModel.countDocuments({
          status: "COMPLETED"
        });

      const successfulDonations =
        await DonationModel.find({
          paymentStatus: "SUCCESS"
        });

      const totalDonations =
        successfulDonations.length;

      const totalDonationAmount =
        successfulDonations.reduce(
          (sum, donation) =>
            sum + donation.amount,
          0
        );

      res.status(200).json({
        message: "dashboard",
        payload: {
          totalUsers,
          totalVolunteers,
          totalDonors:
            totalDonors.length,
          pendingVolunteerRequests,
          totalRescues,
          emergencyCases,
          pendingRescues,
          inProgressRescues,
          completedRescues,
          totalDonations,
          totalDonationAmount
        }
      });
    } catch (err) {
      res.status(500).json({
        message: err.message
      });
    }
  }
);


// get all users

adminApp.get(
  "/users",
  verifyToken("ADMIN"),
  async (req, res) => {
    try {
      const userList =
        await UserModel.find()
          .select("-password")
          .sort({
            createdAt: -1
          });

      res.status(200).json({
        message: "users",
        payload: userList
      });
    } catch (err) {
      res.status(500).json({
        message: err.message
      });
    }
  }
);


// get volunteer applications

adminApp.get(
  "/volunteer-applications",
  verifyToken("ADMIN"),
  async (req, res) => {
    try {
      const applicationList =
        await UserModel.find({
          volunteerStatus: "PENDING"
        })
          .select("-password")
          .sort({
            createdAt: -1
          });

      res.status(200).json({
        message: "applications",
        payload: applicationList
      });
    } catch (err) {
      res.status(500).json({
        message: err.message
      });
    }
  }
);


// approve volunteer

adminApp.patch(
  "/approve-volunteer/:id",
  verifyToken("ADMIN"),
  async (req, res) => {
    try {
      const volunteerDocument =
        await UserModel.findById(
          req.params.id
        );

      if (!volunteerDocument) {
        return res.status(404).json({
          message: "user not found"
        });
      }

      volunteerDocument.role =
        "VOLUNTEER";

      volunteerDocument.volunteerStatus =
        "APPROVED";

      await volunteerDocument.save();

      res.status(200).json({
        message:
          "volunteer approved"
      });
    } catch (err) {
      res.status(500).json({
        message: err.message
      });
    }
  }
);


// reject volunteer

adminApp.patch(
  "/reject-volunteer/:id",
  verifyToken("ADMIN"),
  async (req, res) => {
    try {
      const volunteerDocument =
        await UserModel.findById(
          req.params.id
        );

      if (!volunteerDocument) {
        return res.status(404).json({
          message: "user not found"
        });
      }

      volunteerDocument.volunteerStatus =
        "REJECTED";

      await volunteerDocument.save();

      res.status(200).json({
        message:
          "volunteer rejected"
      });
    } catch (err) {
      res.status(500).json({
        message: err.message
      });
    }
  }
);


// get volunteers

adminApp.get(
  "/volunteers",
  verifyToken("ADMIN"),
  async (req, res) => {
    try {
      const volunteerList =
        await UserModel.find({
          role: "VOLUNTEER"
        })
          .select("-password")
          .sort({
            volunteerPoints: -1
          });

      res.status(200).json({
        message: "volunteers",
        payload: volunteerList
      });
    } catch (err) {
      res.status(500).json({
        message: err.message
      });
    }
  }
);


// get all rescues

adminApp.get(
  "/current-rescues",
  verifyToken("ADMIN"),
  async (req, res) => {
    try {
      const rescueList =
        await RescueModel.find({
          status: {
            $in: [
              "PENDING",
              "CLAIMED",
              "IN_PROGRESS"
            ]
          }
        })
          .populate(
            "reportedBy",
            "firstName lastName email"
          )
          .populate(
            "claimedBy",
            "firstName lastName email liveLocation"
          )
          .sort({
            createdAt: -1
          });

      res.status(200).json({
        message:
          "current rescues",
        payload:
          rescueList
      });
    } catch (err) {
      res.status(500).json({
        message: err.message
      });
    }
  }
);


// get previous rescue history

adminApp.get(
  "/previous-rescues",
  verifyToken("ADMIN"),
  async (req, res) => {
    try {
      const rescueList =
        await RescueModel.find({
          status: "COMPLETED"
        })
          .populate(
            "reportedBy",
            "firstName lastName email"
          )
          .populate(
            "claimedBy",
            "firstName lastName email liveLocation"
          )
          .sort({
            updatedAt: -1
          });

      res.status(200).json({
        message:
          "previous rescues",
        payload:
          rescueList
      });
    } catch (err) {
      res.status(500).json({
        message: err.message
      });
    }
  }
);


adminApp.get(
  "/rescues",
  verifyToken("ADMIN"),
  async (req, res) => {
    try {
      const rescueList =
        await RescueModel.find()
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
        message: "rescues",
        payload: rescueList
      });
    } catch (err) {
      res.status(500).json({
        message: err.message
      });
    }
  }
);


// update rescue status

adminApp.patch(
  "/update-rescue-status/:id",
  verifyToken("ADMIN"),
  async (req, res) => {
    try {
      const rescueDocument =
        await RescueModel.findById(
          req.params.id
        );

      if (!rescueDocument) {
        return res.status(404).json({
          message: "rescue not found"
        });
      }

      rescueDocument.status =
        req.body.status;

      await rescueDocument.save();

      if (
        req.body.status ===
          "COMPLETED" &&
        rescueDocument.claimedBy
      ) {
        const volunteerDocument =
          await UserModel.findById(
            rescueDocument.claimedBy
          );

        if (volunteerDocument) {
          volunteerDocument.volunteerPoints +=
            10;

          await volunteerDocument.save();
        }
      }

      res.status(200).json({
        message:
          "status updated",
        payload:
          rescueDocument
      });
    } catch (err) {
      res.status(500).json({
        message: err.message
      });
    }
  }
);


// get all donations

adminApp.get(
  "/donations",
  verifyToken("ADMIN"),
  async (req, res) => {
    try {
      const donationList =
        await DonationModel.find()
          .populate(
            "user",
            "firstName lastName email"
          )
          .populate(
            "rescueCase"
          )
          .sort({
            createdAt: -1
          });

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

export default adminApp;
