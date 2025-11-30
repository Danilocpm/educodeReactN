import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as NavigationBar from 'expo-navigation-bar';
import { useProblemStore } from '../../src/store/useProblemStore';
import { useLanguageStore } from '../../src/store/useLanguageStore';
import { useProblemStarter } from '../../src/services/useProblemStarters';

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

  // HTML com Monaco Editor embutido - useMemo recria APENAS quando languageCode muda
  const monacoHTML = useMemo(() => {
    // Define a linguagem do Monaco (fallback para javascript se não definido)
    const editorLanguage = languageCode || 'javascript';
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <style>
        body, html {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow: hidden;
        }
        #container {
          width: 100%;
          height: 100%;
        }
      </style>
    </head>
    <body>
      <div id="container"></div>
      
      <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.min.js"></script>
      <script>
        require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' }});
        
        require(['vs/editor/editor.main'], function() {
          const editor = monaco.editor.create(document.getElementById('container'), {
            value: ${JSON.stringify(initialCode)},
            language: '${editorLanguage}',
            theme: 'vs-dark',
            automaticLayout: true,
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible'
            },
            // Opções para melhorar a experiência mobile
            wordWrap: 'on',
            wrappingIndent: 'indent',
            quickSuggestions: false,
            parameterHints: { enabled: false },
            suggestOnTriggerCharacters: false,
            acceptSuggestionOnEnter: 'off',
            tabCompletion: 'off',
            wordBasedSuggestions: false
          });

          // Focar no editor ao carregar para abrir o teclado
          setTimeout(() => {
            editor.focus();
          }, 100);

          // Adicionar evento de clique para garantir que o teclado abra
          document.getElementById('container').addEventListener('click', () => {
            editor.focus();
          });

          // Enviar código atualizado para o React Native
          editor.onDidChangeModelContent(() => {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'codeChange',
              code: editor.getValue()
            }));
          });
        });
      </script>
    </body>
    </html>
  `;
  }, [initialCode, languageCode]); // Recria apenas quando initialCode (carregamento inicial) ou languageCode mudam

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
        <View style={[styles.container, styles.centerContainer]}>
          <ActivityIndicator size="large" color="#007aff" />
          <Text style={styles.loadingText}>Carregando código inicial...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  // Verifica se a linguagem foi selecionada
  if (!languageId || !languageCode) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#0A0F21" />
        <View style={[styles.container, styles.centerContainer]}>
          <Feather name="alert-circle" size={48} color="#FFA500" style={{ marginBottom: 16 }} />
          <Text style={styles.warningText}>Nenhuma linguagem selecionada</Text>
          <Text style={styles.warningSubtext}>
            Por favor, selecione uma linguagem de programação nas configurações.
          </Text>
          <TouchableOpacity style={styles.backButtonStyled} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0F21" />
      <View style={styles.container}>
        {/* Header com botões de ação */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Editor de Código</Text>

          <TouchableOpacity
            style={styles.runButton}
            onPress={handleRunCode}
          >
            <Feather name="play" size={20} color="#FFF" />
            <Text style={styles.runButtonText}>Executar</Text>
          </TouchableOpacity>
        </View>

        {/* Monaco Editor via WebView */}
        <WebView
          style={styles.webview}
          originWhitelist={['*']}
          source={{ html: monacoHTML }}
          onMessage={handleMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          keyboardDisplayRequiresUserAction={false}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: '#0A0F21',
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  runButton: {
    backgroundColor: '#007aff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  runButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  webview: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 12,
  },
  warningText: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  warningSubtext: {
    color: '#CCC',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  backButtonStyled: {
    backgroundColor: '#007aff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CodeEditorScreen;