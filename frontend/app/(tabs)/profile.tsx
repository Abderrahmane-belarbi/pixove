import { useAuth } from "@/store/auth.store";
import { LinearGradient } from "expo-linear-gradient";
import { Grid, Heart, Settings } from "lucide-react-native";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { user, logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  }

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
        <View style={{ alignItems: "center", padding: 24 }}>
          <Image
            source={{ uri: user?.picture }}
            style={{
              width: 112,
              height: 112,
              borderRadius: 100,
              marginBottom: 16,
            }}
          />
          <Text style={{ color: "#eee", marginBottom: 4, fontSize: 24 }}>
            {user?.name}
          </Text>
          <Text
            style={{
              color: "#71717A",
              marginBottom: 16,
              textTransform: "lowercase",
            }}
          >
            @{user?.name.split(" ")?.join("")}
          </Text>
          <Text style={{ fontSize: 14, color: "#ccc", marginBottom: 24 }}>
            {user?.bio}
          </Text>
          <View
            className="text-sm"
            style={{ flexDirection: "row", gap: 32, marginBottom: 24 }}
          >
            <View>
              <Text style={{ fontSize: 24, lineHeight: 32, color: "#ccc" }}>
                42
              </Text>
              <Text style={{ fontSize: 14, lineHeight: 20, color: "#71717A" }}>
                Posts
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 24, lineHeight: 32, color: "#ccc" }}>
                1.2M
              </Text>
              <Text style={{ fontSize: 14, lineHeight: 20, color: "#71717A" }}>
                Followers
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 24, lineHeight: 32, color: "#ccc" }}>
                385
              </Text>
              <Text style={{ fontSize: 14, lineHeight: 20, color: "#71717A" }}>
                Following
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={{ borderRadius: 100, overflow: "hidden", width: "90%" }}
          >
            <LinearGradient
              colors={["#7C3AED", "#F97316"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                paddingVertical: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
                Edit Profile
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        {/* TABS */}
        <View
          style={{
            width: "100%",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingVertical: 16,
            paddingHorizontal: 24,
            flexDirection: "row",
            gap: 32,
            borderBottomColor: "#27272A",
            borderBottomWidth: 1,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              gap: 8,
              paddingBottom: 8,
              borderBottomColor: "#7C3AED",
              borderBottomWidth: 2,
            }}
          >
            <Grid size={20} color="#7C3AED" />
            <Text
              style={{
                color: "#ccc",
              }}
            >
              Posts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              gap: 8,
            }}
          >
            <Heart size={20} color="#71717A" />
            <Text
              style={{
                color: "#71717A",
              }}
            >
              Likes
            </Text>
          </TouchableOpacity>
        </View>
        {/* Video Grid */}
        <View></View>
      </View>
    </SafeAreaView>
  );
}
