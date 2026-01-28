import express from "express";
import {
    createAdoptionRequest,
    getAdoptionRequests,
    getMyAdoptionRequests,
    updateAdoptionStatus
} from "../controllers/adoptionController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route to submit request (Now secured)
router.post("/", authenticateToken, createAdoptionRequest);

// Get user's requests
router.get("/my-requests", authenticateToken, getMyAdoptionRequests);

// Admin route to view requests (TODO: Add admin auth middleware later)
router.get("/", getAdoptionRequests);

// Update status (Admin)
router.patch("/:id/status", updateAdoptionStatus);

export default router;
