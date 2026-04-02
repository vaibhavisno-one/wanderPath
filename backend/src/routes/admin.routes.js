import { Router } from "express";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";
import { 
    getPendingQueue,
    approveContent,
    rejectContent,
    flagReview,
    banUser,
    unbanUser,
    getFlaggedReviews,
    getDashboardStats
} from "../controllers/admin.controller.js";

const router = Router();


router.route("/queue").get(verifyJWT, verifyAdmin, getPendingQueue);
router.route("/approve/:adminId").post(verifyJWT, verifyAdmin, approveContent);
router.route("/reject/:adminId").post(verifyJWT, verifyAdmin, rejectContent);
router.route("/ban/:userId").post(verifyJWT, verifyAdmin, banUser);
router.route("/unban/:userId").post(verifyJWT, verifyAdmin, unbanUser);
router.route("/flagged-reviews").get(verifyJWT, verifyAdmin, getFlaggedReviews);
router.route("/stats").get(verifyJWT, verifyAdmin, getDashboardStats);

// User can flag reviews ,not for only admin
router.route("/flag-review/:reviewId").post(verifyJWT, flagReview);

export default router;
