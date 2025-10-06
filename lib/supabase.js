// Importa o polyfill necessário para o Supabase funcionar bem no React Native
import 'react-native-url-polyfill/auto';

// Importa o AsyncStorage para persistência da sessão
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createClient } from '@supabase/supabase-js';

// Pega as variáveis de ambiente
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Cria o cliente Supabase com a configuração de persistência
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Usa o AsyncStorage para salvar a sessão.
    storage: AsyncStorage,
    // Atualiza o token automaticamente se ele estiver perto de expirar.
    autoRefreshToken: true,
    // Habilita a persistência da sessão.
    persistSession: true,
    // Desabilita a detecção de sessão na URL, que não é relevante para mobile.
    detectSessionInUrl: false,
  },
});