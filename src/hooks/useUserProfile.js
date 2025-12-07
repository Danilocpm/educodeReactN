import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

/**
 * Hook customizado para obter informações do perfil do usuário
 * Acessa o raw_user_meta_data do auth.users
 */
export const useUserProfile = () => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState({
    name: 'Visitante',
    picture: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Acessa o raw_user_meta_data que vem do provedor de autenticação
      const metadata = user.user_metadata || {};
      
      setProfile({
        name: metadata.name || metadata.full_name || user.email?.split('@')[0] || 'Usuário',
        picture: metadata.picture || metadata.avatar_url || null,
      });
    } else {
      setProfile({
        name: 'Visitante',
        picture: null,
      });
    }
    setLoading(false);
  }, [user]);

  return { profile, loading, isLoggedIn: !!user };
};
