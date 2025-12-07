import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useThemeStore } from '../../store/useThemeStore';

const NavigationCard = ({ item }) => {
  const { theme, fontSize } = useThemeStore();
  const router = useRouter();
  const styles = getStyles(theme, fontSize);

  const handlePress = () => {
    router.push(item.route);
  };

  return (
    <TouchableOpacity style={styles.navigationCardContainer} onPress={handlePress}>
      <Feather name={item.icon} size={40} color={theme.primary} />
      <Text style={styles.navigationCardTitle}>{item.title}</Text>
    </TouchableOpacity>
  );
};

const getStyles = (theme, baseFontSize) => StyleSheet.create({
  navigationCardContainer: {
    backgroundColor: theme.cardBackground,
    borderRadius: 20,
    padding: 20,
    width: 140,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 1,
    borderColor: theme.borderColor,
  },
  navigationCardTitle: {
    color: theme.textPrimary,
    fontSize: baseFontSize,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default NavigationCard;
