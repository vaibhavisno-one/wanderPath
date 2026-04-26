import { Router } from "express";
import { verifyJWT, optionalJWT } from "../middlewares/auth.middleware.js";
import { uploadPlaceImages } from "../middlewares/multer.middleware.js";
import { 
    createPlace, 
    getNearbyPlaces, 
    getPlaceById, 
    updatePlace 
} from "../controllers/place.controller.js";

const router = Router();

// Public routes
router.route("/nearby").get(getNearbyPlaces);

// Hybrid route - public but enhanced with auth if available
router.route("/:placeId").get(optionalJWT, getPlaceById);

// Protected routes
router.route("/").post(verifyJWT, uploadPlaceImages, createPlace);
router.route("/:placeId").put(verifyJWT, uploadPlaceImages, updatePlace);

export default router;
