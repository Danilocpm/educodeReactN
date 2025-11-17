import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../src/store/useAuthStore";
import LoadingScreen from "../src/components/LoadingScreen";

export default function RootLayout() {
  const { loading, session, setSession, initializeAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Inicializa a autenticação
    initializeAuth();

    // Escuta mudanças de autenticação
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        router.replace("/(tabs)");
      } else {
        router.replace("/auth/login");
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Redireciona após carregar a sessão
  useEffect(() => {
    if (!loading) {
      if (session) {
        router.replace("/(tabs)");
      } else {
        router.replace("/auth/login");
      }
    }
  }, [loading, session]);

  // Exibe loading screen enquanto verifica a autenticação
  if (loading) {
    return <LoadingScreen />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
