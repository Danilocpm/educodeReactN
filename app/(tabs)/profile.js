// app/(tabs)/profile.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Stack } from 'expo-router';
// 1. Importando o seu store oficial
import { useThemeStore } from '../../src/store/useThemeStore';
import { Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// --- Constantes de Mock e Cores ---
const ACTIVE_BLUE = '#3b82f6';
const PROGRESS_WHITE = '#f0f2f5';

const calendarData = [
  [1, 1, 1, 0, 1, 1, 0],
  [1, 1, 1, 0, 1, 0, 0],
  [1, 0, 0, 1, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 0],
];

// --- Componentes da Tela ---

// Cabeçalho
const Header = ({ theme, fontSize }) => {
  // 2. Passando 'fontSize' para os estilos
  const styles = getStyles(theme, fontSize);
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Meu Perfil</Text>
      <Feather name="shield" size={28} color={theme.iconColor} />
    </View>
  );
};

// Seção de "Clima" (Estatísticas)
const WeatherStats = ({ theme, fontSize }) => {
  const styles = getStyles(theme, fontSize);
  return (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Feather name="cloud" size={24} color={ACTIVE_BLUE} />
        <Text style={styles.statText}>12/25</Text>
      </View>
      <View style={styles.statItem}>
        <Feather name="cloud-drizzle" size={24} color={ACTIVE_BLUE} />
        <Text style={styles.statText}>12/25</Text>
      </View>
      <View style={styles.statItem}>
        <Feather name="cloud-lightning" size={24} color={ACTIVE_BLUE} />
        <Text style={styles.statText}>12/25</Text>
      </View>
    </View>
  );
};

// Barra de Progresso customizada
const ProgressBar = ({ label, progress, color, theme, fontSize }) => {
  const styles = getStyles(theme, fontSize);
  return (
    <View style={styles.progressRow}>
      <View style={styles.progressBarTrack}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${progress * 100}%`, backgroundColor: color },
          ]}
        />
      </View>
      <Text style={styles.progressLabel}>{label}</Text>
    </View>
  );
};

// Seção de Progresso de Exercícios
const ExerciseProgress = ({ theme, fontSize }) => {
  const styles = getStyles(theme, fontSize);
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Exercícios Feitos</Text>
      <ProgressBar
        label="52%"
        progress={0.52}
        color={ACTIVE_BLUE}
        theme={theme}
        fontSize={fontSize}
      />
      <ProgressBar
        label="52%"
        progress={0.52}
        color={ACTIVE_BLUE}
        theme={theme}
        fontSize={fontSize}
      />
      <ProgressBar
        label="64%"
        progress={0.64}
        color={ACTIVE_BLUE}
        theme={theme}
        fontSize={fontSize}
      />
    </View>
  );
};

// Seção do Calendário
const ActivityCalendar = ({ theme, fontSize }) => {
  const styles = getStyles(theme, fontSize);
  const days = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Mês Atual</Text>
      {/* Cabeçalho do Calendário */}
      <View style={styles.calendarHeader}>
        {days.map((day, index) => (
          <Text key={index} style={styles.calendarDayHeader}>
            {day}
          </Text>
        ))}
      </View>
      {/* Grid do Calendário */}
      <View style={styles.calendarGrid}>
        {calendarData.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.calendarWeek}>
            {week.map((day, dayIndex) => (
              <View
                key={dayIndex}
                style={[
                  styles.calendarDay,
                  day === 1 && styles.calendarDayActive,
                ]}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

// --- Componente Principal da Página ---
export default function ProfileScreen() {
  // 3. Obtendo 'theme' e 'fontSize' do seu store
  const { theme, fontSize, isDark } = useThemeStore();
  
  // 4. Passando ambos para a função de estilos
  const styles = getStyles(theme, fontSize);

  return (
    // Usamos 'theme.background' do seu store
    <SafeAreaView style={styles.safeArea}>
      {/* Usamos 'theme.statusBar' (ou 'isDark') do seu store */}
      <StatusBar style={isDark ? 'light-content' : 'dark-content'} />

      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* 5. Passando 'theme' e 'fontSize' para os componentes filhos */}
        <Header theme={theme} fontSize={fontSize} />
        <WeatherStats theme={theme} fontSize={fontSize} />
        <ExerciseProgress theme={theme} fontSize={fontSize} />
        <ActivityCalendar theme={theme} fontSize={fontSize} />
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Estilos Dinâmicos ---
// 6. A função 'getStyles' agora aceita 'baseFontSize'
const getStyles = (theme, baseFontSize) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    container: {
      flexGrow: 1,
      padding: 24,
    },
    // Header
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    headerTitle: {
      color: theme.textPrimary,
      // Fonte de display (título principal) calculada relativa ao tamanho base
      fontSize: baseFontSize * 2 + 2, // Ex: 16 -> 34
      fontWeight: '900',
      letterSpacing: 2,
    },
    // Stats (Weather)
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 30,
    },
    statItem: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    statText: {
      color: theme.textSecondary,
      // Fonte relativa
      fontSize: baseFontSize - 2, // Ex: 16 -> 14
      marginLeft: 8,
    },
    // Container de Seção
    sectionContainer: {
      marginBottom: 30,
    },
    sectionTitle: {
      color: theme.textPrimary,
      // Fonte relativa
      fontSize: baseFontSize + 4, // Ex: 16 -> 20
      fontWeight: '600',
      marginBottom: 20,
    },
    // Progress
    progressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    progressBarTrack: {
      flex: 1,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.cardBackground,
      marginRight: 12,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      borderRadius: 4,
    },
    progressLabel: {
      color: theme.textSecondary,
      // Fonte relativa
      fontSize: baseFontSize - 4, // Ex: 16 -> 12
      fontWeight: '600',
      minWidth: 35,
      textAlign: 'right',
    },
    // Calendar
    calendarHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    calendarDayHeader: {
      color: theme.textSecondary,
      // Fonte relativa
      fontSize: baseFontSize - 2, // Ex: 16 -> 14
      fontWeight: '500',
      width: 40,
      textAlign: 'center',
    },
    calendarGrid: {},
    calendarWeek: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    calendarDay: {
      width: 40,
      height: 40,
      borderRadius: 8,
      backgroundColor: theme.cardBackground,
    },
    calendarDayActive: {
      backgroundColor: ACTIVE_BLUE,
    },
  });