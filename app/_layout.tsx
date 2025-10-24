import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { View } from "react-native";

import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <View className={`flex-1 ${isDark ? "bg-slate-900" : "bg-white"}`}>
        <Stack>
          {/* Tabs & Auth groups */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="screens" options={{ headerShown: false }} />

          {/* Single screens (tránh 404, tùy biến header) */}
          <Stack.Screen name="screens/Checkout" options={{ headerShown: false }} />
          <Stack.Screen name="screens/PaymentResult" options={{ headerShown: false }} />
          <Stack.Screen name="screens/Chat" options={{ headerShown: false }} />
          <Stack.Screen name="screens/Notifications" options={{ title: "Thông báo" }} />
          <Stack.Screen name="screens/ReviewCreate" options={{ title: "Đánh giá" }} />
          <Stack.Screen name="screens/TripDetail" options={{ title: "Chi tiết chuyến" }} />

          {/* Modal (nếu dùng) */}
          <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} />
        </Stack>

        <StatusBar style={isDark ? "light" : "dark"} />
      </View>
    </ThemeProvider>
  );
}
