import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { generalLimiter } from "./middlewares/rateLimit.middleware.js";

const app = express();

// Security & CORS Configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Global Rate Limiter
app.use(generalLimiter);

// Body Parser Middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Static Files
app.use(express.static("public"));

// Cookie Parser
app.use(cookieParser());

// Routes Import
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.routes.js";
import placeRouter from "./routes/place.routes.js";
import reviewRouter from "./routes/review.routes.js";
import visitRouter from "./routes/visit.routes.js";
import adminRouter from "./routes/admin.routes.js";
import bookmarkRouter from "./routes/bookmark.routes.js";

// API v1 Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/places", placeRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/visits", visitRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/bookmarks", bookmarkRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "Server is running" });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    });
});

export default app;

