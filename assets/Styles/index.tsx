import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  title: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 20,
    textAlign: "center",
  },
  subTitle: {
    fontSize: width * 0.045,
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
    shadowColor: "rgba(0,0,0,0.3)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: width * 0.045,
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
