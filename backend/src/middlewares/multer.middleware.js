import multer from "multer";
import ApiError from "../utils/ApiError.js";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_MIME_TYPES = new Set([
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif"
]);

const imageFileFilter = (req, file, cb) => {
    if (!ALLOWED_IMAGE_MIME_TYPES.has(file.mimetype)) {
        return cb(new ApiError(400, "Only image files are allowed"));
    }
    cb(null, true);
};

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: MAX_FILE_SIZE
    },
    fileFilter: imageFileFilter
});

export const uploadPlaceImages = upload.array("images", 8);
export const uploadReviewImages = upload.array("images", 5);
export const uploadAvatarImage = upload.single("avatar");
