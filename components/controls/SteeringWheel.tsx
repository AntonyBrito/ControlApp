import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface SteeringWheelProps {
  onAngleChange: (angle: number) => void;
  onPedalChange: (status: "ACELERANDO" | "FREANDO" | "PARADO") => void;
}

export default function SteeringWheel({
  onAngleChange,
  onPedalChange,
}: SteeringWheelProps) {
  const rotation = useSharedValue(0);

  // Gesture handler atualizado
  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event, ctx) => {
      const dx = event.translationX;
      const dy = event.translationY;

      let angle = (Math.atan2(dy, dx) * 180) / Math.PI;

      // Limitar o ângulo
      angle = Math.max(-180, Math.min(180, angle));

      rotation.value = angle;
      runOnJS(onAngleChange)(Math.round(angle));
    },
    onEnd: () => {
      rotation.value = withSpring(0);
      runOnJS(onAngleChange)(0);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.wheelContainer, animatedStyle]}>
          <MaterialCommunityIcons name="steering" size={220} color="#2c5282" />
        </Animated.View>
      </PanGestureHandler>

      <View style={styles.pedalsContainer}>
        <TouchableOpacity
          style={[styles.pedal, styles.brake]}
          onPressIn={() => onPedalChange("FREANDO")}
          onPressOut={() => onPedalChange("PARADO")}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="car-brake-alert"
            size={42}
            color="#e53e3e"
          />
          <Text style={styles.pedalText}>FREIO</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.pedal, styles.accelerator]}
          onPressIn={() => onPedalChange("ACELERANDO")}
          onPressOut={() => onPedalChange("PARADO")}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="rocket-launch-outline"
            size={42}
            color="#48bb78"
          />
          <Text style={styles.pedalText}>ACELERADOR</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  wheelContainer: {
    width: 260,
    height: 260,
    borderRadius: 130,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  pedalsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 30,
    gap: 40,
  },
  pedal: {
    width: 130,
    height: 110,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1F2937",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    borderWidth: 2,
  },
  brake: {
    borderColor: "#e53e3e",
  },
  accelerator: {
    borderColor: "#48bb78",
  },
  pedalText: {
    color: "white",
    fontWeight: "bold",
    marginTop: 10,
    fontSize: 14,
  },
});
