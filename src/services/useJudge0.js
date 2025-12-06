import { useMutation } from '@tanstack/react-query';

/**
 * Judge0 API Configuration
 */
const JUDGE0_API_BASE = 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_API_KEY = process.env.EXPO_PUBLIC_X_RAPIDAPI_KEY;
const JUDGE0_API_HOST = 'judge0-ce.p.rapidapi.com';

/**
 * Judge0 Status Codes
 */
export const JUDGE0_STATUS = {
  IN_QUEUE: 1,
  PROCESSING: 2,
  ACCEPTED: 3,
  WRONG_ANSWER: 4,
  TIME_LIMIT_EXCEEDED: 5,
  COMPILATION_ERROR: 6,
  RUNTIME_ERROR_SIGSEGV: 7,
  RUNTIME_ERROR_SIGXFSZ: 8,
  RUNTIME_ERROR_SIGFPE: 9,
  RUNTIME_ERROR_SIGABRT: 10,
  RUNTIME_ERROR_NZEC: 11,
  RUNTIME_ERROR_OTHER: 12,
  INTERNAL_ERROR: 13,
  EXEC_FORMAT_ERROR: 14,
};

/**
 * Submit code batch to Judge0 API
 * @param {Array} submissions - Array of submission objects with source_code, language_id, expected_output
 * @returns {Promise<Array>} Array of tokens
 */
