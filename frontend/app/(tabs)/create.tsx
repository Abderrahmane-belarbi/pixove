import { SERVER_LOCAL_API_URL } from "@/lib/utils/env";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Sparkles, Upload } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

const baseUrl = `api/${SERVER_LOCAL_API_URL}`;

export default function Create() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handlePublish() {
    setIsLoading(true);
    try {
      const res = await fetch(`${baseUrl}/create-post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        //router.replace("/(tabs)/home");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

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
          style={{ color: "#FFFFFF", fontSize: 16, fontFamily: "Sora-Bold" }}
        >
          New Post
        </Text>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: "#A1A1AA", fontSize: 16 }}>Cancel</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 20, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          style={{
            borderWidth: 2,
            borderStyle: "dashed",
            borderColor: "#27272A",
            borderRadius: 20,
            backgroundColor: "#18181B",
            minHeight: 260,
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              width: 70,
              height: 70,
              borderRadius: 35,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(124, 58, 237, 0.2)",
              marginBottom: 16,
            }}
          >
            <Upload size={34} color="#7C3AED" />
          </View>
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 18,
              fontFamily: "Sora-SemiBold",
            }}
          >
            Upload Media
          </Text>
          <Text
            style={{
              color: "#A1A1AA",
              fontSize: 13,
              fontFamily: "Inter-Regular",
              marginTop: 6,
            }}
          >
            Tap to select video or image
          </Text>
          <Text
            style={{
              color: "#71717A",
              fontSize: 13,
              marginTop: 10,
            }}
          >
            MP4, MOV, JPG • Max 100MB
          </Text>
        </Pressable>

        {/* Title */}
        <View>
          <Text
            style={{
              color: "#A1A1AA",
              fontSize: 13,
              marginBottom: 6,
            }}
          >
            Title
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Add a clear title"
            placeholderTextColor="#71717A"
            style={{
              backgroundColor: "#18181B",
              borderColor: "#27272A",
              borderWidth: 1,
              borderRadius: 14,
              color: "#FFF",
              paddingHorizontal: 14,
              paddingVertical: 12,
            }}
          />
        </View>

        {/* Description */}
        <View>
          <Text
            style={{
              color: "#A1A1AA",
              fontSize: 13,
              marginBottom: 6,
            }}
          >
            Description (Optional)
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Add details or context"
            placeholderTextColor="#71717A"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={{
              backgroundColor: "#18181B",
              borderColor: "#27272A",
              borderWidth: 1,
              borderRadius: 14,
              color: "#FFF",
              paddingHorizontal: 14,
              paddingVertical: 12,
              minHeight: 90,
            }}
          />
        </View>

        {/* Publish button */}
        <Pressable onPress={handlePublish}>
          <LinearGradient
            colors={["#7C3AED", "#F97316"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 14,
              minHeight: 50,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Sparkles size={18} color="#FFFFFF" />
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 16,
                fontFamily: "Sora-SemiBold",
              }}
            >
              Publish
            </Text>
          </LinearGradient>
        </Pressable>

        <Text
          style={{
            textAlign: "center",
            color: "#A1A1AA",
            fontSize: 12,
          }}
        >
          By publishing, you agree to our Community Guidelines
        </Text>
      </ScrollView>
    </View>
  );
}
