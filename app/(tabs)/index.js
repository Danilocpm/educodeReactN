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
import { useThemeStore } from '../../src/store/useThemeStore';


import ChallengeCard from '../../src/components/cards/ChallengeCard';
import PracticeCard from '../../src/components/cards/PractiseCard';
import ContinueCard from '../../src/components/cards/ContinueCard';

const challengeData = [
  {
    id: '1',
    title: 'Desafio de Hoje',
    subtitle: 'Porcentagem de acerto: 00%',
  },
  {
    id: '2',
    title: 'Desafio de Ontem',
    subtitle: 'Porcentagem de acerto: 80%',
  },
];

const practiceData = [
  {
    id: '1',
    title: 'Pratique',
    icon: 'code',
  },
  {
    id: '2',
    title: 'Pratique',
    icon: 'code',
  },
  {
    id: '3',
    title: 'Revisar',
    icon: 'refresh-cw',
  },
];

// --- Tela Principal ---

const App = () => {
  const { theme } = useThemeStore();
  const styles = React.useMemo(() => getStyles(theme), [theme]);
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
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
        <FlatList
          data={challengeData}
          renderItem={({ item }) => <ChallengeCard item={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.challengeCarousel}
        />

        {/* 3. Seção de Navegação */}
        <Text style={styles.sectionTitle}>Navegação</Text>
        <FlatList
          data={practiceData}
          renderItem={({ item }) => <PracticeCard item={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.practiceCarousel}
        />

        {/* 4. Card de "Continuar" */}
        <ContinueCard title="Título do Exercício" />

      </ScrollView>
    </SafeAreaView>
  );
};

// --- Estilos ---
const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background, // <--- Exemplo de uso do tema
  },
  contentContainer: {
    paddingVertical: 20,
  },

  // --- Estilos do Header (copiados para cá) ---
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderColor, // Usa o tema
    shadowColor: theme.shadowColor, // Usa o tema
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  welcomeText: {
    color: theme.textSecondary, // Usa o tema
    fontSize: 16,
  },
  userNameText: {
    color: theme.textPrimary, // Usa o tema
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10
  },
  profileIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.cardBackground, // Usa o tema
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
  sectionTitle: {
    color: theme.textPrimary, // Usa o tema
    fontSize: 20,
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