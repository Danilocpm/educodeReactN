import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons'

const PracticeCard = ({ item }) => (
  <TouchableOpacity style={styles.practiceCardContainer}>
    <Feather name={item.icon} size={40} color="#007aff" />
    <Text style={styles.practiceCardTitle}>{item.title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  practiceCardContainer: {
    backgroundColor: '#1c1f3a',
    borderRadius: 20,
    padding: 20,
    width: 140,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  practiceCardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default PracticeCard;