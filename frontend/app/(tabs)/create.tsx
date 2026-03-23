import { File } from "expo-file-system";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Sparkles, Upload, X } from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

type SelectedMedia = {
  uri: string;
  type: "image" | "video";
  mimeType: string;
  fileName: string;
  fileSize: number;
};

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const baseUrl = `${API_BASE_URL}/api`;
const MAX_SINGLE_FILE_BYTES = 100 * 1024 * 1024;

async function uploadToCloudinary(
  media: SelectedMedia,
  token: string,
  onProgress: (percent: number) => void,
) {
  // 1️⃣ Get signature from backend
  const sigRes = await fetch(`${baseUrl}/signature`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!sigRes.ok) {
    throw new Error("Failed to generate upload signature");
  }

  const sigData = await sigRes.json();

  const resourceType = media.type === "video" ? "video" : "image";
  const formData = new FormData();

  formData.append("file", {
    uri: media.uri,
    type: media.mimeType,
    name: media.fileName,
  } as unknown as Blob);

  formData.append("api_key", sigData.apiKey);
  formData.append("timestamp", sigData.timestamp.toString());
  formData.append("signature", sigData.signature);
  formData.append("folder", sigData.folder);

  // 2️⃣ Use XMLHttpRequest for progress
  return new Promise<{ url: string }>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.response);
          resolve({ url: data.secure_url });
        } else {
          try {
            const err = JSON.parse(xhr.response);
            reject(
              new Error(err?.error?.message ?? "Cloudinary upload failed"),
            );
          } catch {
            reject(new Error("Cloudinary upload failed"));
          }
        }
      }
    };
    xhr.onerror = () => reject(new Error("Network error during upload"));

    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${sigData.cloudName}/${resourceType}/upload`,
    );
    xhr.send(formData);
  });
}

export default function Create() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<SelectedMedia | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const mediaLabel = useMemo(() => {
    if (!selectedMedia) return "Tap to select video or image";
    return `${selectedMedia.fileName} • ${(selectedMedia.fileSize / 1024 / 1024).toFixed(1)} MB`;
  }, [selectedMedia]);

  async function handlePickMedia() {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Please allow media library access to choose a video or image.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: false,
      quality: 1,
      videoMaxDuration: 180,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    const type = asset.type === "video" ? "video" : "image";
    const fileInfo = new File(asset.uri);
    const fileSize =
      typeof asset.fileSize === "number"
        ? asset.fileSize
        : fileInfo.exists && typeof fileInfo.size === "number"
          ? fileInfo.size
          : null;

    if (fileSize === null) {
      Alert.alert(
        "Upload error",
        "Could not determine file size. Please choose a different file.",
      );
      return;
    }

    if (fileSize > MAX_SINGLE_FILE_BYTES) {
      Alert.alert(
        "File too large",
        `Please select a file smaller than ${MAX_SINGLE_FILE_BYTES / 1024 / 1024}MB.`,
      );
      return;
    }

    setSelectedMedia({
      uri: asset.uri,
      type,
      fileName:
        asset.fileName ??
        `upload-${Date.now()}.${type === "video" ? "mp4" : "jpg"}`,
      mimeType:
        asset.mimeType ?? (type === "video" ? "video/mp4" : "image/jpeg"),
      fileSize,
    });
  }

  async function handlePublish() {
    if (!title.trim()) {
      Alert.alert("Missing title", "Please add a title before publishing.");
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);

    try {
      const token = await SecureStore.getItemAsync("accessToken");
      if (!token) throw new Error("Not logged in");

      const uploadedMedia = selectedMedia
        ? [
            await uploadToCloudinary(selectedMedia, token, (percent) => {
              setUploadProgress(percent);
            }),
          ]
        : [];

      const res = await fetch(`${baseUrl}/create-post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          media: uploadedMedia.map((m) => ({
            url: m.url,
            type: selectedMedia?.type,
            name: selectedMedia?.fileName,
            size: selectedMedia?.fileSize,
          })),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setTitle("");
        setDescription("");
        setSelectedMedia(null);
        setUploadProgress(0);
        Alert.alert("Published", "Your post was published successfully.");
      } else {
        throw new Error(data?.error || "Failed to publish");
      }
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Upload failed";
      Alert.alert("Error", message);
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
          onPress={handlePickMedia}
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
            position: "relative",
            overflow: "hidden",
          }}
        >
          {!!selectedMedia && selectedMedia.type === "image" ? (
            <Image
              source={{ uri: selectedMedia.uri }}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
              }}
              contentFit="cover"
            />
          ) : null}

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
            {selectedMedia ? "Media selected" : "Upload Media"}
          </Text>
          <Text
            style={{
              color: "#A1A1AA",
              fontSize: 13,
              fontFamily: "Inter-Regular",
              marginTop: 6,
              textAlign: "center",
            }}
          >
            {mediaLabel}
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

        {selectedMedia ? (
          <Pressable
            onPress={() => setSelectedMedia(null)}
            style={{
              alignSelf: "flex-start",
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              paddingVertical: 6,
              paddingHorizontal: 10,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: "#3F3F46",
            }}
          >
            <X size={14} color="#A1A1AA" />
            <Text style={{ color: "#A1A1AA", fontSize: 12 }}>Remove media</Text>
          </Pressable>
        ) : null}

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

        <Pressable onPress={handlePublish} disabled={isLoading}>
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
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? (
              <Text style={{ color: "#FFF" }}>{uploadProgress}%</Text>
            ) : (
              <Sparkles size={18} color="#FFFFFF" />
            )}
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 16,
                fontFamily: "Sora-SemiBold",
              }}
            >
              {isLoading ? "Uploading..." : "Publish"}
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
