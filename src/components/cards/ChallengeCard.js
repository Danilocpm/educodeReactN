import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ChallengeCard = ({ item }) => (
  <View style={styles.challengeCardContainer}>
    <View style={styles.cardTextContainer}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
    </View>
    <TouchableOpacity style={styles.blueCircleButton}>
      <MaterialCommunityIcons name="chevron-double-right" size={28} color="#fff" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  challengeCardContainer: {
    backgroundColor: '#1c1f3a',
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
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 4,
  },
  blueCircleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007aff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
});

export default ChallengeCard;