import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rateLimit.middleware.js";
import { registerUser, loginUser, logoutUser, refreshAccessToken } from "../controllers/auth.controller.js"

const router = Router();

// Apply auth rate limiter to login and register
router.route("/register").post(authLimiter, registerUser);
router.route("/login").post(authLimiter, loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

export default router;

 