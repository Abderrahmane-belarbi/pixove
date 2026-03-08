import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import "react-native-reanimated";
import "../../global.css";

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>["name"];
type TabIconProps = {
  name: MaterialIconName;
  color: string;
  focused: boolean;
};

function TabIcon({ name, color, focused }: TabIconProps) {
  return <MaterialIcons name={name} size={32} color={color} />;
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
