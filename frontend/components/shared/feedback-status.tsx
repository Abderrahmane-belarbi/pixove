import { AlertCircle, CheckCircle, InfoIcon } from "lucide-react-native";
import { Text, View } from "react-native";

type FeedbackStatusProps = {
  type: "error" | "success" | "info";
  message: string;
};

export function FeedbackStatus({ type, message }: FeedbackStatusProps) {
  const variants = {
    error: {
      bg: "#EF44441A",
      border: "#EF44444D",
      text: "#EF4444",
      icon: AlertCircle,
    },
    success: {
      bg: "#22C55E1A",
      border: "#22C55E4D",
      text: "#4ADE80",
      icon: CheckCircle,
    },
    info: {
      bg: "#60A5FA1A",
      border: "#60A5FA4D",
      text: "#60A5FA",
      icon: InfoIcon,
    },
  };

  const variant = variants[type];
  const IconComponent = variant.icon;

  return (
    <View
      style={{
        borderColor: variant.border,
        borderWidth: 1,
        backgroundColor: variant.bg,
        flexDirection: "row",
        gap: 12,
        alignItems: "center",
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
    >
      <IconComponent color={variant.text} size={20} />
      <Text style={{ color: variant.text, fontSize: 14, lineHeight: 20 }}>
        {message}
      </Text>
    </View>
  );
}
