// Reviews API methods
import { apiRequest } from "./client";
import { Review } from "./types";

export const reviewsApi = {
  getTourReviews: async (tourId: string): Promise<Review[]> => {
    return await apiRequest(`/tours/${tourId}/reviews`);
  },

  createReview: async (reviewData: {
    tourId: string;
    bookingId?: string;
    rating: number;
    comment?: string;
    images?: string[];
    pros?: string[];
    cons?: string[];
  }): Promise<Review> => {
    return await apiRequest("/reviews", {
      method: "POST",
      body: JSON.stringify(reviewData),
    });
  },

  updateReview: async (
    id: string,
    reviewData: Partial<Review>
  ): Promise<Review> => {
    return await apiRequest(`/reviews/${id}`, {
      method: "PUT",
      body: JSON.stringify(reviewData),
    });
  },

  deleteReview: async (id: string): Promise<void> => {
    await apiRequest(`/reviews/${id}`, {
      method: "DELETE",
    });
  },

  // Admin endpoints
  getAllReviews: async (): Promise<Review[]> => {
    return await apiRequest("/admin/reviews");
  },

  getTourReviews: async (tourId: string): Promise<Review[]> => {
    return await apiRequest(`/admin/reviews/tour/${tourId}`);
  },
};

