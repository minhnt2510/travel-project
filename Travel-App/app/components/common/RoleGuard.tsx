import { ThemedView } from "@/ui-components/themed-view";
import { ThemedText } from "@/ui-components/themed-text";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useUser } from "@/app/_layout";

interface RoleGuardProps {
  allowedRoles: ("client" | "staff" | "admin")[];
  children: React.ReactNode;
}

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user } = useUser();

  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <ThemedView className="flex-1 justify-center items-center bg-gray-50 px-6">
        <IconSymbol name="lock" size={64} color="#ef4444" />
        <ThemedText className="text-gray-900 text-xl font-extrabold mt-4 text-center">
          Truy cập bị từ chối
        </ThemedText>
        <ThemedText className="text-gray-600 text-base font-medium mt-2 text-center">
          Bạn không có quyền truy cập trang này
        </ThemedText>
        <ThemedText className="text-gray-500 text-sm mt-1 text-center">
          Yêu cầu quyền: {allowedRoles.map(r => r.toUpperCase()).join(" hoặc ")}
        </ThemedText>
        <TouchableOpacity
          onPress={() => {
            if (user?.role === "admin") {
              router.replace("/screens/AdminDashboard" as any);
            } else if (user?.role === "staff") {
              router.replace("/screens/StaffDashboard" as any);
            } else {
              router.replace("/(tabs)" as any);
            }
          }}
          className="mt-6 bg-red-600 px-6 py-3 rounded-full"
        >
          <ThemedText className="text-white font-semibold">Quay về Dashboard</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return <>{children}</>;
}

