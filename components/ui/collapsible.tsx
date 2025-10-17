import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native";

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
}

export function Collapsible({ title, children }: CollapsibleProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.icon}>{isExpanded ? "-" : "+"}</Text>
      </TouchableOpacity>
      {isExpanded && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  icon: {
    fontSize: 20,
    fontWeight: "600",
  },
  content: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
});
