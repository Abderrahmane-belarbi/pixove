import { useAuth } from "@/store/auth.store";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Grid, Heart, Settings } from "lucide-react-native";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Profile() {
  const { user } = useAuth();
  const router = useRouter();
  const screenWidth = Dimensions.get("window").width;
  const GAP = 3;
  const ITEM_WIDTH = (screenWidth - GAP * 4) / 3;
  const ITEM_HEIGHT = 180;

  return (
    <View style={{ backgroundColor: "#0F0F11", flex: 1 }}>
      <View
        style={{
          borderBottomColor: "#27272A",
          borderBottomWidth: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 24,
          paddingHorizontal: 16,
          height: 60,
        }}
      >
        <Text
          style={{ color: "#FFFFFF", fontSize: 16, fontFamily: "Sora-Bold" }}
        >
          Profile
        </Text>
        <TouchableOpacity onPress={() => router.push("/settings")}>
          <Settings width={24} height={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={{ gap: 20, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ alignItems: "center", padding: 24 }}>
          <Image
            source={user?.picture ? { uri: user.picture } : undefined}
            style={{
              width: 112,
              height: 112,
              borderRadius: 100,
              marginBottom: 16,
            }}
          />
          <Text style={{ color: "#fff", marginBottom: 4, fontSize: 24 }}>
            {user?.name}
          </Text>
          <Text
            style={{
              color: "#A1A1AA",
              marginBottom: 16,
              textTransform: "lowercase",
            }}
          >
            @{user?.name?.split(" ")?.join("")}
          </Text>
          <Text style={{ fontSize: 14, color: "#fff", marginBottom: 24 }}>
            {user?.bio}
          </Text>
          <View
            className="text-sm"
            style={{ flexDirection: "row", gap: 32, marginBottom: 24 }}
          >
            <View>
              <Text style={{ fontSize: 24, lineHeight: 32, color: "#fff" }}>
                42
              </Text>
              <Text style={{ fontSize: 14, lineHeight: 20, color: "#A1A1AA" }}>
                Posts
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 24, lineHeight: 32, color: "#fff" }}>
                1.2M
              </Text>
              <Text style={{ fontSize: 14, lineHeight: 20, color: "#A1A1AA" }}>
                Followers
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 24, lineHeight: 32, color: "#fff" }}>
                385
              </Text>
              <Text style={{ fontSize: 14, lineHeight: 20, color: "#A1A1AA" }}>
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
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
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
                color: "#fff",
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
            <Heart size={20} color="#A1A1AA" />
            <Text
              style={{
                color: "#A1A1AA",
              }}
            >
              Likes
            </Text>
          </TouchableOpacity>
        </View>
        {/* Video Images Grid */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: GAP,
            padding: GAP,
          }}
        >
          {[...Array(9)].map((_, index) => (
            <View
              key={index}
              style={{
                width: ITEM_WIDTH,
                height: ITEM_HEIGHT,
                backgroundColor: "#ccc",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>{index + 1}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
