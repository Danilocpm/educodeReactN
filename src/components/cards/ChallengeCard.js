import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useThemeStore } from '../../store/useThemeStore';

const { width } = Dimensions.get('window');

const ChallengeCard = ({ problem }) => {
  const { theme, fontSize } = useThemeStore();
  const router = useRouter();
  const styles = getStyles(theme, fontSize);

  const handlePress = () => {
    router.push(`/problems/${problem.id}`);
  };

  return (
    <View style={styles.challengeCardContainer}>
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle}>{problem.title}</Text>
        <Text style={styles.cardSubtitle}>Problema #{problem.id}</Text>
      </View>
      <TouchableOpacity style={styles.blueCircleButton} onPress={handlePress}>
        <MaterialCommunityIcons name="chevron-double-right" size={28} color={theme.primaryText} />
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (theme, baseFontSize) => StyleSheet.create({
  challengeCardContainer: {
    backgroundColor: theme.cardBackground,
    borderRadius: 20,
    padding: 20,
    width: width * 0.85,
    marginHorizontal: (width * 0.15) / 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    color: theme.textPrimary,
    fontSize: baseFontSize + 2,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    color: theme.textSecondary,
    fontSize: baseFontSize - 2,
    marginTop: 4,
  },
  blueCircleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
});

export default ChallengeCard;