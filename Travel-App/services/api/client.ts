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

// API request helper with retry logic
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {},
  retries: number = 2
): Promise<any> => {
  const token = await getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Helper function to make a single request attempt
  const makeRequest = async (attempt: number): Promise<Response> => {
    const controller = new AbortController();
    // Increased timeout to 45 seconds for slow connections
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 45000);

    try {
      const url = `${API_URL}${endpoint}`;
      // Removed verbose logging

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error: any) {
      clearTimeout(timeoutId);

      // If it's an abort error (timeout) and we have retries left, throw to retry
      if (error.name === "AbortError" && attempt < retries) {
        throw error;
      }

      // Re-throw to be handled by outer catch
      throw error;
    }
  };

  // Retry logic
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (attempt > 0) {
        // Wait before retry: exponential backoff (1s, 2s, 4s...)
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise((resolve) => setTimeout(resolve, delay));
        // Retrying silently
      }

      const response = await makeRequest(attempt);

      if (!response.ok) {
        // Try to get error details from response
        let error: any = {
          message: `Request failed with status ${response.status}`,
        };
        const contentType = response.headers.get("content-type");

        try {
          if (contentType && contentType.includes("application/json")) {
            error = await response.json();
          } else {
            const text = await response.text();
            error = { message: text || `Request failed: ${response.status}` };
          }
        } catch (e) {
          // If we can't parse, use default error
          if (__DEV__) {
            console.warn(`⚠️ Could not parse error response for ${endpoint}`);
          }
        }

        // Extract error message from various possible formats
        let errorMessage =
          error.message || error.error || `Request failed: ${response.status}`;

        // Handle Zod validation errors (fieldErrors format)
        if (error.fieldErrors) {
          const fieldErrors: string[] = [];
          Object.entries(error.fieldErrors).forEach(([field, messages]) => {
            const msgs = Array.isArray(messages) ? messages : [messages];
            msgs.forEach((msg: string) => {
              fieldErrors.push(`${field}: ${msg}`);
            });
          });
          if (fieldErrors.length > 0) {
            errorMessage = fieldErrors.join(", ");
          }
        }

        // Don't retry on client errors (4xx) except 408 (Request Timeout)
        // These should be thrown immediately without retrying
        if (
          response.status >= 400 &&
          response.status < 500 &&
          response.status !== 408
        ) {
          const errorMsg =
            typeof errorMessage === "string"
              ? errorMessage
              : JSON.stringify(errorMessage) ||
                `Request failed: ${response.status}`;

          // Don't log "already cancelled" errors as they're handled gracefully
          const isAlreadyCancelled =
            errorMsg.includes("already cancelled") ||
            errorMsg.includes("Booking already cancelled");

          // For Forbidden (403) on booking/review endpoints, don't log as ERROR since we have fallback
          // Only log if it's not a detail request (which has fallback mechanism)
          const isBookingForbidden =
            response.status === 403 &&
            endpoint.includes("/bookings/") &&
            !endpoint.includes("/cancel");
          const isReviewForbidden =
            response.status === 403 && endpoint.includes("/reviews");

          // Only log server errors (5xx) - client errors are expected and handled
          if (
            __DEV__ &&
            !isAlreadyCancelled &&
            !isBookingForbidden &&
            !isReviewForbidden &&
            response.status >= 500
          ) {
            console.error(`API Error ${response.status} for ${endpoint}`);
          }

          const clientError = new Error(errorMsg);
          (clientError as any).statusCode = response.status;
          (clientError as any).isClientError = true; // Mark as client error to prevent retry
          (clientError as any).isAlreadyCancelled = isAlreadyCancelled; // Mark for special handling
          (clientError as any).isBookingForbidden = isBookingForbidden; // Mark for silent fallback
          throw clientError;
        }

        // For server errors (5xx) or 408, retry if attempts remain
        if (
          attempt < retries &&
          (response.status >= 500 || response.status === 408)
        ) {
          continue;
        }

        throw new Error(
          typeof errorMessage === "string"
            ? errorMessage
            : `Request failed: ${response.status}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      // Don't retry client errors (4xx) - throw immediately
      if (error.isClientError) {
        throw error;
      }

      // If this was the last attempt, throw the error
      if (attempt === retries) {
        if (error.name === "AbortError") {
          throw new Error(
            `Kết nối timeout sau ${
              retries + 1
            } lần thử. Vui lòng kiểm tra kết nối mạng và đảm bảo backend đang chạy tại ${API_URL}`
          );
        }
        if (error.message) {
          throw error;
        }
        throw new Error(
          "Có lỗi xảy ra khi kết nối đến server. Vui lòng kiểm tra kết nối mạng."
        );
      }
      // Otherwise, continue to next retry (only for network errors or server errors)
    }
  }

  // This should never be reached, but TypeScript needs it
  throw new Error("Unexpected error in API request");
};
