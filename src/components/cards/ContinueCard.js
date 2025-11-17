import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/useThemeStore';

const ContinueCard = ({ title }) => {
  const { theme, fontSize } = useThemeStore();
  const styles = getStyles(theme, fontSize);

  return (
    <View style={styles.continueCardContainer}>
      <View style={styles.continueLeft}>
        <Feather name="cloud" size={40} color={theme.primary} />
        <View style={styles.continueTextContainer}>
          <Text style={styles.continueSubtitle}>{title}</Text>
          <Text style={styles.continueTitle}>Deseja continuar fazendo?</Text>        
        </View>
      </View>
      <TouchableOpacity style={styles.blueCircleButton}>
        <MaterialCommunityIcons name="chevron-double-right" size={28} color={theme.primaryText} />
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (theme, baseFontSize) => StyleSheet.create({
  continueCardContainer: {
    backgroundColor: theme.cardBackground,
    borderRadius: 20,
    padding: 36,
    marginHorizontal: 10,
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  continueLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  continueTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  continueTitle: {
    color: theme.textSecondary,
    fontSize: baseFontSize - 2,
    marginTop: 2
  },
  continueSubtitle: {
    color: theme.textPrimary,
    fontSize: baseFontSize,
    fontWeight: 'bold',
  },
  blueCircleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
});

export default ContinueCard;