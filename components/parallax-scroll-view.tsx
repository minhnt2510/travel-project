import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

interface ParallaxScrollViewProps {
  headerBackgroundColor: {
    light: string;
    dark: string;
  };
  headerImage: React.ReactNode;
  children: React.ReactNode;
}

export default function ParallaxScrollView({
  headerBackgroundColor,
  headerImage,
  children,
}: ParallaxScrollViewProps) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View
        style={[
          styles.headerContainer,
          { backgroundColor: headerBackgroundColor.light },
        ]}
      >
        {headerImage}
      </View>
      <View style={styles.content}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  headerContainer: {
    height: 200,
    position: "relative",
    overflow: "hidden",
  },
  content: {
    padding: 20,
  },
});
