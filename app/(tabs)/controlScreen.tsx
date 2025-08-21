import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Pressable,
  Animated,
  Platform, // Importar Platform
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AnalogJoystick from "@/components/controls/AnalogJoystick";
import Dpad from "@/components/controls/DirectionalPad";
import SteeringWheel from "@/components/controls/SteeringWheel";

// Define o tipo para os controlos disponíveis
type JoystickType = "analogico" | "setas" | "volante";

export default function ControlScreen() {
  // Estado para o tipo de controlo selecionado
  const [selectedJoystick, setSelectedJoystick] =
    useState<JoystickType>("analogico");
  // Estado para a visibilidade do modal de configurações
  const [modalVisible, setModalVisible] = useState(false);
  // Valor animado para a rotação do ícone de engrenagem
  const rotation = useRef(new Animated.Value(0)).current;

  // Estados para os dados de cada controlo
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

  // Função para lidar com o movimento do joystick analógico
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

  // Funções para controlar a animação e visibilidade do modal
  const handleOpenModal = () => {
    setModalVisible(true);
    Animated.timing(rotation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: Platform.OS !== 'web', // Correção para a web
    }).start();
  };

  const handleCloseModal = () => {
    Animated.timing(rotation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: Platform.OS !== 'web', // Correção para a web
    }).start(() => setModalVisible(false));
  };

  // Interpola o valor da rotação para o estilo do ícone
  const rotationInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  const animatedGearStyle = {
    transform: [{ rotate: rotationInterpolate }],
  };

  // Renderiza o componente de controlo selecionado
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

  // Renderiza a caixa de dados correspondente ao controlo selecionado
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
      {/* Ícone de engrenagem animado */}
      <TouchableOpacity onPress={handleOpenModal} style={styles.settings}>
        <Animated.View style={animatedGearStyle}>
          <FontAwesome name="gear" size={30} color="#FFFFFF" />
        </Animated.View>
      </TouchableOpacity>

      <Text style={styles.title}>Painel de Controlo</Text>

      <View style={styles.joystickContainer}>{renderControl()}</View>
      <View style={styles.dataBox}>{renderDataBox()}</View>

      {/* Modal de Configurações */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <Pressable onPress={handleCloseModal} style={styles.modalBackground}>
          <Pressable style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecionar Controlo</Text>
            {(["analogico", "setas", "volante"] as JoystickType[]).map(
              (type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.modalOptionButton}
                  onPress={() => {
                    setSelectedJoystick(type);
                    handleCloseModal();
                  }}
                >
                  <Text style={styles.modalOptionText}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

// Estilos responsivos
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
  settings: {
    position: "absolute",
    top: height * 0.05,
    right: width * 0.05,
    zIndex: 1,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FFFFFF",
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
  // Estilos do Modal
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContent: {
    width: width * 0.8,
    maxWidth: 350,
    backgroundColor: "#272a33",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: width * 0.055,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#FFFFFF",
  },
  modalOptionButton: {
    width: "100%",
    paddingVertical: 15,
    marginVertical: 8,
    backgroundColor: "#333642",
    borderRadius: 10,
    alignItems: "center",
  },
  modalOptionText: {
    fontSize: width * 0.045,
    color: "#FFFFFF",
    fontWeight: "500",
  },
});