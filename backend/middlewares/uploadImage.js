import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("only image files allowed"));
  }
};

const multerUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

function getCloudinaryFolder(fieldName) {
  if (fieldName === "animalImage") {
    return "anvia/animals";
  }

  return "anvia/updates";
}

function uploadToCloudinary(fieldName) {
  return async (req, res, next) => {
    try {
      if (!req.file) {
        return next();
      }

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: getCloudinaryFolder(fieldName),
            resource_type: "image",
          },
          (error, uploadResult) => {
            if (error) {
              reject(error);
            } else {
              resolve(uploadResult);
            }
          }
        );

        stream.end(req.file.buffer);
      });

      req.file.path = result.secure_url;
      req.file.filename = result.public_id;

      next();
    } catch (err) {
      next(err);
    }
  };
}

const uploadImage = {
  single(fieldName) {
    return [multerUpload.single(fieldName), uploadToCloudinary(fieldName)];
  },
};

export default uploadImage;