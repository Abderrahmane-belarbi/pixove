import { useVideoPlayer, VideoSource, VideoView } from "expo-video";
import { Volume2, VolumeX } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GestureResponderEvent, Pressable, View } from "react-native";

type VideoCardProps = {
  url: string;
  hlsUrl?: string;
  shouldAutoPlay: boolean; // comes from FlatList viewability
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
  const source = useMemo<VideoSource>(() => {
    const derived = hlsUrl ?? buildCloudinaryHlsUrl(url);
    return { uri: derived ?? url };
  }, [hlsUrl, url]);

  const player = useVideoPlayer(source, (p) => {
    p.loop = true;
    p.muted = true;
  });

  const [isMuted, setIsMuted] = useState(true);

  /**
   * SINGLE SOURCE OF TRUTH:
   * playback is derived from shouldAutoPlay ONLY
   */
  useEffect(() => {
    if (shouldAutoPlay) {
      player.play();
    } else {
      player.pause();
    }
  }, [shouldAutoPlay, player]);

  /**
   * keep mute synced
   */
  useEffect(() => {
    player.muted = isMuted;
  }, [isMuted, player]);

  /**
   * user interaction overrides autoplay ONLY via player state
   * (no extra React flags)
   */
  const togglePlayback = useCallback(() => {
    console.log("Pressed video card, toggling playback");
    const isCurrentlyPlaying = player.playing; // expo-video source of truth

    if (isCurrentlyPlaying) {
      player.pause();
    } else {
      player.play();
    }
  }, [player]);

  const toggleMute = useCallback((e: GestureResponderEvent) => {
    e.stopPropagation();
    setIsMuted((v) => !v);
  }, []);

  /**
   * derive UI state from player instead of React state
   */
  const isPlaying = player.playing;

  return (
    <View
      style={{
        width: "100%",
        aspectRatio: 9 / 16,
        position: "relative",
        backgroundColor: "#000",
      }}
    >
      {/* VIDEO (non-interactive) */}
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
