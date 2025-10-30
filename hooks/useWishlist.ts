import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { api } from "@/services/api";

export function useWishlist() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadWishlist = async () => {
    try {
      const data = await api.getWishlist();
      setItems(data);
    } catch (error) {
      console.error("Error loading wishlist:", error);
      Alert.alert("Lỗi", "Không thể tải wishlist");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWishlist();
  };

  const addToWishlist = async (tourId: string) => {
    try {
      await api.addToWishlist(tourId);
      Alert.alert("Thành công", "Đã thêm vào wishlist!");
      loadWishlist();
    } catch (error) {
      Alert.alert("Lỗi", "Không thể thêm vào wishlist");
    }
  };

  const removeFromWishlist = async (tourId: string) => {
    try {
      await api.removeFromWishlist(tourId);
      Alert.alert("Thành công", "Đã xóa khỏi wishlist!");
      loadWishlist();
    } catch (error) {
      Alert.alert("Lỗi", "Không thể xóa khỏi wishlist");
    }
  };

  return {
    items,
    loading,
    refreshing,
    onRefresh,
    addToWishlist,
    removeFromWishlist,
    refetch: loadWishlist,
  };
}

