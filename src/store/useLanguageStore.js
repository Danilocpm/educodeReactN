import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Judge0 Language ID Mapping
 * Maps custom language codes to Judge0 API language IDs
 */
export const JUDGE0_LANGUAGE_MAP = {
  'python': 71,      // Python 3
  'javascript': 63,  // JavaScript (Node.js)
  'java': 62,        // Java
  'cpp': 54,         // C++ (GCC 9.2.0)
  'c': 50,           // C (GCC 9.2.0)
  'csharp': 51,      // C# (Mono 6.6.0.161)
  'go': 60,          // Go (1.13.5)
  'rust': 73,        // Rust (1.40.0)
  'typescript': 74,  // TypeScript (3.7.4)
};

/**
 * Get Judge0 language ID from language code
 * @param {string} languageCode - Language code (e.g., 'python', 'java')
 * @returns {number|null} Judge0 language ID or null if not found
 */
export const getJudge0LanguageId = (languageCode) => {
  if (!languageCode) return null;
  return JUDGE0_LANGUAGE_MAP[languageCode.toLowerCase()] || null;
};

/**
 * Store Zustand para gerenciar a linguagem de programação selecionada
 * Armazena o ID e o código da linguagem do banco de dados public.languages
 */
export const useLanguageStore = create(
  persist(
    (set, get) => ({
      // Estado - linguagem de programação atual
      languageId: 2,
      languageCode: 'python',

      // Ação para definir a linguagem atual
      setLanguage: (id, code) => set({ languageId: id, languageCode: code }),

      // Ação para limpar a linguagem
      clearLanguage: () => set({ languageId: null, languageCode: null }),

      // Ação para obter o Judge0 language ID da linguagem atual
      getJudge0LanguageId: () => {
        const { languageCode } = get();
        return getJudge0LanguageId(languageCode);
      },
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
