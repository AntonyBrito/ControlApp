import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AnalogJoystick from "@/components/controls/AnalogJoystick";
import Dpad from "@/components/controls/DirectionalPad";
import SteeringWheel from "@/components/controls/SteeringWheel";

type JoystickType = "analogico" | "setas" | "volante";

export default function ControlScreen() {
  const [selectedJoystick, setSelectedJoystick] =
    useState<JoystickType>("analogico");
  const [joystickData, setJoystickData] = useState({
    x: 0,
    y: 0,
    force: 0,
    direction: "PARADO",
  });
  const [dpadDirection, setDpadDirection] = useState<string>("PARADO");
  const [wheelData, setWheelData] = useState({
    angle: 0,
    pedalStatus: "PARADO",
  });

  const handleJoystickMove = useCallback(
    ({ x, y }: { x: number; y: number }) => {
      const MAX_RAW_DISTANCE = 100;
      const scaledX = Math.round((x / MAX_RAW_DISTANCE) * 100);
      const scaledY = Math.round((y / MAX_RAW_DISTANCE) * 100);
      const distance = Math.sqrt(x * x + y * y);
      const force = Math.min(
        100,
        Math.round((distance / MAX_RAW_DISTANCE) * 100)
      );

      let direction = "PARADO";
      if (force > 10) {
        if (Math.abs(scaledX) > Math.abs(scaledY)) {
          direction = scaledX > 0 ? "DIREITA" : "ESQUERDA";
        } else {
          direction = scaledY > 0 ? "FRENTE" : "TRÁS";
        }
      }
      setJoystickData({ x: scaledX, y: scaledY, force, direction });
    },
    []
  );

  const renderControl = () => {
    switch (selectedJoystick) {
      case "analogico":
        return <AnalogJoystick onMove={handleJoystickMove} />;
      case "setas":
        return <Dpad onDirectionChange={setDpadDirection} />;
      case "volante":
        return (
          <SteeringWheel
            onAngleChange={(angle) =>
              setWheelData((prev) => ({ ...prev, angle }))
            }
            onPedalChange={(pedalStatus) =>
              setWheelData((prev) => ({ ...prev, pedalStatus }))
            }
          />
        );
      default:
        return null;
    }
  };

  const renderDataBox = () => {
    switch (selectedJoystick) {
      case "analogico":
        return (
          <>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>EIXO X / Y</Text>
              <Text style={styles.dataValue}>
                ({joystickData.x}, {joystickData.y})
              </Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>FORÇA</Text>
              <Text style={styles.dataValue}>{joystickData.force}%</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>DIREÇÃO</Text>
              <Text style={styles.dataValue}>{joystickData.direction}</Text>
            </View>
          </>
        );
      case "setas":
        return (
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>DIREÇÃO</Text>
            <Text style={styles.dataValue}>{dpadDirection}</Text>
          </View>
        );
      case "volante":
        return (
          <>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>ÂNGULO</Text>
              <Text style={styles.dataValue}>
                {Math.round(wheelData.angle)}°
              </Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>PEDAIS</Text>
              <Text style={styles.dataValue}>{wheelData.pedalStatus}</Text>
            </View>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Painel de Controle</Text>
      <View style={styles.optionsContainer}>
        {(["analogico", "setas", "volante"] as JoystickType[]).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.optionButton,
              selectedJoystick === type && styles.optionButtonSelected,
            ]}
            onPress={() => setSelectedJoystick(type)}
          >
            <Text style={styles.optionText}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.joystickContainer}>{renderControl()}</View>
      <View style={styles.dataBox}>{renderDataBox()}</View>
    </View>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0A192F",
    paddingTop: height * 0.05,
    gap: 20,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FFFFFF",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#272a33",
    borderRadius: 20,
  },
  optionButtonSelected: {
    backgroundColor: "#61a3f2",
  },
  optionText: {
    color: "white",
    fontWeight: "bold",
  },
  joystickContainer: {
    width: "90%",
    aspectRatio: 1,
    maxWidth: 400,
    justifyContent: "center",
    alignItems: "center",
  },
  dataBox: {
    backgroundColor: "#272a33",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    maxWidth: 350,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  dataLabel: {
    fontSize: 16,
    color: "#a0a0a0",
  },
  dataValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
