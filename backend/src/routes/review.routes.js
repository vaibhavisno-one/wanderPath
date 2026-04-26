import { Router } from "express";
import { verifyJWT, optionalJWT } from "../middlewares/auth.middleware.js";
import { reviewLimiter } from "../middlewares/rateLimit.middleware.js";
import { uploadReviewImages } from "../middlewares/multer.middleware.js";
import { 
    createReview, 
    updateReview, 
    deleteReview,
    getPlaceReviews
} from "../controllers/review.controller.js";

const router = Router();

// review routes require authentication
router.route("/").post(verifyJWT, reviewLimiter, uploadReviewImages, createReview);
router.route("/place/:placeId").get(optionalJWT, getPlaceReviews);
router.route("/:reviewId").put(verifyJWT, updateReview);
router.route("/:reviewId").delete(verifyJWT, deleteReview);

export default router;
