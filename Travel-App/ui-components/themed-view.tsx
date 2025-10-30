import { View } from "react-native";

export function ThemedView(props: React.ComponentProps<typeof View>) {
  return <View className="bg-white dark:bg-gray-900" {...props} />;
}
