// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // "expo-router/babel" - deprecated, already included in babel-preset-expo
      "nativewind/babel",
      [
        "module-resolver",
        {
          root: ["./"],
          alias: { "@": "./" },
          extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
