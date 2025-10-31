import React from "react";
import { View, TouchableOpacity } from "react-native";
import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { router } from "expo-router";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ThemedView className="flex-1 justify-center items-center bg-gray-50 px-6">
          <IconSymbol name="alert-circle" size={64} color="#ef4444" />
          <ThemedText className="text-2xl font-extrabold text-gray-900 mt-6 mb-2">
            Đã xảy ra lỗi
          </ThemedText>
          <ThemedText className="text-gray-600 text-center mb-6">
            {this.state.error?.message || "Có lỗi không mong muốn xảy ra"}
          </ThemedText>
          <TouchableOpacity
            onPress={this.handleReset}
            className="bg-purple-600 px-6 py-3 rounded-full mb-4"
          >
            <ThemedText className="text-white font-bold">Thử lại</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-gray-200 px-6 py-3 rounded-full"
          >
            <ThemedText className="text-gray-700 font-semibold">Quay lại</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

