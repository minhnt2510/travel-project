// Bookings API methods
import { apiRequest } from "./client";
import { Booking } from "./types";

export const bookingsApi = {
  getBookings: async (): Promise<Booking[]> => {
    return await apiRequest("/bookings");
  },

  createBooking: async (bookingData: {
    tourId: string;
    quantity: number;
    travelDate: string;
    travelers: Array<{ name: string; age: number; idCard?: string }>;
    contactInfo: { phone: string; email: string };
    specialRequests?: string;
  }): Promise<Booking> => {
    return await apiRequest("/bookings", {
      method: "POST",
      body: JSON.stringify(bookingData),
    });
  },

  getBookingById: async (id: string): Promise<Booking> => {
    return await apiRequest(`/bookings/${id}`);
  },

  cancelBooking: async (id: string): Promise<Booking> => {
    return await apiRequest(`/bookings/${id}/cancel`, {
      method: "PUT",
    });
  },

  // Admin endpoints
  getAllBookings: async (): Promise<Booking[]> => {
    return await apiRequest("/admin/bookings");
  },

  updateBookingStatus: async (id: string, status: string): Promise<Booking> => {
    return await apiRequest(`/admin/bookings/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  },
};

