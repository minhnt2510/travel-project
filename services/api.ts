// services/api.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

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

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
}

// === MOCK DATA (chỉ destinations) ===
const mockDestinations: Destination[] = [
  {
    id: "1",
    name: "Đà Lạt",
    country: "Việt Nam",
    city: "Lâm Đồng",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    rating: 4.8,
    reviews: 1250,
    price: "2,500,000đ",
    description: "Thành phố ngàn hoa với khí hậu mát mẻ quanh năm, nổi tiếng với những đồi thông, hồ nước thơ mộng và kiến trúc Pháp cổ kính.",
    coordinates: { latitude: 11.9404, longitude: 108.4583 },
  },
  {
    id: "2",
    name: "Phú Quốc",
    country: "Việt Nam",
    city: "Kiên Giang",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400",
    rating: 4.9,
    reviews: 2100,
    price: "5,500,000đ",
    description: "Đảo ngọc với những bãi biển tuyệt đẹp, nước biển trong xanh và hệ sinh thái biển phong phú.",
    coordinates: { latitude: 10.2899, longitude: 103.9840 },
  },
  {
    id: "3",
    name: "Hội An",
    country: "Việt Nam",
    city: "Quảng Nam",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400",
    rating: 4.7,
    reviews: 1800,
    price: "1,800,000đ",
    description: "Phố cổ Hội An với kiến trúc cổ kính, đèn lồng đầy màu sắc và ẩm thực đặc sắc.",
    coordinates: { latitude: 15.8801, longitude: 108.3380 },
  },
  {
    id: "4",
    name: "Hạ Long",
    country: "Việt Nam",
    city: "Quảng Ninh",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400",
    rating: 4.9,
    reviews: 3200,
    price: "3,200,000đ",
    description: "Vịnh Hạ Long với hàng nghìn đảo đá vôi tuyệt đẹp, được UNESCO công nhận là Di sản Thế giới.",
    coordinates: { latitude: 20.9101, longitude: 107.1839 },
  },
];

const mockUser: User = {
  id: "1",
  name: "Nguyễn Văn A",
  email: "nguyenvana@email.com",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
  phone: "0123456789",
};

// === HELPER: Lưu / Lấy trips từ AsyncStorage ===
const TRIPS_KEY = "travel_app_trips";

const getStoredTrips = async (): Promise<Trip[]> => {
  try {
    const json = await AsyncStorage.getItem(TRIPS_KEY);
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.error("Lỗi đọc trips:", error);
    return [];
  }
};

const saveTrips = async (trips: Trip[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
  } catch (error) {
    console.error("Lỗi lưu trips:", error);
  }
};

// === API ===
export const api = {
  // === DESTINATIONS ===
  getDestinations: async (): Promise<Destination[]> => {
    await new Promise((r) => setTimeout(r, 1000));
    return mockDestinations;
  },

  getDestinationById: async (id: string): Promise<Destination | null> => {
    await new Promise((r) => setTimeout(r, 500));
    return mockDestinations.find((d) => d.id === id) || null;
  },

  searchDestinations: async (query: string): Promise<Destination[]> => {
    await new Promise((r) => setTimeout(r, 800));
    const lower = query.toLowerCase();
    return mockDestinations.filter(
      (d) =>
        d.name.toLowerCase().includes(lower) ||
        d.city.toLowerCase().includes(lower) ||
        d.country.toLowerCase().includes(lower)
    );
  },

  // === TRIPS ===
  getTrips: async (): Promise<Trip[]> => {
    await new Promise((r) => setTimeout(r, 800));
    return await getStoredTrips();
  },

  createTrip: async (tripData: Omit<Trip, "id" | "createdAt">): Promise<Trip> => {
    await new Promise((r) => setTimeout(r, 1000));
    const trips = await getStoredTrips();
    const newTrip: Trip = {
      ...tripData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    trips.push(newTrip);
    await saveTrips(trips);
    return newTrip;
  },

  updateTrip: async (id: string, tripData: Partial<Trip>): Promise<Trip | null> => {
    await new Promise((r) => setTimeout(r, 800));
    const trips = await getStoredTrips();
    const index = trips.findIndex((t) => t.id === id);
    if (index === -1) return null;

    trips[index] = { ...trips[index], ...tripData };
    await saveTrips(trips);
    return trips[index];
  },

  deleteTrip: async (id: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 500));
    const trips = await getStoredTrips();
    const index = trips.findIndex((t) => t.id === id);
    if (index === -1) return false;

    trips.splice(index, 1);
    await saveTrips(trips);
    return true;
  },

  // === USER ===
  getUser: async (): Promise<User> => {
    await new Promise((r) => setTimeout(r, 500));
    return mockUser;
  },

  updateUser: async (userData: Partial<User>): Promise<User> => {
    await new Promise((r) => setTimeout(r, 800));
    Object.assign(mockUser, userData);
    return mockUser;
  },

  // === AUTH ===
  login: async (email: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> => {
    await new Promise((r) => setTimeout(r, 1000));
    if (email === "test@email.com" && password === "123456") {
      return { success: true, user: mockUser };
    }
    return { success: false, message: "Email hoặc mật khẩu không đúng" };
  },

  register: async (userData: { name: string; email: string; password: string }): Promise<{ success: boolean; user?: User; message?: string }> => {
    await new Promise((r) => setTimeout(r, 1000));
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
    };
    return { success: true, user: newUser };
  },
};