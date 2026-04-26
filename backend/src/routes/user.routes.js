import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getMe, updateProfile, deleteUser,toggleUserStatus,reactivateUser } from "../controllers/user.controller.js";
import { uploadAvatarImage } from "../middlewares/multer.middleware.js";

const router = Router();

//  user routes require authentication
router.route("/me").get(verifyJWT, getMe);
router.route("/profile").patch(verifyJWT, uploadAvatarImage, updateProfile);
router.route("/:userId").delete(verifyJWT, deleteUser);
router.route("/:userId/status").patch(verifyJWT, toggleUserStatus);
router.route("/reactivate/:userId").patch(verifyJWT, reactivateUser);

export default router;
