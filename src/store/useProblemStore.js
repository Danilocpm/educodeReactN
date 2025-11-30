import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Store Zustand para gerenciar o problema atual sendo visualizado
 * e o código do usuário para cada problema+linguagem
 */
export const useProblemStore = create(
  persist(
    (set, get) => ({
      // Estado - problema atual sendo visualizado
      currentProblem: null,

      // Estado - código do último problema aberto (apenas um por vez)
      // Estrutura: { problemId, languageId, code }
      lastProblemCode: null,

      // Ação para definir o problema atual
      setProblem: (problem) => set({ currentProblem: problem }),

      // Ação para limpar o problema atual
      clearProblem: () => set({ currentProblem: null }),

      // Ação para definir o código de um problema específico
      // Sobrescreve o código anterior, mantendo apenas o último problema
      setCode: (problemId, languageId, code) => {
        set({
          lastProblemCode: {
            problemId,
            languageId,
            code,
          },
        });
      },

      // Ação para obter o código de um problema específico
      // Retorna código apenas se for o mesmo problema+linguagem do último salvo
      getCode: (problemId, languageId) => {
        const { lastProblemCode } = get();
        if (
          lastProblemCode &&
          lastProblemCode.problemId === problemId &&
          lastProblemCode.languageId === languageId
        ) {
          return lastProblemCode.code;
        }
        return null;
      },

      // Ação para limpar o código salvo
      clearCode: () => set({ lastProblemCode: null }),
    }),
    {
      name: 'problem-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        lastProblemCode: state.lastProblemCode,
      }),
    }
  )
);
