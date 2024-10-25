import multer from "multer";
import {CloudinaryStorage} from "multer-storage-cloudinary";
import cloudinary from "./cloudinaryConfig.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "library",
    allowedFormats: ["jpg", "png"],
  },
});

const parser = multer({ storage: storage });

export default parser