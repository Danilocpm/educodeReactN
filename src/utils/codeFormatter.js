/**
 * Code Formatter for Judge0 API Submissions
 * 
 * This utility combines user code with language-specific templates
 * (imports + solution + test calls) and formats for Judge0 API submission
 * as base64-encoded source code.
 */

/**
 * Judge0 Language ID Mapping
 * Maps custom language codes to Judge0 API language IDs
 */
export const JUDGE0_LANGUAGE_MAP = {
  'python': 71,      // Python 3
  'javascript': 63,  // JavaScript (Node.js)
  'java': 62,        // Java
  'cpp': 54,         // C++ (GCC 9.2.0)
  'c': 50,           // C (GCC 9.2.0)
  'csharp': 51,      // C# (Mono 6.6.0.161)
  'go': 60,          // Go (1.13.5)
  'rust': 73,        // Rust (1.40.0)
  'typescript': 74,  // TypeScript (3.7.4)
};

/**
 * Language-specific template generators
 */

/**
 * Python template - combines imports, user code, and test execution
 * @param {string} userCode - User's solution code from store
 * @param {string} testCode - Test code from problem_outputs
 * @returns {string} Complete formatted Python code
 */
const formatPython = (userCode, testCode) => {
  return `## Imports
from typing import *

## Solution
${userCode}

## Test Execution
sol = Solution()
${testCode}`;
};

/**
 * JavaScript template - combines user code with test execution
 * @param {string} userCode - User's solution code from store
 * @param {string} testCode - Test code from problem_outputs
 * @returns {string} Complete formatted JavaScript code
 */
const formatJavaScript = (userCode, testCode) => {
  return `// Solution
${userCode}

// Test Execution
const sol = new Solution();
${testCode}`;
};

/**
 * Java template - wraps user code in class structure with test execution
 * @param {string} userCode - User's solution code from store
 * @param {string} testCode - Test code from problem_outputs
 * @returns {string} Complete formatted Java code
 */
const formatJava = (userCode, testCode) => {
  return `import java.util.*;

// Solution
${userCode}

// Test Execution
public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
        ${testCode}
    }
}`;
};

/**
 * C++ template - combines user code with test execution in main
 * @param {string} userCode - User's solution code from store
 * @param {string} testCode - Test code from problem_outputs
 * @returns {string} Complete formatted C++ code
 */
const formatCpp = (userCode, testCode) => {
  return `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <map>
#include <set>
using namespace std;

// Solution
${userCode}

// Test Execution
int main() {
    Solution sol;
    ${testCode}
    return 0;
}`;
};

/**
 * C template - combines user code with test execution
 * @param {string} userCode - User's solution code from store
 * @param {string} testCode - Test code from problem_outputs
 * @returns {string} Complete formatted C code
 */
const formatC = (userCode, testCode) => {
  return `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Solution
${userCode}

// Test Execution
int main() {
    ${testCode}
    return 0;
}`;
};

/**
 * C# template - wraps user code in class structure
 * @param {string} userCode - User's solution code from store
 * @param {string} testCode - Test code from problem_outputs
 * @returns {string} Complete formatted C# code
 */
const formatCSharp = (userCode, testCode) => {
  return `using System;
using System.Collections.Generic;
using System.Linq;

// Solution
${userCode}

// Test Execution
class Program {
    static void Main() {
        Solution sol = new Solution();
        ${testCode}
    }
}`;
};

/**
 * Go template - combines user code with test execution
 * @param {string} userCode - User's solution code from store
 * @param {string} testCode - Test code from problem_outputs
 * @returns {string} Complete formatted Go code
 */
const formatGo = (userCode, testCode) => {
  return `package main

import (
    "fmt"
)

// Solution
${userCode}

// Test Execution
func main() {
    ${testCode}
}`;
};

/**
 * Rust template - combines user code with test execution
 * @param {string} userCode - User's solution code from store
 * @param {string} testCode - Test code from problem_outputs
 * @returns {string} Complete formatted Rust code
 */
const formatRust = (userCode, testCode) => {
  return `// Solution
${userCode}

// Test Execution
fn main() {
    ${testCode}
}`;
};

/**
 * TypeScript template - combines user code with test execution
 * @param {string} userCode - User's solution code from store
 * @param {string} testCode - Test code from problem_outputs
 * @returns {string} Complete formatted TypeScript code
 */
const formatTypeScript = (userCode, testCode) => {
  return `// Solution
${userCode}

// Test Execution
const sol = new Solution();
${testCode}`;
};

/**
 * Template function mapping by language code
 */
