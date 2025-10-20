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

import Icon from 'react-native-vector-icons/Feather';


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
            <Icon name="user" size={24} color="#fff" />
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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(10, 15, 33, 1)',
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
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  welcomeText: {
    color: '#aaa',
    fontSize: 16,
  },
  userNameText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10
  },
  profileIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1c1f3a',
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
    color: '#fff',
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