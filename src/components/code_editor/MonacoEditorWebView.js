import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const MonacoEditorWebView = ({ initialCode, languageCode, onMessage }) => {
  // HTML com Monaco Editor embutido
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
  }, [initialCode, languageCode]);

  return (
    <WebView
      style={styles.webview}
      originWhitelist={['*']}
      source={{ html: monacoHTML }}
      onMessage={onMessage}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState={true}
      keyboardDisplayRequiresUserAction={false}
      allowsInlineMediaPlayback={true}
      mediaPlaybackRequiresUserAction={false}
    />
  );
};

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
});

export default MonacoEditorWebView;
