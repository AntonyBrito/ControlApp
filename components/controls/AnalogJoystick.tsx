import React from "react";
import { View, StyleSheet } from "react-native";
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

// --- Constantes e Tipagens ---
const JOYSTICK_SIZE = 200;
const JOYSTICK_KNOB_SIZE = 80;
const JOYSTICK_RADIUS = JOYSTICK_SIZE / 2;
const KNOB_RADIUS = JOYSTICK_KNOB_SIZE / 2;
const MAX_DISTANCE = JOYSTICK_RADIUS - KNOB_RADIUS;

interface JoystickProps {
  onMove: (data: { x: number; y: number }) => void;
}

export default function AnalogJoystick({ onMove }: JoystickProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx: { startX: number; startY: number }) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx: { startX: number; startY: number }) => {
      let newX = ctx.startX + event.translationX;
      let newY = ctx.startY + event.translationY;

      const distance = Math.sqrt(newX * newX + newY * newY);

      if (distance > MAX_DISTANCE) {
        const angle = Math.atan2(newY, newX);
        newX = Math.cos(angle) * MAX_DISTANCE;
        newY = Math.sin(angle) * MAX_DISTANCE;
      }

      translateX.value = newX;
      translateY.value = newY;

      if (onMove) {
        runOnJS(onMove)({ x: newX, y: -newY }); // Invertendo Y para o padrão (cima é positivo)
      }
    },
    onEnd: () => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      if (onMove) {
        runOnJS(onMove)({ x: 0, y: 0 });
      }
    },
  });

  const knobStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  return (
    <GestureHandlerRootView style={styles.joystickContainer}>
      <View style={styles.joystickBase}>
        <PanGestureHandler onGestureEvent={onGestureEvent}>
          <Animated.View style={[styles.joystickKnob, knobStyle]} />
        </PanGestureHandler>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  joystickContainer: {
    width: JOYSTICK_SIZE,
    height: JOYSTICK_SIZE,
  },
  joystickBase: {
    width: "100%",
    height: "100%",
    borderRadius: JOYSTICK_RADIUS,
    backgroundColor: "#333642",
    justifyContent: "center",
    alignItems: "center",
  },
  joystickKnob: {
    width: JOYSTICK_KNOB_SIZE,
    height: JOYSTICK_KNOB_SIZE,
    borderRadius: KNOB_RADIUS,
    backgroundColor: "#61a3f2",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
