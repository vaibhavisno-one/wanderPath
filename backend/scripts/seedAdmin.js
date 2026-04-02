import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../src/models/user.model.js";
import { DB_NAME } from "../src/constants.js";


const seedAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("✅ Connected to MongoDB");

        // Check if admin already exists
        const existingAdmin = await User.findOne({ role: "admin" });
        
        if (existingAdmin) {
            console.log("⚠️  Admin user already exists:");
            console.log(`   Email: ${existingAdmin.email}`);
            console.log(`   Username: ${existingAdmin.username}`);
            console.log("\n❌ Aborting: Cannot create multiple admin users.");
            process.exit(0);
        }

        // Admin credentials (Change these before running!)
        const adminData = {
            email: process.env.ADMIN_EMAIL || "admin@wanderpath.com",
            username: process.env.ADMIN_USERNAME || "admin",
            fullname: process.env.ADMIN_FULLNAME || "System Administrator",
            password: process.env.ADMIN_PASSWORD || "Admin@123456", // CHANGE THIS!
            role: "admin",
            isActive: true
        };

        // Validate password strength
        if (adminData.password.length < 8) {
            console.log("❌ Error: Admin password must be at least 8 characters long");
            process.exit(1);
        }

        // Check if username or email already exists
        const existingUser = await User.findOne({
            $or: [
                { email: adminData.email },
                { username: adminData.username }
            ]
        });

        if (existingUser) {
            console.log("❌ Error: A user with this email or username already exists");
            console.log(`   Existing user: ${existingUser.email}`);
            process.exit(1);
        }

        // Create admin user
        const admin = await User.create(adminData);

        console.log("\n✅ Admin user created successfully!");
        console.log("═══════════════════════════════════════");
        console.log(`Email:    ${admin.email}`);
        console.log(`Username: ${admin.username}`);
        console.log(`Role:     ${admin.role}`);
        console.log(`ID:       ${admin._id}`);
        console.log("═══════════════════════════════════════");
        console.log("\n⚠️  IMPORTANT: Change the admin password immediately after first login!");
        console.log("⚠️  SECURITY: Never commit admin credentials to version control!");

        process.exit(0);

    } catch (error) {
        console.error("❌ Error seeding admin:", error.message);
        process.exit(1);
    }
};

// Run the seed function
seedAdmin();
