import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { useThemeStore } from '../../store/useThemeStore';
import { Feather } from '@expo/vector-icons';

const ACTIVE_BLUE = '#3b82f6';

/**
 * Fetch all problems by difficulty
 */
const fetchAllProblems = async () => {
  const { data, error } = await supabase
    .from('problems')
    .select('id, difficulty');

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Fetch user's completed submissions (where passed_tests = total_tests)
 */
const fetchCompletedSubmissions = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('submissions')
    .select('problem_id, passed_tests, total_tests')
    .eq('user_id', user.id);

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * ProgressStats Component
 * Shows completed problems statistics by difficulty
 */
const ProgressStats = () => {
  const { theme, fontSize } = useThemeStore();
  const styles = getStyles(theme, fontSize);

  // Fetch all problems
  const { data: problems = [], isLoading: isLoadingProblems } = useQuery({
    queryKey: ['allProblems'],
    queryFn: fetchAllProblems,
  });

  // Fetch user's submissions
  const { data: submissions = [], isLoading: isLoadingSubmissions } = useQuery({
    queryKey: ['completedSubmissions'],
    queryFn: fetchCompletedSubmissions,
  });

  // Calculate statistics
  const stats = useMemo(() => {
    // Count total problems by difficulty
    const totalByDifficulty = {
      easy: 0,
      medium: 0,
      hard: 0,
    };

    problems.forEach(problem => {
      if (totalByDifficulty[problem.difficulty] !== undefined) {
        totalByDifficulty[problem.difficulty]++;
      }
    });

    // Find completed problems (unique problem_id where passed_tests = total_tests)
    const completedProblems = new Set();
    
    submissions.forEach(sub => {
      if (sub.passed_tests === sub.total_tests && sub.total_tests > 0) {
        completedProblems.add(sub.problem_id);
      }
    });

    // Count completed problems by difficulty
    const completedByDifficulty = {
      easy: 0,
      medium: 0,
      hard: 0,
    };

    problems.forEach(problem => {
      if (completedProblems.has(problem.id) && completedByDifficulty[problem.difficulty] !== undefined) {
        completedByDifficulty[problem.difficulty]++;
      }
    });

    return {
      easy: {
        completed: completedByDifficulty.easy,
        total: totalByDifficulty.easy,
      },
      medium: {
        completed: completedByDifficulty.medium,
        total: totalByDifficulty.medium,
      },
      hard: {
        completed: completedByDifficulty.hard,
        total: totalByDifficulty.hard,
      },
    };
  }, [problems, submissions]);

  const isLoading = isLoadingProblems || isLoadingSubmissions;

  if (isLoading) {
    return (
      <View style={styles.statsContainer}>
        <Text style={styles.loadingText}>Carregando estatísticas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.statsContainer}>
      {/* Easy Problems */}
      <View style={styles.statItem}>
        <Feather name="cloud" size={24} color={ACTIVE_BLUE} />
        <Text style={styles.statText}>
          {stats.easy.completed}/{stats.easy.total}
        </Text>
      </View>

      {/* Medium Problems */}
      <View style={styles.statItem}>
        <Feather name="cloud-drizzle" size={24} color={ACTIVE_BLUE} />
        <Text style={styles.statText}>
          {stats.medium.completed}/{stats.medium.total}
        </Text>
      </View>

      {/* Hard Problems */}
      <View style={styles.statItem}>
        <Feather name="cloud-lightning" size={24} color={ACTIVE_BLUE} />
        <Text style={styles.statText}>
          {stats.hard.completed}/{stats.hard.total}
        </Text>
      </View>
    </View>
  );
};

const getStyles = (theme, baseFontSize) =>
  StyleSheet.create({
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 30,
    },
    statItem: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    statText: {
      color: theme.textSecondary,
      fontSize: baseFontSize - 2,
      marginLeft: 8,
    },
    loadingText: {
      color: theme.textSecondary,
      fontSize: baseFontSize,
      textAlign: 'center',
    },
  });

export default ProgressStats;
