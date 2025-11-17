import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkTheme, lightTheme } from "../theme/theme";

// Defina os valores reais de fonte para cada chave
const FONT_SIZES = {
  small: 14,
  medium: 16,
  large: 20,
};

export const useThemeStore = create(
  persist(
    (set) => ({
      // 1. Estado do Tema
      isDark: true,
      theme: darkTheme,

      // 2. Estado do Tamanho da Fonte
      fontSizeKey: "medium", // 'small', 'medium', 'large'
      fontSize: FONT_SIZES.medium, // O valor real em pixels

      // 3. Ação para definir o tema
      setTheme: (key) => // 'light' ou 'dark'
        set(() => {
          const isDark = key === 'dark';
          return {
            isDark,
            theme: isDark ? darkTheme : lightTheme,
          };
        }),

      // 4. Ação para definir o tamanho da fonte
      setFontSize: (key) => // 'small', 'medium', 'large'
        set(() => ({
          fontSizeKey: key,
          fontSize: FONT_SIZES[key] || FONT_SIZES.medium, // Garante um valor padrão
        })),
    }),
    {
      name: 'theme-storage', // Nome da chave no AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
      // Particiona o que será salvo (theme não pode ser serializado diretamente)
      partialize: (state) => ({
        isDark: state.isDark,
        fontSizeKey: state.fontSizeKey,
        fontSize: state.fontSize,
      }),
      // Reconstrói o estado ao carregar
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Reconstrói o objeto theme baseado no isDark salvo
          state.theme = state.isDark ? darkTheme : lightTheme;
        }
      },
    }
  )
);