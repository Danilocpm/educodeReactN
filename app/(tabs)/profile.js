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
import { useThemeStore } from '../../src/store/useThemeStore';
import { Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import ProgressStats from '../../src/components/profile/ProgressStats';
import ExerciseProgress from '../../src/components/profile/ExerciseProgress';
import ActivityCalendar from '../../src/components/profile/ActivityCalendar';

// --- Componente de Cabeçalho ---
const Header = ({ theme, fontSize }) => {
  const styles = getStyles(theme, fontSize);
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Meu Perfil</Text>
      <Feather name="shield" size={28} color={theme.iconColor} />
    </View>
  );
};

// --- Componente Principal da Página ---
export default function ProfileScreen() {
  const { theme, fontSize, isDark } = useThemeStore();
  const styles = getStyles(theme, fontSize);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style={isDark ? 'light-content' : 'dark-content'} />

      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Header theme={theme} fontSize={fontSize} />
        <ProgressStats />
        <ExerciseProgress />
        <ActivityCalendar />
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Estilos Dinâmicos ---
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
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    headerTitle: {
      color: theme.textPrimary,
      fontSize: baseFontSize * 2 + 2,
      fontWeight: '900',
      letterSpacing: 2,
    },
  });