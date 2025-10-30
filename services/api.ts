// services/api.ts
// Backward compatibility - re-exports from modular structure
export * from "./api/index";

// Default export for backward compatibility
import { api } from "./api/index";
export default api;
