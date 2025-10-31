import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { Tabs } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const t = Colors[useColorScheme() ?? "light"] as Record<string, string>;

  const activeTint =
    "tint" in t
      ? t.tint
      : "tabIconSelected" in t
      ? t.tabIconSelected
      : t.primary;
  const inactiveTint = "tabIconDefault" in t ? t.tabIconDefault : t.icon;

  return (
    <SafeAreaView
      edges={["top"]}
      style={{ flex: 1, backgroundColor: t.background }}
    >
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: activeTint,
          tabBarInactiveTintColor: inactiveTint,
          tabBarStyle: {
            backgroundColor: t.background,
            borderTopWidth: 1,
            borderTopColor: "#E5E7EB",
            height: 65 + insets.bottom,
            paddingTop: 8,
            paddingBottom: Math.max(8, insets.bottom / 2),
            paddingHorizontal: 8,
          },
          tabBarLabelStyle: { 
            fontSize: 11, 
            fontWeight: "600", 
            marginTop: 4,
          },
          tabBarIconStyle: { marginTop: 4 },
          tabBarItemStyle: {
            paddingVertical: 4,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Trang chủ",
            tabBarIcon: ({ color }) => (
              <IconSymbol name="home" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Khám phá",
            tabBarIcon: ({ color }) => (
              <IconSymbol name="map" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="bookings"
          options={{
            title: "Chuyến đi",
            tabBarIcon: ({ color }) => (
              <IconSymbol name="calendar" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="more"
          options={{
            title: "Thêm",
            tabBarIcon: ({ color }) => (
              <IconSymbol name="grid" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Cá nhân",
            tabBarIcon: ({ color }) => (
              <IconSymbol name="user" size={22} color={color} />
            ),
          }}
        />
        {/* Hidden tabs - accessible from More menu */}
        <Tabs.Screen
          name="deals"
          options={{
            href: null, // Hide from tab bar
          }}
        />
        <Tabs.Screen
          name="wishlist"
          options={{
            href: null, // Hide from tab bar
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            href: null, // Hide from tab bar
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            href: null, // Hide from tab bar
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
