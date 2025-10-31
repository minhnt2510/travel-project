import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  tourId: { type: mongoose.Schema.Types.ObjectId, ref: "Tour", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  quantity: { type: Number, default: 1 },
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "in_progress", "cancelled", "completed"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "refunded"],
    default: "pending",
  },
  travelDate: { type: Date, required: true },
  travelers: [{
    name: { type: String },
    age: { type: Number },
    idCard: { type: String }
  }],
  contactInfo: {
    phone: { type: String },
    email: { type: String }
  },
  specialRequests: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

bookingSchema.index({ userId: 1 });
bookingSchema.index({ tourId: 1 });
bookingSchema.index({ status: 1 });

export const Booking = mongoose.model("Booking", bookingSchema);
