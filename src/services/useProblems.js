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

/**
 * Busca um problema específico pelo ID
 * @param {string|number} id - ID do problema
 * @returns {Object} Dados do problema completo
 */
const fetchProblemById = async (id) => {
  const { data, error } = await supabase
    .from('problems')
    .select('id, title, slug, description_md, expected_output, difficulty')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Hook para buscar um problema específico pelo ID
 * @param {string|number} id - ID do problema
 * @param {Object} options - Opções do useQuery
 * @returns {Object} Query result com data, isLoading, error, etc.
 */
export const useProblemById = (id, options = {}) => {
  return useQuery({
    queryKey: ['problem', id],
    queryFn: () => fetchProblemById(id),
    enabled: !!id, // Só executa se o ID estiver definido
    ...options,
  });
};
