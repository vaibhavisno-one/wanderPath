import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Admin from "../models/admin.model.js";
import Place from "../models/place.model.js";
import Review from "../models/review.model.js";
import User from "../models/user.model.js";

// Get pending moderation queue - ADMIN ONLY
const getPendingQueue = asyncHandler(async (req, res) => {
    const items = await Admin.find({ status: "pending" })
        .populate("targetId")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, items, "Pending moderation items fetched")
    );
});

// Approve content - ADMIN ONLY
const approveContent = asyncHandler(async (req, res) => {
    const { adminId } = req.params;

    if (!adminId) {
        throw new ApiError(400, "Admin record ID is required");
    }

    const record = await Admin.findById(adminId);
    if (!record) {
        throw new ApiError(404, "Record not found");
    }

    if (record.status !== "pending") {
        throw new ApiError(400, "Only pending records can be approved");
    }

    record.status = "approved";
    record.reviewedBy = req.user._id;
    record.reviewedAt = new Date();
    await record.save();

    // Update respective model
    if (record.targetModel === "Place") {
        await Place.findByIdAndUpdate(record.targetId, { isVerified: true });
    }

    if (record.targetModel === "Review") {
        const review = await Review.findById(record.targetId);
        if (review) {
            review.approved = true;
            await review.save();

            // Update place rating with approved reviews only
            const stats = await Review.aggregate([
                { $match: { place: review.place, approved: true } },
                {
                    $group: {
                        _id: "$place",
                        avgRating: { $avg: "$rating" },
                        count: { $sum: 1 }
                    }
                }
            ]);

            if (stats.length > 0) {
                await Place.findByIdAndUpdate(review.place, {
                    avgRating: stats[0].avgRating,
                    reviewCount: stats[0].count
                });
            }
        }
    }

    return res.status(200).json(
        new ApiResponse(200, record, "Content approved successfully")
    );
});

// Reject content - ADMIN ONLY
const rejectContent = asyncHandler(async (req, res) => {
    const { adminId } = req.params;
    const { reason } = req.body;

    if (!adminId) {
        throw new ApiError(400, "Admin record ID is required");
    }

    if (!reason || reason.trim().length === 0) {
        throw new ApiError(400, "Rejection reason is required");
    }

    const record = await Admin.findById(adminId);
    if (!record) {
        throw new ApiError(404, "Record not found");
    }

    if (record.status !== "pending") {
        throw new ApiError(400, "Only pending records can be rejected");
    }

    record.status = "rejected";
    record.reason = reason.trim();
    record.reviewedBy = req.user._id;
    record.reviewedAt = new Date();
    await record.save();

    return res.status(200).json(
        new ApiResponse(200, record, "Content rejected successfully")
    );
});

// Flag review for moderation - USER TRIGGERED
const flagReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;

    if (!reviewId) {
        throw new ApiError(400, "Review ID is required");
    }

    const review = await Review.findById(reviewId);
    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    // Check if already flagged
    if (review.flagged) {
        throw new ApiError(400, "Review is already flagged");
    }

    review.flagged = true;
    await review.save();

    // Create admin record
    await Admin.create({
        type: "review",
        targetModel: "Review",
        targetId: reviewId,
        status: "pending"
    });

    return res.status(200).json(
        new ApiResponse(200, {}, "Review flagged for admin review")
    );
});

// Ban user - ADMIN ONLY
const banUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { reason } = req.body;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user._id.toString() === req.user._id.toString()) {
        throw new ApiError(400, "Cannot ban yourself");
    }

    user.isActive = false;
    await user.save();

    return res.status(200).json(
        new ApiResponse(200, {}, "User banned successfully")
    );
});

// Unban user - ADMIN ONLY
const unbanUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    user.isActive = true;
    await user.save();

    return res.status(200).json(
        new ApiResponse(200, {}, "User unbanned successfully")
    );
});

// Get flagged reviews - ADMIN ONLY
const getFlaggedReviews = asyncHandler(async (req, res) => {
    const flaggedReviews = await Review.find({ flagged: true })
        .populate("user", "fullname email")
        .populate("place", "name")
        .sort({ updatedAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, flaggedReviews, "Flagged reviews fetched")
    );
});

// Get dashboard statistics - ADMIN ONLY
const getDashboardStats = asyncHandler(async (req, res) => {
    const [
        totalUsers,
        totalPlaces,
        pendingApprovals,
        flaggedReviews
    ] = await Promise.all([
        User.countDocuments({ isActive: true }),
        Place.countDocuments(),
        Admin.countDocuments({ status: "pending" }),
        Review.countDocuments({ flagged: true })
    ]);

    const stats = {
        totalUsers,
        totalPlaces,
        pendingApprovals,
        flaggedReviews
    };

    return res.status(200).json(
        new ApiResponse(200, stats, "Dashboard stats fetched successfully")
    );
});

// Search  by username/email for  actions 
const searchUserForModeration = asyncHandler(async (req, res) => {
    const { identifier } = req.query;

    if (!identifier || identifier.trim().length === 0) {
        throw new ApiError(400, "identifier query is required");
    }

    const normalized = identifier.toLowerCase().trim();

    const user = await User.findOne({
        $or: [
            { email: normalized },
            { username: normalized }
        ]
    }).select("_id email username fullname role isActive createdAt");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, user, "User fetched successfully")
    );
});

export {
    getPendingQueue,
    approveContent,
    rejectContent,
    flagReview,
    banUser,
    unbanUser,
    getFlaggedReviews,
    getDashboardStats,
    searchUserForModeration
};

