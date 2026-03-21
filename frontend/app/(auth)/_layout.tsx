import { useAuth } from "@/store/auth.store";
import { router, Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";
import "../../global.css";

export default function AuthLayout() {
  const { status, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (status === "authenticated") router.replace("/(tabs)/home");
  }, [isLoading]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0F0F11",
        }}
      >
        <ActivityIndicator size="small" color="#fff" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
