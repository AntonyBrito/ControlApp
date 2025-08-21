import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 20,
    textAlign: "center",
  },
  subTitle: {
    fontSize: 18,
    color: "#B0C4DE",
    marginTop: 8,
    marginBottom: 20,
    textAlign: "center",
  },
  btnGradient: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 5,
    boxShadow: "0px 4px 5px rgba(0,0,0,0.3)", // compatível web
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  iconeInit: {
    color: "#00B4DB",
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});

export default styles;