const TEMPLATE_FORMATTERS = {
  'python': formatPython,
  'javascript': formatJavaScript,
  'java': formatJava,
  'cpp': formatCpp,
  'c': formatC,
  'csharp': formatCSharp,
  'go': formatGo,
  'rust': formatRust,
  'typescript': formatTypeScript,
};

/**
 * Format code for a single test case
 * @param {string} languageCode - Language code (e.g., 'python', 'java')
 * @param {string} userCode - User's solution code
 * @param {string} testCode - Single test case code
 * @returns {string} Formatted code ready for submission
 */
const formatCodeForLanguage = (languageCode, userCode, testCode) => {
  const formatter = TEMPLATE_FORMATTERS[languageCode.toLowerCase()];
  
  if (!formatter) {
    throw new Error(`Unsupported language: ${languageCode}`);
  }
  
  return formatter(userCode, testCode);
};

/**
 * Get Judge0 language ID from language code
 * @param {string} languageCode - Language code (e.g., 'python', 'java')
 * @returns {number} Judge0 language ID
 */
export const getJudge0LanguageId = (languageCode) => {
  const judge0Id = JUDGE0_LANGUAGE_MAP[languageCode.toLowerCase()];
  
  if (!judge0Id) {
    throw new Error(`No Judge0 mapping for language: ${languageCode}`);
  }
  
  return judge0Id;
};

/**
 * Create a Judge0 submission payload for a single test case
 * @param {string} languageCode - Language code
 * @param {string} userCode - User's solution code
 * @param {string} testCode - Test case code
 * @param {string} expectedOutput - Expected output for the test
 * @returns {Object} Judge0 submission payload
 */
export const createSubmissionPayload = (languageCode, userCode, testCode, expectedOutput) => {
  const formattedCode = formatCodeForLanguage(languageCode, userCode, testCode);
  const base64Code = Buffer.from(formattedCode).toString('base64');
  
  // Extract output value from JSON if expectedOutput is an object
  let expectedOutputValue = expectedOutput;
  if (expectedOutput && typeof expectedOutput === 'object') {
    expectedOutputValue = expectedOutput.output || JSON.stringify(expectedOutput);
  } else if (expectedOutput && typeof expectedOutput === 'string') {
    try {
      const parsed = JSON.parse(expectedOutput);
      expectedOutputValue = parsed.output || expectedOutput;
    } catch (e) {
      // If not JSON, use as is
      expectedOutputValue = expectedOutput;
    }
  }
  
  const base64ExpectedOutput = expectedOutputValue ? Buffer.from(String(expectedOutputValue)).toString('base64') : null;
  
  return {
    source_code: base64Code,
    language_id: getJudge0LanguageId(languageCode),
    expected_output: base64ExpectedOutput,
  };
};

/**
 * Format code for Judge0 batch submission
 * Creates an array of submission payloads, one for each test case
 * 
 * @param {string} languageCode - Language code (e.g., 'python', 'java')
 * @param {string} userCode - User's solution code from store
 * @param {Array} testCases - Array of test case objects from problem_outputs
 * @param {string} testCases[].test_code - Test code to execute
 * @param {string} testCases[].expected_output - Expected output
 * @returns {Object} Object containing submissions array and metadata
 */
export const formatForJudge0Batch = (languageCode, userCode, testCases) => {
  if (!languageCode || !userCode) {
    throw new Error('Language code and user code are required');
  }
  
  if (!Array.isArray(testCases) || testCases.length === 0) {
    throw new Error('At least one test case is required');
  }
  
  const submissions = testCases.map((testCase) => {
    return createSubmissionPayload(
      languageCode,
      userCode,
      testCase.test_code,
      testCase.expected_output
    );
  });
  
  return {
    submissions,
    languageId: getJudge0LanguageId(languageCode),
    totalTests: testCases.length,
  };
};

/**
 * Main formatting function - creates Judge0 submission payloads
 * 
 * @param {Object} params - Formatting parameters
 * @param {string} params.languageCode - Language code (from languages table)
 * @param {string} params.userCode - User's solution code (from useProblemStore)
 * @param {Array} params.testCases - Test cases array (from useProblemOutputs)
 * @returns {Object} Formatted submission data for Judge0
 * 
 * @example
 * const result = formatCodeForJudge0({
 *   languageCode: 'python',
 *   userCode: 'class Solution:\n    def twoSum(self, nums, target):\n        pass',
 *   testCases: [
 *     { test_code: 'print(sol.twoSum([2,7,11,15], 9))', expected_output: '[0, 1]' }
 *   ]
 * });
 * // Returns: { submissions: [...], languageId: 71, totalTests: 1 }
 */
export const formatCodeForJudge0 = ({ languageCode, userCode, testCases }) => {
  return formatForJudge0Batch(languageCode, userCode, testCases);
};
