import { Stack } from "expo-router";
import "react-native-reanimated";
import "../../global.css";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="auth" options={{ headerShown: false }} />
    </Stack>
  );
}
