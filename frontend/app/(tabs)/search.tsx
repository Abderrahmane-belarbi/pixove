import { LinearGradient } from "expo-linear-gradient";
import { Search as SearchIcon, TrendingUp } from "lucide-react-native";
import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

const trendingVideos = [
  {
    id: 1,
    thumbnail:
      "https://images.unsplash.com/photo-1762436933065-fe6d7f51d4f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMHN0cmVldCUyMHBob3RvZ3JhcGh5fGVufDF8fHx8MTc3Mjg3NDI3MXww&ixlib=rb-4.1.0&q=80&w=1080",
    views: "2.3M",
  },
  {
    id: 2,
    thumbnail:
      "https://images.unsplash.com/photo-1772587023179-d70e47f1acc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwZ2FtaW5nJTIwZXNwb3J0c3xlbnwxfHx8fDE3NzI4OTIzMDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    views: "1.8M",
  },
  {
    id: 3,
    thumbnail:
      "https://images.unsplash.com/photo-1759486999883-4797c4e28c90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBwYWludGluZyUyMGNyZWF0aXZlfGVufDF8fHx8MTc3Mjg3NTc1OXww&ixlib=rb-4.1.0&q=80&w=1080",
    views: "3.1M",
  },
  {
    id: 4,
    thumbnail:
      "https://images.unsplash.com/photo-1678048632153-d961f9c37a48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjB3aWxkbGlmZSUyMGFuaW1hbHN8ZW58MXx8fHwxNzcyODU4NzE4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    views: "4.2M",
  },
  {
    id: 5,
    thumbnail:
      "https://images.unsplash.com/photo-1767969457898-51d5e9cf81d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGNvbmNlcnQlMjBwZXJmb3JtYW5jZXxlbnwxfHx8fDE3NzI4NTUzMTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    views: "5.5M",
  },
  {
    id: 6,
    thumbnail:
      "https://images.unsplash.com/photo-1712898281217-d9a6905516f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3R5bGUlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzI4NDUzMzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    views: "2.7M",
  },
];

const suggestedCreators = [
  {
    id: 1,
    name: "Sarah Johnson",
    username: "@sarahj",
    avatar:
      "https://images.unsplash.com/photo-1712898281217-d9a6905516f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3R5bGUlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzI4NDUzMzF8MA&ixlib=rb-4.1.0&q=80&w=200",
  },
  {
    id: 2,
    name: "Mike Chen",
    username: "@mikec",
    avatar:
      "https://images.unsplash.com/photo-1759882609529-0fa95c898794?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHZpZGVvJTIwY29udGVudCUyMGNyZWF0b3J8ZW58MXx8fHwxNzcyODkyMzA0fDA&ixlib=rb-4.1.0&q=80&w=200",
  },
  {
    id: 3,
    name: "Alex Rivera",
    username: "@alexr",
    avatar:
      "https://images.unsplash.com/photo-1641604210418-9c32f8f05ca0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBtZWRpYSUyMG1vYmlsZSUyMHBob25lfGVufDF8fHx8MTc3Mjg5MjMwNHww&ixlib=rb-4.1.0&q=80&w=200",
  },
  {
    id: 4,
    name: "Emma Davis",
    username: "@emmad",
    avatar:
      "https://images.unsplash.com/photo-1678048632153-d961f9c37a48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjB3aWxkbGlmZSUyMGFuaW1hbHN8ZW58MXx8fHwxNzcyODU4NzE4fDA&ixlib=rb-4.1.0&q=80&w=200",
  },
];

function SearchBar() {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: "#18181B",
        borderColor: "#27272A",
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 6,
      }}
    >
      <SearchIcon size={20} color="#A1A1AA" />
      <TextInput
        placeholder="Search videos..."
        placeholderTextColor="#A1A1AA"
        style={{
          flex: 1,
          color: "#fff",
          fontSize: 16,
        }}
      />
    </View>
  );
}

function ImageWithFallback({ uri, style }: { uri: string; style: object }) {
  const [didError, setDidError] = useState(false);

  return (
    <Image
      source={{ uri: didError ? ERROR_IMG_SRC : uri }}
      style={style}
      resizeMode="cover"
      onError={() => setDidError(true)}
    />
  );
}

export default function SearchScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0F0F11",
      }}
    >
      <View
        style={{
          marginTop: 20,
          paddingTop: 20,
          paddingHorizontal: 16,
          paddingBottom: 12,
          borderBottomColor: "#27272A",
          borderBottomWidth: 1,
          backgroundColor: "rgba(15,15,17,0.94)",
        }}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 16,
            fontFamily: "Sora-Bold",
            marginBottom: 14,
          }}
        >
          Search
        </Text>
        <SearchBar />
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 20,
        }}
      >
        <View style={{ marginBottom: 30 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 14,
            }}
          >
            <TrendingUp size={20} color="#F97316" />
            <Text
              style={{
                color: "#fff",
                fontSize: 24,
              }}
            >
              Trending Now
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            {trendingVideos.map((video) => (
              <Pressable
                key={video.id}
                style={{
                  width: "48.2%",
                  aspectRatio: 9 / 16,
                  borderRadius: 16,
                  overflow: "hidden",
                  backgroundColor: "#18181B",
                }}
              >
                <ImageWithFallback
                  uri={video.thumbnail}
                  style={{ width: "100%", height: "100%" }}
                />

                <LinearGradient
                  colors={[
                    "rgba(0,0,0,0.85)",
                    "rgba(0,0,0,0.2)",
                    "transparent",
                  ]}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0,
                  }}
                />

                <View
                  style={{
                    position: "absolute",
                    left: 10,
                    right: 10,
                    bottom: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <TrendingUp size={14} color="#fff" />
                  <Text style={{ color: "#fff", fontSize: 12 }}>
                    {video.views} views
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        <View>
          <Text
            style={{
              color: "#fff",
              fontSize: 24,
              marginBottom: 14,
            }}
          >
            Suggested Creators
          </Text>

          <View style={{ gap: 12 }}>
            {suggestedCreators.map((creator) => (
              <View
                key={creator.id}
                style={{
                  backgroundColor: "#18181B",
                  borderColor: "#27272A",
                  borderWidth: 1,
                  borderRadius: 16,
                  padding: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    flexShrink: 1,
                  }}
                >
                  <ImageWithFallback
                    uri={creator.avatar}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 999,
                    }}
                  />
                  <View>
                    <Text style={{ color: "#fff", fontSize: 16 }}>
                      {creator.name}
                    </Text>
                    <Text style={{ color: "#A1A1AA", fontSize: 13 }}>
                      {creator.username}
                    </Text>
                  </View>
                </View>

                <Pressable
                  style={{
                    borderRadius: 12,
                    overflow: "hidden",
                  }}
                >
                  <LinearGradient
                    colors={["#7C3AED", "#F97316"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      paddingHorizontal: 18,
                      paddingVertical: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: "600",
                      }}
                    >
                      Follow
                    </Text>
                  </LinearGradient>
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
