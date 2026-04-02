import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.model.js";

const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken");
    if (!user) throw new ApiError(404, "User not found");

    return res.status(200).json(new ApiResponse(200, user, "User fetched"));
});

const updateProfile = asyncHandler(async (req, res) => {
    const { fullname, email } = req.body;

    // Prevent role modification through this endpoint
    if (req.body.role) {
        throw new ApiError(403, "Role cannot be modified via this endpoint");
    }

    const user = await User.findById(req.user._id);
    if (!user) throw new ApiError(404, "User not found");

    if (email && email !== user.email) {
        const exists = await User.findOne({ email });
        if (exists) throw new ApiError(400, "Email already in use");
        user.email = email;
    }

    if (fullname) user.fullname = fullname;

    await user.save();

    return res.status(200).json(new ApiResponse(200, user, "Profile updated"));
});

const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (req.user._id.toString() !== userId && req.user.role !== "admin") {
        throw new ApiError(403, "Unauthorized");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Soft delete - set isActive to false
    user.isActive = false;
    await user.save();

    return res.status(200).json(new ApiResponse(200, {}, "User deactivated successfully"));
});

export { getMe, updateProfile, deleteUser };