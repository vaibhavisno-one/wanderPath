import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { reviewLimiter } from "../middlewares/rateLimit.middleware.js";
import { 
    createReview, 
    updateReview, 
    deleteReview 
} from "../controllers/review.controller.js";

const router = Router();

// review routes require authentication
router.route("/").post(verifyJWT, reviewLimiter, createReview);
router.route("/:reviewId").put(verifyJWT, updateReview);
router.route("/:reviewId").delete(verifyJWT, deleteReview);

export default router;
