import { create } from "zustand";
import { darkTheme, lightTheme } from "../theme/theme";

// Defina os valores reais de fonte para cada chave
const FONT_SIZES = {
  small: 14,
  medium: 16,
  large: 20,
};

export const useThemeStore = create((set) => ({
  // 1. Estado do Tema
  isDark: true,
  theme: darkTheme,

  // 2. Estado do Tamanho da Fonte (Novo)
  fontSizeKey: "medium", // 'small', 'medium', 'large'
  fontSize: FONT_SIZES.medium, // O valor real em pixels

  // 3. Ação para definir o tema (Substitui toggleTheme)
  setTheme: (key) => // 'light' ou 'dark'
    set(() => {
      const isDark = key === 'dark';
      return {
        isDark,
        theme: isDark ? darkTheme : lightTheme,
      };
    }),

  // 4. Ação para definir o tamanho da fonte (Novo)
  setFontSize: (key) => // 'small', 'medium', 'large'
    set(() => ({
      fontSizeKey: key,
      fontSize: FONT_SIZES[key] || FONT_SIZES.medium, // Garante um valor padrão
    })),
}));