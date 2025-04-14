import util from "util";
import dotenv from "dotenv";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE as string);
const IMAGES_DIR = process.env.IMAGES_DIR?? "/../../images/";

const storage = multer.diskStorage(
    {
        destination: (req, file, cb) => {
            cb(null, __dirname + IMAGES_DIR);
        },
        filename: (req: any, file, cb) => {
            if(file.mimetype.substring(0, 5) != "image"){
                const error: any = new Error("Not an image type file");
                error.errType = "fileTypeError";
                cb(error, "");
                return;
            }
            const hashFileName = uuidv4() + file.originalname.substring(file.originalname.lastIndexOf("."));
            req.hashFileName = hashFileName;
            cb(null, hashFileName);
        }
    }
);

const uploadFile = multer(
    {
        storage: storage,
        limits: {
            fileSize: MAX_FILE_SIZE
        }
    }
).single("image");

export const uploadMiddleware = util.promisify(uploadFile);