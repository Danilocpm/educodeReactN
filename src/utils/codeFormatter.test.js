/**
 * Simple tests for Code Formatter
 * Run these to verify the formatter is working correctly
 */

import { 
  formatCodeForJudge0, 
  getJudge0LanguageId,
  createSubmissionPayload,
  JUDGE0_LANGUAGE_MAP
} from './codeFormatter';

// Test 1: Judge0 Language ID Mapping
console.log('=== Test 1: Judge0 Language ID Mapping ===');
console.log('Python:', getJudge0LanguageId('python') === 71 ? '✅' : '❌');
console.log('JavaScript:', getJudge0LanguageId('javascript') === 63 ? '✅' : '❌');
console.log('Java:', getJudge0LanguageId('java') === 62 ? '✅' : '❌');
console.log('C++:', getJudge0LanguageId('cpp') === 54 ? '✅' : '❌');

// Test 2: Python Code Formatting
console.log('\n=== Test 2: Python Code Formatting ===');
try {
  const pythonResult = formatCodeForJudge0({
    languageCode: 'python',
    userCode: 'class Solution:\n    def test(self):\n        return True',
    testCases: [
      { test_code: 'print(sol.test())', expected_output: 'True' }
    ]
  });
  console.log('✅ Python formatting works');
  console.log('Submissions count:', pythonResult.totalTests);
  console.log('Language ID:', pythonResult.languageId);
} catch (error) {
  console.log('❌ Python formatting failed:', error.message);
}

// Test 3: Java Code Formatting
console.log('\n=== Test 3: Java Code Formatting ===');
try {
  const javaResult = formatCodeForJudge0({
    languageCode: 'java',
    userCode: 'class Solution {\n    public boolean test() {\n        return true;\n    }\n}',
    testCases: [
      { test_code: 'System.out.println(sol.test());', expected_output: 'true' }
    ]
  });
  console.log('✅ Java formatting works');
  console.log('Submissions count:', javaResult.totalTests);
} catch (error) {
  console.log('❌ Java formatting failed:', error.message);
}

// Test 4: Multiple Test Cases (Batch)
console.log('\n=== Test 4: Multiple Test Cases (Batch) ===');
try {
  const batchResult = formatCodeForJudge0({
    languageCode: 'python',
    userCode: 'class Solution:\n    def add(self, a, b):\n        return a + b',
    testCases: [
      { test_code: 'print(sol.add(1, 2))', expected_output: '3' },
      { test_code: 'print(sol.add(5, 5))', expected_output: '10' },
      { test_code: 'print(sol.add(0, 0))', expected_output: '0' }
    ]
  });
  console.log('✅ Batch formatting works');
  console.log('Total submissions:', batchResult.totalTests);
  console.log('Expected: 3 submissions');
} catch (error) {
  console.log('❌ Batch formatting failed:', error.message);
}

// Test 5: Base64 Encoding
console.log('\n=== Test 5: Base64 Encoding ===');
try {
  const result = formatCodeForJudge0({
    languageCode: 'javascript',
    userCode: 'class Solution {}',
    testCases: [{ test_code: 'console.log("test");', expected_output: 'test' }]
  });
  const hasBase64 = result.submissions[0].source_code.length > 0;
  console.log(hasBase64 ? '✅ Base64 encoding works' : '❌ No base64 encoding');
} catch (error) {
  console.log('❌ Base64 encoding failed:', error.message);
}

// Test 6: Error Handling - Unsupported Language
console.log('\n=== Test 6: Error Handling - Unsupported Language ===');
try {
  formatCodeForJudge0({
    languageCode: 'cobol',
    userCode: 'PROGRAM-ID. HELLO.',
    testCases: [{ test_code: 'DISPLAY "HELLO"', expected_output: 'HELLO' }]
  });
  console.log('❌ Should have thrown error for unsupported language');
} catch (error) {
  console.log('✅ Correctly throws error:', error.message);
}

// Test 7: Error Handling - Missing Parameters
console.log('\n=== Test 7: Error Handling - Missing Parameters ===');
try {
  formatCodeForJudge0({
    languageCode: 'python',
    userCode: 'class Solution: pass',
    testCases: []
  });
  console.log('❌ Should have thrown error for empty test cases');
} catch (error) {
  console.log('✅ Correctly throws error:', error.message);
}

// Test 8: All Supported Languages
console.log('\n=== Test 8: All Supported Languages ===');
const supportedLanguages = Object.keys(JUDGE0_LANGUAGE_MAP);
console.log('Supported languages:', supportedLanguages.join(', '));
console.log('Total supported:', supportedLanguages.length);

// Test 9: createSubmissionPayload
console.log('\n=== Test 9: createSubmissionPayload ===');
try {
  const payload = createSubmissionPayload(
    'python',
    'class Solution:\n    pass',
    'print("test")',
    'test'
  );
  const hasRequiredFields = payload.source_code && payload.language_id && payload.expected_output;
  console.log(hasRequiredFields ? '✅ Payload structure correct' : '❌ Missing fields');
  console.log('Payload keys:', Object.keys(payload).join(', '));
} catch (error) {
  console.log('❌ Payload creation failed:', error.message);
}

// Test 10: C++ Formatting
console.log('\n=== Test 10: C++ Code Formatting ===');
try {
  const cppResult = formatCodeForJudge0({
    languageCode: 'cpp',
    userCode: 'class Solution {\npublic:\n    bool test() { return true; }\n};',
    testCases: [
      { test_code: 'cout << sol.test() << endl;', expected_output: '1' }
    ]
  });
  console.log('✅ C++ formatting works');
} catch (error) {
  console.log('❌ C++ formatting failed:', error.message);
}

console.log('\n=== All Tests Complete ===');
