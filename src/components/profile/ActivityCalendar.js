import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { useThemeStore } from '../../store/useThemeStore';

const ACTIVE_BLUE = '#3b82f6';

/**
 * Fetch all user submissions from the last 30 days
 */
const fetchRecentSubmissions = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data, error } = await supabase
    .from('submissions')
    .select('created_at')
    .eq('user_id', user.id)
    .gte('created_at', thirtyDaysAgo.toISOString())
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * ActivityCalendar Component
 * Shows user's submission activity for the last 30 days
 */
const ActivityCalendar = () => {
  const { theme, fontSize } = useThemeStore();
  const styles = getStyles(theme, fontSize);

  // Fetch submissions from last 30 days
  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['recentSubmissions'],
    queryFn: fetchRecentSubmissions,
  });

  // Process submissions into calendar data
  const calendarData = useMemo(() => {
    // Create a set of dates (YYYY-MM-DD) that have submissions
    const submissionDates = new Set(
      submissions.map(sub => {
        const date = new Date(sub.created_at);
        return date.toISOString().split('T')[0];
      })
    );

    // Generate last 30 days
    const today = new Date();
    const calendar = [];
    let currentWeek = [];

    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Check if this date has submissions
      const hasSubmission = submissionDates.has(dateStr);
      currentWeek.push(hasSubmission ? 1 : 0);

      // Start new week on Sunday (day 0) or after 7 days
      if (currentWeek.length === 7) {
        calendar.push(currentWeek);
        currentWeek = [];
      }
    }

    // Add remaining days
    if (currentWeek.length > 0) {
      // Fill remaining days with 0s to complete the week
      while (currentWeek.length < 7) {
        currentWeek.push(0);
      }
      calendar.push(currentWeek);
    }

    return calendar;
  }, [submissions]);

  const days = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  if (isLoading) {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Últimos 30 Dias</Text>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Últimos 30 Dias</Text>
      
      {/* Calendar Header */}
      <View style={styles.calendarHeader}>
        {days.map((day, index) => (
          <Text key={index} style={styles.calendarDayHeader}>
            {day}
          </Text>
        ))}
      </View>
      
      {/* Calendar Grid */}
      <View style={styles.calendarGrid}>
        {calendarData.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.calendarWeek}>
            {week.map((day, dayIndex) => (
              <View
                key={dayIndex}
                style={[
                  styles.calendarDay,
                  day === 1 && styles.calendarDayActive,
                ]}
              />
            ))}
          </View>
        ))}
      </View>
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
    calendarHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    calendarDayHeader: {
      color: theme.textSecondary,
      fontSize: baseFontSize - 2,
      fontWeight: '500',
      width: 40,
      textAlign: 'center',
    },
    calendarGrid: {},
    calendarWeek: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    calendarDay: {
      width: 40,
      height: 40,
      borderRadius: 8,
      backgroundColor: theme.cardBackground,
    },
    calendarDayActive: {
      backgroundColor: ACTIVE_BLUE,
    },
  });

export default ActivityCalendar;
