import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String },
    pricePerNight: { type: Number, required: true },
    stars: { type: Number, min: 1, max: 5, default: 4 },
    amenities: [{ type: String }],
    imageUrl: { type: String },
    images: [{ type: String }],
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
  },
  { timestamps: true }
);

hotelSchema.index({ city: 1 });
hotelSchema.index({ featured: 1 });
hotelSchema.index({ stars: 1 });

export const Hotel = mongoose.model("Hotel", hotelSchema);


