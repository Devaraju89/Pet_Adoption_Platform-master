import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();

const restoreUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const email = "123@lpu.com";
        const password = "123456";

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("User already exists. You should be able to login.");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name: "Test User",
            email: email,
            password: hashedPassword,
            role: "user"
        });

        console.log(`✅ User restored successfully!`);
        console.log(`Email: ${user.email}`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Error restoring user:", error);
        process.exit(1);
    }
};

restoreUser();
