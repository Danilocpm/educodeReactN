import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'

const ContinueCard = ({ title }) => (
  <View style={styles.continueCardContainer}>
    <View style={styles.continueLeft}>
      <Feather name="cloud" size={40} color="#007aff" />
      <View style={styles.continueTextContainer}>
        <Text style={styles.continueSubtitle}>{title}</Text>
        <Text style={styles.continueTitle}>Deseja continuar fazendo?</Text>        
      </View>
    </View>
    <TouchableOpacity style={styles.blueCircleButton}>
      <MaterialCommunityIcons name="chevron-double-right" size={28} color="#fff" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  continueCardContainer: {
    backgroundColor: '#1c1f3a',
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
    color: '#aaa',
    fontSize: 14,
    marginTop: 2
  },
  continueSubtitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  blueCircleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007aff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
});

export default ContinueCard;