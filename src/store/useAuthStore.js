import { create } from "zustand";
import { supabase } from "../../lib/supabase";

export const useAuthStore = create((set) => ({
  // Estado
  user: null,
  session: null,
  loading: true,
  
  // Ação para inicializar a sessão
  initializeAuth: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ 
        session, 
        user: session?.user ?? null, 
        loading: false 
      });
    } catch (error) {
      console.error("Erro ao inicializar autenticação:", error);
      set({ loading: false });
    }
  },

  // Ação para atualizar a sessão (chamada pelo listener)
  setSession: (session) => set({ 
    session, 
    user: session?.user ?? null,
    loading: false 
  }),

  // Ação para fazer logout
  signOut: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null, session: null });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  },

  // Ação para atualizar loading
  setLoading: (loading) => set({ loading }),
}));
