import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useThemeStore } from '../../store/useThemeStore';

/**
 * Format date to readable string
 */
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Agora mesmo';
  if (diffMins < 60) return `${diffMins}m atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays < 7) return `${diffDays}d atrás`;
  
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get language name from language_id
 */
const getLanguageName = (languageId) => {
  const languageMap = {
    71: 'Python',
    62: 'Java',
    63: 'JavaScript',
    54: 'C++',
    50: 'C',
    51: 'C#',
    // Add more as needed
  };
  return languageMap[languageId] || `Language ${languageId}`;
};

const SubmissionCard = ({ submission }) => {
  const { theme, fontSize } = useThemeStore();
  const styles = getStyles(theme, fontSize);
  const [expanded, setExpanded] = useState(false);

  const isPassed = submission.passed_tests === submission.total_tests;
  const statusColor = isPassed ? '#10b981' : '#ef4444';
  
  // Parse test results if available
  let testResults = [];
  try {
    testResults = submission.test_results_json ? JSON.parse(submission.test_results_json) : [];
  } catch (e) {
    console.error('Error parsing test results:', e);
  }

  return (
    <View style={styles.card}>
      {/* Header - always visible */}
      <TouchableOpacity
        style={styles.cardHeader}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={styles.statusIndicator}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={styles.statusText}>
            {submission.status || `${submission.passed_tests}/${submission.total_tests} testes`}
          </Text>
        </View>

        <View style={styles.headerInfo}>
          <View style={styles.infoRow}>
            <Feather name="code" size={14} color={theme.textSecondary} />
            <Text style={styles.languageText}>
              {getLanguageName(submission.language_id)}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Feather name="clock" size={14} color={theme.textSecondary} />
            <Text style={styles.dateText}>
              {formatDate(submission.created_at)}
            </Text>
          </View>
        </View>

        <Feather
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={theme.textSecondary}
        />
      </TouchableOpacity>

      {/* Expanded content */}
      {expanded && (
        <View style={styles.expandedContent}>
          {/* Execution info */}
          <View style={styles.executionInfo}>
            <View style={styles.executionItem}>
              <Text style={styles.executionLabel}>Tempo:</Text>
              <Text style={styles.executionValue}>
                {submission.execution_time ? `${submission.execution_time}ms` : 'N/A'}
              </Text>
            </View>
            <View style={styles.executionItem}>
              <Text style={styles.executionLabel}>Memória:</Text>
              <Text style={styles.executionValue}>
                {submission.memory_used ? `${submission.memory_used}KB` : 'N/A'}
              </Text>
            </View>
          </View>

          {/* Test results */}
          {testResults.length > 0 && (
            <View style={styles.testResultsSection}>
              <Text style={styles.sectionTitle}>Resultados dos Testes:</Text>
              <ScrollView
                style={styles.testResultsScroll}
                nestedScrollEnabled={true}
              >
                {testResults.map((result, index) => (
                  <View
                    key={index}
                    style={[
                      styles.testResultItem,
                      { borderLeftColor: result.passed ? '#10b981' : '#ef4444' }
                    ]}
                  >
                    <View style={styles.testResultHeader}>
                      <Text style={styles.testResultTitle}>
                        Teste {result.testCaseIndex || index + 1}
                      </Text>
                      <Text
                        style={[
                          styles.testResultStatus,
                          { color: result.passed ? '#10b981' : '#ef4444' }
                        ]}
                      >
                        {result.message || (result.passed ? 'Passou' : 'Falhou')}
                      </Text>
                    </View>

                    {result.stdout && (
                      <View style={styles.outputSection}>
                        <Text style={styles.outputLabel}>Saída:</Text>
                        <Text style={styles.outputText}>{result.stdout}</Text>
                      </View>
                    )}

                    {result.stderr && (
                      <View style={styles.outputSection}>
                        <Text style={[styles.outputLabel, { color: '#ef4444' }]}>
                          Erro:
                        </Text>
                        <Text style={[styles.outputText, { color: '#ef4444' }]}>
                          {result.stderr}
                        </Text>
                      </View>
                    )}

                    {result.compileOutput && (
                      <View style={styles.outputSection}>
                        <Text style={[styles.outputLabel, { color: '#f59e0b' }]}>
                          Compilação:
                        </Text>
                        <Text style={[styles.outputText, { color: '#f59e0b' }]}>
                          {result.compileOutput}
                        </Text>
                      </View>
                    )}

                    {result.time && result.memory && (
                      <View style={styles.testMetrics}>
                        <Text style={styles.metricText}>
                          ⏱️ {result.time}s
                        </Text>
                        <Text style={styles.metricText}>
                          💾 {result.memory}KB
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Code preview */}
          {submission.code && (
            <View style={styles.codeSection}>
              <Text style={styles.sectionTitle}>Código Enviado:</Text>
              <ScrollView
                style={styles.codeScroll}
                horizontal={true}
                nestedScrollEnabled={true}
              >
                <Text style={styles.codeText}>{submission.code}</Text>
              </ScrollView>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const getStyles = (theme, fontSize) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.cardBackground || '#FFF',
      borderRadius: 12,
      marginBottom: 12,
      elevation: theme.elevation || 2,
      shadowColor: theme.shadowColor || '#000',
      shadowOpacity: theme.shadowOpacity || 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      overflow: 'hidden',
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      gap: 12,
    },
    statusIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    statusDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    statusText: {
      color: theme.textPrimary,
      fontSize: fontSize * 0.9,
      fontWeight: '600',
    },
    headerInfo: {
      flex: 1,
      gap: 4,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    languageText: {
      color: theme.textPrimary,
      fontSize: fontSize * 0.85,
      fontWeight: '500',
    },
    dateText: {
      color: theme.textSecondary,
      fontSize: fontSize * 0.8,
    },
    expandedContent: {
      borderTopWidth: 1,
      borderTopColor: theme.border || '#E0E0E0',
      padding: 16,
      gap: 16,
    },
    executionInfo: {
      flexDirection: 'row',
      gap: 16,
    },
    executionItem: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    executionLabel: {
      color: theme.textSecondary,
      fontSize: fontSize * 0.85,
    },
    executionValue: {
      color: theme.textPrimary,
      fontSize: fontSize * 0.85,
      fontWeight: '600',
    },
    testResultsSection: {
      gap: 8,
    },
    sectionTitle: {
      color: theme.textPrimary,
      fontSize: fontSize * 0.9,
      fontWeight: '700',
      marginBottom: 4,
    },
    testResultsScroll: {
      maxHeight: 300,
    },
    testResultItem: {
      backgroundColor: theme.background || '#F9FAFB',
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      borderLeftWidth: 3,
    },
    testResultHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    testResultTitle: {
      color: theme.textPrimary,
      fontSize: fontSize * 0.85,
      fontWeight: '600',
    },
    testResultStatus: {
      fontSize: fontSize * 0.8,
      fontWeight: '600',
    },
    outputSection: {
      marginTop: 8,
      gap: 4,
    },
    outputLabel: {
      color: theme.textSecondary,
      fontSize: fontSize * 0.75,
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    outputText: {
      color: theme.textPrimary,
      fontSize: fontSize * 0.8,
      fontFamily: 'monospace',
      backgroundColor: theme.cardBackground || '#FFF',
      padding: 8,
      borderRadius: 4,
    },
    testMetrics: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 8,
    },
    metricText: {
      color: theme.textSecondary,
      fontSize: fontSize * 0.75,
    },
    codeSection: {
      gap: 8,
    },
    codeScroll: {
      maxHeight: 200,
    },
    codeText: {
      color: theme.textPrimary,
      fontSize: fontSize * 0.8,
      fontFamily: 'monospace',
      backgroundColor: theme.background || '#F9FAFB',
      padding: 12,
      borderRadius: 8,
      lineHeight: fontSize * 1.4,
    },
  });

export default SubmissionCard;
