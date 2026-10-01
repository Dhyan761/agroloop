import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Coins, TrendingUp, Leaf, Calendar, Brain, Recycle, Globe, Award, Users, Target } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useActivity } from '../../context/ActivityContext';

interface ActivityItem {
  id: number;
  type: string;
  description: string;
  credits: number;
  date: string;
}

export default function DashboardScreen() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const { activities, wasteLogged, ecoCredits } = useActivity();
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  // Function to get appropriate greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return t('goodMorning');
    } else if (hour < 17) {
      return t('goodAfternoon');
    } else if (hour < 21) {
      return t('goodEvening');
    } else {
      return t('goodNight');
    }
  };

  // Calculate monthly earnings from activities (only positive waste_log credits)
  const monthlyEarnings = activities
    .filter(activity => activity.type === 'waste_log' && activity.credits && activity.credits > 0)
    .reduce((total, activity) => total + (activity.credits || 0), 0);

  useEffect(() => {
    // Convert activities to recent activity format
    const recentActivities = activities.slice(0, 5).map((activity, index) => ({
      id: index + 1,
      type: activity.type,
      description: activity.title,
      credits: (activity.type === 'waste_log' || activity.type === 'reward_redemption') ? (activity.credits || 0) : 0,
      date: activity.date,
    }));
    setRecentActivity(recentActivities);
  }, [activities]);

  const handleLogWaste = () => {
    router.push('/(tabs)/waste-log');
  };

  const handleRedeemRewards = () => {
    router.push('/(tabs)/rewards');
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDark ? '#1f2937' : '#f8fafc' }]}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: isDark ? '#1f2937' : '#f8fafc' }]}>
        <Text style={[styles.errorText, { color: isDark ? '#9ca3af' : '#64748b' }]}>{t('pleaseLogin')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? '#1f2937' : '#ffffff' }]}>
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: isDark ? '#ffffff' : '#111827' }]}>{getGreeting()}!</Text>
        <Text style={[styles.welcomeText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>{t('welcomeBack')} AgroLoop</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: isDark ? '#374151' : '#ffffff' }]}>
          <View style={styles.statHeader}>
            <Coins size={24} color="#22c55e" />
            <Text style={[styles.statValue, { color: isDark ? '#ffffff' : '#111827' }]}>{ecoCredits.toLocaleString()}</Text>
          </View>
          <Text style={[styles.statLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>{t('ecoCreditsBalance')}</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: isDark ? '#374151' : '#ffffff' }]}>
          <View style={styles.statHeader}>
            <TrendingUp size={24} color="#3b82f6" />
            <Text style={[styles.statValue, { color: isDark ? '#ffffff' : '#111827' }]}>{monthlyEarnings}</Text>
          </View>
          <Text style={[styles.statLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>{t('monthlyEarnings')}</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: isDark ? '#374151' : '#ffffff' }]}>
          <View style={styles.statHeader}>
            <Leaf size={24} color="#10b981" />
            <Text style={[styles.statValue, { color: isDark ? '#ffffff' : '#111827' }]}>{wasteLogged}</Text>
          </View>
          <Text style={[styles.statLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>{t('wasteEntries')}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#111827' }]}>{t('quickActions')}</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: isDark ? '#374151' : '#ffffff' }]} onPress={handleLogWaste}>
            <Leaf size={32} color="#22c55e" />
            <Text style={[styles.actionLabel, { color: isDark ? '#ffffff' : '#111827' }]}>{t('logWaste')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: isDark ? '#374151' : '#ffffff' }]} onPress={handleRedeemRewards}>
            <Coins size={32} color="#f59e0b" />
            <Text style={[styles.actionLabel, { color: isDark ? '#ffffff' : '#111827' }]}>{t('redeemRewards')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: isDark ? '#374151' : '#ffffff' }]} onPress={() => router.navigate('/(tabs)/ai-disease-detection')}>
            <Brain size={32} color="#8b5cf6" />
            <Text style={[styles.actionLabel, { color: isDark ? '#ffffff' : '#111827' }]}>{t('aiDiseaseDetection')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#111827' }]}>{t('recentActivity')}</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
            <Text style={[styles.viewAllText, { color: isDark ? '#22c55e' : '#22c55e' }]}>{t('viewAll')}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.activityList}>
          {recentActivity.length > 0 ? (
            recentActivity.map((item) => (
              <View key={item.id} style={[styles.activityItem, { backgroundColor: isDark ? '#374151' : '#ffffff' }]}>
                <View style={styles.activityContent}>
                  <Text style={[styles.activityDescription, { color: isDark ? '#ffffff' : '#111827' }]}>{item.description}</Text>
                  <Text style={[styles.activityDate, { color: isDark ? '#9ca3af' : '#6b7280' }]}>{item.date}</Text>
                </View>
                <Text style={[
                  styles.activityCredits,
                  item.credits > 0 ? styles.positiveCredits : styles.negativeCredits
                ]}>
                  {item.credits > 0 ? '+' : ''}{item.credits}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>{t('noRecentActivity')}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Environmental Impact Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#111827' }]}>🌱 Environmental Impact</Text>
        <View style={[styles.impactCard, { backgroundColor: isDark ? '#374151' : '#f0fdf4' }]}>
          <View style={styles.impactHeader}>
            <Recycle size={32} color="#22c55e" />
            <Text style={[styles.impactTitle, { color: isDark ? '#ffffff' : '#111827' }]}>Your Contribution</Text>
          </View>
          <View style={styles.impactStats}>
            <View style={styles.impactStat}>
              <Text style={[styles.impactValue, { color: '#22c55e' }]}>{wasteLogged * 50}</Text>
              <Text style={[styles.impactLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>kg CO2 Saved</Text>
            </View>
            <View style={styles.impactStat}>
              <Text style={[styles.impactValue, { color: '#3b82f6' }]}>{wasteLogged * 2}</Text>
              <Text style={[styles.impactLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>Trees Equivalent</Text>
            </View>
            <View style={styles.impactStat}>
              <Text style={[styles.impactValue, { color: '#10b981' }]}>{wasteLogged * 100}</Text>
              <Text style={[styles.impactLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>Liters Water Saved</Text>
            </View>
          </View>
        </View>
      </View>

      {/* How It Works Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#111827' }]}>🔄 How It Works</Text>
        <View style={styles.howItWorksContainer}>
          <View style={[styles.stepCard, { backgroundColor: isDark ? '#374151' : '#ffffff' }]}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={[styles.stepTitle, { color: isDark ? '#ffffff' : '#111827' }]}>Collect Waste</Text>
            <Text style={[styles.stepDescription, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              Gather agricultural waste from your fields
            </Text>
          </View>
          <View style={[styles.stepCard, { backgroundColor: isDark ? '#374151' : '#ffffff' }]}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={[styles.stepTitle, { color: isDark ? '#ffffff' : '#111827' }]}>Get Verified</Text>
            <Text style={[styles.stepDescription, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              Visit collection center for verification
            </Text>
          </View>
          <View style={[styles.stepCard, { backgroundColor: isDark ? '#374151' : '#ffffff' }]}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={[styles.stepTitle, { color: isDark ? '#ffffff' : '#111827' }]}>Earn Credits</Text>
            <Text style={[styles.stepDescription, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              Receive eco-credits for your contribution
            </Text>
          </View>
        </View>
      </View>

      {/* Benefits Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#111827' }]}>✨ Benefits</Text>
        <View style={styles.benefitsGrid}>
          <View style={[styles.benefitCard, { backgroundColor: isDark ? '#374151' : '#ffffff' }]}>
            <Globe size={24} color="#22c55e" />
            <Text style={[styles.benefitTitle, { color: isDark ? '#ffffff' : '#111827' }]}>Environmental</Text>
            <Text style={[styles.benefitDescription, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              Reduce pollution and promote sustainability
            </Text>
          </View>
          <View style={[styles.benefitCard, { backgroundColor: isDark ? '#374151' : '#ffffff' }]}>
            <Award size={24} color="#f59e0b" />
            <Text style={[styles.benefitTitle, { color: isDark ? '#ffffff' : '#111827' }]}>Rewards</Text>
            <Text style={[styles.benefitDescription, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              Earn credits for every waste submission
            </Text>
          </View>
          <View style={[styles.benefitCard, { backgroundColor: isDark ? '#374151' : '#ffffff' }]}>
            <Users size={24} color="#3b82f6" />
            <Text style={[styles.benefitTitle, { color: isDark ? '#ffffff' : '#111827' }]}>Community</Text>
            <Text style={[styles.benefitDescription, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              Join a network of eco-conscious farmers
            </Text>
          </View>
          <View style={[styles.benefitCard, { backgroundColor: isDark ? '#374151' : '#ffffff' }]}>
            <Target size={24} color="#8b5cf6" />
            <Text style={[styles.benefitTitle, { color: isDark ? '#ffffff' : '#111827' }]}>Goals</Text>
            <Text style={[styles.benefitDescription, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              Track your environmental impact
            </Text>
          </View>
        </View>
      </View>

      {/* Call to Action */}
      <View style={styles.section}>
        <View style={[styles.ctaCard, { backgroundColor: isDark ? '#1e40af' : '#dbeafe' }]}>
          <Text style={[styles.ctaTitle, { color: isDark ? '#ffffff' : '#1e40af' }]}>
            Ready to Make a Difference?
          </Text>
          <Text style={[styles.ctaDescription, { color: isDark ? '#bfdbfe' : '#1e40af' }]}>
            Start logging your waste today and earn eco-credits while helping the environment.
          </Text>
          <TouchableOpacity 
            style={[styles.ctaButton, { backgroundColor: isDark ? '#ffffff' : '#1e40af' }]}
            onPress={handleLogWaste}
          >
            <Text style={[styles.ctaButtonText, { color: isDark ? '#1e40af' : '#ffffff' }]}>
              Start Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 16,
    color: '#64748b',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginLeft: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  viewAllText: {
    fontSize: 14,
    color: '#22c55e',
    fontWeight: '500',
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
    marginTop: 8,
  },
  activityList: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  activityContent: {
    flex: 1,
  },
  activityDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 12,
    color: '#64748b',
  },
  activityCredits: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  positiveCredits: {
    color: '#22c55e',
  },
  negativeCredits: {
    color: '#ef4444',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  // New styles for environmental impact and benefits sections
  impactCard: {
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  impactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  impactTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  impactStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  impactStat: {
    alignItems: 'center',
  },
  impactValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  impactLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  howItWorksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  stepCard: {
    flex: 1,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumberText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 12,
    textAlign: 'center',
    color: '#6b7280',
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 12,
  },
  benefitCard: {
    flex: 1,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  benefitDescription: {
    fontSize: 12,
    textAlign: 'center',
    color: '#6b7280',
  },
  ctaCard: {
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ctaDescription: {
    fontSize: 14,
    marginBottom: 20,
  },
  ctaButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});