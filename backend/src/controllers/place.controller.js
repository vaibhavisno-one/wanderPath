import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Place from "../models/place.model.js";
import Admin from "../models/admin.model.js";
import mongoose from "mongoose";
import { deleteManyFromCloudinary, uploadManyToCloudinary } from "../utils/cloudinary.js";
import {
    MAX_RADIUS,
    MAX_PLACE_NAME_LENGTH,
    MIN_DESCRIPTION_LENGTH,
    MAX_DESCRIPTION_LENGTH,
    VALID_COORDINATES_RANGE
} from "../constants.js";

// Validate coordinates
const isValidCoordinates = (lat, lng) => {
    const latRange = VALID_COORDINATES_RANGE.lat;
    const lngRange = VALID_COORDINATES_RANGE.lng;

    return (
        lat >= latRange[0] && lat <= latRange[1] &&
        lng >= lngRange[0] && lng <= lngRange[1]
    );
}

const parseLocationInput = (location) => {
    if (!location) return location;
    if (typeof location !== "string") return location;

    try {
        return JSON.parse(location);
    } catch {
        throw new ApiError(400, "Invalid location payload");
    }
};

const createPlace = asyncHandler(async (req, res) => {
    const { name, description, location, address, city, state, country, lat, lng } = req.body;
    let uploadedImages = [];

    // Validation
    if (!name || !description) {
        throw new ApiError(400, "Name and description are required");
    }

    if (name.length > MAX_PLACE_NAME_LENGTH) {
        throw new ApiError(400, `Place name must not exceed ${MAX_PLACE_NAME_LENGTH} characters`);
    }

    if (description.length < MIN_DESCRIPTION_LENGTH || description.length > MAX_DESCRIPTION_LENGTH) {
        throw new ApiError(400, `Description must be between ${MIN_DESCRIPTION_LENGTH} and ${MAX_DESCRIPTION_LENGTH} characters`);
    }

    let finalLat, finalLng;

    const parsedLocation = parseLocationInput(location);

    // Case 1: GeoJSON
    if (parsedLocation?.type === "Point" && Array.isArray(parsedLocation.coordinates)) {
        [finalLng, finalLat] = parsedLocation.coordinates;
    }

    // Case 2: GPS / manual lat-lng
    else if (lat !== undefined && lng !== undefined) {
        finalLat = Number(lat);
        finalLng = Number(lng);
    }

    else {
        throw new ApiError(400, "Provide location as GeoJSON or lat/lng");
    }

    // Validate coordinates
    if (!isValidCoordinates(finalLat, finalLng)) {
        throw new ApiError(400, "Invalid coordinates");
    }

    if (!address || !city || !state) {
        throw new ApiError(400, "Address, city, and state are required");
    }

    if (!req.files || req.files.length === 0) {
        throw new ApiError(400, "At least one place image is required");
    }

    // Duplicate check
    const existingPlace = await Place.findOne({
        name: { $regex: `^${name}$`, $options: "i" }
    });

    if (existingPlace) {
        throw new ApiError(409, "A place with this name already exists");
    }

    const createPlaceDoc = async (session = null) => {
        const createdPlace = new Place({
            name: name.trim(),
            description: description.trim(),
            location: {
                type: "Point",
                coordinates: [finalLng, finalLat]
            },
            address: address.trim(),
            city: city.trim(),
            state: state.trim(),
            country: country?.trim() || "India",
            addedBy: req.user._id,
            isVerified: false,
            images: uploadedImages
        });

        await createdPlace.save(session ? { session } : undefined);

        const adminRecord = new Admin({
            type: "place",
            targetModel: "Place",
            targetId: createdPlace._id,
            status: "pending"
        });
        await adminRecord.save(session ? { session } : undefined);

        return createdPlace;
    };

    try {
        uploadedImages = await uploadManyToCloudinary(req.files, { folder: "wanderpath/places" });

        try {
            const session = await mongoose.startSession();
            try {
                let createdPlace;
                await session.withTransaction(async () => {
                    createdPlace = await createPlaceDoc(session);
                });

                return res.status(201).json(
                    new ApiResponse(201, createdPlace, "Place submitted for admin review")
                );
            } finally {
                await session.endSession();
            }
        } catch (error) {
            if (error.message?.includes("Transaction numbers are only allowed")) {
                const createdPlace = await createPlaceDoc();
                return res.status(201).json(
                    new ApiResponse(201, createdPlace, "Place submitted for admin review")
                );
            }
            throw error;
        }
    } catch (error) {
        await deleteManyFromCloudinary(uploadedImages.map((img) => img.public_id));
        throw error;
    }
});

