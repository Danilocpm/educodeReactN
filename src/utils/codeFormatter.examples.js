/**
 * Code Formatter Usage Examples
 * 
 * This file demonstrates how to use the codeFormatter utility
 * to prepare code for Judge0 API submission.
 */

import { formatCodeForJudge0, getJudge0LanguageId } from './codeFormatter';
import { useProblemStore } from '../store/useProblemStore';
import { useLanguageStore } from '../store/useLanguageStore';

/**
 * Example 1: Basic Usage - Format code for Judge0 submission
 * 
 * This is the typical flow when the user clicks "Run" in the code editor
 */
export const exampleBasicUsage = (problemId, languageId, testCases) => {
  // 1. Get user's code from store
  const { getCode } = useProblemStore.getState();
  const userCode = getCode(problemId, languageId);
  
  // 2. Get language code from store
  const { languageCode } = useLanguageStore.getState();
  
  // 3. Format code for Judge0
  try {
    const result = formatCodeForJudge0({
      languageCode,
      userCode,
      testCases, // Array from useProblemOutputs
    });
    
    console.log('Formatted for Judge0:', result);
    // Returns:
    // {
    //   submissions: [
    //     { source_code: 'base64...', language_id: 71, expected_output: 'base64...' },
    //     { source_code: 'base64...', language_id: 71, expected_output: 'base64...' }
    //   ],
    //   languageId: 71,
    //   totalTests: 2
    // }
    
    return result;
  } catch (error) {
    console.error('Formatting error:', error.message);
    return null;
  }
};

/**
 * Example 2: Python Code Formatting
 */
export const examplePython = () => {
  const userCode = `class Solution:
    def twoSum(self, nums, target):
        hashmap = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in hashmap:
                return [hashmap[complement], i]
            hashmap[num] = i
        return []`;

  const testCases = [
    {
      test_code: 'print(sol.twoSum([2, 7, 11, 15], 9))',
      expected_output: '[0, 1]'
    },
    {
      test_code: 'print(sol.twoSum([3, 2, 4], 6))',
      expected_output: '[1, 2]'
    }
  ];

  const result = formatCodeForJudge0({
    languageCode: 'python',
    userCode,
    testCases
  });

  console.log('Python submission:', result);
  return result;
};

/**
 * Example 3: Java Code Formatting
 */
export const exampleJava = () => {
  const userCode = `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }
}`;

  const testCases = [
    {
      test_code: 'System.out.println(Arrays.toString(sol.twoSum(new int[]{2, 7, 11, 15}, 9)));',
      expected_output: '[0, 1]'
    }
  ];

  const result = formatCodeForJudge0({
    languageCode: 'java',
    userCode,
    testCases
  });

  console.log('Java submission:', result);
  return result;
};

/**
 * Example 4: JavaScript Code Formatting
 */
export const exampleJavaScript = () => {
  const userCode = `class Solution {
    twoSum(nums, target) {
        const map = new Map();
        for (let i = 0; i < nums.length; i++) {
            const complement = target - nums[i];
            if (map.has(complement)) {
                return [map.get(complement), i];
            }
            map.set(nums[i], i);
        }
        return [];
    }
}`;

  const testCases = [
    {
      test_code: 'console.log(sol.twoSum([2, 7, 11, 15], 9));',
      expected_output: '[0, 1]'
    }
  ];

  const result = formatCodeForJudge0({
    languageCode: 'javascript',
    userCode,
    testCases
  });

  console.log('JavaScript submission:', result);
  return result;
};

/**
 * Example 5: Get Judge0 Language ID
 */
export const exampleGetLanguageId = () => {
  console.log('Python Judge0 ID:', getJudge0LanguageId('python'));      // 71
  console.log('Java Judge0 ID:', getJudge0LanguageId('java'));          // 62
  console.log('JavaScript Judge0 ID:', getJudge0LanguageId('javascript')); // 63
  console.log('C++ Judge0 ID:', getJudge0LanguageId('cpp'));            // 54
};

/**
 * Example 6: Integration with Code Editor Screen
 * 
 * This shows how to use the formatter in the actual code editor
 */
export const exampleCodeEditorIntegration = async (problemId) => {
  const { getCode } = useProblemStore.getState();
  const { languageId, languageCode } = useLanguageStore.getState();
  
  // Get user's current code
  const userCode = getCode(problemId, languageId);
  
  if (!userCode) {
    console.error('No code found for this problem');
    return null;
  }
  
  // Fetch test cases (assuming you have the query result)
  // const { data: testCases } = useProblemOutputs(problemId, languageId);
  
  // Mock test cases for demonstration
  const testCases = [
    {
      test_code: 'print(sol.hasDuplicate([1, 2, 3]))',
      expected_output: 'False'
    },
    {
      test_code: 'print(sol.hasDuplicate([1, 2, 2]))',
      expected_output: 'True'
    }
  ];
  
  try {
    // Format for Judge0
    const formattedData = formatCodeForJudge0({
      languageCode,
      userCode,
      testCases
    });
    
    console.log(`Prepared ${formattedData.totalTests} test submissions`);
    console.log('Judge0 Language ID:', formattedData.languageId);
    
    // Now you can send formattedData.submissions to Judge0 API
    // using batch submission endpoint
    
    return formattedData;
  } catch (error) {
    console.error('Failed to format code:', error.message);
    return null;
  }
};

/**
 * Example 7: Handle Multiple Test Cases (Batch Submission)
 */
export const exampleBatchSubmission = () => {
  const userCode = `class Solution:
    def hasDuplicate(self, nums):
        return len(nums) != len(set(nums))`;

  const testCases = [
    { test_code: 'print(sol.hasDuplicate([1, 2, 3]))', expected_output: 'False' },
    { test_code: 'print(sol.hasDuplicate([1, 2, 2]))', expected_output: 'True' },
    { test_code: 'print(sol.hasDuplicate([]))', expected_output: 'False' },
    { test_code: 'print(sol.hasDuplicate([1]))', expected_output: 'False' },
  ];

  const result = formatCodeForJudge0({
    languageCode: 'python',
    userCode,
    testCases
  });

  console.log(`Created ${result.totalTests} submissions for batch processing`);
  console.log('Each submission has:', result.submissions[0]);
  
  // Each submission in the array is ready to be sent to Judge0
  // You would typically send all submissions together and get back tokens
  // Then poll each token to get results
  
  return result;
};
