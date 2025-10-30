import { ThemedText } from "@/ui-components/themed-text";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { Image, ImageSource } from "expo-image";
import { TouchableOpacity, View } from "react-native";

interface Destination {
  id: string;
  name: string;
  image: ImageSource | number | string | { uri: string } | null;
  count: string;
}

interface DestinationCardProps {
  destination: Destination;
  onPress: (destinationId: string) => void;
}

export default function DestinationCard({
  destination,
  onPress,
}: DestinationCardProps) {
  return (
    <TouchableOpacity
      className="mr-4 w-48"
      onPress={() => onPress(destination.id)}
    >
      <View className="relative">
        <Image
          source={destination.image}
          className="w-48 h-48 rounded-2xl"
          contentFit="cover"
        />
        <View className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl" />
        <View className="absolute bottom-3 left-3 right-3">
          <ThemedText className="text-white font-bold text-lg">
            {destination.name}
          </ThemedText>
          <View className="flex-row items-center mt-1">
            <IconSymbol name="map-pin" size={14} color="#FFF" />
            <ThemedText className="text-white/90 text-xs ml-1">
              {destination.count}
            </ThemedText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

