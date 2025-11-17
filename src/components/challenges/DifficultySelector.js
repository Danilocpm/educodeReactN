import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useThemeStore } from '../../store/useThemeStore';
// Mapeia as dificuldades para os ícones
const difficulties = [
  { key: 'Fácil', iconName: 'cloud' },
  { key: 'Médio', iconName: 'rainy' },
  { key: 'Difícil', iconName: 'thunderstorm' },
];

// Recebe a seleção atual (selectedKey) e a função para alterar (onSelect)
const DifficultySelector = ({ selectedKey, onSelect }) => {
  const { theme } = useThemeStore();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      {difficulties.map((diff) => {
        const isActive = selectedKey === diff.key;

        // O ícone ativo ganha um fundo circular e o ícone fica branco
        // O ícone inativo fica sem fundo e com a cor secundária
        return (
          <TouchableOpacity
            key={diff.key}
            onPress={() => onSelect(diff.key)}
            style={[styles.iconWrapper, isActive && styles.iconWrapperActive]}
          >
            <Ionicons
              name={isActive ? diff.iconName : `${diff.iconName}-outline`}
              size={isActive ? 32 : 36}
              color={isActive ? theme.primaryText : theme.textSecondary}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginVertical: 24,
      paddingHorizontal: 20,
    },
    iconWrapper: {
      width: 60,
      height: 60,
      borderRadius: 30, // Metade da largura/altura para ser um círculo
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent', // Inativo é transparente
    },
    iconWrapperActive: {
      backgroundColor: theme.primary, // Ativo tem a cor primária
      elevation: 5,
      shadowColor: theme.primary,
      shadowOpacity: 0.5,
      shadowRadius: 5,
    },
  });

export default DifficultySelector;