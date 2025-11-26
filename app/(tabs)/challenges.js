import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useThemeStore } from '../../src/store/useThemeStore'; 

// Importa os componentes
import DifficultySelector from '../../src/components/challenges/DifficultySelector';
import ExerciseCard from '../../src/components/cards/ExerciseCard';

// Importa os hooks de dados
import { useProblemsByDifficulty } from '../../src/services/useProblems';

// Mapeamento entre o texto em português (UI) e o valor do banco (enum)
const DIFFICULTY_MAP = {
  'Fácil': 'easy',
  'Médio': 'medium',
  'Difícil': 'hard',
};

const ChallengesScreen = ({ navigation }) => {
  const { theme, fontSize } = useThemeStore();
  const styles = getStyles(theme, fontSize);

  // Estado para controlar a dificuldade selecionada (UI em português)
  const [selectedDifficulty, setSelectedDifficulty] = useState('Fácil');

  // Converte a dificuldade em português para o valor do banco
  const difficultyValue = DIFFICULTY_MAP[selectedDifficulty];

  // Busca os problemas do banco usando TanStack Query
  const { data: problems = [], isLoading, error } = useProblemsByDifficulty(difficultyValue);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={theme.statusBar}
        backgroundColor={theme.background}
      />
      <View style={styles.container}>
        {/* 1. Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Exercícios</Text>
        </View>

        {/* 2. Seletor de Dificuldade */}
        <DifficultySelector
          selectedKey={selectedDifficulty}
          onSelect={setSelectedDifficulty}
        />

        {/* 3. Título da Dificuldade e Lista */}
        <ScrollView
          style={styles.listContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.difficultyTitle}>{selectedDifficulty}</Text>

          {/* Estado de carregamento */}
          {isLoading && (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={styles.loadingText}>Carregando exercícios...</Text>
            </View>
          )}

          {/* Estado de erro */}
          {error && (
            <View style={styles.centerContainer}>
              <Text style={styles.errorText}>
                Erro ao carregar exercícios: {error.message}
              </Text>
            </View>
          )}

          {/* Lista de exercícios do banco de dados */}
          {!isLoading && !error && problems.map((problem) => (
            <ExerciseCard
              key={problem.id}
              id={problem.id}
              title={problem.title}
              percentage="00" // Taxa de acerto será implementada futuramente
            />
          ))}

          {/* Fallback caso não haja exercícios */}
          {!isLoading && !error && problems.length === 0 && (
            <Text style={styles.emptyText}>
              Nenhum exercício encontrado para esta dificuldade.
            </Text>
          )}
        </ScrollView>
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
      marginTop: 12,
      flex: 1,
    },
    // Header
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 15,
    },
    headerTitle: {
      color: theme.textPrimary,
      fontSize: fontSize * 1.4, // 1.4x o tamanho base
      fontWeight: 'bold',
    },
    profileIconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.cardBackground,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: theme.elevation,
    },
    // Lista
    listContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    difficultyTitle: {
      color: theme.textPrimary,
      fontSize: fontSize * 1.5, // 1.5x o tamanho base
      fontWeight: 'bold',
      marginBottom: 16,
    },
    emptyText: {
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: 40,
      fontSize: fontSize,
    },
    centerContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
    },
    loadingText: {
      color: theme.textSecondary,
      marginTop: 12,
      fontSize: fontSize,
    },
    errorText: {
      color: '#ef4444', // Cor vermelha para erro
      textAlign: 'center',
      fontSize: fontSize,
      paddingHorizontal: 20,
    },
  });

export default ChallengesScreen;