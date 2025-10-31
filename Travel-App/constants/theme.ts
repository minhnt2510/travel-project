/**
 * Modern Theme configuration for the app
 * Supports Light & Dark mode with beautiful gradients and consistent design tokens
 */

import { Platform } from 'react-native';

// Primary gradient colors
const primaryGradientLight = ['#667eea', '#764ba2']; // Purple to violet
const primaryGradientDark = ['#8b5cf6', '#6366f1']; // Lighter purple

export const Colors = {
  light: {
    // Core
    text: '#1a1a2e',           // Dark navy
    background: '#ffffff',
    tint: '#667eea',           // Purple
    icon: '#64748b',           // slate-500
    tabIconDefault: '#94a3b8', // slate-400
    tabIconSelected: '#667eea',
    // Semantic
    primary: '#667eea',        // Purple
    secondary: '#8b5cf6',      // Violet
    accent: '#f59e0b',         // Amber/Gold
    success: '#10b981',        // Emerald
    warning: '#f59e0b',        // Amber
    error: '#ef4444',          // Red

    // Surfaces
    surface: '#f8fafc',        // slate-50
    card: '#ffffff',
    border: '#e2e8f0',         // slate-200
    
    // Gradients
    gradientPrimary: primaryGradientLight,
    gradientHero: ['#667eea', '#764ba2', '#f093fb'],
    gradientCard: ['#ffffff', '#f8fafc'],

    // Status bar
    statusBar: 'dark-content' as const,
  },
  dark: {
    // Core
    text: '#f1f5f9',           // slate-100
    background: '#0f172a',     // slate-900
    icon: '#94a3b8',           // slate-400
    tabIconDefault: '#64748b', // slate-500
    tabIconSelected: '#8b5cf6',

    // Semantic
    primary: '#8b5cf6',        // Lighter purple
    secondary: '#a78bfa',      // light violet
    accent: '#fbbf24',         // light amber
    success: '#34d399',        // emerald-400
    warning: '#fbbf24',        // amber-400
    error: '#f87171',          // red-400

    // Surfaces
    surface: '#1e293b',        // slate-800
    card: '#1e293b',           // slate-800
    border: '#334155',         // slate-700

    // Gradients
    gradientPrimary: primaryGradientDark,
    gradientHero: ['#1e293b', '#334155', '#475569'],
    gradientCard: ['#1e293b', '#0f172a'],

    // Status bar
    statusBar: 'light-content' as const,
  },
};

// Auto-select tint based on primary
Colors.light.tint = Colors.light.primary;

// Font families by platform
export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'Georgia',
    rounded: 'System',
    mono: 'Courier New',
  },
  android: {
    sans: 'Roboto',
    serif: 'Roboto Serif',
    rounded: 'Roboto',
    mono: 'Roboto Mono',
  },
  web: {
    sans: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`,
    serif: `Georgia, 'Times New Roman', serif`,
    rounded: `'SF Pro Rounded', system-ui, sans-serif`,
    mono: `SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace`,
  },
  default: {
    sans: 'System',
    serif: 'Georgia',
    rounded: 'System',
    mono: 'monospace',
  },
})!;

// Spacing scale (4px grid)
export const Spacing = {
  '0': 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
  '4xl': 56,
};

// Border radius (consistent with component sizes)
export const BorderRadius = {
  none: 0,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

// Shadows (optimized for both platforms)
export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
};

// Optional: Export current theme based on system
export const getCurrentTheme = (isDark: boolean) => (isDark ? Colors.dark : Colors.light);