import AnalogJoystick from "@/components/controls/AnalogJoystick";
import Dpad from "@/components/controls/DirectionalPad";
import SteeringWheel from "@/components/controls/SteeringWheel";
import SteeringWheelGyroscope from "@/components/controls/SteeringWheelGyroscope";
import { useCallback, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Tipos de controles
type JoystickType = "analogico" | "setas" | "volante" | "gyro";

export default function ControlScreen() {
  const [selectedJoystick, setSelectedJoystick] =
    useState<JoystickType>("analogico");

  // Estados separados para cada controle
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

  // Joystick analógico
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

  // Volante (manual ou giroscópio) - atualiza ângulo e pedal separadamente
  const handleWheelAngleChange = useCallback((angle: number) => {
    setWheelData((prev) => ({ ...prev, angle }));
  }, []);

  const handlePedalChange = useCallback((pedalStatus: string) => {
    setWheelData((prev) => ({ ...prev, pedalStatus }));
  }, []);

  const renderControl = () => {
    switch (selectedJoystick) {
      case "analogico":
        return <AnalogJoystick onMove={handleJoystickMove} />;
      case "setas":
        return <Dpad onDirectionChange={setDpadDirection} />;
      case "volante":
        return (
          <SteeringWheel
            onAngleChange={handleWheelAngleChange}
            onPedalChange={handlePedalChange}
          />
        );
      case "gyro":
        return (
          <SteeringWheelGyroscope
            onAngleChange={handleWheelAngleChange}
            onPedalChange={handlePedalChange}
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
      case "gyro":
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
      <View style={styles.controlButtonsContainer}>
        <TouchableOpacity
          style={[
            styles.controlButton,
            selectedJoystick === "analogico" && styles.activeButton,
          ]}
          onPress={() => setSelectedJoystick("analogico")}
        >
          <Text style={styles.controlButtonText}>Analógico</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.controlButton,
            selectedJoystick === "setas" && styles.activeButton,
          ]}
          onPress={() => setSelectedJoystick("setas")}
        >
          <Text style={styles.controlButtonText}>Setas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.controlButton,
            selectedJoystick === "volante" && styles.activeButton,
          ]}
          onPress={() => setSelectedJoystick("volante")}
        >
          <Text style={styles.controlButtonText}>Volante</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.controlButton,
            selectedJoystick === "gyro" && styles.activeButton,
          ]}
          onPress={() => setSelectedJoystick("gyro")}
        >
          <Text style={styles.controlButtonText}>Volante Gyro</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Painel de Controlo</Text>
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
  controlButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    position: "absolute",
    top: height * 0.05,
    zIndex: 1,
  },
  controlButton: {
    backgroundColor: "#333642",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "transparent",
  },
  controlButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  activeButton: {
    borderColor: "#00B4DB",
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FFFFFF",
    marginTop: height * 0.15,
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
