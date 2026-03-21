import { MaterialIcons } from "@expo/vector-icons";
// @ts-ignore
import { useAuth } from "@/store/auth.store";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { router, Tabs } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";
import "../../global.css";

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>["name"];
type TabIconProps = {
  name: MaterialIconName;
  color: string;
  focused: boolean;
};

function TabIcon({ name, focused }: TabIconProps) {
  if (!focused) {
    return <MaterialIcons name={name} size={28} color="#A1A1AA" />;
  }

  return (
    <MaskedView
      maskElement={<MaterialIcons name={name} size={28} color="black" />}
    >
      <LinearGradient
        colors={["#F97316", "#7C3AED"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ width: 28, height: 28 }}
      />
    </MaskedView>
  );
}

export default function TabsLayout() {
  const { status, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (status === "unauthenticated") router.replace("/(auth)/login");
  }, [isLoading]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0F0F11",
        }}
      >
        <ActivityIndicator size="small" color="#fff" />
      </View>
    );
  }

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#F97316",
          tabBarInactiveTintColor: "#27272A",
          tabBarStyle: {
            backgroundColor: "#18181B",
            borderTopWidth: 1,
            borderTopColor: "#27272A",
            height: 60,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon name="home" color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: "Create",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon name="add-box" color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon name="search" color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon name="person" color={color} focused={focused} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
