import mongoose from "mongoose";
import dotenv from "dotenv";
import AdoptionRequest from "./models/AdoptionRequest.js";

dotenv.config();

const approveAll = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const result = await AdoptionRequest.updateMany(
            { status: "pending" },
            { $set: { status: "approved" } }
        );

        console.log(`✅ Approved ${result.modifiedCount} pending requests.`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Error updating requests:", error);
        process.exit(1);
    }
};

approveAll();
