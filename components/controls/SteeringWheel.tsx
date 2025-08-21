import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
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

  const handleGesture = (event: any) => {
    // Centro do volante
    const centerX = Dimensions.get("window").width / 2;
    const centerY = 200; // ajuste conforme layout

    // Calcula ângulo em relação ao centro
    const dx = event.absoluteX - centerX;
    const dy = event.absoluteY - centerY;
    let angle = (Math.atan2(dy, dx) * 180) / Math.PI;

    // Ajusta para faixa -180 a +180
    if (angle > 180) angle -= 360;
    if (angle < -180) angle += 360;

    // Limite de giro
    if (angle > 180) angle = 180;
    if (angle < -180) angle = -180;

    rotation.value = angle;
    runOnJS(onAngleChange)(angle);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <GestureHandlerRootView>
      <PanGestureHandler
        onGestureEvent={handleGesture}
        onEnded={() => {
          rotation.value = withSpring(0);
          runOnJS(onAngleChange)(0);
        }}
      >
        <Animated.View style={[styles.wheelContainer, animatedStyle]}>
          <FontAwesome5 name="circle-notch" size={150} color="#61a3f2" />
        </Animated.View>
      </PanGestureHandler>

      <View style={styles.pedalsContainer}>
        <TouchableOpacity
          style={[styles.pedal, styles.brake]}
          onPressIn={() => onPedalChange("FREANDO")}
          onPressOut={() => onPedalChange("PARADO")}
        >
          <Text style={styles.pedalText}>FREIO</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.pedal, styles.accelerator]}
          onPressIn={() => onPedalChange("ACELERANDO")}
          onPressOut={() => onPedalChange("PARADO")}
        >
          <Text style={styles.pedalText}>ACELERADOR</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  wheelContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333642",
    marginBottom: 40,
    alignSelf: "center",
  },
  pedalsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  pedal: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  brake: {
    backgroundColor: "#e53e3e",
  },
  accelerator: {
    backgroundColor: "#48bb78",
  },
  pedalText: {
    color: "white",
    fontWeight: "bold",
  },
});
