// API Types & Interfaces

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
  status: "pending" | "confirmed" | "in_progress" | "cancelled" | "completed";
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
  tourId: string | { _id: string; title: string; imageUrl?: string; location?: string };
  bookingId?: string | { _id: string; travelDate?: string; quantity?: number };
  userId: string | { _id?: string; name: string; avatar?: string; email?: string };
  rating: number;
  comment?: string;
  images?: string[];
  pros?: string[];
  cons?: string[];
  createdAt: string;
  updatedAt?: string;
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
  role?: "user" | "admin";
  createdAt?: string;
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
  status: "confirmed" | "pending" | "in_progress" | "cancelled" | "completed";
  createdAt: string;
}

export interface Hotel {
  _id: string;
  name: string;
  description: string;
  city: string;
  address?: string;
  pricePerNight: number;
  stars: number;
  amenities?: string[];
  imageUrl?: string;
  images?: string[];
  rating: number;
  reviewCount: number;
  featured: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

