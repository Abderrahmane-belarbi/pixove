// frontend/components/media-card.tsx
import { Post } from "@/types";
import { Bookmark, Heart, MessageCircle } from "lucide-react-native";
import { Image, Text, TouchableOpacity, View } from "react-native";
import ImageCard from "./image-card";
import VideoCard from "./video-card";

type MediaCardProps = {
  post: Post;
  isVisible: boolean;
};

export function MediaCard({ post, isVisible }: MediaCardProps) {
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
        marginBottom: 16,
      }}
    >
      {post.media.type === "video" && (
        <VideoCard
          url={post.media.url}
          hlsUrl={post.media.url}
          shouldAutoPlay={isVisible}
        />
      )}
      {post.media.type === "image" && <ImageCard url={post.media.url} />}
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
              source={{ uri: post.auther.picture }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          </View>
          <Text style={{ color: "#FFFFFF", fontSize: 15, fontWeight: "600" }}>
            {post.auther.name}
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
          {post.title}
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
                {post.likes.length}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <MessageCircle color="#7C3AED" size={20} />
              <Text style={{ color: "#A1A1AA", fontSize: 13, marginLeft: 6 }}>
                {post.comments.length}
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
