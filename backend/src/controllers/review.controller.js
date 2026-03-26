import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Review from "../models/review.model.js";
import Visit from "../models/visit.model.js";
import Place from "../models/place.model.js";

const createReview = asyncHandler(async (req, res) => {
    const { placeId, rating, comment } = req.body;

    if (rating < 1 || rating > 5) {
        throw new ApiError(400, "Invalid rating");
    }

    const visit = await Visit.findOne({
        user: req.user._id,
        place: placeId,
        isVerified: true
    });

    if (!visit) {
        throw new ApiError(403, "You must visit the place before reviewing");
    }

    const existing = await Review.findOne({
        user: req.user._id,
        place: placeId
    });

    if (existing) {
        throw new ApiError(400, "Review already exists");
    }

    const review = await Review.create({
        user: req.user._id,
        place: placeId,
        rating,
        comment,
        visit: visit._id
    });

    // update place rating
    const stats = await Review.aggregate([
        { $match: { place: placeId } },
        {
            $group: {
                _id: "$place",
                avgRating: { $avg: "$rating" },
                count: { $sum: 1 }
            }
        }
    ]);

    await Place.findByIdAndUpdate(placeId, {
        avgRating: stats[0].avgRating,
        reviewCount: stats[0].count
    });

    return res.status(201).json(new ApiResponse(201, review, "Review submitted (pending approval)"));
});

export default { createReview };