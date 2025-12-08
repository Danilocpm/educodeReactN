import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Platform,
  ActivityIndicator,
  Text,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as NavigationBar from 'expo-navigation-bar';
import { useProblemStore } from '../../src/store/useProblemStore';
import { useLanguageStore } from '../../src/store/useLanguageStore';
import { useProblemStarter } from '../../src/services/useProblemStarters';
import { useProblemOutputs } from '../../src/services/useProblemOutputs';
import { useSubmitCode } from '../../src/services/useJudge0';
import { useSaveSubmission } from '../../src/services/useSubmissions';
import { formatCodeForJudge0 } from '../../src/utils/codeFormatter';
import CodeEditorHeader from '../../src/components/code_editor/CodeEditorHeader';
import MonacoEditorWebView from '../../src/components/code_editor/MonacoEditorWebView';
import EditorLoadingState from '../../src/components/code_editor/EditorLoadingState';
import NoLanguageWarning from '../../src/components/code_editor/NoLanguageWarning';
import TestResultsModal from '../../src/components/code_editor/TestResultsModal';

const CodeEditorScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  // Zustand stores
  const { currentProblem, getCode, setCode } = useProblemStore();
  const { languageId, languageCode } = useLanguageStore();
  
  // Busca o starter code do problema
  const { data: starterData, isLoading: starterLoading, error: starterError } = useProblemStarter(id, languageId);
  
  // Busca os test cases do problema
  const { data: testCases, isLoading: testCasesLoading } = useProblemOutputs(id, languageId);
  
  // Save submission mutation
  const saveSubmission = useSaveSubmission();
  
  // Judge0 submission mutation
  const submitCode = useSubmitCode({
    onSuccess: async (results, variables) => {
      // Save submission to database after successful execution
      try {
        // Calculate average execution time and memory from test results
        const avgTime = results.results.reduce((sum, r) => sum + (parseFloat(r.time) || 0), 0) / results.results.length;
        const avgMemory = results.results.reduce((sum, r) => sum + (parseFloat(r.memory) || 0), 0) / results.results.length;
        
        // Get the original code (not base64 encoded)
        const currentCode = getCode(id, languageId);
        
        await saveSubmission.mutateAsync({
          problemId: parseInt(id),
          languageId: languageId,
          code: currentCode,
          status: `${results.passedTests}/${results.totalTests} testes`,
          passedTests: results.passedTests,
          totalTests: results.totalTests,
          executionTime: avgTime.toFixed(2),
          memoryUsed: avgMemory.toFixed(2),
          testResults: JSON.stringify(results.results),
        });
        
        console.log('Submission saved successfully');
      } catch (error) {
        console.error('Error saving submission:', error);
        // Don't throw - we still want to show results even if save fails
      }
    },
  });
  
  const [initialCode, setInitialCode] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [testResults, setTestResults] = useState(null);
  
  // Atualiza o código inicial quando o starter code é carregado
  // Prioridade: código salvo na store > starter code > código padrão
  useEffect(() => {
    if (!languageId) return;
    
    // Tenta buscar código salvo na store
    const savedCode = getCode(id, languageId);
    
    if (savedCode) {
      // Usa código salvo se existir
      setInitialCode(savedCode);
    } else if (starterData?.starter_code) {
      // Usa starter code do banco se não houver código salvo
      setInitialCode(starterData.starter_code);
    } else if (starterData && !starterData.starter_code) {
      // Fallback para código padrão quando não há starter code
      const defaultCode = '// Escreva seu código aqui\nfunction solucao() {\n  \n}\n';
      setInitialCode(defaultCode);
    }
  }, [starterData, id, languageId, getCode]);
  
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

  const handleRunCode = async () => {
    // 1. Validações
    const currentCode = getCode(id, languageId);
    
    if (!currentCode || currentCode.trim() === '') {
      Alert.alert('Erro', 'Nenhum código encontrado. Por favor, escreva seu código primeiro.');
      return;
    }
    
    if (!languageCode) {
      Alert.alert('Erro', 'Nenhuma linguagem selecionada. Por favor, selecione uma linguagem nas configurações.');
      return;
    }
    
    if (!testCases || testCases.length === 0) {
      Alert.alert('Erro', 'Nenhum teste disponível para este problema.');
      return;
    }
    
    try {
      // 2. Formatar código para Judge0
      const formattedData = formatCodeForJudge0({
        languageCode,
        userCode: currentCode,
        testCases,
      });
      
      console.log(`Executando ${formattedData.totalTests} testes...`);
      
      // 3. Submeter para Judge0 e aguardar resultados (onSuccess callback will save to DB)
      const results = await submitCode.mutateAsync({
        submissions: formattedData.submissions,
        testCases,
      });
      
      // 4. Mostrar resultados
      setTestResults(results);
      setShowResults(true);
      
    } catch (error) {
      console.error('Erro ao executar código:', error);
      Alert.alert(
        'Erro na Execução',
        error.message || 'Ocorreu um erro ao executar o código. Tente novamente.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'codeChange') {
        // Salva código na store para persistência
        setCode(id, languageId, data.code);
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
        
        {/* Loading Overlay */}
        {submitCode.isPending && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007aff" />
              <Text style={styles.loadingText}>Executando código...</Text>
            </View>
          </View>
        )}
        
        {/* Test Results Modal */}
        <TestResultsModal
          visible={showResults}
          onClose={() => setShowResults(false)}
          results={testResults}
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingContainer: {
    backgroundColor: '#1a1d2e',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    minWidth: 200,
  },
  loadingText: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 16,
    fontWeight: '600',
  },
});

export default CodeEditorScreen;