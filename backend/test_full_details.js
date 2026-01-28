import mongoose from "mongoose";
import dotenv from "dotenv";
import Pet from "./models/Pet.js";
// Models are needed if we query them directly, or if we use the controller logic (which we aren't, we are calling endpoints via script? No, testing logic).
// Wait, I can't call API endpoints easily from node script without axios.
// I will just test the logic by queries, or better yet, I should check if the ROUTES are defined.

// Let's rely on axios to hit the running server found in previous steps.
// This is better than mocking the database connection.

import axios from "axios";

const API_URL = "http://localhost:5002/api";

const testEndpoints = async () => {
    try {
        console.log("Fetching pets...");
        const petsRes = await axios.get(`${API_URL}/pets`);
        if (petsRes.data.length === 0) {
            console.log("No pets to test.");
            return;
        }

        const petId = petsRes.data[0]._id;
        console.log(`Testing with Pet ID: ${petId}`);

        console.log("1. Fetching Pet Details...");
        const petRes = await axios.get(`${API_URL}/pets/${petId}`);
        console.log("✅ Pet Details Status:", petRes.status);

        console.log("2. Fetching Medical Records...");
        try {
            const medRes = await axios.get(`${API_URL}/medical/pet/${petId}`);
            console.log("✅ Medical Records Status:", medRes.status);
            console.log("   Records found:", medRes.data.length);
        } catch (e) {
            console.log("❌ Medical Records Failed:", e.message);
        }

        console.log("3. Fetching Vaccinations...");
        try {
            const vacRes = await axios.get(`${API_URL}/medical/pet/${petId}/vaccinations`);
            console.log("✅ Vaccinations Status:", vacRes.status);
            console.log("   Vaccinations found:", vacRes.data.length);
        } catch (e) {
            console.log("❌ Vaccinations Failed:", e.message);
        }

    } catch (error) {
        console.error("❌ Test Failed:", error.message);
        if (error.response) {
            console.error("Response data:", error.response.data);
        }
    }
};

testEndpoints();
