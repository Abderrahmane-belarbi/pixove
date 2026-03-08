import { MaterialIcons } from "@expo/vector-icons";
// @ts-ignore
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
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
