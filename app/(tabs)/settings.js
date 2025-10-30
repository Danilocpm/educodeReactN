import { Text, View, TouchableOpacity } from "react-native";
import { useThemeStore } from "../../src/store/useThemeStore";

export default function SettingsScreen() {
  const { theme, toggleTheme } = useThemeStore();


  return (
    <View style={{ flex: 1, backgroundColor: theme.background, padding: 20 }}>
      <Text style={{ color: theme.text, fontSize: 18 }}>
        Configurações
      </Text>

      <TouchableOpacity onPress={toggleTheme} style={{ marginTop: 20 }}>
        <Text style={{ color: theme.text }}>
          Alternar Tema 🌗
        </Text>
      </TouchableOpacity>
    </View>
  );
}