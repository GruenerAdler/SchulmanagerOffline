import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ColorPicker from "react-native-wheel-color-picker";

const Color_Picker = ({
  visible,
  initialColor = "#2f608b",
  onClose,
  onSelect,
  theme = "dark",
}) => {
  const [color, setColor] = useState(initialColor);
const [inputValue, setInputValue] = useState(initialColor);

    const getContrastColor = (hex) => {
        if (!hex) return "#000";

        const c = hex.replace("#", "");
        const r = parseInt(c.substr(0, 2), 16);
        const g = parseInt(c.substr(2, 2), 16);
        const b = parseInt(c.substr(4, 2), 16);

        // Helligkeit berechnen
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        return brightness > 155 ? "#000" : "#fff";
    };

  useEffect(() => {
    setColor(initialColor);
  }, [initialColor, visible]);

  const handleDone = () => {
    onSelect?.(color);
    onClose?.();
  };

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade">
    <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, theme === "light" && styles.lightBg]}>
          
          <Text style={[styles.title, theme === "light" && styles.darkText]}>
            Farbe auswählen
          </Text>

          <View style={styles.pickerWrapper}>
            <ColorPicker
              palette={["#428bca","#2f608b", "#ff0000", "#ff7f00", "#ffff00", "#00ff00", "#00ffff", "#0000ff", "#ff00ff",]}
                color={color}
                onColorChange={(c) => {
                    setInputValue(c);
                }}
                onColorChangeComplete={(c) => {
                    setColor(c);
                }}
                thumbSize={30}
                sliderSize={25}
                noSnap={true}
                row={false}
            />
            </View>

            <TextInput
                style={[
                    styles.hashInput,
                    { color: theme === "light" ? "#000" : "#fff" },
                ]}
                value={inputValue}
                onChangeText={(text) => {
                    setInputValue(text);

                    let val = text;
                    if (!val.startsWith("#")) val = "#" + val;

                    // nur setzen wenn komplett gültig
                    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                    setColor(val);
                    }
                }}
                maxLength={7}
                autoCapitalize="none"
                autoCorrect={false}
            />

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "#666" }]}
              onPress={onClose}
            >
              <Text style={styles.btnText}>Abbrechen</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: color }]}
              onPress={handleDone}
            >
              <Text style={[styles.btnText, {color: getContrastColor(color)}]}>OK</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default Color_Picker;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#222",
  },
  lightBg: {
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  darkText: {
    color: "black",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  btn: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontWeight: "600",
  },
  pickerWrapper: {
  height: 300,
  marginVertical: 10,
},
  hashInput: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#555",
    fontSize: 16,
    textAlign: "center",
},
});