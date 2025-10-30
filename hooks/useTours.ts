import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { api, type Tour } from "@/services/api";

export function useFeaturedTours() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getFeaturedTours();
      setTours(data);
    } catch (error) {
      console.error("Error loading featured tours:", error);
      Alert.alert("Lỗi", "Không thể tải tours nổi bật");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return { tours, loading, refetch: loadData };
}

export function useAllTours(filters?: {
  category?: string;
  search?: string;
  limit?: number;
}) {
  const [tours, setTours] = useState<Tour[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await api.getTours({
        ...filters,
        limit: filters?.limit || 50,
        offset: 0,
      });
      setTours(result.tours);
      setTotal(result.total);
    } catch (error) {
      console.error("Error loading tours:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách tours");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters?.category, filters?.search]);

  return { tours, total, loading, refetch: loadData };
}

