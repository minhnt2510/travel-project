import { View, Text, Animated } from "react-native";
import { useEffect, useRef } from "react";

export function HelloWave() {
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [waveAnim]);

  const rotate = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "20deg"],
  });

  return (
    <View style={{ alignItems: "center" }}>
      <Animated.Text
        style={{
          fontSize: 40,
          transform: [{ rotate }],
        }}
      >
        👋
      </Animated.Text>
      <Text style={{ fontSize: 16, color: "#555" }}>
        Hello from NativeWind!
      </Text>
    </View>
  );
}
