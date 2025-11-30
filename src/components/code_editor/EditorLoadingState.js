import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const EditorLoadingState = () => {
  return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color="#007aff" />
      <Text style={styles.loadingText}>Carregando código inicial...</Text>
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
  loadingText: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 12,
  },
});

export default EditorLoadingState;
