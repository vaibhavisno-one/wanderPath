import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

import Admin from "../models/admin.model.js";
import Place from "../models/place.model.js";
import Review from "../models/review.model.js";
import User from "../models/user.model.js";

// 🔹 Get moderation queue
const getPendingQueue = asyncHandler(async (req, res) => {
    const items = await Admin.find({ status: "pending" })
        .populate("targetId")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, items, "Pending moderation items")
    );
});

// 🔹 Approve content
const approveContent = asyncHandler(async (req, res) => {
    const { adminId } = req.params;

    const record = await Admin.findById(adminId);
    if (!record) throw new ApiError(404, "Record not found");

    record.status = "approved";
    record.reviewedBy = req.user._id;
    await record.save();

    if (record.targetModel === "Place") {
        await Place.findByIdAndUpdate(record.targetId, { isVerified: true });
    }

    if (record.targetModel === "Review") {
        await Review.findByIdAndUpdate(record.targetId, { approved: true });
    }

    return res.status(200).json(
        new ApiResponse(200, record, "Content approved")
    );
});

// 🔹 Reject content
const rejectContent = asyncHandler(async (req, res) => {
    const { adminId } = req.params;
    const { reason } = req.body;

    const record = await Admin.findById(adminId);
    if (!record) throw new ApiError(404, "Record not found");

    record.status = "rejected";
    record.reason = reason;
    record.reviewedBy = req.user._id;

    await record.save();

    return res.status(200).json(
        new ApiResponse(200, record, "Content rejected")
    );
});

// 🔹 Flag review (user-triggered moderation)
const flagReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) throw new ApiError(404, "Review not found");

    review.flagged = true;
    await review.save();

    await Admin.create({
        type: "review",
        targetModel: "Review",
        targetId: reviewId
    });

    return res.status(200).json(
        new ApiResponse(200, {}, "Review flagged for admin review")
    );
});

// 🔹 Ban user
const banUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    user.role = "banned"; // you can also add isBlocked field later
    await user.save();

    return res.status(200).json(
        new ApiResponse(200, {}, "User banned successfully")
    );
});

// 🔹 Get flagged reviews
const getFlaggedReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ flagged: true })
        .populate("user place")
        .sort({ updatedAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, reviews, "Flagged reviews")
    );
});

export default {
    getPendingQueue,
    approveContent,
    rejectContent,
    flagReview,
    banUser,
    getFlaggedReviews
};