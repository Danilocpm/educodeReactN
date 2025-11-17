import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useThemeStore } from '../../src/store/useThemeStore';

// Dados mock - substitua com dados reais de uma API/banco
const MOCK_PROBLEMS = {
  '1': {
    title: 'Exercício Fácil 1',
    difficulty: 'Fácil',
    statement: 'Escreva um programa que imprima "Hello World" na tela.',
    solution: 'console.log("Hello World");',
    comments: [
      { id: '1', user: 'João Silva', text: 'Ótimo exercício para iniciantes!' },
      { id: '2', user: 'Maria Santos', text: 'Muito didático!' },
    ],
  },
  '2': {
    title: 'Exercício Fácil 2',
    difficulty: 'Fácil',
    statement: 'Crie uma função que some dois números.',
    solution: 'function soma(a, b) { return a + b; }',
    comments: [{ id: '1', user: 'Pedro Costa', text: 'Bom para praticar funções.' }],
  },
  '3': {
    title: 'Exercício Fácil 3',
    difficulty: 'Fácil',
    statement: 'Crie um array com 5 números e exiba-o no console.',
    solution: 'const numeros = [1, 2, 3, 4, 5]; console.log(numeros);',
    comments: [],
  },
  '4': {
    title: 'Exercício Médio 1',
    difficulty: 'Médio',
    statement: 'Implemente uma função que inverta uma string.',
    solution: 'function inverter(str) { return str.split("").reverse().join(""); }',
    comments: [{ id: '1', user: 'Ana Lima', text: 'Desafio interessante!' }],
  },
  '5': {
    title: 'Exercício Médio 2',
    difficulty: 'Médio',
    statement: 'Crie uma função que verifique se um número é primo.',
    solution: 'function ehPrimo(n) { if (n < 2) return false; for (let i = 2; i <= Math.sqrt(n); i++) { if (n % i === 0) return false; } return true; }',
    comments: [],
  },
  '6': {
    title: 'Exercício Difícil 1',
    difficulty: 'Difícil',
    statement: 'Implemente o algoritmo de busca binária.',
    solution: 'function buscaBinaria(arr, alvo) { let esq = 0, dir = arr.length - 1; while (esq <= dir) { const meio = Math.floor((esq + dir) / 2); if (arr[meio] === alvo) return meio; if (arr[meio] < alvo) esq = meio + 1; else dir = meio - 1; } return -1; }',
    comments: [{ id: '1', user: 'Carlos Mendes', text: 'Algoritmo clássico!' }],
  },
};

const TAB_OPTIONS = ['Enunciado', 'Solução', 'Comentários'];

const ProblemDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { theme, fontSize } = useThemeStore();
  const styles = getStyles(theme, fontSize);

  const [activeTab, setActiveTab] = useState('Enunciado');

  // Busca o problema pelo ID
  const problem = MOCK_PROBLEMS[id] || {
    title: 'Problema não encontrado',
    difficulty: '',
    statement: 'Este problema não existe.',
    solution: '',
    comments: [],
  };

  // Renderiza o conteúdo baseado na aba ativa
  const renderContent = () => {
    switch (activeTab) {
      case 'Enunciado':
        return (
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>Enunciado</Text>
            <Text style={styles.contentText}>{problem.statement}</Text>
          </View>
        );
      case 'Solução':
        return (
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>Solução</Text>
            <View style={styles.codeBlock}>
              <Text style={styles.codeText}>{problem.solution}</Text>
            </View>
          </View>
        );
      case 'Comentários':
        return (
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>
              Comentários ({problem.comments.length})
            </Text>
            {problem.comments.length === 0 ? (
              <Text style={styles.emptyText}>
                Nenhum comentário ainda. Seja o primeiro!
              </Text>
            ) : (
              problem.comments.map((comment) => (
                <View key={comment.id} style={styles.commentCard}>
                  <Text style={styles.commentUser}>{comment.user}</Text>
                  <Text style={styles.commentText}>{comment.text}</Text>
                </View>
              ))
            )}
          </View>
        );
      default:
        return null;
    }
  };

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
            <Text style={styles.headerSubtitle}>{problem.difficulty}</Text>
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
