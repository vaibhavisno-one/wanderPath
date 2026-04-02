import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getMe, updateProfile, deleteUser } from "../controllers/user.controller.js";

const router = Router();

//  user routes require authentication
router.route("/me").get(verifyJWT, getMe);
router.route("/profile").put(verifyJWT, updateProfile);
router.route("/:userId").delete(verifyJWT, deleteUser);

export default router;
