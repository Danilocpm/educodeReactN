import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as NavigationBar from 'expo-navigation-bar';
import { useProblemStore } from '../../src/store/useProblemStore';
import { useLanguageStore } from '../../src/store/useLanguageStore';
import { useProblemStarter } from '../../src/services/useProblemStarters';
import CodeEditorHeader from '../../src/components/code_editor/CodeEditorHeader';
import MonacoEditorWebView from '../../src/components/code_editor/MonacoEditorWebView';
import EditorLoadingState from '../../src/components/code_editor/EditorLoadingState';
import NoLanguageWarning from '../../src/components/code_editor/NoLanguageWarning';

const CodeEditorScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  // Zustand stores
  const { currentProblem } = useProblemStore();
  const { languageId, languageCode } = useLanguageStore();
  
  // Busca o starter code do problema
  const { data: starterData, isLoading: starterLoading, error: starterError } = useProblemStarter(id, languageId);
  
  const [initialCode, setInitialCode] = useState('');
  const codeRef = useRef('');
  
  // Atualiza o código inicial quando o starter code é carregado (apenas uma vez)
  useEffect(() => {
    if (starterData?.starter_code) {
      setInitialCode(starterData.starter_code);
      codeRef.current = starterData.starter_code;
    } else if (starterData && !starterData.starter_code) {
      // Fallback para código padrão quando não há starter code
      const defaultCode = '// Escreva seu código aqui\nfunction solucao() {\n  \n}\n';
      setInitialCode(defaultCode);
      codeRef.current = defaultCode;
    }
  }, [starterData]);
  
  // Configura orientação e oculta navigation bar quando o componente montar
  useEffect(() => {
    const setupScreen = async () => {
      // Permite todas as orientações
      await ScreenOrientation.unlockAsync();
      
      // Oculta a navigation bar no Android
      if (Platform.OS === 'android') {
        await NavigationBar.setVisibilityAsync('hidden');
        await NavigationBar.setBehaviorAsync('overlay-swipe');
      }
    };
    
    setupScreen();
    
    // Quando o componente desmontar, restaura configurações
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      
      if (Platform.OS === 'android') {
        NavigationBar.setVisibilityAsync('visible');
      }
    };
  }, []);

  const handleRunCode = () => {
    console.log('Executando código do problema ID:', id);
    console.log('Código:', codeRef.current);
    
    Alert.alert(
      'Código Executado',
      'A funcionalidade de execução será implementada em breve!',
      [{ text: 'OK' }]
    );
  };

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'codeChange') {
        codeRef.current = data.code;
        // Não chama setCode para não causar re-render
      }
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
    }
  };
  
  // Estado de carregamento
  if (starterLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#0A0F21" />
        <EditorLoadingState />
      </SafeAreaView>
    );
  }
  
  // Verifica se a linguagem foi selecionada
  if (!languageId || !languageCode) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#0A0F21" />
        <NoLanguageWarning onBack={() => router.back()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0F21" />
      <View style={styles.container}>
        <CodeEditorHeader 
          onBack={() => router.back()} 
          onRun={handleRunCode}
        />

        <MonacoEditorWebView
          initialCode={initialCode}
          languageCode={languageCode}
          onMessage={handleMessage}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0F21',
  },
  container: {
    flex: 1,
    backgroundColor: '#0A0F21',
  },
});

export default CodeEditorScreen;