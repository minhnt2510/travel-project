import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { Feather } from "@expo/vector-icons";

interface IconSymbolProps {
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export function IconSymbol({
  name,
  size = 24,
  color = "#000",
  style,
}: IconSymbolProps) {
  return (
    <View style={style}>
      <Feather name={name as any} size={size} color={color} />
    </View>
  );
}
