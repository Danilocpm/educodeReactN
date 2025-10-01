import React from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '16934476424-plrvdcsrhofs2ceifubo64pgqkvqtn36.apps.googleusercontent.com',
  scopes: ['profile', 'email'],
});

export default function Login() {
  const handleLoginWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      
      // CORREÇÃO: Acessamos o idToken dentro de userInfo.data
      if (userInfo && userInfo.data && userInfo.data.idToken) {
        const { data, error: supabaseError } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          // CORREÇÃO: Passamos o token do caminho correto
          token: userInfo.data.idToken,
        });

        if (supabaseError) {
          throw supabaseError;
        }
        
        console.log('LOGIN BEM-SUCEDIDO!', data.user);
        Alert.alert('Sucesso!', 'Você está logado!');

      } else {
        throw new Error('As informações do Google retornaram em um formato inesperado.');
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Login com Google cancelado pelo usuário.');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Aguarde', 'Um processo de login já está em andamento.');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Erro de Serviço', 'O Google Play Services não está disponível ou está desatualizado no seu dispositivo.');
      } else {
        console.error('Erro durante o login com Google:', error);
        Alert.alert('Erro', `Ocorreu um erro inesperado: ${error.message}`);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Entrar com Google (Nativo)" onPress={handleLoginWithGoogle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});