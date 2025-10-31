import { useState, useEffect } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/services/api";
import { useUser } from "@/app/_layout";

const OFFLINE_WISHLIST_KEY = "offline_wishlist";
const PENDING_SYNC_KEY = "pending_wishlist_sync";

export function useWishlist() {
  const { user } = useUser();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load offline wishlist
  const loadOfflineWishlist = async () => {
    try {
      const offlineData = await AsyncStorage.getItem(OFFLINE_WISHLIST_KEY);
      if (offlineData) {
        return JSON.parse(offlineData);
      }
    } catch (error) {
      console.error("Error loading offline wishlist:", error);
    }
    return [];
  };

  // Save offline wishlist
  const saveOfflineWishlist = async (wishlistItems: any[]) => {
    try {
      await AsyncStorage.setItem(OFFLINE_WISHLIST_KEY, JSON.stringify(wishlistItems));
    } catch (error) {
      console.error("Error saving offline wishlist:", error);
    }
  };

  // Sync offline items when user logs in
  const syncOfflineItems = async () => {
    if (!user) return;

    try {
      const pendingSync = await AsyncStorage.getItem(PENDING_SYNC_KEY);
      if (pendingSync) {
        const pendingItems = JSON.parse(pendingSync);
        // Sync each item
        for (const tourId of pendingItems) {
          try {
            await api.addToWishlist(tourId);
          } catch (error) {
            console.error(`Error syncing tour ${tourId}:`, error);
          }
        }
        // Clear pending sync
        await AsyncStorage.removeItem(PENDING_SYNC_KEY);
      }
    } catch (error) {
      console.error("Error syncing offline items:", error);
    }
  };

  const loadWishlist = async () => {
    try {
      if (user) {
        // User is logged in - load from API
        const data = await api.getWishlist();
        setItems(data);
        // Save to offline storage for offline access
        await saveOfflineWishlist(data);
        // Sync any pending offline items
        await syncOfflineItems();
      } else {
        // User not logged in - load from offline storage
        const offlineData = await loadOfflineWishlist();
        setItems(offlineData);
      }
    } catch (error) {
      console.error("Error loading wishlist:", error);
      // Fallback to offline data if API fails
      const offlineData = await loadOfflineWishlist();
      setItems(offlineData);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, [user]); // Reload when user changes

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWishlist();
  };

  const addToWishlist = async (tourId: string) => {
    try {
      if (user) {
        // User is logged in - add via API
        await api.addToWishlist(tourId);
        await loadWishlist(); // Reload to get updated list
      } else {
        // User not logged in - save to offline
        const offlineData = await loadOfflineWishlist();
        if (!offlineData.find((item: any) => item.tourId === tourId || item._id === tourId)) {
          const newItem = { tourId, _id: tourId, createdAt: new Date().toISOString() };
          const updatedData = [...offlineData, newItem];
          await saveOfflineWishlist(updatedData);
          
          // Save to pending sync for later
          const pendingSync = await AsyncStorage.getItem(PENDING_SYNC_KEY);
          const pendingItems = pendingSync ? JSON.parse(pendingSync) : [];
          if (!pendingItems.includes(tourId)) {
            pendingItems.push(tourId);
            await AsyncStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(pendingItems));
          }
          
          setItems(updatedData);
        }
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      // Even if API fails, try to save offline
      if (!user) {
        const offlineData = await loadOfflineWishlist();
        const newItem = { tourId, _id: tourId, createdAt: new Date().toISOString() };
        await saveOfflineWishlist([...offlineData, newItem]);
        setItems([...offlineData, newItem]);
      }
    }
  };

  const removeFromWishlist = async (tourId: string) => {
    try {
      if (user) {
        // User is logged in - remove via API
        await api.removeFromWishlist(tourId);
        await loadWishlist(); // Reload to get updated list
      } else {
        // User not logged in - remove from offline
        const offlineData = await loadOfflineWishlist();
        const updatedData = offlineData.filter(
          (item: any) => item.tourId !== tourId && item._id !== tourId
        );
        await saveOfflineWishlist(updatedData);
        setItems(updatedData);
        
        // Remove from pending sync
        const pendingSync = await AsyncStorage.getItem(PENDING_SYNC_KEY);
        if (pendingSync) {
          const pendingItems = JSON.parse(pendingSync);
          const updatedPending = pendingItems.filter((id: string) => id !== tourId);
          await AsyncStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(updatedPending));
        }
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      // Even if API fails, try to remove from offline
      if (!user) {
        const offlineData = await loadOfflineWishlist();
        const updatedData = offlineData.filter(
          (item: any) => item.tourId !== tourId && item._id !== tourId
        );
        await saveOfflineWishlist(updatedData);
        setItems(updatedData);
      }
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

