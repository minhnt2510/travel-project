import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const t = Colors[colorScheme ?? "light"] as Record<string, string>;

  const activeTint =
    "tint" in t ? t.tint : ("tabIconSelected" in t ? t.tabIconSelected : t.primary);

  const inactiveTint = "tabIconDefault" in t ? t.tabIconDefault : t.icon;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeTint,
        tabBarInactiveTintColor: inactiveTint,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: t.background,
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600", marginTop: 4 },
        tabBarIconStyle: { marginTop: 4 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              name={focused ? "home" : "home"} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Chuyến đi",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              name={focused ? "calendar" : "calendar"} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: "Yêu thích",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              name={focused ? "heart" : "heart"} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Cá nhân",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              name={focused ? "user" : "user"} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
