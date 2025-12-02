import React from 'react';
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

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const TestResultsModal = ({ visible, onClose, results }) => {
  if (!results) return null;

  const { results: testResults, totalTests, passedTests, failedTests } = results;
  const allPassed = failedTests === 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
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

          {/* Test Results List */}
          <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={true}>
            {testResults.map((result, index) => (
              <TestResultItem key={index} result={result} />
            ))}
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

const TestResultItem = ({ result }) => {
  const {
    testCaseIndex,
    passed,
    message,
    stdout,
    stderr,
    compileOutput,
    time,
    memory,
  } = result;

  const [expanded, setExpanded] = React.useState(false);

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

          {/* Output */}
          {stdout && (
            <View style={styles.outputSection}>
              <Text style={styles.outputLabel}>Saída:</Text>
              <View style={styles.outputBox}>
                <Text style={styles.outputText}>{stdout}</Text>
              </View>
            </View>
          )}

          {/* Compilation Error */}
          {compileOutput && (
            <View style={styles.outputSection}>
              <Text style={[styles.outputLabel, styles.errorLabel]}>Erro de Compilação:</Text>
              <View style={[styles.outputBox, styles.errorBox]}>
                <Text style={styles.errorOutputText}>{compileOutput}</Text>
              </View>
            </View>
          )}

          {/* Runtime Error */}
          {stderr && (
            <View style={styles.outputSection}>
              <Text style={[styles.outputLabel, styles.errorLabel]}>Erro de Execução:</Text>
              <View style={[styles.outputBox, styles.errorBox]}>
                <Text style={styles.errorOutputText}>{stderr}</Text>
              </View>
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
    maxHeight: SCREEN_HEIGHT * 0.85,
    paddingBottom: 20,
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
  },
  testItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    overflow: 'hidden',
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
  },
  errorBox: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderColor: 'rgba(244, 67, 54, 0.3)',
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
});

export default TestResultsModal;
