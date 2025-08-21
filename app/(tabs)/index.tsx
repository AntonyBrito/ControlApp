
import React, { useRef, useEffect } from "react";
import { Animated, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../../assets/Styles/index";
import AnimatedScreen from "../../components/animation/AnimatedScreen";

export default function InitialScreen() {
  const router = useRouter();
  const scale = useRef(new Animated.Value(1)).current;

  // Pulsação suave do botão
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.05, duration: 800, useNativeDriver: false }),
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  // Animação ao pressionar
  const onPressIn = () => Animated.spring(scale, { toValue: 0.95, useNativeDriver: false }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1, friction: 3, useNativeDriver: false }).start();

  const handleNavigate = () => router.push("/controlScreen");

  return (
    <AnimatedScreen onExit={handleNavigate}>
      <FontAwesome5 size={45} name="car-battery" style={styles.iconeInit} />
      <Text style={styles.title}>Bem-vindo!</Text>
      <Text style={styles.subTitle}>Pronto para assumir o controle?</Text>

      <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={handleNavigate}>
        <Animated.View style={{ transform: [{ scale: Animated.multiply(scale, pulse)}] }}>
          <LinearGradient
            colors={["#00B4DB", "#8A2BE2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.btnGradient}
          >
            <Text style={styles.btnText}>Iniciar</Text>
          </LinearGradient>
        </Animated.View>
      </Pressable>
    </AnimatedScreen>
  );
}
