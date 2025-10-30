import { create } from "zustand";
import { darkTheme, lightTheme } from "../theme/theme";

export const useThemeStore = create((set) => ({
  isDark: true,
  theme: darkTheme,

  toggleTheme: () =>
    set((state) => {
      const isDark = !state.isDark;
      return {
        isDark,
        theme: isDark ? darkTheme : lightTheme,
      };
    }),
}));