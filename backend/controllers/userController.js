import User from "../models/User.js";

// Toggle favorite status of a pet
export const toggleFavorite = async (req, res) => {
    try {
        const { petId } = req.params;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const index = user.favorites.indexOf(petId);
        if (index === -1) {
            // Add to favorites
            user.favorites.push(petId);
            await user.save();
            return res.json({ msg: "Added to favorites", favorited: true, favorites: user.favorites });
        } else {
            // Remove from favorites
            user.favorites.splice(index, 1);
            await user.save();
            return res.json({ msg: "Removed from favorites", favorited: false, favorites: user.favorites });
        }
    } catch (error) {
        console.error("Toggle favorite error:", error);
        res.status(500).json({ msg: "Server error toggling favorite" });
    }
};

// Get user's favorites
export const getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("favorites");
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.json(user.favorites);
    } catch (error) {
        console.error("Get favorites error:", error);
        res.status(500).json({ msg: "Server error fetching favorites" });
    }
};
