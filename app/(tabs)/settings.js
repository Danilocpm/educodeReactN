import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useThemeStore } from "../../src/store/useThemeStore";
import { useAuthStore } from "../../src/store/useAuthStore";
import { useLanguageStore } from "../../src/store/useLanguageStore";
import { useLanguages } from "../../src/services/useLanguages";

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

  const { signOut } = useAuthStore();
  
  const { languageId, languageCode, setLanguage } = useLanguageStore();
  const { data: languages, isLoading: languagesLoading } = useLanguages();
  
  const [languageDropdownVisible, setLanguageDropdownVisible] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      "Confirmar Logout",
      "Tem certeza que deseja sair?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
              console.log("Logout realizado com sucesso");
            } catch (error) {
              console.error("Erro ao fazer logout:", error);
              Alert.alert("Erro", "Não foi possível fazer logout. Tente novamente.");
            }
          }
        }
      ]
    );
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

        <Text style={[styles.label, { marginTop: 24 }]}>Linguagem de Programação</Text>
        {languagesLoading ? (
          <ActivityIndicator size="small" color={theme.textPrimary} style={{ marginVertical: 12 }} />
        ) : (
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setLanguageDropdownVisible(true)}
          >
            <Text style={styles.dropdownText}>
              {languageCode || "Selecione uma linguagem"}
            </Text>
            <Feather name="chevron-down" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
        
        {/* Modal do Dropdown */}
        <Modal
          visible={languageDropdownVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setLanguageDropdownVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setLanguageDropdownVisible(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Selecione a Linguagem</Text>
                <TouchableOpacity onPress={() => setLanguageDropdownVisible(false)}>
                  <Feather name="x" size={24} color={theme.textPrimary} />
                </TouchableOpacity>
              </View>
              <FlatList
                data={languages}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.languageItem,
                      languageId === item.id && styles.languageItemActive
                    ]}
                    onPress={() => {
                      setLanguage(item.id, item.code);
                      setLanguageDropdownVisible(false);
                    }}
                  >
                    <Text style={[
                      styles.languageItemText,
                      languageId === item.id && styles.languageItemTextActive
                    ]}>
                      {item.code}
                    </Text>
                    {languageId === item.id && (
                      <Feather name="check" size={20} color={theme.primary} />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
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
    // Dropdown styles
    dropdown: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.cardBackground,
      borderWidth: 1.5,
      borderColor: theme.borderColor,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    dropdownText: {
      color: theme.textPrimary,
      fontSize: 16,
      fontWeight: "500",
    },
    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: theme.cardBackground,
      borderRadius: 12,
      width: "80%",
      maxHeight: "60%",
      overflow: "hidden",
    },
    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderColor,
    },
    modalTitle: {
      color: theme.textPrimary,
      fontSize: 18,
      fontWeight: "bold",
    },
    languageItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderColor,
    },
    languageItemActive: {
      backgroundColor: theme.background,
    },
    languageItemText: {
      color: theme.textPrimary,
      fontSize: 16,
    },
    languageItemTextActive: {
      color: theme.primary,
      fontWeight: "bold",
    },
  });