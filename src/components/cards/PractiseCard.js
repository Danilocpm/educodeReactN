import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useThemeStore } from '../../store/useThemeStore';

const PracticeCard = ({ item }) => {
  const { theme, fontSize } = useThemeStore();
  const styles = getStyles(theme, fontSize);

  return (
    <TouchableOpacity style={styles.practiceCardContainer}>
      <Feather name={item.icon} size={40} color={theme.primary} />
      <Text style={styles.practiceCardTitle}>{item.title}</Text>
    </TouchableOpacity>
  );
};

const getStyles = (theme, baseFontSize) => StyleSheet.create({
  practiceCardContainer: {
    backgroundColor: theme.cardBackground,
    borderRadius: 20,
    padding: 20,
    width: 140,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  practiceCardTitle: {
    color: theme.textPrimary,
    fontSize: baseFontSize,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default PracticeCard;