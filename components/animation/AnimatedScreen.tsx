import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

interface AnimatedScreenProps {
  children: React.ReactNode;
  onExit?: () => void;
}

export default function AnimatedScreen({ children, onExit }: AnimatedScreenProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Entrada da tela: fade + slide
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: false }),
      Animated.spring(translateY, { toValue: 0, friction: 6, useNativeDriver: false }),
    ]).start();
  }, []);

  const handleExit = () => {
    // Saída da tela: fade + slide para cima
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: false }),
      Animated.timing(translateY, { toValue: -20, duration: 300, useNativeDriver: false }),
    ]).start(() => {
      if (onExit) onExit();
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity, transform: [{ translateY }] },
      ]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A192F",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});
