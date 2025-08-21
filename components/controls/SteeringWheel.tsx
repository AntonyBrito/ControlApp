import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

interface SteeringWheelProps {
  onAngleChange: (angle: number) => void;
  onPedalChange: (status: "ACELERANDO" | "FREANDO" | "PARADO") => void;
}

export default function SteeringWheel({
  onAngleChange,
  onPedalChange,
}: SteeringWheelProps) {
  const rotation = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: { startRotation: number }) => {
      ctx.startRotation = rotation.value;
    },
    onActive: (event, ctx: { startRotation: number }) => {
      rotation.value = ctx.startRotation + event.translationX;
      runOnJS(onAngleChange)(rotation.value);
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
    <GestureHandlerRootView>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.wheelContainer, animatedStyle]}>
          <FontAwesome5 name="fan" size={150} color="#61a3f2" />
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
