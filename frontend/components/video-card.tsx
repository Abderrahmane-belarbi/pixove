import { Play, Volume2, VolumeX } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
// eslint-disable-next-line import/no-unresolved
import { useVideoPlayer, VideoSource, VideoView } from "expo-video";

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
  const source = useMemo<VideoSource>(() => {
    const derivedHlsUrl = hlsUrl ?? buildCloudinaryHlsUrl(url);

    return {
      uri: derivedHlsUrl ?? url,
    };
  }, [hlsUrl, url]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const player = useVideoPlayer(source, (videoPlayer) => {
    videoPlayer.loop = true;
    videoPlayer.muted = true;
  });

  useEffect(() => {
    player.muted = isMuted;
  }, [isMuted, player]);

  useEffect(() => {
    if (shouldAutoPlay) {
      player.play();
      setIsPlaying(true);
      return;
    }

    player.pause();
    player.currentTime = 0;
    setIsPlaying(false);
  }, [player, shouldAutoPlay]);

  const togglePlayback = useCallback(() => {
    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
      return;
    }

    player.play();
    setIsPlaying(true);
  }, [isPlaying, player]);

  const toggleMute = useCallback((event: GestureResponderEvent) => {
    event.stopPropagation();
    setIsMuted((prevMuted) => !prevMuted);
  }, []);

  return (
    <Pressable onPress={togglePlayback} style={styles.container}>
      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        contentFit="cover"
        nativeControls={false}
      />

      {!isPlaying && (
        <View style={styles.centerOverlay}>
          <View style={styles.centerBadge}>
            <Play color="#FFFFFF" size={24} fill="#FFFFFF" />
          </View>
        </View>
      )}

      <Pressable onPress={toggleMute} style={styles.muteButton} hitSlop={8}>
        {isMuted ? (
          <VolumeX color="#FFFFFF" size={18} />
        ) : (
          <Volume2 color="#FFFFFF" size={18} />
        )}
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    aspectRatio: 9 / 16,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  centerOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  centerBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(0,0,0,0.38)",
    alignItems: "center",
    justifyContent: "center",
  },
  muteButton: {
    position: "absolute",
    right: 12,
    bottom: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
});
