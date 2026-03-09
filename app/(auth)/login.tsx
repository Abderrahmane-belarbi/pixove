import InputField from "@/components/form/input-field";
import { AntDesign } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Login() {
  function handleLogin() {}
  return (
    <View style={styles.container}>
      <MaskedView maskElement={<Text style={styles.logo}>Pixove</Text>}>
        <LinearGradient
          colors={["#F97316", "#7C3AED"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logoGradient}
        />
      </MaskedView>
      <Text style={styles.subtitle}>Welcome back</Text>
      <View style={styles.form}>
        <InputField
          label="Email"
          placeholder="email@example.com"
          placeholderColor="#71717A"
          autoCapitalize="none"
          autoComplete="email"
          iconName="mail-outline"
        />
        <InputField
          label="Password"
          placeholder="enter your password"
          placeholderColor="#71717A"
          autoCapitalize="none"
          autoComplete="current-password"
          iconName="lock-outline"
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <LinearGradient
            colors={["#7C3AED", "#F97316"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Sign in</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View
          style={{
            marginTop: 14,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: "#27272A",
            }}
          />

          <Text
            style={{
              marginHorizontal: 10,
              color: "#71717A",
            }}
          >
            or continue with
          </Text>

          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: "#27272A",
            }}
          />
        </View>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#27272A",
            paddingVertical: 10,
          }}
        >
          <AntDesign name="google" size={20} color={"#ccc"} />
          <Text style={{ color: "#ccc", fontSize: 16, fontWeight: "600" }}>
            Google
          </Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", gap: 8, alignSelf: "center" }}>
          <Text style={{ fontSize: 14, color: "#71717A" }}>
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
            <Text style={{ color: "#BB57A2", fontSize: 14 }}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F0F11",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  logo: {
    alignSelf: "center",
    fontSize: 28,
    fontWeight: "bold",
  },
  logoGradient: {
    width: 95,
    height: 35,
    alignSelf: "center",
  },
  title: {
    color: "#A1A1AA",
    fontSize: 24,
  },
  subtitle: {
    color: "#A1A1AA",
    fontSize: 14,
    marginTop: 12,
    fontWeight: "500",
  },
  form: {
    marginTop: 40,
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#18181B",
    borderColor: "#27272A",
    borderWidth: 1,
    borderRadius: 20,
    padding: 24,
    gap: 20,
  },
  button: {
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 8,
  },
  buttonGradient: {
    paddingVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
