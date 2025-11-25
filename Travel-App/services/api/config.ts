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

  // In development mode, use localhost by default
  // Set EXPO_PUBLIC_API_URL in .env file to override
  if (__DEV__) {
    // For iOS simulator or same machine
    // For Android emulator, change to "http://10.0.2.2:4000"
    // For physical device, use your computer's IP (e.g., "http://172.16.100.234:4000")
    return "http://localhost:4000";
  }

  // Production: Set EXPO_PUBLIC_API_URL environment variable
  // or update this fallback to your production backend URL
  return "http://localhost:4000"; // Default to localhost - update when deploying
};

export const API_URL = getApiUrl();

export const TOKEN_KEY = "travel_app_token";

// Log API URL for debugging (remove in production)
if (__DEV__) {
  console.log("🌐 API URL:", API_URL);
}
