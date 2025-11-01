// Tours API methods
import { apiRequest } from "./client";
import { Tour } from "./types";

interface ToursFilters {
  category?: string;
  location?: string;
  featured?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
  minPrice?: number;
  maxPrice?: number;
}

export const toursApi = {
  getTours: async (
    filters?: ToursFilters
  ): Promise<{ tours: Tour[]; total: number }> => {
    const params = new URLSearchParams();
    if (filters?.category) params.append("category", filters.category);
    if (filters?.location) params.append("location", filters.location);
    if (filters?.featured) params.append("featured", "true");
    if (filters?.search) params.append("search", filters.search);
    if (filters?.limit)
      params.append("limit", filters.limit.toString());
    if (filters?.offset)
      params.append("offset", filters.offset.toString());
    if (filters?.minPrice)
      params.append("minPrice", filters.minPrice.toString());
    if (filters?.maxPrice)
      params.append("maxPrice", filters.maxPrice.toString());

    const query = params.toString();
    return await apiRequest(`/tours${query ? `?${query}` : ""}`);
  },

  getFeaturedTours: async (): Promise<Tour[]> => {
    return await apiRequest("/tours/featured");
  },

  getTourById: async (id: string): Promise<Tour> => {
    // Validate MongoDB ObjectId format before making API call
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new Error("Invalid tour ID format");
    }
    return await apiRequest(`/tours/${id}`);
  },
};

