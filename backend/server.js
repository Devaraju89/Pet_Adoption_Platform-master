import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";

// Logging setup
const log = (msg) => {
    try {
        fs.appendFileSync("debug_startup.log", msg + "\n");
    } catch (e) { console.error(e); }
};

log("Starting server.js with error handling...");

try {
    dotenv.config();
    log("Dotenv configured");
} catch (e) { log("Dotenv error: " + e); }

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import petRoutes from "./routes/petRoutes.js";
import shelterRoutes from "./routes/shelterRoutes.js";
import medicalRoutes from "./routes/medicalRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";
import adminRoutes from "./routes/admin.js";
import adoptionRoutes from "./routes/adoptionRoutes.js";
import userRoutes from "./routes/userRoutes.js";
// import passport from "./config/passport.js";
// import googleAuthRoutes from "./routes/googleAuth.js";

const app = express();

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());
// // app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);
// app.use("/api/auth", googleAuthRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/shelters", shelterRoutes);
app.use("/api/medical", medicalRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/adoption-requests", adoptionRoutes);
app.use("/api/user", userRoutes);

// Root route
app.get("/", (req, res) => res.send("Backend is running 🚀"));

const PORT = process.env.PORT || 5000;
log(`Selected PORT: ${PORT}`);

const start = async () => {
    try {
        log("Connecting to DB...");
        await connectDB();
        log("DB Connected");

        const server = app.listen(PORT, () => {
            const msg = `Backend running on http://localhost:${PORT}`;
            console.log(msg);
            log(msg);
        });

        server.on('error', (e) => {
            const err = `Server listen error: ${e.code} on port ${PORT}`;
            console.error(err);
            log(err);
            process.exit(1);
        });

    } catch (err) {
        console.error("Server failed to start:", err);
        log("Server failed to start: " + err);
        process.exit(1);
    }
};

start();