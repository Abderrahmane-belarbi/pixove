import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { height } = Dimensions.get("window");

const onboardingData = [
  {
    image: "/assets/images/onboarding/onboarding-1.jpg",
    title: "Welcome to Pixove",
    description: "Discover and share amazing video content with the world",
  },
  {
    image: "/assets/images/onboarding/onboarding-2.jpg",
    title: "Create & Share",
    description: "Express yourself with powerful video creation tools",
  },
  {
    image: "/assets/images/onboarding/onboarding-3.jpg",
    title: "Join the Community",
    description: "Connect with creators worldwide",
  },
];

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSlide = onboardingData[currentIndex];

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      router.push("/(auth)/login");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Image Section */}
      <ImageBackground
        source={{ uri: currentSlide.image }}
        style={styles.image}
      >
        <LinearGradient
          colors={["transparent", "rgba(15,15,17,0.6)", "#0F0F11"]}
          style={styles.gradient}
        />

        <MaskedView maskElement={<Text style={styles.logo}>Pixove</Text>}>
          <LinearGradient
            colors={["#F97316", "#7C3AED"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 250,
              height: 100,
            }}
          />
        </MaskedView>
      </ImageBackground>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{currentSlide.title}</Text>
        <Text style={styles.description}>{currentSlide.description}</Text>

        {/* Dots */}
        <View style={styles.dotsContainer}>
          {onboardingData.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setCurrentIndex(index)}
              style={[styles.dot, index === currentIndex && styles.activeDot]}
            />
          ))}
        </View>

        {/* Button */}
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
  image: {
    height: height * 0.6,
    justifyContent: "flex-start",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  logo: {
    marginTop: 60,
    alignSelf: "center",
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  content: {
    padding: 24,
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
    marginBottom: 30,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
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
