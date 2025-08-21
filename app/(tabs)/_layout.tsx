import { Tabs } from "expo-router/tabs";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function AppLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color }: { color: string }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="controlScreen"
        options={{
          title: "Controles",
          tabBarIcon: ({ color }: { color: string }) => (
            <FontAwesome size={28} name="gamepad" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}