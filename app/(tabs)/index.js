import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  ScrollView,
  FlatList,
  Text,
  View, 
  TouchableOpacity, 
} from 'react-native';

import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router';
import { useThemeStore } from '../../src/store/useThemeStore';
import { useProblemStore } from '../../src/store/useProblemStore';
import { useEasyProblems } from '../../src/services/useProblems';

import ChallengeCard from '../../src/components/cards/ChallengeCard';
import PracticeCard from '../../src/components/cards/PractiseCard';
import ContinueCard from '../../src/components/cards/ContinueCard';
import NavigationCard from '../../src/components/cards/NavigationCard';

const navigationData = [
  {
    id: '1',
    title: 'Exercícios',
    icon: 'book',
    route: '/(tabs)/challenges',
  },
  {
    id: '2',
    title: 'Perfil',
    icon: 'user',
    route: '/(tabs)/profile',
  },
  {
    id: '3',
    title: 'Configurações',
    icon: 'settings',
    route: '/(tabs)/settings',
  },
];

// --- Tela Principal ---

const App = () => {
  const { theme, fontSize, isDark } = useThemeStore();
  const { lastProblemCode } = useProblemStore();
  const { data: problems = [], isLoading } = useEasyProblems();
  const router = useRouter();
  
  const styles = React.useMemo(() => getStyles(theme, fontSize), [theme, fontSize]);
  
  // Get first 2 problems for challenge carousel
  const challengeProblems = problems.slice(0, 2);
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
        translucent={false}
        hidden={true}
      />
      
      <ScrollView contentContainerStyle={styles.contentContainer}>
        
        {/* --- Header Inserido Diretamente --- */}
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.welcomeText}>Bem Vindo</Text>
            <Text style={styles.userNameText}>Seu Nome Aqui</Text>
          </View>
          <TouchableOpacity style={styles.profileIcon}>
            <Feather name="user" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        {/* --- Fim do Header --- */}


        {/* 2. Carrossel de Desafio */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Carregando desafios...</Text>
          </View>
        ) : challengeProblems.length > 0 ? (
          <FlatList
            data={challengeProblems}
            renderItem={({ item }) => <ChallengeCard problem={item} />}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.challengeCarousel}
          />
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Nenhum desafio disponível</Text>
          </View>
        )}

        {/* 3. Seção de Navegação */}
        <Text style={styles.sectionTitle}>Navegação</Text>
        <FlatList
          data={navigationData}
          renderItem={({ item }) => <NavigationCard item={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.practiceCarousel}
        />

        {/* 4. Card de "Continuar" */}
        <ContinueCard 
          problemId={lastProblemCode?.problemId}
          languageId={lastProblemCode?.languageId}
        />

      </ScrollView>
    </SafeAreaView>
  );
};

// --- Estilos ---
const getStyles = (theme, baseFontSize) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  contentContainer: {
    paddingVertical: 20,
  },

  // --- Estilos do Header ---
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderColor,
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme.shadowOpacity,
    shadowRadius: 3,
    elevation: theme.elevation,
  },
  welcomeText: {
    color: theme.textSecondary,
    fontSize: baseFontSize,
  },
  userNameText: {
    color: theme.textPrimary,
    fontSize: baseFontSize * 1.375, // 22 at medium (16)
    fontWeight: 'bold',
    marginBottom: 10
  },
  profileIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10
  },
  // --- Fim dos Estilos do Header ---

  challengeCarousel: {
    marginTop: 10,
    marginBottom: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    marginHorizontal: 20,
  },
  loadingText: {
    color: theme.textSecondary,
    fontSize: baseFontSize,
  },
  sectionTitle: {
    color: theme.textPrimary,
    fontSize: baseFontSize * 1.25, // 20 at medium (16)
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  practiceCarousel: {
    paddingLeft: 20,
    marginBottom: 20,
  },
});

export default App;