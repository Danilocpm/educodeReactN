import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../src/store/useAuthStore";
import LoadingScreen from "../src/components/LoadingScreen";
import { Buffer } from 'buffer';

// Polyfill Buffer for React Native (required for base64 encoding)
global.Buffer = Buffer;

// Criar uma instância do QueryClient com configurações otimizadas para React Native
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      retry: 2,
      refetchOnWindowFocus: false, // Desabilitar refetch automático no foco (importante para mobile)
    },
  },
});

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

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );
}
