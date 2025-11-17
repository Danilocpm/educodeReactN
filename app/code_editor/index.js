import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useThemeStore } from '../../src/store/useThemeStore';

const CodeEditorScreen = () => {
  const router = useRouter();
  const { problemId } = useLocalSearchParams();
  const { theme, fontSize } = useThemeStore();
  const styles = getStyles(theme, fontSize);

  const [code, setCode] = useState('// Escreva seu código aqui\n');

  const handleRunCode = () => {
    // Aqui você implementaria a lógica para executar o código
    console.log('Executando código:', code);
    alert('Funcionalidade de execução será implementada em breve!');
  };

  const handleSubmit = () => {
    // Aqui você implementaria a lógica para submeter a solução
    console.log('Submetendo código:', code);
    alert('Funcionalidade de submissão será implementada em breve!');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.background} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editor de Código</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Code Editor */}
        <View style={styles.editorContainer}>
          <View style={styles.editorHeader}>
            <Text style={styles.editorHeaderText}>Seu Código</Text>
            <View style={styles.editorActions}>
              <TouchableOpacity style={styles.editorActionButton}>
                <Feather name="copy" size={18} color={theme.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.editorActionButton}>
                <Feather name="settings" size={18} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.codeScrollView} nestedScrollEnabled>
            <TextInput
              style={styles.codeInput}
              multiline
              value={code}
              onChangeText={setCode}
              placeholder="Digite seu código aqui..."
              placeholderTextColor={theme.textSecondary}
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
            />
          </ScrollView>
        </View>

        {/* Output Section */}
        <View style={styles.outputContainer}>
          <Text style={styles.outputTitle}>Saída</Text>
          <ScrollView style={styles.outputScrollView}>
            <Text style={styles.outputText}>
              A saída do código aparecerá aqui após a execução...
            </Text>
          </ScrollView>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.runButton]}
            onPress={handleRunCode}
          >
            <Feather name="play" size={20} color="#FFF" />
            <Text style={styles.actionButtonText}>Executar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.submitButton]}
            onPress={handleSubmit}
          >
            <Feather name="check" size={20} color="#FFF" />
            <Text style={styles.actionButtonText}>Submeter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const getStyles = (theme, fontSize) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    // Header
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.border || '#E0E0E0',
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      flex: 1,
      color: theme.textPrimary,
      fontSize: fontSize * 1.2,
      fontWeight: 'bold',
      textAlign: 'center',
      marginRight: 40, // Compensa o backButton para centralizar
    },
    headerSpacer: {
      width: 40,
    },
    // Editor
    editorContainer: {
      flex: 1,
      margin: 16,
      backgroundColor: theme.cardBackground,
      borderRadius: 12,
      overflow: 'hidden',
      elevation: theme.elevation,
      shadowColor: theme.shadowColor,
      shadowOpacity: theme.shadowOpacity,
      shadowRadius: 3,
      shadowOffset: { width: 0, height: 2 },
    },
    editorHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border || '#E0E0E0',
    },
    editorHeaderText: {
      color: theme.textPrimary,
      fontSize: fontSize,
      fontWeight: '600',
    },
    editorActions: {
      flexDirection: 'row',
      gap: 12,
    },
    editorActionButton: {
      padding: 4,
    },
    codeScrollView: {
      flex: 1,
    },
    codeInput: {
      flex: 1,
      color: theme.textPrimary,
      fontSize: fontSize,
      fontFamily: 'monospace',
      padding: 16,
      minHeight: 200,
      textAlignVertical: 'top',
    },
    // Output
    outputContainer: {
      height: 150,
      margin: 16,
      marginTop: 0,
      backgroundColor: theme.cardBackground,
      borderRadius: 12,
      padding: 16,
      elevation: theme.elevation,
      shadowColor: theme.shadowColor,
      shadowOpacity: theme.shadowOpacity,
      shadowRadius: 3,
      shadowOffset: { width: 0, height: 2 },
    },
    outputTitle: {
      color: theme.textPrimary,
      fontSize: fontSize,
      fontWeight: '600',
      marginBottom: 8,
    },
    outputScrollView: {
      flex: 1,
    },
    outputText: {
      color: theme.textSecondary,
      fontSize: fontSize * 0.9,
      fontFamily: 'monospace',
    },
    // Action Buttons
    actionButtonsContainer: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingBottom: 16,
      gap: 12,
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 14,
      borderRadius: 8,
      gap: 8,
    },
    runButton: {
      backgroundColor: '#4A90E2',
    },
    submitButton: {
      backgroundColor: '#34C759',
    },
    actionButtonText: {
      color: '#FFF',
      fontSize: fontSize,
      fontWeight: '600',
    },
  });

export default CodeEditorScreen;
