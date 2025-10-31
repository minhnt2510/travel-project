// Helper methods - Legacy compatibility and utility functions
import { toursApi } from "./tours";
import { bookingsApi } from "./bookings";
import { usersApi } from "./users";
import { Destination, Trip } from "./types";

export const helpersApi = {
  getDestinations: async (): Promise<Destination[]> => {
    // Convert tours to destinations format for compatibility
    const tours = await toursApi.getFeaturedTours();
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
        price: tour.price
          ? typeof tour.price === "number"
            ? tour.price.toLocaleString("vi-VN") + "đ"
            : tour.price
          : "0đ",
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
    const bookings = await bookingsApi.getBookings();
    return bookings.map((booking) => ({
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
    }));
  },

  createTrip: async (
    tripData: Omit<Trip, "id" | "createdAt">,
    userEmail?: string,
    userPhone?: string
  ): Promise<Trip> => {
    // Get current user info if available
    let email = userEmail || "";
    let phone = userPhone || "";

    // If no user info provided, try to get from API
    if (!email || !phone) {
      try {
        const currentUser = await usersApi.getCurrentUser();
        if (currentUser) {
          email = email || currentUser.email || "";
          phone = phone || currentUser.phone || "";
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    }

    // Validate email - must have valid email
    if (!email || !email.includes("@")) {
      throw new Error(
        "Email không hợp lệ. Vui lòng cập nhật thông tin cá nhân."
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
        phone: phone || "0000000000", // Fallback phone
        email: email, // Must be valid email
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
    } catch {
      return false;
    }
  },
};
