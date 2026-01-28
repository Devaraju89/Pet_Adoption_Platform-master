import AdoptionRequest from "../models/AdoptionRequest.js";
import Pet from "../models/Pet.js";

// Create a new adoption request
export const createAdoptionRequest = async (req, res) => {
    try {
        const { petId, name, email, message } = req.body;
        const userId = req.user.id; // Get user ID from auth middleware

        // Validate fields
        if (!petId || !name || !email) {
            return res.status(400).json({ msg: "Please provide all required fields (petId, name, email)." });
        }

        // Verify pet exists
        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({ msg: "Pet not found." });
        }

        const newRequest = new AdoptionRequest({
            userId,
            petId,
            name,
            email,
            message,
        });

        const savedRequest = await newRequest.save();

        // Optionally update pet status to 'pending' if desired, but usually admins decide that.
        // For now, just save the request.

        res.status(201).json({ msg: "Adoption request submitted successfully", request: savedRequest });
    } catch (error) {
        console.error("Create adoption request error:", error);
        res.status(500).json({ msg: "Server error submitting adoption request" });
    }
};

// Get all adoption requests (Admin)
export const getAdoptionRequests = async (req, res) => {
    try {
        const requests = await AdoptionRequest.find()
            .populate("petId", "name type image adoptionFee")
            .populate("userId", "name email");
        res.json(requests);
    } catch (error) {
        console.error("Get adoption requests error:", error);
        res.status(500).json({ msg: "Server error fetching requests" });
    }
};

// Get user's adoption requests
export const getMyAdoptionRequests = async (req, res) => {
    try {
        const requests = await AdoptionRequest.find({ userId: req.user.id })
            .populate("petId", "name type image adoptionFee")
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        console.error("Get my requests error:", error);
        res.status(500).json({ msg: "Server error fetching your requests" });
    }
};

// Update adoption status (Admin)
export const updateAdoptionStatus = async (req, res) => {
    try {
        const { status, paymentStatus } = req.body;
        const { id } = req.params;

        const updateData = {};
        if (status) updateData.status = status;
        if (paymentStatus) updateData.paymentStatus = paymentStatus;

        const updatedRequest = await AdoptionRequest.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );

        // If payment is completed, mark pet as adopted
        if (paymentStatus === 'completed' && updatedRequest) {
            await Pet.findByIdAndUpdate(updatedRequest.petId, { adoptionStatus: 'adopted' });
        }

        if (!updatedRequest) {
            return res.status(404).json({ msg: "Request not found" });
        }

        res.json(updatedRequest);
    } catch (error) {
        console.error("Update status error:", error);
        res.status(500).json({ msg: "Server error updating status" });
    }
};
