import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import { useThemeStore } from '../../src/store/useThemeStore';
import { useProblemStore } from '../../src/store/useProblemStore';
import { useLanguageStore } from '../../src/store/useLanguageStore';
import { useProblemById } from '../../src/services/useProblems';
import { useSubmissionsByProblem } from '../../src/services/useSubmissions';
import SubmissionCard from '../../src/components/profile/SubmissionCard';

// Mapeamento de dificuldade do banco (enum) para português
const DIFFICULTY_MAP = {
  easy: 'Fácil',
  medium: 'Médio',
  hard: 'Difícil',
};

const TAB_OPTIONS = ['Enunciado', 'Solução', 'Submissões'];

const ProblemDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { theme, fontSize } = useThemeStore();
  const { setProblem, clearProblem } = useProblemStore();
  const { languageId } = useLanguageStore();
  const styles = getStyles(theme, fontSize);

  const [activeTab, setActiveTab] = useState('Enunciado');

  // Busca o problema do banco de dados
  const { data: problem, isLoading, error } = useProblemById(id);
  
  // Busca as submissões do usuário para este problema
  // refetchOnMount: 'always' garante que sempre busca dados frescos ao abrir a aba
  const { data: submissions, isLoading: submissionsLoading, refetch: refetchSubmissions } = useSubmissionsByProblem(id, languageId, {
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  // Armazena o problema na store quando carregado
  useEffect(() => {
    if (problem) {
      setProblem(problem);
    }

    // Cleanup: limpa a store quando o componente desmonta ou o ID muda
    return () => {
      clearProblem();
    };
  }, [problem, id, setProblem, clearProblem]);

  // Recarrega submissões quando a aba de Submissões é aberta
  useEffect(() => {
    if (activeTab === 'Submissões') {
      refetchSubmissions();
    }
  }, [activeTab, refetchSubmissions]);

  // Renderiza o conteúdo baseado na aba ativa
  const renderContent = () => {
    if (!problem) return null;

    switch (activeTab) {
      case 'Enunciado':
        return (
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>{problem.title}</Text>
            {problem.description_md ? (
              <Markdown style={getMarkdownStyles(theme, fontSize)}>
                {problem.description_md}
              </Markdown>
            ) : (
              <Text style={styles.emptyText}>Enunciado não disponível</Text>
            )}
          </View>
        );
      case 'Solução':
        return (
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>Solução</Text>
            {problem.solutions_md ? (
              <Markdown style={getMarkdownStyles(theme, fontSize)}>
                {problem.solutions_md}
              </Markdown>
            ) : (
              <Text style={styles.emptyText}>
                Solução não disponível
              </Text>
            )}
          </View>
        );
      case 'Submissões':
        return (
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>Minhas Submissões</Text>
            {submissionsLoading ? (
              <ActivityIndicator size="small" color={theme.primary} style={{ marginTop: 20 }} />
            ) : submissions && submissions.length > 0 ? (
              <View style={styles.submissionsContainer}>
                {submissions.map((submission) => (
                  <SubmissionCard key={submission.id} submission={submission} />
                ))}
              </View>
            ) : (
              <View style={styles.emptyStateContainer}>
                <Feather name="file-text" size={48} color={theme.textSecondary} />
                <Text style={styles.emptyText}>
                  Nenhuma submissão encontrada
                </Text>
                <Text style={styles.emptySubtext}>
                  Execute seu código no editor para criar sua primeira submissão
                </Text>
              </View>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  // Estado de carregamento
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle={theme.statusBar} backgroundColor={theme.background} />
        <View style={[styles.container, styles.centerContainer]}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Carregando problema...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Estado de erro
  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle={theme.statusBar} backgroundColor={theme.background} />
        <View style={[styles.container, styles.centerContainer]}>
          <Feather name="alert-circle" size={48} color="#ef4444" />
          <Text style={styles.errorText}>
            Erro ao carregar o problema
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.retryButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Problema não encontrado
  if (!problem) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle={theme.statusBar} backgroundColor={theme.background} />
        <View style={[styles.container, styles.centerContainer]}>
          <Feather name="search" size={48} color={theme.textSecondary} />
          <Text style={styles.errorText}>Problema não encontrado</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.retryButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.background} />
      <View style={styles.container}>
        {/* Header com botão de voltar */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{problem.title}</Text>
            <Text style={styles.headerSubtitle}>
              {DIFFICULTY_MAP[problem.difficulty] || problem.difficulty}
            </Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Navegação por abas */}
        <View style={styles.tabContainer}>
          {TAB_OPTIONS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && styles.activeTab,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Conteúdo baseado na aba ativa */}
        <ScrollView
          style={styles.contentContainer}
          contentContainerStyle={styles.contentContainerStyle}
          showsVerticalScrollIndicator={false}
        >
          {renderContent()}
        </ScrollView>

        {/* Botão flutuante de código (inferior direita) */}
        <TouchableOpacity
          style={styles.codeButton}
          onPress={() => router.push(`/code_editor/${id}`)}
        >
          <Feather name="code" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Estilos para o Markdown
const getMarkdownStyles = (theme, fontSize) => ({
  body: {
    color: theme.textPrimary,
    fontSize: fontSize,
    lineHeight: fontSize * 1.5,
  },
  heading1: {
    color: theme.textPrimary,
    fontSize: fontSize * 1.5,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  heading2: {
    color: theme.textPrimary,
    fontSize: fontSize * 1.3,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 6,
  },
  code_inline: {
    backgroundColor: theme.cardBackground,
    color: theme.textPrimary,
    fontFamily: 'monospace',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  code_block: {
    backgroundColor: theme.cardBackground,
    color: theme.textPrimary,
    fontFamily: 'monospace',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  fence: {
    backgroundColor: theme.cardBackground,
    color: theme.textPrimary,
    fontFamily: 'monospace',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  bullet_list: {
    marginVertical: 8,
  },
  ordered_list: {
    marginVertical: 8,
  },
  list_item: {
    marginVertical: 4,
  },
  paragraph: {
    marginVertical: 4,
  },
});

const getStyles = (theme, fontSize) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    centerContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    loadingText: {
      color: theme.textSecondary,
      fontSize: fontSize,
      marginTop: 12,
    },
    errorText: {
      color: '#ef4444',
      fontSize: fontSize * 1.1,
      textAlign: 'center',
      marginTop: 16,
      marginBottom: 20,
    },
    retryButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      marginTop: 12,
    },
    retryButtonText: {
      color: '#FFF',
      fontSize: fontSize,
      fontWeight: 'bold',
    },
    // Header
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.border || '#E0E0E0',
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTextContainer: {
      flex: 1,
      marginLeft: 12,
    },
    headerTitle: {
      color: theme.textPrimary,
      fontSize: fontSize * 1.2,
      fontWeight: 'bold',
    },
    headerSubtitle: {
      color: theme.textSecondary,
      fontSize: fontSize * 0.9,
      marginTop: 2,
    },
    headerSpacer: {
      width: 40,
    },
    // Tabs
    tabContainer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingTop: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border || '#E0E0E0',
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    activeTab: {
      borderBottomColor: theme.primary || '#4A90E2',
    },
    tabText: {
      color: theme.textSecondary,
      fontSize: fontSize,
      fontWeight: '500',
    },
    activeTabText: {
      color: theme.primary || '#4A90E2',
      fontWeight: 'bold',
    },
    // Content
    contentContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    contentContainerStyle: {
      paddingBottom: 100, // Espaço extra para o botão flutuante
    },
    contentSection: {
      paddingVertical: 20,
    },
    sectionTitle: {
      color: theme.textPrimary,
      fontSize: fontSize * 1.3,
      fontWeight: 'bold',
      marginBottom: 12,
    },
    contentText: {
      color: theme.textPrimary,
      fontSize: fontSize,
      lineHeight: fontSize * 1.5,
    },
    codeBlock: {
      backgroundColor: theme.cardBackground || '#F5F5F5',
      borderRadius: 8,
      padding: 16,
      marginTop: 8,
    },
    codeText: {
      color: theme.textPrimary,
      fontSize: fontSize * 0.9,
      fontFamily: 'monospace',
      lineHeight: fontSize * 1.4,
    },
    // Comments
    commentCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      elevation: theme.elevation,
      shadowColor: theme.shadowColor,
      shadowOpacity: theme.shadowOpacity,
      shadowRadius: 2,
      shadowOffset: { width: 0, height: 1 },
    },
    commentUser: {
      color: theme.textPrimary,
      fontSize: fontSize * 0.9,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    commentText: {
      color: theme.textPrimary,
      fontSize: fontSize,
      lineHeight: fontSize * 1.4,
    },
    emptyText: {
      color: theme.textSecondary,
      fontSize: fontSize,
      textAlign: 'center',
      marginTop: 20,
    },
    // Submissions
    submissionsContainer: {
      marginTop: 8,
    },
    emptyStateContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
      gap: 12,
    },
    emptySubtext: {
      color: theme.textSecondary,
      fontSize: fontSize * 0.85,
      textAlign: 'center',
      marginTop: 4,
      paddingHorizontal: 20,
    },
    // Floating Code Button
    codeButton: {
      position: 'absolute',
      bottom: 80, // Aumentado para evitar sobreposição com botões do Android
      right: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.primary || '#4A90E2',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 6,
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    },
  });

export default ProblemDetailScreen;
