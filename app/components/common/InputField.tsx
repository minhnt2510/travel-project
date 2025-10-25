// app/components/common/InputField.tsx
import { View, TextInput } from "react-native";
import { ThemedText } from "@/ui-components/themed-text";

type Props = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (t: string) => void;
  keyboardType?: "default" | "numeric";
  isDark: boolean;
};

export default function InputField({
  label,
  placeholder,
  value,
  onChange,
  keyboardType,
  isDark,
}: Props) {
  return (
    <View className="mb-5">
      <ThemedText
        className={`text-base font-semibold mb-2 ${
          isDark ? "text-gray-200" : "text-gray-800"
        }`}
      >
        {label}
      </ThemedText>

      <TextInput
        className={`border rounded-2xl px-4 py-3.5 text-base ${
          isDark
            ? "bg-slate-800 border-slate-600 text-white placeholder-gray-400"
            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
        }`}
        placeholder={placeholder}
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
      />
    </View>
  );
}
