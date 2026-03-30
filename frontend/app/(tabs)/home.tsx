import { useFocusEffect } from "expo-router";
import { Bell, Search } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  ListRenderItem,
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

const tabs = ["For You", "Following", "Trending"];

export default function Home() {
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
  const baseUrl = `${API_BASE_URL}/api`;

  const [activeTab, setActiveTab] = useState("For You");
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

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

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
      const topVisibleVideo = viewableItems.find(
        (item) => item.isViewable && item.item.media.type === "video",
      );

      setVisiblePostId(topVisibleVideo?.item.id ?? null);
    },
  );

  const renderHeader = useMemo(
    () => (
      <>
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

        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              backgroundColor: "#18181B",
              borderRadius: 14,
              paddingHorizontal: 14,
              paddingVertical: 12,
              borderWidth: 1,
              borderColor: "#27272A",
            }}
          >
            <Search size={18} color="#A1A1AA" />
            <Text style={{ color: "#A1A1AA" }}>Search videos, creators...</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: 18,
            paddingHorizontal: 16,
            marginTop: 14,
            marginBottom: 16,
          }}
        >
          {tabs.map((tab) => {
            const active = tab === activeTab;

            return (
              <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
                <Text
                  style={{
                    color: active ? "#fff" : "#A1A1AA",
                    fontSize: 14,
                    fontFamily: active ? "Inter-Medium" : "Inter-Regular",
                  }}
                >
                  {tab}
                </Text>

                {active && (
                  <View
                    style={{
                      marginTop: 6,
                      height: 2,
                      borderRadius: 2,
                      backgroundColor: "#7C3AED",
                    }}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </>
    ),
    [activeTab],
  );

  const renderPost: ListRenderItem<Post> = useCallback(
    ({ item }) => (
      <View style={{ marginBottom: 18 }}>
        <MediaCard post={item} isVisible={visiblePostId === item.id} />
      </View>
    ),
    [visiblePostId],
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#0F0F11" }}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 20,
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
