import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

const CodeEditorScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [code, setCode] = useState('// Escreva seu código aqui\nfunction solucao() {\n  \n}\n');
  const codeRef = useRef(code);

  const handleRunCode = () => {
    console.log('Executando código do problema ID:', id);
    console.log('Código:', codeRef.current);
    
    Alert.alert(
      'Código Executado',
      'A funcionalidade de execução será implementada em breve!',
      [{ text: 'OK' }]
    );
  };

  // HTML com Monaco Editor embutido - useMemo para evitar recriar o HTML
  const monacoHTML = useMemo(() => `
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
            value: ${JSON.stringify(code)},
            language: 'javascript',
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
          }, 500);

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
  `, []); // Array vazio para criar apenas uma vez

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'codeChange') {
        codeRef.current = data.code;
        setCode(data.code);
      }
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
    }
  };

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
});

export default CodeEditorScreen;