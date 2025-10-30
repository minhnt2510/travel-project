import mongoose from "mongoose";

const tourSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    imageUrl: { type: String },
    images: [{ type: String }],
    availableSeats: { type: Number, default: 0 },
    maxSeats: { type: Number, default: 20 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    duration: { type: Number, default: 1 }, // number of days
    category: { type: String, enum: ['adventure', 'culture', 'beach', 'mountain', 'city'], default: 'adventure' },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number }
    },
    itinerary: [{ 
      day: { type: Number },
      activities: [{ type: String }]
    }],
  },
  { timestamps: true }
);

tourSchema.index({ location: 1 });
tourSchema.index({ category: 1 });
tourSchema.index({ featured: 1 });

export const Tour = mongoose.model("Tour", tourSchema);
