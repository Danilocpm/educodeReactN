import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Store Zustand para gerenciar a linguagem de programação selecionada
 * Armazena o ID e o código da linguagem do banco de dados public.languages
 */
export const useLanguageStore = create(
  persist(
    (set) => ({
      // Estado - linguagem de programação atual
      languageId: null,
      languageCode: null,

      // Ação para definir a linguagem atual
      setLanguage: (id, code) => set({ languageId: id, languageCode: code }),

      // Ação para limpar a linguagem
      clearLanguage: () => set({ languageId: null, languageCode: null }),
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        languageId: state.languageId,
        languageCode: state.languageCode,
      }),
    }
  )
);
