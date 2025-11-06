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
export * as chatApi from "./chat";
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
import { chatApi } from "./chat";
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
  changePassword: usersApi.changePassword,

  // Admin Users
  getAllUsers: usersApi.getAllUsers,
  getUserById: usersApi.getUserById,
  deleteUser: usersApi.deleteUser,
  updateUserRole: usersApi.updateUserRole,

  // Bookings
  getBookings: bookingsApi.getBookings,
  createBooking: bookingsApi.createBooking,
  getBookingById: bookingsApi.getBookingById,
  cancelBooking: bookingsApi.cancelBooking,
  
  // Admin Bookings
  getAllBookings: bookingsApi.getAllBookings,
  updateBookingStatus: bookingsApi.updateBookingStatus,

  // Reviews
  getTourReviews: reviewsApi.getTourReviews,
  createReview: reviewsApi.createReview,
  updateReview: reviewsApi.updateReview,
  deleteReview: reviewsApi.deleteReview,
  getAllReviews: reviewsApi.getAllReviews, // Admin
  getTourReviewsForAdmin: reviewsApi.getTourReviews, // Admin alias

  // Wishlist
  getWishlist: wishlistApi.getWishlist,
  addToWishlist: wishlistApi.addToWishlist,
  removeFromWishlist: wishlistApi.removeFromWishlist,

  // Notifications
  getNotifications: notificationsApi.getNotifications,
  markNotificationRead: notificationsApi.markNotificationRead,
  markAllNotificationsRead: notificationsApi.markAllNotificationsRead,
  deleteNotification: notificationsApi.deleteNotification,

  // Chat
  sendChatMessage: chatApi.sendMessage,

  // Legacy/Helpers
  getDestinations: helpersApi.getDestinations,
  getDestinationById: helpersApi.getDestinationById,
  searchDestinations: helpersApi.searchDestinations,
  getTrips: helpersApi.getTrips,
  createTrip: helpersApi.createTrip,
  updateTrip: helpersApi.updateTrip,
  deleteTrip: helpersApi.deleteTrip,
};

