import { Text as DefaultText } from "react-native";

export type TextProps = DefaultText["props"] & {
  type?: "default" | "defaultSemiBold" | "title" | "link";
};

export function ThemedText(props: TextProps) {
  const { style, type = "default", ...otherProps } = props;

  return (
    <DefaultText
      className={`
        ${type === "default" ? "text-base text-gray-700" : ""}
        ${
          type === "defaultSemiBold"
            ? "text-base font-semibold text-gray-700"
            : ""
        }
        ${type === "title" ? "text-2xl font-bold text-gray-900" : ""}
        ${type === "link" ? "text-base text-blue-600 underline" : ""}
      `}
      style={style}
      {...otherProps}
    />
  );
}
