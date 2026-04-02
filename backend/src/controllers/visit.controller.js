import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Visit from "../models/visit.model.js";
import Place from "../models/place.model.js";
import { 
    MIN_VISIT_DISTANCE, 
    DISTANCE_TOLERANCE, 
    MIN_VISIT_DURATION 
} from "../constants.js";

// Haversine formula
const getDistance = (coords1, coords2) => {
    const toRad = val => (val * Math.PI) / 180;

    const [lng1, lat1] = coords1;
    const [lng2, lat2] = coords2;

    const R = 6371e3;
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lng2 - lng1);

    const a =
        Math.sin(Δφ / 2) ** 2 +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const checkIn = asyncHandler(async (req, res) => {
    const { placeId, userLocation } = req.body;

    if (!placeId || !userLocation) {
        throw new ApiError(400, "placeId and userLocation required");
    }

    const place = await Place.findById(placeId);
    if (!place) throw new ApiError(404, "Place not found");

    const distance = getDistance(
        userLocation.coordinates,
        place.location.coordinates
    );

    if (distance > MIN_VISIT_DISTANCE) {
        throw new ApiError(400, `You must be within ${MIN_VISIT_DISTANCE}m of the place to check in`);
    }

    // prevent multiple active visits
    const activeVisit = await Visit.findOne({
        user: req.user._id,
        place: placeId,
        checkOutTime: null
    });

    if (activeVisit) {
        throw new ApiError(400, "Already checked in");
    }

    const visit = await Visit.create({
        user: req.user._id,
        place: placeId,
        userLocation,
        checkInTime: new Date(),
        isVerified: false
    });

    return res.status(200).json(
        new ApiResponse(200, visit, "Check-in successful")
    );
});

const checkOut = asyncHandler(async (req, res) => {
    const { visitId, userLocation } = req.body;

    if (!visitId || !userLocation) {
        throw new ApiError(400, "visitId and userLocation required");
    }

    const visit = await Visit.findById(visitId);
    if (!visit) throw new ApiError(404, "Visit not found");

    if (visit.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized");
    }

    if (visit.checkOutTime) {
        throw new ApiError(400, "Already checked out");
    }

    const place = await Place.findById(visit.place);

    const duration = Date.now() - visit.checkInTime.getTime();

    const distance = getDistance(
        userLocation.coordinates,
        place.location.coordinates
    );

    // Verification with tolerance buffer for real-world GPS variance
    if (duration >= MIN_VISIT_DURATION && distance <= DISTANCE_TOLERANCE) {
        visit.isVerified = true;
    }

    visit.checkOutTime = new Date();
    await visit.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            visit,
            visit.isVerified ? "Visit verified" : "Visit not verified"
        )
    );
});

const getMyVisits = asyncHandler(async (req, res) => {
    const visits = await Visit.find({ user: req.user._id })
        .populate("place")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, visits, "User visits fetched")
    );
});

export { checkIn, checkOut, getMyVisits };