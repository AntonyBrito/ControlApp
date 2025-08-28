import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Accelerometer } from "expo-sensors";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface Props {
  onAngleChange: (angle: number) => void;
  onPedalChange: (status: "ACELERANDO" | "FREANDO" | "PARADO") => void;
}

export default function SteeringWheelGyroscope({
  onAngleChange,
  onPedalChange,
}: Props) {
  const rotation = useSharedValue(0);
  const [pedalStatus, setPedalStatus] = useState<
    "ACELERANDO" | "FREANDO" | "PARADO"
  >("PARADO");

  const neutralX = 0; // posição em pé do celular sempre zero
  const SENSITIVITY = 200; // aumenta a sensibilidade
  const DEAD_ZONE = 0.05; // zona morta para estabilidade

  useEffect(() => {
    Accelerometer.setUpdateInterval(50);

    const subscription = Accelerometer.addListener((accelData) => {
      const x = accelData.x;

      // delta entre posição atual e neutra
      let delta = x - neutralX;

      // aplicar zona morta
      if (Math.abs(delta) < DEAD_ZONE) delta = 0;

      // inverter para que girar para direita → volante direita
      const targetAngle = -delta * SENSITIVITY;

      // suavização com peso
      const smoothedAngle = rotation.value * 0.7 + targetAngle * 0.3;

      // limitar ângulo
      rotation.value = withSpring(
        Math.max(-180, Math.min(180, smoothedAngle)),
        {
          damping: 12,
          stiffness: 100,
        }
      );

      onAngleChange(Math.round(rotation.value));
    });

    return () => subscription.remove();
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const handlePedalPress = (status: "ACELERANDO" | "FREANDO" | "PARADO") => {
    setPedalStatus(status);
    onPedalChange(status);
  };

  return (
    <View style={{ alignItems: "center" }}>
      <Animated.View style={[styles.wheelContainer, animatedStyle]}>
        <FontAwesome5 name="circle-notch" size={150} color="#61a3f2" />
      </Animated.View>

      <View style={styles.pedalsContainer}>
        <TouchableOpacity
          style={[styles.pedal, styles.brake]}
          onPressIn={() => handlePedalPress("FREANDO")}
          onPressOut={() => handlePedalPress("PARADO")}
        >
          <Text style={styles.pedalText}>FREIO</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.pedal, styles.accelerator]}
          onPressIn={() => handlePedalPress("ACELERANDO")}
          onPressOut={() => handlePedalPress("PARADO")}
        >
          <Text style={styles.pedalText}>ACELERADOR</Text>
        </TouchableOpacity>
      </View>
    </View>
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
