import { create } from 'zustand';

/**
 * Store Zustand para gerenciar o problema atual sendo visualizado
 * Este store é limpo e substituído sempre que um novo problema é aberto
 */
export const useProblemStore = create((set) => ({
  // Estado - problema atual sendo visualizado
  currentProblem: null,

  // Ação para definir o problema atual
  setProblem: (problem) => set({ currentProblem: problem }),

  // Ação para limpar o problema atual
  clearProblem: () => set({ currentProblem: null }),
}));
