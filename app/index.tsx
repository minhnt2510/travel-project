import { useUser } from "./_layout";
import { Redirect } from "expo-router";

export default function Index() {
  const { user, token } = useUser();
  if (user && token) {
    if (user.role === "admin")
      return <Redirect href="/screens/AdminDashboard" />;
    if (user.role === "user") return <Redirect href="/(tabs)" />;
  }
  if (user === null || token === null) return <Redirect href="/" />;
  return null;
}
