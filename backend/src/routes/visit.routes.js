import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkInLimiter } from "../middlewares/rateLimit.middleware.js";
import { 
    checkIn, 
    checkOut, 
    getMyVisits 
} from "../controllers/visit.controller.js";

const router = Router();

//  visit routes require authentication
router.route("/check-in").post(verifyJWT, checkInLimiter, checkIn);
router.route("/check-out").post(verifyJWT, checkOut);
router.route("/my-visits").get(verifyJWT, getMyVisits);

export default router;
