// API Client - Request helper
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, TOKEN_KEY } from "./config";

// Helper function to get auth token
export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

// Helper function to save auth token
export const saveToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error("Error saving token:", error);
  }
};

// Helper function to remove auth token
export const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error removing token:", error);
  }
};

// API request helper
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = await getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    // Add timeout to fetch - increased to 30 seconds
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: `Request failed with status ${response.status}` }));
      
      if (response.status === 404) {
        throw new Error("Không tìm thấy dữ liệu");
      }
      
      throw new Error(error.message || `Request failed: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error("API Error: Request timed out", endpoint);
      throw new Error("Kết nối timeout. Vui lòng kiểm tra kết nối mạng và backend.");
    }
    if (error.message) {
      throw error;
    }
    console.error("API Error:", error, endpoint);
    throw new Error("Có lỗi xảy ra khi kết nối đến server");
  }
};
