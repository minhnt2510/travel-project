// Wishlist API methods
import { apiRequest } from "./client";
import { Wishlist } from "./types";

export const wishlistApi = {
  getWishlist: async (): Promise<Wishlist[]> => {
    return await apiRequest("/wishlist");
  },

  addToWishlist: async (tourId: string): Promise<Wishlist> => {
    return await apiRequest(`/wishlist/${tourId}`, {
      method: "POST",
    });
  },

  removeFromWishlist: async (tourId: string): Promise<void> => {
    await apiRequest(`/wishlist/${tourId}`, {
      method: "DELETE",
    });
  },
};

