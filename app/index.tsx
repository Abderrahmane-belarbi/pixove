import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-dark-primary p-4">
      <Text className="text-purple-primary text-3xl mb-6">MyApp</Text>

      <View className="gap-4">
        <LinearGradient
          style={{ width: 250, height: 50, borderRadius: 10 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          colors={["#F97316", "#EC4899"]}
        />
      </View>
    </View>
  );
}
