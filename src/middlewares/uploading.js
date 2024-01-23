import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import multer_storage_cloudinary from "multer-storage-cloudinary";
const { CloudinaryStorage } = multer_storage_cloudinary;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer to use Cloudinary as storage
const storage = {
  cloudinary: cloudinary,
  folder: "./public/temp", // Set the folder where you want to store your uploaded files
  allowedFormats: ["jpg", "png", "jpeg", "gif"],
  //   transformation: [{ width: 500, height: 500, crop: "limit" }], // Optional: add any transformations you want
};

export const upload = multer({ storage: storage });
