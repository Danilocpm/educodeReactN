import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

const NoLanguageWarning = ({ onBack }) => {
  return (
    <View style={styles.centerContainer}>
      <Feather name="alert-circle" size={48} color="#FFA500" style={{ marginBottom: 16 }} />
      <Text style={styles.warningText}>Nenhuma linguagem selecionada</Text>
      <Text style={styles.warningSubtext}>
        Por favor, selecione uma linguagem de programação nas configurações.
      </Text>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#0A0F21',
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
  backButton: {
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

export default NoLanguageWarning;
