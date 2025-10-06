
import { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [testResult, setTestResult] = useState('');

  useEffect(() => {
    const testRLS = async () => {
      try {
        setLoading(true);
        console.log('Iniciando teste de RLS...');

        // Primeiro, vamos verificar se há um usuário logado.
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (!session) {
          const message = 'Nenhum usuário está logado. Faça o login para testar a política RLS.';
          setTestResult(message);
          Alert.alert('Aviso', message);
          return;
        }
        
        console.log(`Usuário ${session.user.email} logado. Buscando dados da tabela 'users'...`);

        // A query principal: tentamos buscar TODOS os registros.
        // Se a RLS estiver correta, o Supabase filtrará e retornará apenas um.
        const { data, error: selectError } = await supabase
          .from('users') // Certifique-se de que 'users' é o nome correto da sua tabela
          .select('*');

        if (selectError) {
          throw selectError;
        }

        console.log('Dados recebidos:', data);
        setUserData(data);

        if (data.length === 1) {
          const message = `SUCESSO! A política RLS funcionou. Apenas 1 perfil foi retornado: ${data[0].id}`;
          setTestResult(message);
          Alert.alert('Teste Concluído', message);
        } else if (data.length === 0) {
          const message = 'A query funcionou, mas não retornou perfis. O usuário logado tem um perfil correspondente na tabela "users"?';
          setTestResult(message);
          Alert.alert('Teste Concluído', message);
        } else {
          const message = `FALHA! A política RLS pode estar incorreta. A query retornou ${data.length} perfis.`;
          setTestResult(message);
          Alert.alert('Teste Concluído', message);
        }

      } catch (e) {
        const errorMessage = `Erro no teste: ${e.message}`;
        setError(errorMessage);
        Alert.alert('Erro', errorMessage);
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    testRLS();
  }, []); // O array vazio garante que o teste rode apenas uma vez.

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teste de Row-Level Security (RLS)</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.resultContainer}>
          <Text style={styles.status}>{error ? 'Erro no Teste' : 'Teste Finalizado'}</Text>
          <Text style={styles.details}>{error || testResult}</Text>
          <Text style={styles.dataTitle}>Dados Recebidos:</Text>
          <Text style={styles.dataContent}>
            {userData ? JSON.stringify(userData, null, 2) : 'Nenhum dado.'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  resultContainer: {
    width: '100%',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 3,
  },
  status: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  details: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  dataTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  dataContent: {
    fontFamily: 'monospace',
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 4,
    marginTop: 5,
  },
});
