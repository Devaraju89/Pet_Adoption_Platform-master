import express from "express";
import { toggleFavorite, getFavorites } from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Toggle favorite (add/remove) - Secured
router.post("/favorites/:petId", authenticateToken, toggleFavorite);

// Get all favorites - Secured
router.get("/favorites", authenticateToken, getFavorites);

export default router;
