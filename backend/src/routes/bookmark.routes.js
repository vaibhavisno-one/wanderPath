import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    addBookmark, 
    removeBookmark, 
    getUserBookmarks 
} from "../controllers/bookmark.controller.js";

const router = Router();

//  bookmark  require authentication
router.route("/").post(verifyJWT, addBookmark);
router.route("/").get(verifyJWT, getUserBookmarks);
router.route("/:placeId").delete(verifyJWT, removeBookmark);

export default router;
