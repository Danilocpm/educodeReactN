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
import { Feather } from '@expo/vector-icons';
import { useThemeStore } from '../../src/store/useThemeStore'; 

// Importa os componentes
import DifficultySelector from '../../src/components/challenges/DifficultySelector';
import ExerciseCard from '../../src/components/cards/ExerciseCard';

// Dados de exemplo
const MOCK_DATA = {
  Fácil: [
    { id: '1', title: 'Exercício Fácil 1' },
    { id: '2', title: 'Exercício Fácil 2' },
    { id: '3', title: 'Exercício Fácil 3' },
  ],
  Médio: [
    { id: '4', title: 'Exercício Médio 1' },
    { id: '5', title: 'Exercício Médio 2' },
  ],
  Difícil: [{ id: '6', title: 'Exercício Difícil 1' }],
};

const ChallengesScreen = ({ navigation }) => {
  const { theme, fontSize } = useThemeStore();
  const styles = getStyles(theme, fontSize);

  // Estado para controlar a dificuldade selecionada
  const [selectedDifficulty, setSelectedDifficulty] = useState('Fácil');

  // Filtra os exercícios para exibir (no seu app, isso viria de uma API/banco)
  const exercisesToShow = MOCK_DATA[selectedDifficulty] || [];

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

          {/* Mapeia os dados de exemplo para os cards */}
          {exercisesToShow.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              id={exercise.id}
              title={exercise.title}
              percentage="00" // Você passaria o valor real aqui
            />
          ))}

          {/* Fallback caso não haja exercícios */}
          {exercisesToShow.length === 0 && (
            <Text style={styles.emptyText}>
              Nenhum exercício encontrado para esta dificuldade.
            </Text>
          )}

          {/* Adicionando placeholders como na imagem (pode remover) */}
          {selectedDifficulty === 'Fácil' && exercisesToShow.length < 6 && (
            <>
              <ExerciseCard title="Título do exercício" percentage="00" />
              <ExerciseCard title="Título do exercício" percentage="00" />
              <ExerciseCard title="Título do exercício" percentage="00" />
            </>
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
  });

export default ChallengesScreen;