// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Set the app root for expo-router
process.env.EXPO_ROUTER_APP_ROOT = path.resolve(__dirname, "app");

module.exports = config;
