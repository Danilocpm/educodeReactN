import React, { useMemo, useRef } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

const MonacoEditorWebView = ({ initialCode, languageCode, onMessage }) => {
  const webViewRef = useRef(null);

  const monacoHTML = useMemo(() => {
    // Usando a versão 0.33.0 que é mais estável para mobile
    const MONACO_VERSION = '0.33.0';
    const editorLanguage = languageCode || 'python';
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <style>
        body, html {
          margin: 0; padding: 0; height: 100%; width: 100%;
          overflow: hidden; background-color: #1e1e1e;
        }
        #container { width: 100%; height: 100%; position: absolute; top: 0; left: 0; }
        
        /* TRUQUE CSS PARA ANDROID: Forçar visibilidade do textarea */
        .monaco-editor textarea {
            opacity: 0.01 !important;
            height: 10px !important;
            width: 10px !important;
            z-index: 999999 !important;
            position: absolute !important;
            display: block !important;
        }
      </style>
    </head>
    <body>
      <div id="container"></div>
      
      <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/${MONACO_VERSION}/min/vs/loader.min.js"></script>
      <script>
        require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/${MONACO_VERSION}/min/vs' }});
        
        require(['vs/editor/editor.main'], function() {
          var editor = monaco.editor.create(document.getElementById('container'), {
            value: ${JSON.stringify(initialCode)},
            language: '${editorLanguage}',
            theme: 'modern-dark',
            automaticLayout: true,
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
            fontSize: 14,
            minimap: { enabled: false },
            lineNumbers: 'on',
            contextmenu: false,
            renderLineHighlight: 'all',
            accessibilitySupport: 'off', // MANTENHA OFF NO ANDROID
            scrollbar: {
                vertical: 'visible',
                horizontal: 'visible',
                useShadows: false
            }
          });

          // --- FORÇAR TECLADO AO TOCAR ---
          // Esta função busca o textarea e força o clique nele
          function triggerFocus() {
             var textArea = document.querySelector('.monaco-editor textarea');
             if (textArea) {
                 textArea.focus();
                 textArea.click();
             } else {
                 editor.focus();
             }
          }

          // Listener agressivo para qualquer toque
          document.getElementById('container').addEventListener('click', function() {
              triggerFocus();
          });
          
          document.getElementById('container').addEventListener('touchstart', function(e) {
              // Pequeno delay ajuda o Android a processar o toque
              setTimeout(triggerFocus, 50);
          }, { passive: true });

          // Listener de pressionar (long press)
          document.addEventListener('contextmenu', function(e) {
              e.preventDefault();
              triggerFocus();
          }, false);

          // Comunicação
          editor.onDidChangeModelContent(function() {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'codeChange',
              code: editor.getValue()
            }));
          });
          
          // Foco inicial
          setTimeout(triggerFocus, 1000);
        });
      </script>
    </body>
    </html>
  `;
  }, [initialCode, languageCode]);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        style={styles.webview}
        originWhitelist={['*']}
        source={{ html: monacoHTML }}
        onMessage={onMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        
        // --- PROPS CRÍTICAS DO ANDROID ---
        keyboardDisplayRequiresUserAction={false}
        // Desativa a barra extra do teclado que as vezes buga o layout
        hideKeyboardAccessoryView={true} 
        // Permite interação de texto nativa (ajuda a detectar inputs)
        textInteractionEnabled={true}
        // Evita comportamentos estranhos de zoom
        scalesPageToFit={false}
        // Desliga o scroll nativo da WebView
        scrollEnabled={false}
        overScrollMode="never"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  webview: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    opacity: 0.99,
  },
});

export default MonacoEditorWebView;