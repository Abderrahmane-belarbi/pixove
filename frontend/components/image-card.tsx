import { Image } from "expo-image";
import { View } from "react-native";

export default function ImageCard({ url }: { url: string }) {
  return (
    <View
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: 9 / 16,
        overflow: "hidden",
      }}
    >
      <Image
        source={{ uri: url }}
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
      ></View>
    </View>
  );
}
