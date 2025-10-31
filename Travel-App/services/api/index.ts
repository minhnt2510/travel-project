// Main API export - aggregates all API modules
export * from "./types";
export * as authApi from "./auth";
export * as toursApi from "./tours";
export * as bookingsApi from "./bookings";
export * as hotelsApi from "./hotels";
export * as reviewsApi from "./reviews";
export * as wishlistApi from "./wishlist";
export * as usersApi from "./users";
export * as notificationsApi from "./notifications";
export * as helpersApi from "./helpers";
export { removeToken } from "./client";

// Unified API object for backward compatibility
import { authApi } from "./auth";
import { toursApi } from "./tours";
import { bookingsApi } from "./bookings";
import { hotelsApi } from "./hotels";
import { reviewsApi } from "./reviews";
import { wishlistApi } from "./wishlist";
import { usersApi } from "./users";
import { notificationsApi } from "./notifications";
import { helpersApi } from "./helpers";
import { removeToken } from "./client";

export const api = {
  // Auth
  login: authApi.login,
  register: authApi.register,
  logout: removeToken,

  // Tours
  getTours: toursApi.getTours,
  getFeaturedTours: toursApi.getFeaturedTours,
  getTourById: toursApi.getTourById,

  // Hotels
  getHotels: hotelsApi.getHotels,
  getFeaturedHotels: hotelsApi.getFeaturedHotels,
  getHotelById: hotelsApi.getHotelById,

  // User
  getCurrentUser: usersApi.getCurrentUser,
  getUser: usersApi.getCurrentUser, // Alias
  updateUser: usersApi.updateUser,

  // Bookings
  getBookings: bookingsApi.getBookings,
  createBooking: bookingsApi.createBooking,
  getBookingById: bookingsApi.getBookingById,
  cancelBooking: bookingsApi.cancelBooking,

  // Reviews
  getTourReviews: reviewsApi.getTourReviews,
  createReview: reviewsApi.createReview,
  updateReview: reviewsApi.updateReview,
  deleteReview: reviewsApi.deleteReview,

  // Wishlist
  getWishlist: wishlistApi.getWishlist,
  addToWishlist: wishlistApi.addToWishlist,
  removeFromWishlist: wishlistApi.removeFromWishlist,

  // Notifications
  getNotifications: notificationsApi.getNotifications,
  markNotificationRead: notificationsApi.markNotificationRead,
  markAllNotificationsRead: notificationsApi.markAllNotificationsRead,
  deleteNotification: notificationsApi.deleteNotification,

  // Legacy/Helpers
  getDestinations: helpersApi.getDestinations,
  getDestinationById: helpersApi.getDestinationById,
  searchDestinations: helpersApi.searchDestinations,
  getTrips: helpersApi.getTrips,
  createTrip: helpersApi.createTrip,
  updateTrip: helpersApi.updateTrip,
  deleteTrip: helpersApi.deleteTrip,
};

