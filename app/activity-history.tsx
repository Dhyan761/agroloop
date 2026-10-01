import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useActivity } from '../context/ActivityContext';
import { ChevronLeft, Filter, Leaf, Brain, Gift, Calendar } from 'lucide-react-native';
import { router } from 'expo-router';

export default function ActivityHistoryScreen() {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const { activities } = useActivity();
  const [filter, setFilter] = useState<'all' | 'waste_log' | 'disease_detection' | 'reward_redemption'>('all');

  const handleBack = () => {
    router.back();
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'waste_log':
        return <Leaf size={20} color="#22c55e" />;
      case 'disease_detection':
        return <Brain size={20} color="#3b82f6" />;
      case 'reward_redemption':
        return <Gift size={20} color="#f59e0b" />;
      default:
        return <Calendar size={20} color="#6b7280" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'waste_log':
        return '#22c55e';
      case 'disease_detection':
        return '#3b82f6';
      case 'reward_redemption':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.type === filter;
  });

  const filters = [
    { id: 'all', label: 'All Activities' },
    { id: 'waste_log', label: 'Waste Log' },
    { id: 'disease_detection', label: 'Disease Detection' },
    { id: 'reward_redemption', label: 'Reward Redemption' },
  ];

  const renderActivityItem = ({ item }: { item: any }) => (
    <View style={[styles.activityItem, { backgroundColor: isDark ? '#374151' : '#ffffff' }]}>
      <View style={styles.activityHeader}>
        <View style={styles.activityIcon}>
          {getActivityIcon(item.type)}
        </View>
        <View style={styles.activityInfo}>
          <Text style={[styles.activityTitle, { color: isDark ? '#ffffff' : '#111827' }]}>
            {item.title}
          </Text>
          <Text style={[styles.activityDate, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
            {formatDate(item.date)}
          </Text>
        </View>
        {item.credits && (
          <View style={[
            styles.creditsContainer,
            { backgroundColor: item.credits > 0 ? '#dcfce7' : '#fef3c7' }
          ]}>
            <Text style={[
              styles.creditsText,
              { color: item.credits > 0 ? '#22c55e' : '#f59e0b' }
            ]}>
              {item.credits > 0 ? '+' : ''}{item.credits}
            </Text>
          </View>
        )}
      </View>
      {item.severity && (
        <View style={styles.severityContainer}>
          <Text style={[styles.severityText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
            Severity: {item.severity}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1f2937' : '#ffffff' }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft size={24} color={isDark ? '#ffffff' : '#111827'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? '#ffffff' : '#111827' }]}>
          Activity History
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map((filterOption) => (
            <TouchableOpacity
              key={filterOption.id}
              style={[
                styles.filterTab,
                filter === filterOption.id && styles.activeFilterTab,
                { backgroundColor: isDark ? '#374151' : '#f3f4f6' }
              ]}
              onPress={() => setFilter(filterOption.id as any)}
            >
              <Text style={[
                styles.filterText,
                { color: isDark ? '#9ca3af' : '#6b7280' },
                filter === filterOption.id && { color: '#ffffff' }
              ]}>
                {filterOption.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Activity List */}
      <FlatList
        data={filteredActivities}
        renderItem={renderActivityItem}
        keyExtractor={(item) => item.id}
        style={styles.activityList}
        contentContainerStyle={styles.activityListContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Calendar size={48} color={isDark ? '#9ca3af' : '#6b7280'} />
            <Text style={[styles.emptyTitle, { color: isDark ? '#ffffff' : '#111827' }]}>
              No Activities Found
            </Text>
            <Text style={[styles.emptyText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              Start logging waste or detecting diseases to see your activity history
            </Text>
          </View>
        }
      />
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
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilterTab: {
    backgroundColor: '#22c55e',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activityList: {
    flex: 1,
  },
  activityListContent: {
    padding: 20,
  },
  activityItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 14,
  },
  creditsContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  creditsText: {
    fontSize: 14,
    fontWeight: '600',
  },
  severityContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  severityText: {
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
}); 