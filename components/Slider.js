import { Pressable, StyleSheet, Text, View } from "react-native";

const hexToHslDarkened = (hex, number = 0.1) => {
  let r = parseInt(hex.slice(1, 3), 16) / 255,
      g = parseInt(hex.slice(3, 5), 16) / 255,
      b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;

  let h = d === 0 ? 0 :
    max === r ? ((g - b) / d) % 6 :
    max === g ? (b - r) / d + 2 :
                (r - g) / d + 4;

  h = (h * 60 + 360) % 360;

  const l = (max + min) / 2;

  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));

  const newL = Math.max(0, l - number); // 👈 Lightness reduzieren

  return { h, s, l: newL };
};


export default function Slider({
  options = [],
  value,
  onChange,
  theme,
  CustomColor
}) {
  return (
    <View style={[styles.container, {backgroundColor: CustomColor}]}>
      {options.map((opt) => {
        const active = value === opt.value;
        const {h, s, l} = hexToHslDarkened(CustomColor, 0.1)
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[styles.button, active && [styles.active, { backgroundColor: `hsl(${h}, ${s * 100}%, ${l * 100}%)` }]]}
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