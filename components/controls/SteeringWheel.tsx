import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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

const { width } = Dimensions.get("window");
const wheelContainerSize = width * 0.7;
const wheelIconSize = wheelContainerSize * 0.9;
const pedalWidth = width * 0.35;
const pedalHeight = pedalWidth * 0.85;

export default function SteeringWheel({
  onAngleChange,
  onPedalChange,
}: SteeringWheelProps) {
  const rotation = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      const centerX = wheelContainerSize / 2;
      const centerY = wheelContainerSize / 2;

      const dx = event.x - centerX;
      const dy = event.y - centerY;

      // Calcula o ângulo e adiciona 90 graus para que o topo seja o grau 0
      const newAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

      // Limita o ângulo a um giro de 180 graus para cada lado
      const clampedAngle = Math.max(-180, Math.min(180, newAngle));

      rotation.value = clampedAngle;
      runOnJS(onAngleChange)(clampedAngle);
    },
    onEnd: () => {
      // Retorna suavemente ao centro ao soltar
      rotation.value = withSpring(0);
      runOnJS(onAngleChange)(0);
    },
  });

  const animatedRotationStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={styles.wheelContainer}>
          <Animated.View style={animatedRotationStyle}>
            <MaterialCommunityIcons
              name="steering"
              size={wheelIconSize}
              color="#61a3f2"
            />
          </Animated.View>
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
            size={pedalHeight * 0.4}
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
            size={pedalHeight * 0.4}
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
    width: "100%",
  },
  wheelContainer: {
    width: wheelContainerSize,
    height: wheelContainerSize,
    borderRadius: wheelContainerSize / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  pedalsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  pedal: {
    width: pedalWidth,
    height: pedalHeight,
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
    fontSize: width * 0.035,
  },
});
