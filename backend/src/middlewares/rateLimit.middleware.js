import rateLimit from "express-rate-limit";

// Rate limiter for authentication routes (login, register)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: "Too many authentication attempts. Please try again after 15 minutes.",
    standardHeaders: true,
    legacyHeaders: false
});

// Rate limiter for review creation
export const reviewLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 reviews per hour
    message: "Too many reviews submitted. Please try again later.",
    standardHeaders: true,
    legacyHeaders: false
});

// Rate limiter for check-in operations
export const checkInLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 check-ins per 15 minutes
    message: "Too many check-in attempts. Please slow down.",
    standardHeaders: true,
    legacyHeaders: false
});

// General API rate limiter
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: "Too many requests. Please try again later.",
    standardHeaders: true,
    legacyHeaders: false
});
