export const DB_NAME = "wanderpath";
export const MAX_RADIUS = 20000; // meters
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PLACE_NAME_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 5000;
export const MIN_DESCRIPTION_LENGTH = 10;
export const MIN_RATING = 1;
export const MAX_RATING = 5;
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const VALID_COORDINATES_RANGE = { lat: [-90, 90], lng: [-180, 180] };

// Visit verification constants
export const MIN_VISIT_DISTANCE = 100;
export const DISTANCE_TOLERANCE = 150;
export const MIN_VISIT_DURATION = 5 * 60 * 1000; // 5 minutes