import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useThemeStore } from '../store/useThemeStore';

export default function LoadingScreen() {
  const { theme } = useThemeStore();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ActivityIndicator size="large" color={theme.primary} />
      <Text style={[styles.text, { color: theme.text }]}>
        Carregando...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
});
