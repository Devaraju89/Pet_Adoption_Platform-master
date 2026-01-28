import mongoose from "mongoose";

const adoptionRequestSchema = new mongoose.Schema({
    petId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pet",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending",
    },
}, { timestamps: true });

export default mongoose.model("AdoptionRequest", adoptionRequestSchema);
