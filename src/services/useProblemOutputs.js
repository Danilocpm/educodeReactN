import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';

/**
 * Busca os outputs de teste para um problema específico em uma linguagem
 * @param {string|number} problemId - ID do problema
 * @param {number} languageId - ID da linguagem de programação
 * @returns {Object} Array com os dados de teste
 */
const fetchProblemOutputs = async (problemId, languageId) => {
  const { data, error } = await supabase
    .from('problem_outputs')
    .select('id, created_at, problems_id, languages_id, test_code, expected_output')
    .eq('problems_id', problemId)
    .eq('languages_id', languageId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Hook para buscar os outputs de teste de um problema em uma linguagem específica
 * @param {string|number} problemId - ID do problema
 * @param {number} languageId - ID da linguagem de programação
 * @param {Object} options - Opções do useQuery
 * @returns {Object} Query result com data, isLoading, error, etc.
 */
export const useProblemOutputs = (problemId, languageId, options = {}) => {
  return useQuery({
    queryKey: ['problem-outputs', problemId, languageId],
    queryFn: () => fetchProblemOutputs(problemId, languageId),
    enabled: !!problemId && !!languageId, // Só executa se ambos estiverem definidos
    ...options,
  });
};
