import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router';
import { useThemeStore } from '../../store/useThemeStore'

// Recebe props para o título, a porcentagem e o ID do exercício
const ExerciseCard = ({ id, title, percentage }) => {
  const router = useRouter();
  // Puxa o tema e o tamanho da fonte do Zustand
  const { theme, fontSize } = useThemeStore();
  const styles = getStyles(theme, fontSize);

  const handlePress = () => {
    router.push(`/problems/${id}`);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.percentage}>
          Porcentagem de acertos: {percentage}%
        </Text>
      </View>
      <Feather name="chevron-right" size={24} color={theme.textSecondary} />
    </TouchableOpacity>
  );
};

// Função que gera os estilos com base no tema e tamanho da fonte
const getStyles = (theme, fontSize) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.cardBackground,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
      // Adiciona sombra/elevação do tema
      elevation: theme.elevation,
      shadowColor: theme.shadowColor,
      shadowOpacity: theme.shadowOpacity,
      shadowRadius: 3,
      shadowOffset: { width: 0, height: 2 },
    },
    textContainer: {
        
      flex: 1, // Garante que o texto ocupe o espaço e empurre a seta
    },
    title: {
      color: theme.textPrimary,
      fontSize: fontSize, // Usa o tamanho da fonte do store
      fontWeight: '600',
    },
    percentage: {
      color: theme.textSecondary,
      fontSize: fontSize * 0.875, // Um pouco menor que o título
      marginTop: 4,
    },
  });

export default ExerciseCard;