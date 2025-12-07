import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useThemeStore } from '../../store/useThemeStore';
import { useProblemById } from '../../services/useProblems';

const ContinueCard = ({ problemId, languageId }) => {
  const { theme, fontSize } = useThemeStore();
  const router = useRouter();
  const styles = getStyles(theme, fontSize);
  
  // Busca os dados do problema se houver problemId
  const { data: problem, isLoading } = useProblemById(problemId, {
    enabled: !!problemId,
  });

  // Define se há um problema salvo ou usa o template padrão
  const hasProblem = problemId && problem;
  const displayTitle = hasProblem ? problem.title : 'Comece um Exercício';
  const displaySubtitle = hasProblem 
    ? 'Deseja continuar fazendo?' 
    : 'Escolha um exercício para começar a praticar';

  const handlePress = () => {
    if (hasProblem) {
      router.push(`/problems/${problemId}`);
    } else {
      // Navega para a aba de exercícios
      router.push('/(tabs)/challenges');
    }
  };
  
  // Mostra loading apenas se está carregando E tem problemId
  if (isLoading && problemId) {
    return (
      <View style={styles.continueCardContainer}>
        <ActivityIndicator size="small" color={theme.primary} />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.continueCardContainer}>
      <View style={styles.continueLeft}>
        <Feather 
          name={hasProblem ? "cloud" : "book-open"} 
          size={40} 
          color={theme.primary} 
        />
        <View style={styles.continueTextContainer}>
          <Text style={styles.continueSubtitle}>{displayTitle}</Text>
          <Text style={styles.continueTitle}>{displaySubtitle}</Text>        
        </View>
      </View>
      <TouchableOpacity style={styles.blueCircleButton} onPress={handlePress}>
        <MaterialCommunityIcons name="chevron-double-right" size={28} color={theme.primaryText} />
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (theme, baseFontSize) => StyleSheet.create({
  continueCardContainer: {
    backgroundColor: theme.cardBackground,
    borderRadius: 20,
    padding: 36,
    marginHorizontal: 10,
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.borderColor,
  },
  continueLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  continueTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  continueTitle: {
    color: theme.textSecondary,
    fontSize: baseFontSize - 2,
    marginTop: 2
  },
  continueSubtitle: {
    color: theme.textPrimary,
    fontSize: baseFontSize,
    fontWeight: 'bold',
  },
  blueCircleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
  loadingText: {
    color: theme.textSecondary,
    fontSize: baseFontSize,
    marginLeft: 12,
  },
});

export default ContinueCard;