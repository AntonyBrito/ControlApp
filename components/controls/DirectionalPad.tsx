import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";

type DpadDirection = "FRENTE" | "TRÁS" | "ESQUERDA" | "DIREITA" | "PARADO";

interface DpadProps {
  onDirectionChange: (direction: DpadDirection) => void;
}

export default function Dpad({ onDirectionChange }: DpadProps) {
  const handlePressIn = (direction: DpadDirection) => {
    onDirectionChange(direction);
  };

  const handlePressOut = () => {
    onDirectionChange("PARADO");
  };

  return (
    <View style={styles.dpadContainer}>
      <TouchableOpacity
        style={[styles.dpadButton, styles.up]}
        onPressIn={() => handlePressIn("FRENTE")}
        onPressOut={handlePressOut}
      >
        <FontAwesome name="arrow-up" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.dpadButton, styles.left]}
        onPressIn={() => handlePressIn("ESQUERDA")}
        onPressOut={handlePressOut}
      >
        <FontAwesome name="arrow-left" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.dpadButton, styles.right]}
        onPressIn={() => handlePressIn("DIREITA")}
        onPressOut={handlePressOut}
      >
        <FontAwesome name="arrow-right" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.dpadButton, styles.down]}
        onPressIn={() => handlePressIn("TRÁS")}
        onPressOut={handlePressOut}
      >
        <FontAwesome name="arrow-down" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const { width } = Dimensions.get("window");
const containerSize = width * 0.6;
const buttonSize = containerSize / 3;

const styles = StyleSheet.create({
  dpadContainer: {
    width: containerSize,
    height: containerSize,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  dpadButton: {
    position: "absolute",
    width: buttonSize,
    height: buttonSize,
    backgroundColor: "#333642",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  up: {
    top: 0,
    left: buttonSize,
  },
  down: {
    bottom: 0,
    left: buttonSize,
  },
  left: {
    left: 0,
    top: buttonSize,
  },
  right: {
    right: 0,
    top: buttonSize,
  },
});
