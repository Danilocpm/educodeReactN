import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';

/**
 * Busca problemas do banco de dados com paginação e filtro por dificuldade
 * @param {string} difficulty - Nível de dificuldade ('easy', 'medium', 'hard')
 * @param {number} pageSize - Quantidade de itens por página (padrão: 10)
 * @returns {Object} Resultado da query com data, isLoading, error, etc.
 */
const fetchProblemsByDifficulty = async (difficulty, pageSize = 10) => {
  const { data, error } = await supabase
    .from('problems')
    .select('id, title, slug')
    .eq('difficulty', difficulty)
    .order('created_at', { ascending: false })
    .limit(pageSize);

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Hook para buscar problemas fáceis
 * @param {Object} options - Opções do useQuery
 * @returns {Object} Query result com data, isLoading, error, etc.
 */
export const useEasyProblems = (options = {}) => {
  return useQuery({
    queryKey: ['problems', 'easy'],
    queryFn: () => fetchProblemsByDifficulty('easy'),
    ...options,
  });
};

/**
 * Hook para buscar problemas médios
 * @param {Object} options - Opções do useQuery
 * @returns {Object} Query result com data, isLoading, error, etc.
 */
export const useMediumProblems = (options = {}) => {
  return useQuery({
    queryKey: ['problems', 'medium'],
    queryFn: () => fetchProblemsByDifficulty('medium'),
    ...options,
  });
};

/**
 * Hook para buscar problemas difíceis
 * @param {Object} options - Opções do useQuery
 * @returns {Object} Query result com data, isLoading, error, etc.
 */
export const useHardProblems = (options = {}) => {
  return useQuery({
    queryKey: ['problems', 'hard'],
    queryFn: () => fetchProblemsByDifficulty('hard'),
    ...options,
  });
};

/**
 * Hook genérico para buscar problemas por dificuldade
 * Útil quando você quer alternar dinamicamente entre dificuldades
 * @param {string} difficulty - Nível de dificuldade ('easy', 'medium', 'hard')
 * @param {Object} options - Opções do useQuery
 * @returns {Object} Query result com data, isLoading, error, etc.
 */
export const useProblemsByDifficulty = (difficulty, options = {}) => {
  return useQuery({
    queryKey: ['problems', difficulty],
    queryFn: () => fetchProblemsByDifficulty(difficulty),
    enabled: !!difficulty, // Só executa se difficulty estiver definido
    ...options,
  });
};
