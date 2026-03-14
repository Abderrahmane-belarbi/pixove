import { useAuth } from "@/store/auth.store";
import { Settings } from "lucide-react-native";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { user, checkAuth } = useAuth();

  return (
    <SafeAreaView className="bg-dark-primary h-full">
      <View
        style={{
          paddingVertical: 18,
          paddingHorizontal: 12,
          flexDirection: "row",
          justifyContent: "space-between",
          borderBottomColor: "#27272A",
          borderBottomWidth: 1,
        }}
      >
        <Text style={{ color: "#eee", fontSize: 18 }}>Profile</Text>
        <Settings width={24} height={24} color="#eee" />
      </View>
      <View>
        <Image
          source={{ uri: user?.picture }}
          style={{ width: 100, height: 100 }}
        />
        <Text style={{ color: "#eee" }}>{user?.name}</Text>
      </View>
    </SafeAreaView>
  );
}
