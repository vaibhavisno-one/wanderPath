import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Bookmark from "../models/bookmark.model.js";
import Place from "../models/place.model.js";

const addBookmark = asyncHandler(async (req, res) => {
    const { placeId } = req.body;

    if (!placeId) {
        throw new ApiError(400, "Place ID is required");
    }

    // Check if place exists
    const place = await Place.findById(placeId);
    if (!place) {
        throw new ApiError(404, "Place not found");
    }

    // Check if already bookmarked
    const existing = await Bookmark.findOne({
        user: req.user._id,
        place: placeId
    });

    if (existing) {
        throw new ApiError(409, "Place already bookmarked");
    }

    const bookmark = await Bookmark.create({
        user: req.user._id,
        place: placeId
    });

    return res.status(201).json(
        new ApiResponse(201, bookmark, "Bookmark added successfully")
    );
});

const removeBookmark = asyncHandler(async (req, res) => {
    const { placeId } = req.params;

    if (!placeId) {
        throw new ApiError(400, "Place ID is required");
    }

    const bookmark = await Bookmark.findOneAndDelete({
        user: req.user._id,
        place: placeId
    });

    if (!bookmark) {
        throw new ApiError(404, "Bookmark not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Bookmark removed successfully")
    );
});

const getUserBookmarks = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    
    const pageNum = Math.max(parseInt(page) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit) || 10, 1), 100);

    const total = await Bookmark.countDocuments({ user: req.user._id });
    const totalPages = Math.ceil(total / limitNum);

    const bookmarks = await Bookmark.find({ user: req.user._id })
        .populate("place")
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);

    return res.status(200).json(
        new ApiResponse(200, {
            data: bookmarks,
            page: pageNum,
            limit: limitNum,
            total,
            totalPages
        }, "Bookmarks fetched successfully")
    );
});

export { addBookmark, removeBookmark, getUserBookmarks };
