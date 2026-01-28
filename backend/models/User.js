import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "admin", "shelter_staff"],
    default: "user",
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pet"
  }],
  googleId: { type: String, unique: true, sparse: true },
  profilePicture: { type: String },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
