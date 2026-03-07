import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import "react-native-reanimated";
import "../global.css";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#111",
  },
  header: {
    margin: "auto",
    fontSize: 16,
    width: "100%",
    paddingTop: 50,
    height: 20,
    color: "#eee",
    backgroundColor: "#111",
  },
  footer: {
    fontSize: 16,
    paddingBottom: 10,
    height: 20,
    color: "#eee",
    backgroundColor: "#111",
  },
});
