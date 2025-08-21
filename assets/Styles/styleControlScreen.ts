import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
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
  subtitle: {
    fontSize: width * 0.04,
    color: "#666",
    textAlign: "center",
    marginBottom: height * 0.02,
  },
  joystickContainer: {
    width: "90%",
    aspectRatio: 1,
    maxWidth: 400,
    justifyContent: "center",
    alignItems: "center",
  },
  joystickPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333642",
    borderRadius: (width * 0.9) / 2,
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
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: width * 0.8,
    maxWidth: 350,
    backgroundColor: "white",
    borderRadius: width * 0.05,
    padding: width * 0.05,
  },
  modalTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    marginBottom: height * 0.03,
    textAlign: "center",
  },
  optionButton: {
    width: "100%",
    paddingVertical: height * 0.02,
    marginVertical: height * 0.01,
    backgroundColor: "#f0f0f0",
    borderRadius: width * 0.02,
    alignItems: "center",
  },
  optionText: {
    fontSize: width * 0.04,
  },
});
