import { useFocusEffect } from "expo-router";
import { Bell } from "lucide-react-native";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";

import { MediaCard } from "@/components/media-card";
import { Post } from "@/types";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";

export default function Home() {
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
  const baseUrl = `${API_BASE_URL}/api`;

  const [posts, setPosts] = useState<Post[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [visiblePostId, setVisiblePostId] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch(`${baseUrl}/posts`);
      if (!res.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await res.json();
      setPosts(data.posts ?? []);
    } catch (error) {
      console.log(error);
    }
  }, [baseUrl]);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [fetchPosts]),
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchPosts();
    setIsRefreshing(false);
  }, [fetchPosts]);

  const viewabilityConfig = useMemo(
    () => ({
      itemVisiblePercentThreshold: 70,
      minimumViewTime: 150,
    }),
    [],
  );

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken<Post>[] }) => {
      const firstVisibleVideo = viewableItems.find(
        (item) => item.isViewable && item.item.media.type === "video",
      );
      setVisiblePostId(firstVisibleVideo?.item.id ?? null);
    },
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#0F0F11" }}>
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
        <MaskedView
          maskElement={
            <Text
              style={{
                fontFamily: "Sora-Bold",
                marginTop: 2,
                alignSelf: "center",
                fontSize: 24,
                fontWeight: "bold",
                color: "white",
              }}
            >
              Pixove
            </Text>
          }
        >
          <LinearGradient
            colors={["#F97316", "#7C3AED"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 90,
              height: 38,
              alignSelf: "center",
            }}
          />
        </MaskedView>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
          <TouchableOpacity style={{ position: "relative" }}>
            <Bell size={22} color="#FFFFFF" />
            <View
              style={{
                position: "absolute",
                top: 4,
                right: 2,
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: "#F97316",
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "#27272A",
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <MediaCard post={item} isVisible={visiblePostId === item.id} />
          </View>
        )}
        contentContainerStyle={{
          padding: 16,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig}
      />
    </View>
  );
}
