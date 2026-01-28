import mongoose from "mongoose";
import dotenv from "dotenv";
import Pet from "./models/Pet.js"; // Adjust path as needed
import Shelter from "./models/Shelter.js"; // Adjust path as needed

dotenv.config();

const testPetDetails = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected.");

        // 1. Fetch all pets to find a valid ID
        const pets = await Pet.find().limit(1);
        if (pets.length === 0) {
            console.log("No pets found in database. logic cannot be tested.");
            process.exit(0);
        }

        const testId = pets[0]._id.toString();
        console.log(`Testing with Pet ID: ${testId}`);

        // 2. Simulate logic from controller
        if (!testId.match(/^[0-9a-fA-F]{24}$/)) {
            console.error("Invalid ID format check failed (unexpectedly).");
        }

        const pet = await Pet.findById(testId).populate('shelterId');

        if (!pet) {
            console.error("Pet not found by ID (unexpectedly).");
        } else {
            console.log("✅ Pet found successfully:");
            console.log("Name:", pet.name);
            console.log("ID:", pet._id);
            console.log("Shelter:", pet.shelterId ? pet.shelterId.name : "None");
        }

    } catch (error) {
        console.error("❌ Error in test script:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected.");
    }
};

testPetDetails();
