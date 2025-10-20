import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function RootLayout() {
  const [session, setSession] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Verifica a sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        router.replace("/auth/login");
      } else {
        router.replace("/(tabs)");
      }
    });

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

  return <Stack screenOptions={{ headerShown: false }} />;
}