const getNearbyPlaces = asyncHandler(async (req, res) => {
    let { lat, lng, radius = 5000, page = 1, limit = 10 } = req.query;

    // Validation
    if (!lat || !lng) {
        throw new ApiError(400, "Latitude and longitude are required");
    }

    lat = parseFloat(lat);
    lng = parseFloat(lng);
    radius = Math.min(parseFloat(radius) || 5000, MAX_RADIUS);
    page = Math.max(parseInt(page) || 1, 1);
    limit = Math.min(Math.max(parseInt(limit) || 10, 1), 100); // Max 100 results

    // Validate coordinates
    if (!isValidCoordinates(lat, lng)) {
        throw new ApiError(400, "Invalid coordinates");
    }

    // Count total matching places
    const total = await Place.countDocuments({
        isVerified: true,
        location: {
            $geoWithin: {
                $centerSphere: [[lng, lat], radius / 6371000] // Earth radius in meters
            }
        }
    });

    const totalPages = Math.ceil(total / limit);

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
        { $sort: { distance: 1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit }
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            data: places,
            page,
            limit,
            total,
            totalPages
        }, "Nearby places fetched successfully")
    );
});

const getPlaceById = asyncHandler(async (req, res) => {
    const { placeId } = req.params;

    if (!placeId) {
        throw new ApiError(400, "Place ID is required");
    }

    const place = await Place.findById(placeId).populate("addedBy", "fullname email");

    if (!place) {
        throw new ApiError(404, "Place not found");
    }

    if (!place.isVerified) {
        // Only allow creator or admin to view unverified places
        if (req.user && (req.user._id.toString() === place.addedBy._id.toString() || req.user.role === "admin")) {
            return res.status(200).json(
                new ApiResponse(200, place, "Place fetched successfully")
            );
        }
        throw new ApiError(404, "Place not found");
    }

    return res.status(200).json(
        new ApiResponse(200, place, "Place fetched successfully")
    );
});

const updatePlace = asyncHandler(async (req, res) => {
    const { placeId } = req.params;
    const { name, description, location, address, city, state, country, lat, lng } = req.body;
    const parsedLocation = parseLocationInput(location);

    const place = await Place.findById(placeId);

    if (!place) {
        throw new ApiError(404, "Place not found");
    }

    // Authorization for only creator or admin
    if (
        place.addedBy.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
    ) {
        throw new ApiError(403, "Unauthorized to update this place");
    }

    let isModified = false;
    const previousImages = place.images || [];
    let newlyUploadedImages = [];

    
    if (name) {
        if (name.length > MAX_PLACE_NAME_LENGTH) {
            throw new ApiError(400, `Place name must not exceed ${MAX_PLACE_NAME_LENGTH} characters`);
        }
        place.name = name.trim();
        isModified = true;
    }

    
    if (description) {
        if (
            description.length < MIN_DESCRIPTION_LENGTH ||
            description.length > MAX_DESCRIPTION_LENGTH
        ) {
            throw new ApiError(
                400,
                `Description must be between ${MIN_DESCRIPTION_LENGTH} and ${MAX_DESCRIPTION_LENGTH} characters`
            );
        }
        place.description = description.trim();
        isModified = true;
    }

    
    if (parsedLocation || (lat !== undefined && lng !== undefined)) {
        let finalLat, finalLng;

        // Case 1: GeoJSON
        if (parsedLocation?.type === "Point" && Array.isArray(parsedLocation.coordinates)) {
            if (parsedLocation.coordinates.length !== 2) {
                throw new ApiError(400, "Coordinates must be [lng, lat]");
            }
            [finalLng, finalLat] = parsedLocation.coordinates;
        }

        // Case 2: lat/lng
        else if (lat !== undefined && lng !== undefined) {
            finalLat = Number(lat);
            finalLng = Number(lng);
        }

        else {
            throw new ApiError(400, "Provide location as GeoJSON or lat/lng");
        }

        // Validate
        if (!isValidCoordinates(finalLat, finalLng)) {
            throw new ApiError(400, "Invalid coordinates");
        }

        place.location = {
            type: "Point",
            coordinates: [finalLng, finalLat]
        };

        isModified = true;
    }

    //  Address fields
    if (address) {
        place.address = address.trim();
        isModified = true;
    }

    if (city) {
        place.city = city.trim();
        isModified = true;
    }

    if (state) {
        place.state = state.trim();
        isModified = true;
    }

    if (country) {
        place.country = country.trim();
        isModified = true;
    }

    if (isModified) {
        place.isVerified = false;
    }

    if (req.files && req.files.length > 0) {
        newlyUploadedImages = await uploadManyToCloudinary(req.files, { folder: "wanderpath/places" });
        place.images = newlyUploadedImages;
        place.isVerified = false;
    }

    try {
        await place.save();
    } catch (error) {
        if (newlyUploadedImages.length > 0) {
            await deleteManyFromCloudinary(newlyUploadedImages.map((img) => img.public_id));
        }
        throw error;
    }

    if (newlyUploadedImages.length > 0) {
        await deleteManyFromCloudinary(previousImages.map((img) => img.public_id));
    }

    return res.status(200).json(
        new ApiResponse(200, place, "Place updated successfully")
    );
});

export { createPlace, getNearbyPlaces, getPlaceById, updatePlace };
