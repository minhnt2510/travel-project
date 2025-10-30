// Đây là layout stack mặc định cho các màn hình dạng Stack trong project (ví dụ: modal, chi tiết, v.v.)
// app/screens/_layout.tsx
import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ScreensLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          backgroundColor: "#fff",
        },
      }}
    />
  );
}
