import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';

/**
 * Fetch submissions for a specific problem and language
 * @param {number} problemId - Problem ID
 * @param {number} languageId - Language ID
 * @returns {Promise<Array>} Array of submissions
 */
const fetchSubmissionsByProblem = async (problemId, languageId) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  let query = supabase
    .from('submissions')
    .select('id, user_id, problem_id, language_id, code, status, passed_tests, total_tests, execution_time, memory_used, test_results_json, created_at')
    .eq('user_id', user.id)
    .eq('problem_id', problemId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (languageId) {
    query = query.eq('language_id', languageId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Hook to fetch submissions by problem and language
 * @param {number} problemId - Problem ID
 * @param {number} languageId - Language ID (optional)
 * @param {Object} options - React Query options
 * @returns {Object} Query result
 */
export const useSubmissionsByProblem = (problemId, languageId, options = {}) => {
  return useQuery({
    queryKey: ['submissions', problemId, languageId],
    queryFn: () => fetchSubmissionsByProblem(problemId, languageId),
    enabled: !!problemId,
    ...options,
  });
};

/**
 * Save a submission to the database
 * @param {Object} submission - Submission data
 * @returns {Promise<Object>} Created submission
 */
const saveSubmission = async (submission) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const submissionData = {
    user_id: user.id,
    problem_id: submission.problemId,
    language_id: submission.languageId,
    code: submission.code,
    status: submission.status, // Format: "X/Y testes"
    passed_tests: submission.passedTests,
    total_tests: submission.totalTests,
    execution_time: submission.executionTime,
    memory_used: submission.memoryUsed,
    test_results_json: submission.testResults, // Full test results as JSON
  };

  const { data, error } = await supabase
    .from('submissions')
    .insert([submissionData])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Hook to save a submission
 * @returns {Object} Mutation object
 */
export const useSaveSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveSubmission,
    onSuccess: (data) => {
      // Invalidate submissions queries to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ['submissions', data.problem_id],
      });
    },
    onError: (error) => {
      console.error('Error saving submission:', error);
    },
  });
};

/**
 * Fetch a single submission by ID
 * @param {string} submissionId - Submission ID
 * @returns {Promise<Object>} Submission data
 */
const fetchSubmissionById = async (submissionId) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('id', submissionId)
    .eq('user_id', user.id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Hook to fetch a single submission by ID
 * @param {string} submissionId - Submission ID
 * @param {Object} options - React Query options
 * @returns {Object} Query result
 */
export const useSubmissionById = (submissionId, options = {}) => {
  return useQuery({
    queryKey: ['submission', submissionId],
    queryFn: () => fetchSubmissionById(submissionId),
    enabled: !!submissionId,
    ...options,
  });
};
