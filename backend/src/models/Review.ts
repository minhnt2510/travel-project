import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  tourId: { type: mongoose.Schema.Types.ObjectId, ref: "Tour", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, maxlength: 500 },
  images: [{ type: String }],
  pros: [{ type: String }],
  cons: [{ type: String }],
  helpful: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

reviewSchema.index({ tourId: 1 });
reviewSchema.index({ userId: 1, tourId: 1 }, { unique: true }); // one review per user per tour

export const Review = mongoose.model("Review", reviewSchema);
