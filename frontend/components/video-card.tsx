import { Bookmark, Heart, MessageCircle, Play } from "lucide-react-native";
import { Image, Text, TouchableOpacity, View } from "react-native";

type VideoCardProps = {
  thumbnail: string;
  title: string;
  creator: {
    name: string;
    avatar: string;
  };
  likes: number;
  comments: number;
};

export function VideoCard({
  thumbnail,
  title,
  creator,
  likes,
  comments,
}: VideoCardProps) {
  return (
    <View
      style={{
        backgroundColor: "#18181B",
        borderRadius: 24,
        overflow: "hidden",
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 6,
      }}
    >
      <View
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: 9 / 16,
          overflow: "hidden",
        }}
      >
        <Image
          source={{ uri: thumbnail }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />

        <View
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: "rgba(0,0,0,0.12)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: "rgba(255,255,255,0.24)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Play color="#FFFFFF" size={24} fill="#FFFFFF" />
          </View>
        </View>
      </View>

      <View style={{ padding: 16 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: "#27272A",
              overflow: "hidden",
              marginRight: 12,
            }}
          >
            <Image
              source={{ uri: creator.avatar }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          </View>
          <Text style={{ color: "#FFFFFF", fontSize: 15, fontWeight: "600" }}>
            {creator.name}
          </Text>
        </View>

        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 16,
            lineHeight: 22,
            marginBottom: 16,
          }}
          numberOfLines={2}
        >
          {title}
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 18,
              }}
            >
              <Heart color="#F97316" size={20} />
              <Text style={{ color: "#A1A1AA", fontSize: 13, marginLeft: 6 }}>
                {likes.toLocaleString()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <MessageCircle color="#7C3AED" size={20} />
              <Text style={{ color: "#A1A1AA", fontSize: 13, marginLeft: 6 }}>
                {comments.toLocaleString()}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity>
            <Bookmark color="#A1A1AA" size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
