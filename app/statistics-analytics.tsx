import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useActivity } from '../context/ActivityContext';
import { ChevronLeft, TrendingUp, TrendingDown, BarChart3, Calendar, Target } from 'lucide-react-native';
import { router } from 'expo-router';

export default function StatisticsAnalyticsScreen() {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const { activities, ecoCredits, wasteLogged } = useActivity();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const handleBack = () => {
    router.back();
  };

  // Calculate statistics
  const totalWasteLogged = wasteLogged;
  const totalCreditsEarned = activities
    .filter(activity => activity.type === 'waste_log' && activity.credits && activity.credits > 0)
    .reduce((total, activity) => total + (activity.credits || 0), 0);
  
  const totalCreditsSpent = activities
    .filter(activity => activity.type === 'reward_redemption' && activity.credits)
    .reduce((total, activity) => total + Math.abs(activity.credits || 0), 0);

  const diseaseDetections = activities.filter(activity => activity.type === 'disease_detection').length;
  
  const averageCreditsPerWaste = totalWasteLogged > 0 ? (totalCreditsEarned / totalWasteLogged).toFixed(1) : '0';

  const periods = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'year', label: 'This Year' },
  ];

  const metrics = [
    {
      title: 'Total Waste Logged',
      value: totalWasteLogged.toString(),
      unit: 'entries',
      icon: <Target size={24} color="#22c55e" />,
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Credits Earned',
      value: totalCreditsEarned.toString(),
      unit: 'credits',
      icon: <TrendingUp size={24} color="#3b82f6" />,
      trend: '+8%',
      trendUp: true,
    },
    {
      title: 'Credits Spent',
      value: totalCreditsSpent.toString(),
      unit: 'credits',
      icon: <TrendingDown size={24} color="#ef4444" />,
      trend: '+15%',
      trendUp: false,
    },
    {
      title: 'Disease Detections',
      value: diseaseDetections.toString(),
      unit: 'detections',
      icon: <BarChart3 size={24} color="#f59e0b" />,
      trend: '+5%',
      trendUp: true,
    },
    {
      title: 'Avg Credits per Waste',
      value: averageCreditsPerWaste,
      unit: 'credits',
      icon: <Calendar size={24} color="#8b5cf6" />,
      trend: '+3%',
      trendUp: true,
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1f2937' : '#ffffff' }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft size={24} color={isDark ? '#ffffff' : '#111827'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? '#ffffff' : '#111827' }]}>
          Statistics & Analytics
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.id}
              style={[
                styles.periodButton,
                selectedPeriod === period.id && styles.periodButtonActive,
                { backgroundColor: isDark ? '#374151' : '#f3f4f6' }
              ]}
              onPress={() => setSelectedPeriod(period.id as 'week' | 'month' | 'year')}
            >
              <Text style={[
                styles.periodButtonText,
                { color: isDark ? '#9ca3af' : '#6b7280' },
                selectedPeriod === period.id && { color: '#ffffff' }
              ]}>
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Current Balance */}
        <View style={[styles.balanceCard, { backgroundColor: isDark ? '#374151' : '#f8fafc' }]}>
          <Text style={[styles.balanceLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
            Current Balance
          </Text>
          <Text style={[styles.balanceValue, { color: isDark ? '#ffffff' : '#111827' }]}>
            ₹{ecoCredits.toLocaleString()}
          </Text>
          <Text style={[styles.balanceSubtext, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
            Eco Credits Available
          </Text>
        </View>

        {/* Metrics Grid */}
        <View style={styles.metricsContainer}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#111827' }]}>
            Performance Metrics
          </Text>
          
          {metrics.map((metric, index) => (
            <View key={index} style={[styles.metricCard, { backgroundColor: isDark ? '#374151' : '#ffffff' }]}>
              <View style={styles.metricHeader}>
                {metric.icon}
                <View style={styles.trendContainer}>
                  <Text style={[
                    styles.trendText,
                    { color: metric.trendUp ? '#22c55e' : '#ef4444' }
                  ]}>
                    {metric.trend}
                  </Text>
                </View>
              </View>
              
              <Text style={[styles.metricValue, { color: isDark ? '#ffffff' : '#111827' }]}>
                {metric.value}
              </Text>
              <Text style={[styles.metricTitle, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                {metric.title}
              </Text>
              <Text style={[styles.metricUnit, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                {metric.unit}
              </Text>
            </View>
          ))}
        </View>

        {/* Insights */}
        <View style={[styles.insightsContainer, { backgroundColor: isDark ? '#374151' : '#f8fafc' }]}>
          <Text style={[styles.insightsTitle, { color: isDark ? '#ffffff' : '#111827' }]}>
            Insights
          </Text>
          <View style={styles.insightItem}>
            <Text style={[styles.insightText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              • You've logged waste {totalWasteLogged} times this {selectedPeriod}
            </Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={[styles.insightText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              • Average of {averageCreditsPerWaste} credits earned per waste entry
            </Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={[styles.insightText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              • {diseaseDetections} crop diseases detected and analyzed
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  periodSelector: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#22c55e',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  balanceCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  balanceSubtext: {
    fontSize: 14,
  },
  metricsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  metricCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trendContainer: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: 14,
    marginBottom: 2,
  },
  metricUnit: {
    fontSize: 12,
  },
  insightsContainer: {
    padding: 16,
    borderRadius: 12,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  insightItem: {
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    lineHeight: 20,
  },
}); 