// services/api.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:4000"; // Change this to your backend URL
// For Android emulator: use http://10.0.2.2:4000
// For iOS simulator: use http://localhost:4000
// For physical device: use your computer's IP (e.g., http://192.168.1.100:4000)

const TOKEN_KEY = "travel_app_token";

// Helper function to get auth token
const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

// Helper function to save auth token
const saveToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error("Error saving token:", error);
  }
};

// Helper function to remove auth token
const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error removing token:", error);
  }
};

// API request helper
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = await getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Request failed" }));
      throw new Error(error.message || "Request failed");
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// === INTERFACES ===

export interface Destination {
  id: string;
  name: string;
  country: string;
  city: string;
  image: string;
  rating: number;
  reviews: number;
  price: string;
  description: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface Tour {
  _id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  images?: string[];
  availableSeats: number;
  maxSeats: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  category: string;
  duration: number;
  startDate: string;
  endDate: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  itinerary?: Array<{
    day: number;
    activities: string[];
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface Booking {
  _id: string;
  tourId: string | Tour;
  userId: string;
  quantity: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus: "pending" | "paid" | "refunded";
  travelDate: string;
  travelers: Array<{
    name: string;
    age: number;
    idCard?: string;
  }>;
  contactInfo: {
    phone: string;
    email: string;
  };
  specialRequests?: string;
  createdAt: string;
}

export interface Review {
  _id: string;
  tourId: string;
  userId: string | { name: string; avatar?: string };
  rating: number;
  comment?: string;
  images?: string[];
  pros?: string[];
  cons?: string[];
  createdAt: string;
}

export interface Wishlist {
  _id: string;
  userId: string;
  tourId: string | Tour;
  createdAt: string;
}

export interface Notification {
  _id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  role?: string;
}

export interface Trip {
  id: string;
  destinationId: string;
  destinationName: string;
  destinationImage: string;
  startDate: string;
  endDate: string;
  travelers: number;
  totalPrice: string;
  status: "confirmed" | "pending" | "cancelled";
  createdAt: string;
}

// === API METHODS ===

export const api = {
  // === AUTH ===
  login: async (
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    user?: User;
    accessToken?: string;
    message?: string;
  }> => {
    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (data.accessToken) {
        await saveToken(data.accessToken);
      }

      return {
        success: true,
        user: data.user,
        accessToken: data.accessToken,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Đăng nhập thất bại",
      };
    }
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ success: boolean; user?: User; message?: string }> => {
    try {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      });

      return { success: true, user: data };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Đăng ký thất bại",
      };
    }
  },

  logout: async (): Promise<void> => {
    await removeToken();
  },

  // === TOURS ===
  getTours: async (filters?: {
    category?: string;
    location?: string;
    featured?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<{ tours: Tour[]; total: number }> => {
    const params = new URLSearchParams();
    if (filters?.category) params.append("category", filters.category);
    if (filters?.location) params.append("location", filters.location);
    if (filters?.featured) params.append("featured", "true");
    if (filters?.search) params.append("search", filters.search);
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.offset) params.append("offset", filters.offset.toString());
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
    return await apiRequest(`/tours/${id}`);
  },

  // === USER ===
  getCurrentUser: async (): Promise<User> => {
    return await apiRequest("/me");
  },

  updateUser: async (userData: Partial<User>): Promise<User> => {
    return await apiRequest("/me", {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  },

  // === BOOKINGS ===
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

  // === REVIEWS ===
  getTourReviews: async (tourId: string): Promise<Review[]> => {
    return await apiRequest(`/tours/${tourId}/reviews`);
  },

  createReview: async (reviewData: {
    tourId: string;
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

  // === WISHLIST ===
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

  // === NOTIFICATIONS ===
  getNotifications: async (): Promise<Notification[]> => {
    return await apiRequest("/notifications");
  },

  markNotificationRead: async (id: string): Promise<Notification> => {
    return await apiRequest(`/notifications/${id}/read`, {
      method: "PUT",
    });
  },

  markAllNotificationsRead: async (): Promise<void> => {
    await apiRequest("/notifications/read-all", {
      method: "PUT",
    });
  },

  deleteNotification: async (id: string): Promise<void> => {
    await apiRequest(`/notifications/${id}`, {
      method: "DELETE",
    });
  },

  // === LEGACY/HELPER METHODS ===
  getDestinations: async (): Promise<Destination[]> => {
    // Convert tours to destinations format for compatibility
    const tours = await api.getFeaturedTours();
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
    const tour = await api.getTourById(id);
    return {
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
    };
  },

  searchDestinations: async (query: string): Promise<Destination[]> => {
    const { tours } = await api.getTours({ search: query });
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

  getUser: async (): Promise<User> => {
    return await api.getCurrentUser();
  },

  getTrips: async (): Promise<Trip[]> => {
    const bookings = await api.getBookings();
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
    tripData: Omit<Trip, "id" | "createdAt">
  ): Promise<Trip> => {
    // This needs the actual implementation based on your needs
    const bookingData = {
      tourId: tripData.destinationId,
      quantity: tripData.travelers,
      travelDate: tripData.startDate,
      travelers: Array(tripData.travelers)
        .fill(0)
        .map((_, i) => ({ name: `Traveler ${i + 1}`, age: 25 })),
      contactInfo: { phone: "", email: "" },
    };
    const booking = await api.createBooking(bookingData);
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
      await api.cancelBooking(id);
      return true;
    } catch {
      return false;
    }
  },
};
