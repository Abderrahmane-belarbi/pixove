import { Bell } from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { VideoCard } from "@/components/video-card";

const mockVideos = [
  {
    id: 2,
    thumbnail:
      "https://images.unsplash.com/photo-1635661988046-306631057df3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raW5nJTIwZm9vZCUyMHJlY2lwZXxlbnwxfHx8fDE3NzI4OTIzMDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Easy 5-Minute Pasta Recipe",
    creator: {
      name: "@chefcooking",
      avatar:
        "https://images.unsplash.com/photo-1759882609529-0fa95c898794?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHZpZGVvJTIwY29udGVudCUyMGNyZWF0b3J8ZW58MXx8fHwxNzcyODkyMzA0fDA&ixlib=rb-4.1.0&q=80&w=200",
    },
    likes: 8900,
    comments: 156,
  },
  {
    id: 3,
    thumbnail:
      "https://images.unsplash.com/photo-1743699537171-750edd44bd87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBsYW5kc2NhcGUlMjBhZHZlbnR1cmV8ZW58MXx8fHwxNzcyODkyMzA1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Exploring Hidden Gems in Iceland",
    creator: {
      name: "@wanderlust",
      avatar:
        "https://images.unsplash.com/photo-1641604210418-9c32f8f05ca0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBtZWRpYSUyMG1vYmlsZSUyMHBob25lfGVufDF8fHx8MTc3Mjg5MjMwNHww&ixlib=rb-4.1.0&q=80&w=200",
    },
    likes: 15600,
    comments: 289,
  },
  {
    id: 1,
    thumbnail:
      "https://images.unsplash.com/photo-1758526387507-b27e5f7ed0fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYW5jZSUyMHBlcmZvcm1hbmNlJTIwZW5lcmd5fGVufDF8fHx8MTc3Mjg5MjMwNHww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Epic Dance Performance | Feel the Energy",
    creator: {
      name: "@dancemoves",
      avatar:
        "https://images.unsplash.com/photo-1712898281217-d9a6905516f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3R5bGUlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzI4NDUzMzF8MA&ixlib=rb-4.1.0&q=80&w=200",
    },
    likes: 12500,
    comments: 342,
  },
];

export default function Home() {
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
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 16,
            fontFamily: "Sora-Bold",
          }}
        >
          Pixove
        </Text>

        <TouchableOpacity style={{ padding: 8, position: "relative" }}>
          <Bell size={24} color="#FFFFFF" />
          <View
            style={{
              position: "absolute",
              top: 7,
              right: 9,
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: "#F97316",
            }}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 20,
        }}
      >
        <View style={{ gap: 18 }}>
          {mockVideos.map((video) => (
            <VideoCard key={video.id} {...video} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
