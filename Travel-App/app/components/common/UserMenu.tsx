import { Modal, Pressable, View } from "react-native";
import { router } from "expo-router";
import MenuItem from "./MenuItem";

interface UserMenuProps {
  visible: boolean;
  onClose: () => void;
}

export default function UserMenu({ visible, onClose }: UserMenuProps) {
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

