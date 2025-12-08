import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { useThemeStore } from '../../store/useThemeStore';

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
 * Progress Bar Component
 */
const ProgressBar = ({ label, progress, color, theme, fontSize }) => {
  const styles = getStyles(theme, fontSize);
  
  return (
    <View style={styles.progressRow}>
      <View style={styles.progressBarTrack}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${progress * 100}%`, backgroundColor: color },
          ]}
        />
      </View>
      <Text style={styles.progressLabel}>{label}</Text>
    </View>
  );
};

/**
 * ExerciseProgress Component
 * Shows progress bars for each difficulty level
 */
const ExerciseProgress = () => {
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
        progress: totalByDifficulty.easy > 0 ? completedByDifficulty.easy / totalByDifficulty.easy : 0,
        percentage: totalByDifficulty.easy > 0 
          ? Math.round((completedByDifficulty.easy / totalByDifficulty.easy) * 100) 
          : 0,
      },
      medium: {
        completed: completedByDifficulty.medium,
        total: totalByDifficulty.medium,
        progress: totalByDifficulty.medium > 0 ? completedByDifficulty.medium / totalByDifficulty.medium : 0,
        percentage: totalByDifficulty.medium > 0 
          ? Math.round((completedByDifficulty.medium / totalByDifficulty.medium) * 100) 
          : 0,
      },
      hard: {
        completed: completedByDifficulty.hard,
        total: totalByDifficulty.hard,
        progress: totalByDifficulty.hard > 0 ? completedByDifficulty.hard / totalByDifficulty.hard : 0,
        percentage: totalByDifficulty.hard > 0 
          ? Math.round((completedByDifficulty.hard / totalByDifficulty.hard) * 100) 
          : 0,
      },
    };
  }, [problems, submissions]);

  const isLoading = isLoadingProblems || isLoadingSubmissions;

  if (isLoading) {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Exercícios Feitos</Text>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Exercícios Feitos</Text>
      
      {/* Easy Problems */}
      <ProgressBar
        label={`${stats.easy.percentage}%`}
        progress={stats.easy.progress}
        color={ACTIVE_BLUE}
        theme={theme}
        fontSize={fontSize}
      />
      
      {/* Medium Problems */}
      <ProgressBar
        label={`${stats.medium.percentage}%`}
        progress={stats.medium.progress}
        color={ACTIVE_BLUE}
        theme={theme}
        fontSize={fontSize}
      />
      
      {/* Hard Problems */}
      <ProgressBar
        label={`${stats.hard.percentage}%`}
        progress={stats.hard.progress}
        color={ACTIVE_BLUE}
        theme={theme}
        fontSize={fontSize}
      />
    </View>
  );
};

const getStyles = (theme, baseFontSize) =>
  StyleSheet.create({
    sectionContainer: {
      marginBottom: 30,
    },
    sectionTitle: {
      color: theme.textPrimary,
      fontSize: baseFontSize + 4,
      fontWeight: '600',
      marginBottom: 20,
    },
    loadingText: {
      color: theme.textSecondary,
      fontSize: baseFontSize,
      textAlign: 'center',
      marginVertical: 20,
    },
    progressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    progressBarTrack: {
      flex: 1,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.cardBackground,
      marginRight: 12,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      borderRadius: 4,
    },
    progressLabel: {
      color: theme.textSecondary,
      fontSize: baseFontSize - 4,
      fontWeight: '600',
      minWidth: 35,
      textAlign: 'right',
    },
  });

export default ExerciseProgress;
