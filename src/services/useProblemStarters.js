import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';

/**
 * Busca o código inicial (starter code) para um problema específico em uma linguagem
 * @param {string|number} problemId - ID do problema
 * @param {number} languageId - ID da linguagem de programação
 * @returns {Object} Dados do starter code
 */
const fetchProblemStarter = async (problemId, languageId) => {
  const { data, error } = await supabase
    .from('problem_starters')
    .select('id, problem_id, language_id, starter_code')
    .eq('problem_id', problemId)
    .eq('language_id', languageId)
    .single();

  if (error) {
    // Se não encontrar, retorna código vazio ao invés de erro
    if (error.code === 'PGRST116') {
      return { starter_code: '' };
    }
    throw new Error(error.message);
  }

  return data;
};

/**
 * Hook para buscar o starter code de um problema em uma linguagem específica
 * @param {string|number} problemId - ID do problema
 * @param {number} languageId - ID da linguagem de programação
 * @param {Object} options - Opções do useQuery
 * @returns {Object} Query result com data, isLoading, error, etc.
 */
export const useProblemStarter = (problemId, languageId, options = {}) => {
  return useQuery({
    queryKey: ['problem-starter', problemId, languageId],
    queryFn: () => fetchProblemStarter(problemId, languageId),
    enabled: !!problemId && !!languageId, // Só executa se ambos estiverem definidos
    ...options,
  });
};
