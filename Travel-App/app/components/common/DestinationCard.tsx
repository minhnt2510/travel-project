import { ThemedText } from "@/ui-components/themed-text";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { Image, ImageSource } from "expo-image";
import { TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";

interface Destination {
  id: string;
  name: string;
  image: ImageSource | number | string | { uri: string } | null;
  count: string;
}

interface DestinationCardProps {
  destination: Destination;
  onPress: (destinationId: string) => void;
  index?: number;
}

export default function DestinationCard({
  destination,
  onPress,
  index = 0,
}: DestinationCardProps) {
  return (
    <Animated.View 
      entering={FadeInDown.delay(index * 100).duration(500)}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        className="mr-4 w-56"
        onPress={() => onPress(destination.id)}
      >
        <View className="relative rounded-3xl overflow-hidden shadow-2xl">
          <Image
            source={destination.image}
            className="w-56 h-64"
            contentFit="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            className="absolute bottom-0 left-0 right-0 h-32"
          />
          <View className="absolute top-4 right-4">
            <View className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30">
              <IconSymbol name="heart" size={14} color="#FFF" />
            </View>
          </View>
          <View className="absolute bottom-4 left-4 right-4">
            <ThemedText className="text-white font-extrabold text-xl mb-1">
              {destination.name}
            </ThemedText>
            <View className="flex-row items-center">
              <IconSymbol name="map-pin" size={14} color="#FFF" />
              <ThemedText className="text-white/90 text-sm ml-1 font-medium">
                {destination.count}
              </ThemedText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

