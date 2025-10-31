import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import * as WebBrowser from "expo-web-browser";
import { ThemedText } from "@/ui-components/themed-text";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";

interface MapViewProps {
  latitude?: number;
  longitude?: number;
  height?: number;
  isDark?: boolean;
}

export default function CustomMapView({
  latitude,
  longitude,
  height = 300,
  isDark = false,
}: MapViewProps) {
  // Open Google Maps in browser/app
  const handleMapPress = async () => {
    if (latitude && longitude) {
      try {
        const mapUrl = `https://www.google.com/maps/@${latitude},${longitude},15z?entry=ttu`;
        await WebBrowser.openBrowserAsync(mapUrl, {
          presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
          controlsColor: "#3b82f6",
        });
      } catch (err) {
        console.error("Error opening Google Maps:", err);
      }
    }
  };

  if (latitude && longitude) {
    return (
      <View style={[styles.container, { height }]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleMapPress}
          style={{ width: "100%", height: "100%" }}
        >
          <LinearGradient
            colors={isDark ? ["#1e293b", "#0f172a"] : ["#eff6ff", "#e0e7ff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-3xl h-full relative flex items-center justify-center shadow-xl border-2"
            style={{ borderColor: isDark ? "#475569" : "#bfdbfe" }}
          >
            <View className="items-center px-6">
              {/* Google Maps Icon */}
              <View className="bg-white rounded-2xl p-4 shadow-lg mb-4">
                <Image
                  source={{
                    uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Google_Maps_icon_%282015-2020%29.svg/2048px-Google_Maps_icon_%282015-2020%29.svg.png",
                  }}
                  style={{ width: 64, height: 64 }}
                  contentFit="contain"
                  transition={200}
                />
              </View>
              
              <ThemedText className={`font-bold text-xl ${isDark ? "text-white" : "text-gray-900"}`}>
                Xem vị trí trên bản đồ
              </ThemedText>
              <ThemedText className={`mt-2 text-sm ${isDark ? "text-gray-300" : "text-gray-600"} text-center`}>
                Nhấn để mở Google Maps
              </ThemedText>
              
              {/* Coordinates */}
              <View className={`mt-5 ${isDark ? "bg-black/60" : "bg-white/90"} backdrop-blur-md px-4 py-2.5 rounded-xl shadow-lg border ${isDark ? "border-slate-600" : "border-gray-200"}`}>
                <View className="flex-row items-center">
                  <IconSymbol name="map-pin" size={14} color={isDark ? "#94a3b8" : "#6366f1"} />
                  <ThemedText className={`ml-2 text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    {latitude.toFixed(6)}, {longitude.toFixed(6)}
                  </ThemedText>
                </View>
              </View>
              
              {/* Tap indicator */}
              <View className="mt-4 flex-row items-center">
                <View className={`px-3 py-1 rounded-full ${isDark ? "bg-blue-600/20" : "bg-blue-500/10"}`}>
                  <ThemedText className={`text-xs font-medium ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                    Tap để mở →
                  </ThemedText>
                </View>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }
  
  // No coordinates - show empty state
  return (
    <View style={[styles.container, { height }]}>
      <View className={`rounded-3xl h-full ${isDark ? "bg-slate-800" : "bg-gray-100"} flex items-center justify-center shadow-lg`}>
        <IconSymbol name="map" size={56} color={isDark ? "#64748b" : "#9ca3af"} />
        <ThemedText className={`mt-3 font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          Bản đồ
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
});

