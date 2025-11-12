import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useThemeStore } from "../../src/store/useThemeStore";

// Componente auxiliar para os botões de opção
const OptionButton = ({ label, onPress, isActive, styles }) => (
  <TouchableOpacity
    style={[
      styles.optionButton,
      isActive ? styles.optionButtonActive : styles.optionButtonInactive,
    ]}
    onPress={onPress}
  >
    <Text style={isActive ? styles.optionTextActive : styles.optionTextInactive}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const {
    theme,
    isDark,
    fontSizeKey,
    setTheme,
    setFontSize,
  } = useThemeStore();

  const handleLogout = () => {
    console.log("Usuário clicou em Sair");
    // Coloque sua lógica de logout aqui
  };

  // Os estilos agora usam as chaves do seu theme.js
  const styles = getStyles(theme);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>Configurações</Text>

      {/* --- Seção de Aparência --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aparência</Text>

        <Text style={styles.label}>Tema</Text>
        <View style={styles.optionRow}>
          <OptionButton
            label="Claro"
            onPress={() => setTheme("light")}
            isActive={!isDark}
            styles={styles}
          />
          <OptionButton
            label="Escuro"
            onPress={() => setTheme("dark")}
            isActive={isDark}
            styles={styles}
          />
        </View>

        <Text style={[styles.label, { marginTop: 24 }]}>Tamanho da Fonte</Text>
        <View style={styles.optionRow}>
          <OptionButton
            label="Pequeno"
            onPress={() => setFontSize("small")}
            isActive={fontSizeKey === "small"}
            styles={styles}
          />
          <OptionButton
            label="Médio"
            onPress={() => setFontSize("medium")}
            isActive={fontSizeKey === "medium"}
            styles={styles}
          />
          <OptionButton
            label="Grande"
            onPress={() => setFontSize("large")}
            isActive={fontSizeKey === "large"}
            styles={styles}
          />
        </View>
      </View>

      {/* --- Seção da Conta --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Conta</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sair (Logout)</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// --- StyleSheet Atualizada ---
// Agora usa as chaves específicas do seu theme.js
const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background, // Usa o fundo principal
    },
    contentContainer: {
      padding: 20,
    },
    title: {
      color: theme.textPrimary, // Cor primária para o título principal
      fontSize: 26,
      fontWeight: "bold",
      marginBottom: 24,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      color: theme.textPrimary, // Cor primária para títulos de seção
      fontSize: 20,
      fontWeight: "600",
      marginBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderColor, // Usa a cor de borda do tema
      paddingBottom: 8,
    },
    label: {
      color: theme.textSecondary, // Cor secundária para rótulos (hierarquia)
      fontSize: 16,
      marginBottom: 12,
    },
    optionRow: {
      flexDirection: "row",
      justifyContent: "flex-start",
      gap: 12,
    },
    optionButton: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: 1.5,
    },
    optionButtonInactive: {
      backgroundColor: theme.cardBackground, // Fundo de card para botão inativo
      borderColor: theme.borderColor, // Borda sutil
    },
    optionButtonActive: {
      backgroundColor: theme.textPrimary, // Cor de texto vira fundo (inversão)
      borderColor: theme.textPrimary, // Borda da mesma cor
    },
    optionTextInactive: {
      color: theme.textPrimary, // Texto primário no botão inativo
      fontSize: 16,
      fontWeight: "500",
    },
    optionTextActive: {
      color: theme.background, // Cor de fundo vira texto (inversão)
      fontSize: 16,
      fontWeight: "bold",
    },
    logoutButton: {
      backgroundColor: "#D93F3F", // Vermelho (cor de perigo) é mantido
      padding: 14,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 10,
    },
    logoutButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "bold",
    },
  });