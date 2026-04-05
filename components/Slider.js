import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Slider({
  options = [],
  value,
  onChange,
  theme
}) {
  return (
    <View style={[styles.container, theme === "light" ? {backgroundColor: "#57b0ff"} : {}]}>
      {options.map((opt) => {
        const active = value === opt.value;

        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[styles.button, active && [styles.active, theme === "light" && {backgroundColor: "#2f608b"}]]}
          >
            {opt.icon ? opt.icon(active) : null}

            {opt.label && (
              <Text style={[styles.text, active && styles.activeText, theme === "light" && {backgroundColor: "black"}]}>
                {opt.label}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#1F2937",
    borderRadius: 14,
    padding: 4,
    marginHorizontal: 5,
    marginTop: 5,
  },
  button: {
    flex: 1,
    paddingVertical: 7,
    marginHorizontal: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    flexDirection: "row",
    gap: 6,
  },
  active: {
    backgroundColor: "#374151",
  },
  text: {
    color: "#9CA3AF",
    fontWeight: "500",
  },
  activeText: {
    color: "#fff",
    fontWeight: "600",
  },
});