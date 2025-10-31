// Helper methods - Legacy compatibility and utility functions
import { toursApi } from "./tours";
import { bookingsApi } from "./bookings";
import { usersApi } from "./users";
import { Destination, Trip } from "./types";

export const helpersApi = {
  getDestinations: async (): Promise<Destination[]> => {
    // Show more places: pull a larger list of tours, not only featured
    const { tours } = await toursApi.getTours({ limit: 100 });
    return tours.map((tour) => ({
      id: tour._id,
      name: tour.title,
      country: "Việt Nam",
      city: tour.location,
      image: tour.imageUrl || tour.images?.[0] || "",
      rating: tour.rating,
      reviews: tour.reviewCount,
      price: tour.price.toLocaleString("vi-VN") + "đ",
      description: tour.description,
      coordinates: tour.coordinates || { latitude: 0, longitude: 0 },
    }));
  },

  getDestinationById: async (id: string): Promise<Destination | null> => {
    try {
      const tour = await toursApi.getTourById(id);
      if (!tour || !tour._id) {
        throw new Error("Tour không tồn tại");
      }
      return {
        id: tour._id,
        name: tour.title || "Không có tên",
        country: "Việt Nam",
        city: tour.location || "Không xác định",
        image: tour.imageUrl || tour.images?.[0] || "",
        rating: tour.rating || 0,
        reviews: tour.reviewCount || 0,
        price: tour.price ? typeof tour.price === 'number' ? tour.price.toLocaleString("vi-VN") + "đ" : tour.price : "0đ",
        description: tour.description || "",
        coordinates: tour.coordinates || { latitude: 0, longitude: 0 },
      };
    } catch (error: any) {
      console.error("Error in getDestinationById:", error);
      if (error.message) {
        throw error;
      }
      throw new Error("Không thể tải thông tin tour. Vui lòng thử lại.");
    }
  },

  searchDestinations: async (query: string): Promise<Destination[]> => {
    const { tours } = await toursApi.getTours({ search: query });
    return tours.map((tour) => ({
      id: tour._id,
      name: tour.title,
      country: "Việt Nam",
      city: tour.location,
      image: tour.imageUrl || "",
      rating: tour.rating,
      reviews: tour.reviewCount,
      price: tour.price.toLocaleString("vi-VN") + "đ",
      description: tour.description,
      coordinates: tour.coordinates || { latitude: 0, longitude: 0 },
    }));
  },

  getTrips: async (): Promise<Trip[]> => {
    try {
      const bookings = await bookingsApi.getBookings();
      return bookings.map((booking) => {
        // Handle travelDate - could be string or Date
        // Format: from "2025-10-31T00:00:000z" to "2025-10-31" (YYYY-MM-DD)
        let travelDate = "";
        if (booking.travelDate) {
          if (typeof booking.travelDate === 'string') {
            // Remove timezone and time parts: "2025-10-31T00:00:000z" -> "2025-10-31"
            travelDate = booking.travelDate.split('T')[0];
          } else {
            // If it's a Date object
            travelDate = new Date(booking.travelDate).toISOString().split('T')[0];
          }
        } else {
          travelDate = new Date().toISOString().split('T')[0];
        }
        
        // Handle totalPrice - ensure it's a number
        const totalPriceNum = typeof booking.totalPrice === 'number' 
          ? booking.totalPrice 
          : Number(booking.totalPrice) || 0;
        
        // Handle createdAt - could be string or Date
        const createdAt = booking.createdAt
          ? (typeof booking.createdAt === 'string'
              ? booking.createdAt
              : new Date(booking.createdAt).toISOString())
          : new Date().toISOString();
        
        // Handle tourId - could be populated or just ID
        let destinationId = "";
        let destinationName = "";
        let destinationImage = "";
        
        if (typeof booking.tourId === "string") {
          destinationId = booking.tourId;
        } else if (booking.tourId && typeof booking.tourId === "object") {
          destinationId = (booking.tourId as any)._id || "";
          destinationName = (booking.tourId as any).title || "";
          destinationImage = (booking.tourId as any).imageUrl || (booking.tourId as any).images?.[0] || "";
        }
        
        return {
          id: booking._id,
          destinationId,
          destinationName,
          destinationImage,
          startDate: travelDate,
          endDate: travelDate,
          travelers: booking.quantity || 1,
          totalPrice: totalPriceNum.toLocaleString("vi-VN") + "đ",
          status: (booking.status || "pending") as "confirmed" | "pending" | "in_progress" | "cancelled" | "completed",
          createdAt,
        };
      });
    } catch (error: any) {
      console.error("Error in getTrips:", error);
      throw error;
    }
  },

  createTrip: async (
    tripData: Omit<Trip, "id" | "createdAt">
  ): Promise<Trip> => {
    // Get current user info for contact details
    let userEmail = "";
    let userPhone = "";
    try {
      const currentUser = await usersApi.getCurrentUser();
      if (!currentUser.email) {
        throw new Error("User email is required for booking");
      }
      userEmail = currentUser.email;
      userPhone = currentUser.phone || "";
    } catch (error: any) {
      throw new Error(
        error.message || "Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại."
      );
    }

    const bookingData = {
      tourId: tripData.destinationId,
      quantity: tripData.travelers,
      travelDate: tripData.startDate,
      travelers: Array(tripData.travelers)
        .fill(0)
        .map((_, i) => ({ name: `Traveler ${i + 1}`, age: 25 })),
      contactInfo: { 
        phone: userPhone || "0000000000", 
        email: userEmail 
      },
    };
    const booking = await bookingsApi.createBooking(bookingData);
    return {
      id: booking._id,
      destinationId:
        typeof booking.tourId === "string"
          ? booking.tourId
          : booking.tourId._id,
      destinationName:
        typeof booking.tourId === "string" ? "" : booking.tourId.title,
      destinationImage:
        typeof booking.tourId === "string" ? "" : booking.tourId.imageUrl || "",
      startDate: booking.travelDate,
      endDate: booking.travelDate,
      travelers: booking.quantity,
      totalPrice: booking.totalPrice.toLocaleString("vi-VN") + "đ",
      status: booking.status as "confirmed" | "pending" | "cancelled",
      createdAt: booking.createdAt,
    };
  },

  updateTrip: async (
    id: string,
    tripData: Partial<Trip>
  ): Promise<Trip | null> => {
    // Implementation needed based on your requirements
    return null;
  },

  deleteTrip: async (id: string): Promise<boolean> => {
    try {
      await bookingsApi.cancelBooking(id);
      return true;
    } catch (error: any) {
      // If booking is already cancelled, treat as success (don't log as error)
      if (error.isAlreadyCancelled || 
          error.message?.includes("already cancelled") || 
          error.message?.includes("Booking already cancelled")) {
        return true; // Silent success for already cancelled bookings
      }
      throw error; // Re-throw other errors
    }
  },
};

