import { Modal, Pressable, View } from "react-native";
import { router } from "expo-router";
import MenuItem from "./MenuItem";
import { useUser } from "@/app/_layout";

interface UserMenuProps {
  visible: boolean;
  onClose: () => void;
}

export default function UserMenu({ visible, onClose }: UserMenuProps) {
  const { user } = useUser();
  
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 bg-black/40" onPress={onClose}>
        <View className="flex-1 justify-end" />
      </Pressable>

      <View className="bg-white rounded-t-3xl p-6 pb-12">
        <View className="w-12 h-1.5 bg-gray-300 self-center rounded-full mb-6" />
        
        {/* Client Menu Items */}
        <MenuItem
          icon="user"
          label="Hồ sơ cá nhân"
          onPress={() => {
            onClose();
            router.push("/(tabs)/profile");
          }}
        />
        <MenuItem
          icon="calendar"
          label="Đơn đặt gần đây"
          onPress={() => {
            onClose();
            router.push("/(tabs)/bookings");
          }}
        />
        <MenuItem
          icon="heart"
          label="Danh sách yêu thích"
          onPress={() => {
            onClose();
            router.push("/(tabs)/wishlist");
          }}
        />
        <MenuItem
          icon="bell"
          label="Thông báo"
          onPress={() => {
            onClose();
            router.push("/screens/notifications/Notifications");
          }}
        />
        
        {/* Staff Menu Items - Operations only */}
        {user?.role === "staff" && (
          <>
            <View className="h-px bg-gray-200 my-3" />
            <MenuItem
              icon="briefcase"
              label="Staff Dashboard"
              onPress={() => {
                onClose();
                router.push("/screens/StaffDashboard");
              }}
              textColor="text-green-600"
            />
            <MenuItem
              icon="plus-circle"
              label="Thêm Tour"
              onPress={() => {
                onClose();
                router.push("/screens/staff/CreateTour");
              }}
              textColor="text-green-600"
            />
            <MenuItem
              icon="calendar-check"
              label="Quản lý đơn hàng"
              onPress={() => {
                onClose();
                router.push("/screens/admin/ManageBookings");
              }}
            />
            <MenuItem
              icon="map"
              label="Quản lý Tours"
              onPress={() => {
                onClose();
                router.push("/screens/tours/AllTours");
              }}
            />
            <MenuItem
              icon="x-circle"
              label="Xem hủy đơn"
              onPress={() => {
                onClose();
                router.push("/screens/staff/ViewCancellations");
              }}
            />
          </>
        )}

        {/* Admin Menu Items - Governance only */}
        {user?.role === "admin" && (
          <>
            <View className="h-px bg-gray-200 my-3" />
            <MenuItem
              icon="shield"
              label="Admin Dashboard"
              onPress={() => {
                onClose();
                router.push("/screens/AdminDashboard");
              }}
              textColor="text-purple-600"
            />
            <MenuItem
              icon="users"
              label="Quản lý Users"
              onPress={() => {
                onClose();
                router.push("/screens/admin/ManageUsers");
              }}
              textColor="text-purple-600"
            />
            <MenuItem
              icon="user-check"
              label="Quản lý Staff"
              onPress={() => {
                onClose();
                router.push("/screens/admin/ManageStaff");
              }}
              textColor="text-purple-600"
            />
            <MenuItem
              icon="settings"
              label="Cài đặt hệ thống"
              onPress={() => {
                onClose();
                router.push("/screens/admin/SystemSettings");
              }}
              textColor="text-purple-600"
            />
            <MenuItem
              icon="bar-chart"
              label="Phân tích"
              onPress={() => {
                onClose();
                router.push("/screens/admin/Analytics");
              }}
              textColor="text-purple-600"
            />
          </>
        )}
        
        <MenuItem
          icon="settings"
          label="Cài đặt"
          onPress={() => {
            onClose();
            // TODO: Navigate to settings
          }}
        />
        <View className="h-px bg-gray-200 my-3" />
        <MenuItem
          icon="log-out"
          label="Đăng xuất"
          onPress={() => {
            onClose();
            router.push("/(auth)/login");
          }}
          textColor="text-red-600"
        />
      </View>
    </Modal>
  );
}

