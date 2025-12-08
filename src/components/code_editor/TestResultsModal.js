import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const getScreenDimensions = () => {
  const { width, height } = Dimensions.get('window');
  const isLandscape = width > height;
  return { width, height, isLandscape };
};

const TestResultsModal = ({ visible, onClose, results }) => {
  const [dimensions, setDimensions] = useState(getScreenDimensions());

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', () => {
      setDimensions(getScreenDimensions());
    });
    return () => subscription?.remove();
  }, []);

  if (!results) return null;

  const { results: testResults, totalTests, passedTests, failedTests } = results;
  const allPassed = failedTests === 0;
  
  // Check if there's a compilation error (will be the same for all tests)
  const compilationError = testResults.find(r => r.compileOutput)?.compileOutput;
  
  // Ajustar altura do modal baseado na orientação
  const modalMaxHeight = dimensions.isLandscape 
    ? dimensions.height * 0.98  // 98% em landscape
    : dimensions.height * 0.95; // 95% em portrait para mais espaço

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { maxHeight: modalMaxHeight }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Feather
                name={allPassed ? 'check-circle' : 'x-circle'}
                size={24}
                color={allPassed ? '#4CAF50' : '#f44336'}
              />
              <Text style={styles.headerTitle}>Resultados dos Testes</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Summary */}
          <View style={styles.summary}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={styles.summaryValue}>{totalTests}</Text>
            </View>
            <View style={[styles.summaryItem, styles.summarySuccess]}>
              <Text style={styles.summaryLabel}>Passou</Text>
              <Text style={[styles.summaryValue, styles.successText]}>{passedTests}</Text>
            </View>
            <View style={[styles.summaryItem, styles.summaryError]}>
              <Text style={styles.summaryLabel}>Falhou</Text>
              <Text style={[styles.summaryValue, styles.errorText]}>{failedTests}</Text>
            </View>
          </View>

          {/* Compilation Error (show once at top if exists) */}
          {compilationError && (
            <View style={styles.globalErrorContainer}>
              <View style={styles.globalErrorHeader}>
                <Feather name="alert-circle" size={18} color="#f44336" />
                <Text style={styles.globalErrorTitle}>Erro de Compilação</Text>
              </View>
              <ScrollView 
                style={styles.globalErrorBox}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
              >
                <Text style={styles.errorOutputText}>{compilationError}</Text>
              </ScrollView>
            </View>
          )}

          {/* Test Results List */}
          <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={true}>
            {testResults && testResults.length > 0 ? (
              testResults.map((result, index) => {
                console.log(`Rendering test item ${index + 1}`);
                return <TestResultItem key={index} result={result} showCompileError={false} />;
              })
            ) : (
              <Text style={styles.emptyText}>Nenhum resultado de teste disponível</Text>
            )}
          </ScrollView>

          {/* Footer Button */}
          <TouchableOpacity style={styles.closeFooterButton} onPress={onClose}>
            <Text style={styles.closeFooterButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const TestResultItem = ({ result, showCompileError = true }) => {
  const {
    testCaseIndex,
    passed,
    message,
    stdout,
    stderr,
    compileOutput,
    time,
    memory,
    expectedOutput,
  } = result;

  const [expanded, setExpanded] = React.useState(false);
  
  // Debug log when first test renders
  React.useEffect(() => {
    if (testCaseIndex === 1) {
      console.log('=== MODAL TEST ITEM DATA ===');
      console.log('Expected Output:', expectedOutput);
      console.log('Stdout:', stdout);
      console.log('Stderr:', stderr);
      console.log('Compile Output:', compileOutput);
    }
  }, [testCaseIndex, expectedOutput, stdout, stderr, compileOutput]);

  return (
    <View style={[styles.testItem, passed ? styles.testPassed : styles.testFailed]}>
      {/* Test Header */}
      <TouchableOpacity
        style={styles.testHeader}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={styles.testHeaderLeft}>
          <Feather
            name={passed ? 'check-circle' : 'x-circle'}
            size={20}
            color={passed ? '#4CAF50' : '#f44336'}
          />
          <Text style={styles.testTitle}>Teste {testCaseIndex}</Text>
        </View>
        <View style={styles.testHeaderRight}>
          <Text style={styles.testMessage}>{message}</Text>
          <Feather
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#999"
          />
        </View>
      </TouchableOpacity>

      {/* Expanded Details */}
      {expanded && (
        <View style={styles.testDetails}>
          {/* Execution Info */}
          <View style={styles.executionInfo}>
            {time && (
              <View style={styles.infoItem}>
                <Feather name="clock" size={14} color="#999" />
                <Text style={styles.infoText}>{time}s</Text>
              </View>
            )}
            {memory && (
              <View style={styles.infoItem}>
                <Feather name="cpu" size={14} color="#999" />
                <Text style={styles.infoText}>{memory} KB</Text>
              </View>
            )}
          </View>

          {/* Test Code */}
          {result.testCode && (
            <View style={styles.outputSection}>
              <Text style={styles.outputLabel}>Código do Teste:</Text>
              <View style={styles.codeBox}>
                <Text style={styles.codeText}>{result.testCode}</Text>
              </View>
            </View>
          )}

          {/* Expected Output */}
          {expectedOutput && (
            <View style={styles.outputSection}>
              <Text style={styles.outputLabel}>✓ Saída Esperada:</Text>
              <View style={styles.expectedBox}>
                <Text style={styles.expectedText}>
                  {typeof expectedOutput === 'object' ? JSON.stringify(expectedOutput, null, 2) : String(expectedOutput)}
                </Text>
              </View>
            </View>
          )}

          {/* Actual Output */}
          <View style={styles.outputSection}>
            <Text style={[styles.outputLabel, !passed && styles.errorLabel]}>
              {passed ? '✓ Saída Recebida:' : '✗ Saída Recebida:'}
            </Text>
            <View style={[styles.outputBox, !passed && styles.errorBox]}>
              <Text style={[styles.outputText, !passed && styles.errorOutputText]}>
                {stdout || '(sem saída)'}
              </Text>
            </View>
          </View>

          {/* Compilation Error (only if showCompileError is true) */}
          {compileOutput && showCompileError && (
            <View style={styles.outputSection}>
              <Text style={[styles.outputLabel, styles.errorLabel]}>Erro de Compilação:</Text>
              <ScrollView 
                style={[styles.outputBox, styles.errorBox]}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
              >
                <Text style={styles.errorOutputText}>{compileOutput}</Text>
              </ScrollView>
            </View>
          )}

          {/* Runtime Error (stderr) */}
          {stderr && (
            <View style={styles.outputSection}>
              <Text style={[styles.outputLabel, styles.errorLabel]}>Erro de Execução (stderr):</Text>
              <ScrollView 
                style={[styles.outputBox, styles.errorBox]}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
              >
                <Text style={styles.errorOutputText}>{stderr}</Text>
              </ScrollView>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1d2e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    height: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  summary: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  summaryItem: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  summarySuccess: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  summaryError: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderColor: 'rgba(244, 67, 54, 0.3)',
  },
  summaryLabel: {
    color: '#999',
    fontSize: 12,
    marginBottom: 4,
  },
  summaryValue: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  successText: {
    color: '#4CAF50',
  },
  errorText: {
    color: '#f44336',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    minHeight: 100,
    paddingTop: 8,
  },
  testItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    overflow: 'hidden',
    minHeight: 60,
  },
  testPassed: {
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  testFailed: {
    borderColor: 'rgba(244, 67, 54, 0.3)',
  },
  testHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  testHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  testTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  testHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  testMessage: {
    color: '#999',
    fontSize: 14,
  },
  testDetails: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  executionInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    color: '#999',
    fontSize: 12,
  },
  outputSection: {
    marginTop: 12,
  },
  outputLabel: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  errorLabel: {
    color: '#f44336',
  },
  outputBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    maxHeight: 150,
  },
  errorBox: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderColor: 'rgba(244, 67, 54, 0.3)',
  },
  globalErrorContainer: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(244, 67, 54, 0.3)',
    padding: 16,
  },
  globalErrorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  globalErrorTitle: {
    color: '#f44336',
    fontSize: 16,
    fontWeight: '600',
  },
  globalErrorBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    padding: 12,
    maxHeight: 200,
  },
  outputText: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  errorOutputText: {
    color: '#f44336',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  codeBox: {
    backgroundColor: 'rgba(100, 100, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(100, 100, 255, 0.3)',
  },
  codeText: {
    color: '#9ca3af',
    fontSize: 11,
    fontFamily: 'monospace',
    fontStyle: 'italic',
  },
  expectedBox: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  expectedText: {
    color: '#4CAF50',
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  closeFooterButton: {
    backgroundColor: '#007aff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  closeFooterButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default TestResultsModal;
