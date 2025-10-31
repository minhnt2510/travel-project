import { apiRequest } from "./client";
import { Hotel } from "./types";

interface HotelsFilters {
  city?: string | string[];
  featured?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
  minPrice?: number;
  maxPrice?: number;
  stars?: number;
  minStars?: number;
}

export const hotelsApi = {
  getHotels: async (
    filters?: HotelsFilters
  ): Promise<{ hotels: Hotel[]; total: number; limit: number; offset: number }> => {
    const params = new URLSearchParams();
    if (filters?.city) {
      const value = Array.isArray(filters.city) ? filters.city.join(",") : filters.city;
      params.append("city", value);
    }
    if (filters?.featured) params.append("featured", "true");
    if (filters?.search) params.append("search", filters.search);
    if (filters?.limit) params.append("limit", String(filters.limit));
    if (filters?.offset) params.append("offset", String(filters.offset));
    if (filters?.minPrice) params.append("minPrice", String(filters.minPrice));
    if (filters?.maxPrice) params.append("maxPrice", String(filters.maxPrice));
    if (filters?.stars) params.append("stars", String(filters.stars));
    if (filters?.minStars) params.append("minStars", String(filters.minStars));

    const query = params.toString();
    return await apiRequest(`/hotels${query ? `?${query}` : ""}`);
  },

  getFeaturedHotels: async (): Promise<Hotel[]> => {
    return await apiRequest("/hotels/featured");
  },

  getHotelById: async (id: string): Promise<Hotel> => {
    return await apiRequest(`/hotels/${id}`);
  },
};


