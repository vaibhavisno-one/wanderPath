import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User  from "../models/user.model.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async(req, res, next) => {
    try{
        // Extract token from cookies or Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if(!token){
            throw new ApiError(401, "Unauthorized request");
        }

        // Verify token and decode
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Find user from decoded token
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");

        if(!user){
            throw new ApiError(401, "Invalid access token");
        }

        // Check if user is active
        if(!user.isActive){
            throw new ApiError(403, "User account is disabled");
        }

        req.user = user;
        next();

    }catch(error){
        if(error instanceof ApiError){
            throw error;
        }
        throw new ApiError(401, error?.message || "Invalid access token");
    }
})

const verifyAdmin = asyncHandler(async(req, res, next) => {
    if(!req.user || req.user.role !== "admin"){
        throw new ApiError(403, "Admin access required");
    }
    next();
})

export { verifyJWT, verifyAdmin }