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

  // Default fallback - production API hosted on Render
  // Change this if you deploy backend somewhere else
  return "https://travel-project-b5d3.onrender.com";
};

export const API_URL = getApiUrl();

export const TOKEN_KEY = "travel_app_token";

// Log API URL for debugging (remove in production)
if (__DEV__) {
  console.log("🌐 API URL:", API_URL);
}
