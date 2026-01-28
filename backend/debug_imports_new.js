import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

console.log("Starting model imports...");

try {
    console.log("Importing User...");
    await import("./models/User.js");
    console.log("User imported.");
} catch (e) { console.error("User failed:", e); }

try {
    console.log("Importing Pet...");
    await import("./models/Pet.js");
    console.log("Pet imported.");
} catch (e) { console.error("Pet failed:", e); }

try {
    console.log("Importing Shelter...");
    await import("./models/Shelter.js");
    console.log("Shelter imported.");
} catch (e) { console.error("Shelter failed:", e); }

try {
    console.log("Importing MedicalRecord...");
    await import("./models/MedicalRecord.js");
    console.log("MedicalRecord imported.");
} catch (e) { console.error("MedicalRecord failed:", e); }

try {
    console.log("Importing Donation...");
    await import("./models/Donation.js");
    console.log("Donation imported.");
} catch (e) { console.error("Donation failed:", e); }

try {
    console.log("Importing Volunteer...");
    await import("./models/Volunteer.js");
    console.log("Volunteer imported.");
} catch (e) { console.error("Volunteer failed:", e); }

try {
    console.log("Importing AdoptionRequest...");
    await import("./models/AdoptionRequest.js");
    console.log("AdoptionRequest imported.");
} catch (e) { console.error("AdoptionRequest failed:", e); }

console.log("All imports attempted.");
process.exit(0);
