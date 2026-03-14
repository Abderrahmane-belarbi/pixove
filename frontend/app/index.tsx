import { useAuth } from "@/store/auth.store";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

type OnboardingSlide = {
  image: number;
  title: string;
  description: string;
};

const onboardingData: OnboardingSlide[] = [
  {
    image: require("../assets/images/onboarding/onboarding-1.jpg"),
    title: "Welcome to Pixove",
    description: "Discover and share amazing video content with the world",
  },
  {
    image: require("../assets/images/onboarding/onboarding-2.jpg"),
    title: "Create & Share",
    description: "Express yourself with powerful video creation tools",
  },
  {
    image: require("../assets/images/onboarding/onboarding-3.jpg"),
    title: "Join the Community",
    description: "Connect with creators worldwide",
  },
];

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<OnboardingSlide>>(null);
  const { user, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
    if (user) router.replace("/(tabs)/home");
  }, [user, checkAuth]);

  const viewabilityConfig = useMemo(
    () => ({
      itemVisiblePercentThreshold: 50,
    }),
    [],
  );

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const visibleItem = viewableItems[0];

      if (visibleItem?.index !== undefined && visibleItem.index !== null) {
        setCurrentIndex(visibleItem.index);
      }
    },
  ).current;

  const scrollToSlide = useCallback((index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex < onboardingData.length - 1) {
      scrollToSlide(currentIndex + 1);
      return;
    }

    router.replace("/(auth)/register");
  }, [currentIndex, scrollToSlide]);

  const handleDotPress = useCallback(
    (index: number) => {
      if (index !== currentIndex) {
        scrollToSlide(index);
      }
    },
    [currentIndex, scrollToSlide],
  );

  return (
    <SafeAreaView style={styles.container}>
      <MaskedView maskElement={<Text style={styles.logo}>Pixove</Text>}>
        <LinearGradient
          colors={["#F97316", "#7C3AED"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logoGradient}
        />
      </MaskedView>

      <FlatList
        ref={flatListRef}
        data={onboardingData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        onScrollToIndexFailed={({ index }) => {
          requestAnimationFrame(() => {
            flatListRef.current?.scrollToOffset({
              offset: index * width,
              animated: true,
            });
          });
        }}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <ImageBackground source={item.image} style={styles.image}>
              <LinearGradient
                colors={["transparent", "rgba(15,15,17,0.6)", "#0F0F11"]}
                style={styles.gradient}
              />
            </ImageBackground>

            <View style={styles.content}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
          {onboardingData.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleDotPress(index)}
              style={[styles.dot, index === currentIndex && styles.activeDot]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <LinearGradient
            colors={["#7C3AED", "#F97316"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>
              {currentIndex === onboardingData.length - 1
                ? "Get Started"
                : "Next"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F11",
  },
  logo: {
    marginTop: 2,
    alignSelf: "center",
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  logoGradient: {
    width: 250,
    height: 56,
    alignSelf: "center",
  },
  slide: {
    width,
    flex: 1,
    backgroundColor: "#0F0F11",
  },
  image: {
    height: height * 0.56,
    justifyContent: "flex-start",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  title: {
    color: "white",
    fontSize: 26,
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    color: "#A1A1AA",
    fontSize: 16,
    textAlign: "center",
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 16,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#27272A",
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: "#7C3AED",
  },
  button: {
    borderRadius: 999,
    overflow: "hidden",
  },
  buttonGradient: {
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
