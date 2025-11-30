import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';

/**
 * Busca todas as linguagens de programação disponíveis
 * @returns {Object} Dados das linguagens { id, code }
 */
const fetchLanguages = async () => {
  const { data, error } = await supabase
    .from('languages')
    .select('id, code')
    .order('code', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Hook para buscar todas as linguagens de programação
 * @param {Object} options - Opções do useQuery
 * @returns {Object} Query result com data, isLoading, error, etc.
 */
export const useLanguages = (options = {}) => {
  return useQuery({
    queryKey: ['languages'],
    queryFn: fetchLanguages,
    ...options,
  });
};
