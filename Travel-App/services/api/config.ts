// API Configuration
// For local development, use your local IP address
// You can change this to "http://localhost:4000" if testing on same machine
// For Android emulator, use "http://10.0.2.2:4000"
// For iOS simulator, use "http://localhost:4000"

// Auto-detect or use environment variable
const getApiUrl = () => {
  // Try to get from environment variable first
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Default fallback - change this to your backend IP
  // Using your computer's local IP for better compatibility with iOS Simulator
  // For Android physical device: use your computer's IP
  // For iOS physical device: use your computer's IP
  // For iOS Simulator: use your computer's IP (works better than localhost)
  // For Android Emulator: use 10.0.2.2
  // Your IP detected: 192.168.137.150
  return "http://192.168.1.5:4000";
};

export const API_URL = getApiUrl();

export const TOKEN_KEY = "travel_app_token";

// Log API URL for debugging (remove in production)
if (__DEV__) {
  console.log("🌐 API URL:", API_URL);
}
