import { useVideoPlayer, VideoSource, VideoView } from "expo-video";
import { Pause, Play, Volume2, VolumeX } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, GestureResponderEvent, Pressable, View } from "react-native";

type VideoCardProps = {
  url: string;
  hlsUrl?: string;
  shouldAutoPlay: boolean;
};

function buildCloudinaryHlsUrl(rawUrl: string): string | null {
  if (
    !rawUrl.includes("res.cloudinary.com") ||
    !rawUrl.includes("/video/upload/")
  ) {
    return null;
  }

  const hasStreamingProfile = rawUrl.includes("/video/upload/sp_");

  const withStreamingProfile = hasStreamingProfile
    ? rawUrl
    : rawUrl.replace("/video/upload/", "/video/upload/sp_auto/");

  const [withoutQuery, query] = withStreamingProfile.split("?");
  const m3u8Url = withoutQuery.replace(/\.[a-zA-Z0-9]+$/, ".m3u8");

  return query ? `${m3u8Url}?${query}` : m3u8Url;
}

export default function VideoCard({
  url,
  hlsUrl,
  shouldAutoPlay,
}: VideoCardProps) {
  // ---------------- SOURCE ----------------
  const source = useMemo<VideoSource>(() => {
    const derived = hlsUrl ?? buildCloudinaryHlsUrl(url);
    return { uri: derived ?? url };
  }, [hlsUrl, url]);

  // ---------------- PLAYER ----------------
  const player = useVideoPlayer(source, (p) => {
    p.loop = true;
    p.muted = true;
  });

  // ---------------- STATE ----------------
  const [isMuted, setIsMuted] = useState(true);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);
  const [overlayIcon, setOverlayIcon] = useState<"play" | "pause" | null>(null);

  // ---------------- ANIMATION ----------------
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const runAnimation = useCallback(() => {
    scaleAnim.stopAnimation(); // prevent race conditions
    scaleAnim.setValue(0);

    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      setOverlayIcon(null);
    });
  }, [scaleAnim]);

  const animatedStyle = {
    transform: [
      {
        scale: scaleAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.6, 1.2],
        }),
      },
    ],
    opacity: scaleAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    }),
  };

  // ---------------- EFFECTS ----------------

  // autoplay + manual override (correct logic)
  useEffect(() => {
    if (shouldAutoPlay && !isManuallyPaused) {
      player.play();
    } else {
      player.pause();
    }
  }, [shouldAutoPlay, isManuallyPaused, player]);

  // sync mute
  useEffect(() => {
    player.muted = isMuted;
  }, [isMuted, player]);

  // ---------------- HANDLERS ----------------

  const togglePlayback = useCallback(() => {
    if (player.playing) {
      player.pause();
      setIsManuallyPaused(true);
      setOverlayIcon("pause");
    } else {
      player.play();
      setIsManuallyPaused(false);
      setOverlayIcon("play");
    }

    runAnimation();
  }, [player, runAnimation]);

  const toggleMute = useCallback((e: GestureResponderEvent) => {
    e.stopPropagation();
    setIsMuted((v) => !v);
  }, []);

  // ---------------- UI ----------------

  return (
    <View
      style={{
        width: "100%",
        aspectRatio: 9 / 16,
        position: "relative",
        backgroundColor: "#000",
      }}
    >
      {/* VIDEO */}
      <VideoView
        style={{ width: "100%", height: "100%" }}
        player={player}
        pointerEvents="none"
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        contentFit="cover"
        nativeControls={false}
      />

      {/* FULL TAP LAYER */}
      <Pressable
        onPress={togglePlayback}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      {/* CENTER ICON ANIMATION */}
      {overlayIcon && (
        <Animated.View
          style={[
            {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              alignItems: "center",
              justifyContent: "center",
            },
            animatedStyle,
          ]}
        >
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: "rgba(0,0,0,0.4)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {overlayIcon === "play" ? (
              <Play color="#fff" size={28} fill="#fff" />
            ) : (
              <Pause color="#fff" size={28} />
            )}
          </View>
        </Animated.View>
      )}

      {/* MUTE BUTTON */}
      <Pressable
        onPress={toggleMute}
        hitSlop={8}
        style={{
          position: "absolute",
          right: 12,
          bottom: 12,
          width: 34,
          height: 34,
          borderRadius: 17,
          backgroundColor: "rgba(0,0,0,0.45)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isMuted ? (
          <VolumeX color="#fff" size={18} />
        ) : (
          <Volume2 color="#fff" size={18} />
        )}
      </Pressable>
    </View>
  );
}
