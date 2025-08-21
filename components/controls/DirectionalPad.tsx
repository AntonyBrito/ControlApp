import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

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
    width: containerSize / 3,
    height: containerSize / 3,
    backgroundColor: "#333642",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  up: {
    top: 0,
  },
  down: {
    bottom: 0,
  },
  left: {
    left: 0,
  },
  right: {
    right: 0,
  },
});
