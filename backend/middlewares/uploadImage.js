import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Absolute path to <backend-root>/uploads, independent of process.cwd()
const uploadsRoot = path.join(__dirname, "..", "uploads");

const animalsDir = path.join(uploadsRoot, "animals");
const updatesDir = path.join(uploadsRoot, "updates");

// make sure the folders actually exist before multer tries to write into them
fs.mkdirSync(animalsDir, { recursive: true });
fs.mkdirSync(updatesDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (
      req.originalUrl.includes(
        "/update/"
      )
    ) {
      cb(null, updatesDir);
    } else {
      cb(null, animalsDir);
    }
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
        path.extname(
          file.originalname
        )
    );
  }
});

const fileFilter = (
  req,
  file,
  cb
) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp"
  ];

  if (
    allowedTypes.includes(
      file.mimetype
    )
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "only image files allowed"
      )
    );
  }
};

const uploadImage = multer({
  storage,
  fileFilter
});

export default uploadImage;