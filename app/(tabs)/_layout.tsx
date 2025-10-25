import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { Tabs } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const t = Colors[useColorScheme() ?? "light"] as Record<string, string>;

  const activeTint = "tint" in t ? t.tint : ("tabIconSelected" in t ? t.tabIconSelected : t.primary);
  const inactiveTint = "tabIconDefault" in t ? t.tabIconDefault : t.icon;

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: t.background }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: activeTint,
          tabBarInactiveTintColor: inactiveTint,
          tabBarStyle: {
            backgroundColor: t.background,
            borderTopWidth: 1,
            borderTopColor: "#E5E7EB",
            height: 58 + insets.bottom,
            paddingTop: 6,
            paddingBottom: Math.max(6, insets.bottom / 2),
          },
          tabBarLabelStyle: { fontSize: 12, fontWeight: "600", marginTop: 4 },
          tabBarIconStyle: { marginTop: 4 },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Trang chủ",
            tabBarIcon: ({ color }) => <IconSymbol name="home" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="bookings"
          options={{
            title: "Chuyến đi",
            tabBarIcon: ({ color }) => <IconSymbol name="calendar" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="wishlist"
          options={{
            title: "Yêu thích",
            tabBarIcon: ({ color }) => <IconSymbol name="heart" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Cá nhân",
            tabBarIcon: ({ color }) => <IconSymbol name="user" size={24} color={color} />,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
