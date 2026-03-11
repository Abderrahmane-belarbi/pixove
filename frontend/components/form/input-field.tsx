import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>["name"];
type AutoComplete = React.ComponentProps<typeof TextInput>["autoComplete"];
type InputFieldProps = {
  label: "Email" | "Password" | "Name";
  placeholder: string;
  placeholderColor: string;
  autoCapitalize: "none" | "sentences" | "words" | "characters" | undefined;
  iconName: MaterialIconName;
  autoComplete: AutoComplete;
  forLogin?: boolean;
  onChange: (value: string) => void;
};

export default function InputField({
  label,
  placeholder,
  placeholderColor,
  autoCapitalize,
  autoComplete,
  iconName,
  forLogin = true,
  onChange,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        autoComplete={autoComplete}
        autoCapitalize={autoCapitalize}
        secureTextEntry={label === "Password" && !showPassword}
        onChangeText={(value) => onChange(value)}
      />
      {label === "Password" && forLogin && (
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forget Password?</Text>
        </TouchableOpacity>
      )}
      <MaterialIcons
        name={iconName}
        size={20}
        style={styles.icon}
        color={"#71717A"}
      />
      {label === "Password" && (
        <MaterialIcons
          name={showPassword ? "visibility-off" : "visibility"}
          onPress={() => setShowPassword(!showPassword)}
          size={20}
          style={styles.showPassIcon}
          color={"#71717A"}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  input: {
    borderColor: "#27272A",
    borderWidth: 1,
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 10,
    paddingLeft: 40,
    color: "white",
    position: "relative",
  },
  label: {
    color: "#A1A1AA",
    fontSize: 12,
    marginBottom: 10,
  },
  icon: {
    position: "absolute",
    top: 38,
    left: 12,
  },
  showPassIcon: {
    position: "absolute",
    top: 38,
    right: 12,
  },
  forgotPassword: {
    color: "#BB57A2",
    fontSize: 12,
    marginTop: 8,
    alignSelf: "flex-end",
  },
});
