import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Review from "../models/review.model.js";
import Visit from "../models/visit.model.js";
import Place from "../models/place.model.js";
import Admin from "../models/admin.model.js";
import { MIN_RATING, MAX_RATING } from "../constants.js";

const createReview = asyncHandler(async (req, res) => {
    const { placeId, rating, comment } = req.body;

    // Validation
    if (!placeId || rating === undefined || !comment) {
        throw new ApiError(400, "Place ID, rating, and comment are required");
    }

    if (rating < MIN_RATING || rating > MAX_RATING) {
        throw new ApiError(400, `Rating must be between ${MIN_RATING} and ${MAX_RATING}`);
    }

    if (comment.trim().length < 10) {
        throw new ApiError(400, "Comment must be at least 10 characters long");
    }

    if (comment.trim().length > 1000) {
        throw new ApiError(400, "Comment must not exceed 1000 characters");
    }

    // Check if place exists
    const place = await Place.findById(placeId);
    if (!place) {
        throw new ApiError(404, "Place not found");
    }

    // Verify user visited the place
    const visit = await Visit.findOne({
        user: req.user._id,
        place: placeId,
        isVerified: true
    });

    if (!visit) {
        throw new ApiError(403, "You must have a verified visit to this place before reviewing");
    }

    // Check if user already reviewed this place
    const existing = await Review.findOne({
        user: req.user._id,
        place: placeId
    });

    if (existing) {
        throw new ApiError(409, "You have already reviewed this place");
    }

    // Create review
    const review = await Review.create({
        user: req.user._id,
        place: placeId,
        rating,
        comment: comment.trim(),
        visit: visit._id,
        approved: false  // Requires admin approval
    });

    // Add to admin moderation queue
    await Admin.create({
        type: "review",
        targetModel: "Review",
        targetId: review._id,
        status: "pending"
    });

    return res.status(201).json(
        new ApiResponse(201, review, "Review submitted for admin approval")
    );
});

const updateReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);

    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    // Check authorization
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        throw new ApiError(403, "Unauthorized to update this review");
    }

    if (rating !== undefined) {
        if (rating < MIN_RATING || rating > MAX_RATING) {
            throw new ApiError(400, `Rating must be between ${MIN_RATING} and ${MAX_RATING}`);
        }
        review.rating = rating;
    }

    if (comment !== undefined) {
        if (comment.trim().length < 10) {
            throw new ApiError(400, "Comment must be at least 10 characters long");
        }
        review.comment = comment.trim();
    }

    // Reset approval if changes made
    review.approved = false;

    await review.save();

    // Update place rating
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

    return res.status(200).json(
        new ApiResponse(200, review, "Review updated successfully")
    );
});

const deleteReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    // Check authorization
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        throw new ApiError(403, "Unauthorized to delete this review");
    }

    const placeId = review.place;

    await Review.findByIdAndDelete(reviewId);

    // Update place rating
    const stats = await Review.aggregate([
        { $match: { place: placeId, approved: true } },
        {
            $group: {
                _id: "$place",
                avgRating: { $avg: "$rating" },
                count: { $sum: 1 }
            }
        }
    ]);

    if (stats.length > 0) {
        await Place.findByIdAndUpdate(placeId, {
            avgRating: stats[0].avgRating,
            reviewCount: stats[0].count
        });
    } else {
        await Place.findByIdAndUpdate(placeId, {
            avgRating: 0,
            reviewCount: 0
        });
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Review deleted successfully")
    );
});

export { createReview, updateReview, deleteReview };
