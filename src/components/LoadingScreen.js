import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeStore } from '../store/useThemeStore';

export default function LoadingScreen() {
  const { theme } = useThemeStore();

  return (
    <LinearGradient
      colors={['#0047AB', '#1E3A5F', '#2C5F8D']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.logo}>EDUCODE</Text>
        <ActivityIndicator size="large" color="#FFFFFF" style={styles.loader} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 8,
    marginBottom: 40,
  },
  loader: {
    marginTop: 20,
  },
});
