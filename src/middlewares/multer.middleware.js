import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //uploade files are saves here in upload folder
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    //naming the uploaded files in local file folder
    const uniqueFilename = uuidv4();
    cb(null, uniqueFilename + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });
