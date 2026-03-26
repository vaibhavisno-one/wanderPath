import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Place from "../models/place.model.js";

const createPlace = asyncHandler(async (req, res) => {
    const { name, description, location, address, city, state, country } = req.body;

    if (!name || !description || !location) {
        throw new ApiError(400, "Required fields missing");
    }

    const place = await Place.create({
        ...req.body,
        addedBy: req.user._id,
        isVerified: false // requires admin approval
    });

    return res.status(201).json(new ApiResponse(201, place, "Place submitted for review"));
});

const getNearbyPlaces = asyncHandler(async (req, res) => {
    let { lat, lng, radius = 5000, page = 1, limit = 10 } = req.query;

    lat = parseFloat(lat);
    lng = parseFloat(lng);
    radius = Math.min(parseFloat(radius), 20000); // cap radius

    const places = await Place.aggregate([
        {
            $geoNear: {
                near: { type: "Point", coordinates: [lng, lat] },
                distanceField: "distance",
                maxDistance: radius,
                spherical: true
            }
        },
        { $match: { isVerified: true } },
        { $skip: (page - 1) * limit },
        { $limit: parseInt(limit) }
    ]);

    return res.status(200).json(new ApiResponse(200, places, "Nearby places"));
});

const getPlaceById = asyncHandler(async (req, res) => {
    const place = await Place.findById(req.params.placeId);

    if (!place || !place.isVerified) {
        throw new ApiError(404, "Place not found");
    }

    return res.status(200).json(new ApiResponse(200, place, "Place fetched"));
});

export default { createPlace, getNearbyPlaces, getPlaceById };