const submitCodeBatch = async (submissions) => {
  const response = await fetch(`${JUDGE0_API_BASE}/submissions/batch?base64_encoded=true`, {
    method: 'POST',
    headers: {
      'X-RapidAPI-Key': JUDGE0_API_KEY,
      'X-RapidAPI-Host': JUDGE0_API_HOST,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ submissions }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Judge0 API Error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data; // Returns array of { token: "..." }
};

/**
 * Get submission results by tokens
 * @param {Array<string>} tokens - Array of submission tokens
 * @returns {Promise<Object>} Submission results
 */
const getSubmissionResults = async (tokens) => {
  const tokensParam = tokens.join(',');
  const response = await fetch(
    `${JUDGE0_API_BASE}/submissions/batch?tokens=${tokensParam}&base64_encoded=true&fields=*`,
    {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': JUDGE0_API_KEY,
        'X-RapidAPI-Host': JUDGE0_API_HOST,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Judge0 API Error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data;
};

/**
 * Poll for submission results with retry logic
 * @param {Array<string>} tokens - Array of submission tokens
 * @param {number} maxAttempts - Maximum polling attempts
 * @param {number} interval - Polling interval in ms
 * @returns {Promise<Object>} Final results
 */
const pollSubmissionResults = async (tokens, maxAttempts = 10, interval = 2000) => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const results = await getSubmissionResults(tokens);

    // Check if all submissions are done processing
    const allDone = results.submissions.every(
      (sub) => sub.status.id > JUDGE0_STATUS.PROCESSING
    );

    if (allDone) {
      return results;
    }

    // Wait before next poll
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error('Timeout: Submissions took too long to process');
};

/**
 * Decode base64 string
 * @param {string} base64String - Base64 encoded string
 * @returns {string} Decoded string
 */
const decodeBase64 = (base64String) => {
  if (!base64String) return '';
  try {
    return Buffer.from(base64String, 'base64').toString('utf-8');
  } catch (error) {
    console.error('Error decoding base64:', error);
    return '';
  }
};

/**
 * Compare Judge0 output with expected output
 * Expected output format: {"output": "expected_value"} or plain string
 * Judge0 stdout: base64 encoded string
 * @param {string} stdout - Base64 encoded stdout from Judge0
 * @param {string|object} expectedOutput - Expected output (JSON string or object)
 * @returns {boolean} Whether outputs match
 */
const compareOutputs = (stdout, expectedOutput) => {
  try {
    // Decode Judge0 stdout
    const actualOutput = decodeBase64(stdout).trim();
    
    console.log('=== DEBUG COMPARE OUTPUTS ===');
    console.log('Raw stdout (base64):', stdout);
    console.log('Decoded actualOutput:', JSON.stringify(actualOutput));
    console.log('actualOutput length:', actualOutput.length);
    console.log('expectedOutput raw:', expectedOutput);
    console.log('expectedOutput type:', typeof expectedOutput);
    
    // Extract expected value
    let expectedValue;
    if (typeof expectedOutput === 'object' && expectedOutput.output) {
      expectedValue = String(expectedOutput.output).trim();
    } else if (typeof expectedOutput === 'string') {
      try {
        const expectedJson = JSON.parse(expectedOutput);
        expectedValue = String(expectedJson.output || expectedOutput).trim();
      } catch (e) {
        // Not JSON, use as is
        expectedValue = expectedOutput.trim();
      }
    } else {
      expectedValue = String(expectedOutput).trim();
    }
    
    console.log('Final expectedValue:', JSON.stringify(expectedValue));
    console.log('expectedValue length:', expectedValue.length);
    console.log('actualOutput.toLowerCase():', JSON.stringify(actualOutput.toLowerCase()));
    console.log('expectedValue.toLowerCase():', JSON.stringify(expectedValue.toLowerCase()));
    
    const match = actualOutput.toLowerCase() === expectedValue.toLowerCase();
    console.log('Match result:', match);
    console.log('=== END DEBUG ===');
    
    // Compare outputs (case-insensitive)
    return match;
  } catch (error) {
    console.error('Error comparing outputs:', error);
    return false;
  }
};

/**
 * Parse submission results and compare with expected outputs
 * @param {Object} results - Results from Judge0
 * @param {Array} testCases - Original test cases with expected outputs
 * @returns {Array} Parsed test results
 */
const parseResults = (results, testCases) => {
  return results.submissions.map((submission, index) => {
    const testCase = testCases[index];
    const statusId = submission.status.id;
    
    // Decode outputs
    const stdout = decodeBase64(submission.stdout);
    const stderr = decodeBase64(submission.stderr);
    const compileOutput = decodeBase64(submission.compile_output);

    // Determine if test passed
    let passed = false;
    let message = submission.status.description;

    if (statusId === JUDGE0_STATUS.ACCEPTED) {
      // Compare outputs
      passed = compareOutputs(submission.stdout, testCase.expected_output);
      message = passed ? 'Passed' : 'Wrong Answer';
    } else if (statusId === JUDGE0_STATUS.COMPILATION_ERROR) {
      message = 'Compilation Error';
    } else if (statusId >= JUDGE0_STATUS.RUNTIME_ERROR_SIGSEGV && statusId <= JUDGE0_STATUS.RUNTIME_ERROR_OTHER) {
      message = 'Runtime Error';
    } else if (statusId === JUDGE0_STATUS.TIME_LIMIT_EXCEEDED) {
      message = 'Time Limit Exceeded';
    } else if (statusId === JUDGE0_STATUS.WRONG_ANSWER) {
      message = 'Wrong Answer';
    }

    return {
      testCaseIndex: index + 1,
      passed,
      statusId,
      message,
      stdout,
      stderr,
      compileOutput,
      time: submission.time,
      memory: submission.memory,
      expectedOutput: testCase.expected_output,
      testCode: testCase.test_code,
    };
  });
};

/**
 * Hook to submit code to Judge0 and get results
 * @returns {Object} Mutation object with mutate function
 */
export const useSubmitCode = () => {
  return useMutation({
    mutationFn: async ({ submissions, testCases }) => {
      // 1. Submit batch to Judge0
      const submitResponse = await submitCodeBatch(submissions);
      
      // Extract tokens
      const tokens = submitResponse.map((item) => item.token);

      // 2. Poll for results
      const results = await pollSubmissionResults(tokens);

      // 3. Parse and compare results
      const parsedResults = parseResults(results, testCases);

      return {
        results: parsedResults,
        totalTests: parsedResults.length,
        passedTests: parsedResults.filter((r) => r.passed).length,
        failedTests: parsedResults.filter((r) => !r.passed).length,
      };
    },
    onError: (error) => {
      console.error('Judge0 submission error:', error);
    },
  });
};

/**
 * Get status description for display
 * @param {number} statusId - Judge0 status ID
 * @returns {string} Human-readable status
 */
export const getStatusDescription = (statusId) => {
  switch (statusId) {
    case JUDGE0_STATUS.IN_QUEUE:
      return 'Na fila';
    case JUDGE0_STATUS.PROCESSING:
      return 'Processando';
    case JUDGE0_STATUS.ACCEPTED:
      return 'Aceito';
    case JUDGE0_STATUS.WRONG_ANSWER:
      return 'Resposta Errada';
    case JUDGE0_STATUS.TIME_LIMIT_EXCEEDED:
      return 'Tempo Limite Excedido';
    case JUDGE0_STATUS.COMPILATION_ERROR:
      return 'Erro de Compilação';
    case JUDGE0_STATUS.RUNTIME_ERROR_SIGSEGV:
    case JUDGE0_STATUS.RUNTIME_ERROR_SIGXFSZ:
    case JUDGE0_STATUS.RUNTIME_ERROR_SIGFPE:
    case JUDGE0_STATUS.RUNTIME_ERROR_SIGABRT:
    case JUDGE0_STATUS.RUNTIME_ERROR_NZEC:
    case JUDGE0_STATUS.RUNTIME_ERROR_OTHER:
      return 'Erro de Execução';
    case JUDGE0_STATUS.INTERNAL_ERROR:
      return 'Erro Interno';
    case JUDGE0_STATUS.EXEC_FORMAT_ERROR:
      return 'Erro de Formato';
    default:
      return 'Desconhecido';
  }
};
