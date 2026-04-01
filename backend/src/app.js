import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Security & CORS Configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Body Parser Middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Static Files
app.use(express.static("public"));

// Cookie Parser
app.use(cookieParser());

// Routes
import authRouter from "./routes/auth.route.js"

app.use("/api/auth", authRouter);

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

