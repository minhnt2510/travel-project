import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

export async function requireAuth(redirectTo: string, onAuthed: () => void) {
  const token = await SecureStore.getItemAsync("accessToken");
  if (!token) {
    router.push({
      pathname: "/(auth)/login",
      params: { redirect: redirectTo },
    });
    return;
  }
  onAuthed();
}
