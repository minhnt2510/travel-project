import { View, TouchableOpacity } from "react-native";
import { ThemedText } from "@/ui-components/themed-text";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import SearchBar from "../common/SearchBar";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Image } from "expo-image";
import { useUser } from "@/app/_layout";

interface HeroHeaderProps {
  onSearchPress: () => void;
  onMenuPress: () => void;
}

export default function HeroHeader({
  onSearchPress,
  onMenuPress,
}: HeroHeaderProps) {
  const { user } = useUser();
  
  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="px-4 pt-16 pb-8 rounded-b-3xl"
    >
      <Animated.View 
        entering={FadeInDown.duration(600).delay(100)}
        className="flex-row items-center mb-4"
      >
        <View className="flex-1">
          <View className="flex-row items-center mb-2">
            <ThemedText className="text-white text-3xl font-extrabold">
              {user?.name ? `Chào ${user.name.split(" ")[0]}!` : "Chào mừng!"} 👋
            </ThemedText>
            {user?.role && (
              <View
                className={`ml-3 px-2.5 py-1 rounded-full ${
                  user.role === "admin"
                    ? "bg-purple-500/30 border border-purple-300/50"
                    : user.role === "staff"
                    ? "bg-green-500/30 border border-green-300/50"
                    : "bg-blue-500/30 border border-blue-300/50"
                }`}
              >
                <ThemedText
                  className={`text-xs font-bold ${
                    user.role === "admin"
                      ? "text-purple-100"
                      : user.role === "staff"
                      ? "text-green-100"
                      : "text-blue-100"
                  }`}
                >
                  {user.role === "admin"
                    ? "🛡️ ADMIN"
                    : user.role === "staff"
                    ? "💼 STAFF"
                    : "👤 CLIENT"}
                </ThemedText>
              </View>
            )}
          </View>
          <ThemedText className="text-white/90 text-base font-medium">
            {user?.role === "admin"
              ? "Quản lý hệ thống và người dùng"
              : user?.role === "staff"
              ? "Quản lý tours và đơn hàng"
              : "Khám phá những điểm đến tuyệt vời"}
          </ThemedText>
        </View>
        <TouchableOpacity
          onPress={onMenuPress}
          className="w-12 h-12 rounded-full items-center justify-center bg-white/20 backdrop-blur-md border border-white/30 overflow-hidden relative"
        >
          {user?.avatar ? (
            <Image
              source={{ uri: user.avatar }}
              className="w-full h-full rounded-full"
              contentFit="cover"
              cachePolicy="memory"
            />
          ) : (
            <IconSymbol name="user" size={24} color="#FFF" />
          )}
          {user?.role === "admin" && (
            <View className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-purple-500 rounded-full border-2 border-white" />
          )}
          {user?.role === "staff" && (
            <View className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
          )}
        </TouchableOpacity>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(600).delay(200)}>
        <SearchBar
          placeholder="Tìm kiếm tour, điểm đến..."
          onSearch={onSearchPress}
          onFocus={onSearchPress}
          showFilterButton
        />
      </Animated.View>

      {/* Quick stats */}
      <Animated.View 
        entering={FadeInDown.duration(600).delay(300)}
        className="flex-row justify-around mt-6 pt-6 border-t border-white/20"
      >
        <View className="items-center">
          <ThemedText className="text-white text-2xl font-bold">500+</ThemedText>
          <ThemedText className="text-white/80 text-xs mt-1">Điểm đến</ThemedText>
        </View>
        <View className="items-center">
          <ThemedText className="text-white text-2xl font-bold">10k+</ThemedText>
          <ThemedText className="text-white/80 text-xs mt-1">Khách hàng</ThemedText>
        </View>
        <View className="items-center">
          <ThemedText className="text-white text-2xl font-bold">4.8★</ThemedText>
          <ThemedText className="text-white/80 text-xs mt-1">Đánh giá</ThemedText>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

