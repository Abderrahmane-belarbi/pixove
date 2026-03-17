import InputField from "@/components/form/input-field";
import { FeedbackStatus } from "@/components/shared/feedback-status";
import { useAuth } from "@/store/auth.store";
import { UserRegister, UserRegisterSchema } from "@/validation/user-register";
import { AntDesign } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import z, { ZodError } from "zod";

export default function Register() {
  const [registerInput, setRegisterInput] = useState<UserRegister>({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{
    email: string | undefined;
    name: string | undefined;
    password: string | undefined;
  }>({
    email: undefined,
    name: undefined,
    password: undefined,
  });
  const { signup, message, error, isLoading, clearAuthFeedback } = useAuth();

  useEffect(() => {
    clearAuthFeedback();
  }, [clearAuthFeedback]);

  type FlatError = Partial<Record<keyof UserRegister, string[]>>;
  function toFieldsErrors(error: ZodError) {
    const flat = z.flattenError(error).fieldErrors as FlatError;
    return {
      name: flat?.name?.[0],
      email: flat?.email?.[0],
      password: flat?.password?.[0],
    };
  }

  async function handleRegister() {
    const validate = UserRegisterSchema.safeParse(registerInput);
    if (!validate.success) {
      const flatErrors = toFieldsErrors(validate.error);
      setErrors(flatErrors);
      return;
    }
    if (!registerInput.email || !registerInput.name || !registerInput.password)
      return;
    try {
      await signup(
        registerInput.email,
        registerInput.password,
        registerInput.name,
      );
      setTimeout(() => {
        router.replace("/(auth)/login");
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  }
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
      <Text style={styles.subtitle}>Create your account</Text>
      <View style={styles.form}>
        <InputField
          label="Name"
          placeholder="john_doe"
          placeholderColor="#71717A"
          autoCapitalize="none"
          autoComplete="name"
          iconName="person"
          onChange={(value) => {
            setRegisterInput((prev) => {
              return { ...prev, name: value };
            });
            setErrors((prev) => {
              return { ...prev, name: undefined };
            });
          }}
          error={errors.name}
        />
        <InputField
          label="Email"
          placeholder="email@example.com"
          placeholderColor="#71717A"
          autoCapitalize="none"
          autoComplete="email"
          iconName="mail-outline"
          onChange={(value) => {
            setRegisterInput((prev) => {
              return { ...prev, email: value };
            });
            setErrors((prev) => {
              return { ...prev, email: undefined };
            });
          }}
          error={errors.email}
        />
        <InputField
          label="Password"
          placeholder="enter your password"
          placeholderColor="#71717A"
          autoCapitalize="none"
          autoComplete="current-password"
          iconName="lock-outline"
          onChange={(value) => {
            setRegisterInput((prev) => {
              return { ...prev, password: value };
            });
            setErrors((prev) => {
              return { ...prev, password: undefined };
            });
          }}
          error={errors.password}
        />
        {error && <FeedbackStatus type={"error"} message={error} />}
        {message && <FeedbackStatus type={"success"} message={message} />}
        <TouchableOpacity
          disabled={isLoading}
          style={styles.button}
          onPress={handleRegister}
        >
          <LinearGradient
            colors={["#7C3AED", "#F97316"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign up</Text>
            )}
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
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text style={{ color: "#BB57A2", fontSize: 14 }}>Sign in</Text>
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
