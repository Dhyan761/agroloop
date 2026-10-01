import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useActivity } from '../../context/ActivityContext';
import { router } from 'expo-router';
import {
  User,
  LogOut,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Settings,
  ChevronRight,
  Globe,
  BarChart3,
  FileText,
  Shield,
  QrCode,
} from 'lucide-react-native';

export default function ProfileScreen() {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const { isDark } = useTheme();
  const { ecoCredits, wasteLogged } = useActivity();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      t('logout'),
      t('logoutConfirm'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('logout'),
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              await signOut();
              // Navigate to login screen after successful logout
              router.replace('/auth/login');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert(t('error'), 'Failed to logout. Please try again.');
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  const profileOptions = [
    {
      icon: <Globe size={20} color={isDark ? '#ffffff' : '#374151'} />,
      title: 'Language Settings',
      subtitle: 'Change app language',
      onPress: () => {
        router.push('/language-settings');
      },
    },
    {
      icon: <BarChart3 size={20} color={isDark ? '#ffffff' : '#374151'} />,
      title: 'Statistics & Analytics',
      subtitle: 'View detailed farming metrics',
      onPress: () => {
        router.push('/statistics-analytics');
      },
    },
    {
      icon: <FileText size={20} color={isDark ? '#ffffff' : '#374151'} />,
      title: 'Activity History',
      subtitle: 'View all your logged activities',
      onPress: () => {
        router.push('/activity-history');
      },
    },
    {
      icon: <QrCode size={20} color={isDark ? '#ffffff' : '#374151'} />,
      title: 'My Verification Codes',
      subtitle: 'View your verification codes and history',
      onPress: () => {
        router.push('/verification-codes');
      },
    },
    {
      icon: <Settings size={20} color={isDark ? '#ffffff' : '#374151'} />,
      title: 'Settings',
      subtitle: 'App preferences and notifications',
      onPress: () => {
        router.push('/settings');
      },
    },
    {
      icon: <Shield size={20} color={isDark ? '#ffffff' : '#374151'} />,
      title: 'Privacy & Security',
      subtitle: 'Manage your privacy settings',
      onPress: () => {
        router.push('/privacy-security');
      },
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1f2937' : '#ffffff' }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: isDark ? '#ffffff' : '#111827' }]}>
            {t('profile')}
          </Text>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: '#22c55e' }]}>
              <User size={32} color="#ffffff" />
            </View>
          </View>
          <Text style={[styles.userName, { color: isDark ? '#ffffff' : '#111827' }]}>
            As
          </Text>
          <Text style={[styles.userRole, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
            Farmer
          </Text>
          
          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: isDark ? '#ffffff' : '#111827' }]}>
                ₹{ecoCredits.toLocaleString()}
              </Text>
              <Text style={[styles.statLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                {t('ecoCredits')}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: isDark ? '#ffffff' : '#111827' }]}>
                {wasteLogged}
              </Text>
              <Text style={[styles.statLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                {t('wasteLogged')}
              </Text>
            </View>
            <View style={styles.statDivider} />
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#111827' }]}>
            {t('personalInformation')}
          </Text>
          
          <View style={styles.infoItem}>
            <Mail size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                Email
              </Text>
              <Text style={[styles.infoValue, { color: isDark ? '#ffffff' : '#111827' }]}>
                as@gmail.com
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Phone size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                Phone
              </Text>
              <Text style={[styles.infoValue, { color: isDark ? '#ffffff' : '#111827' }]}>
                1234567890
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <MapPin size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                Location
              </Text>
              <Text style={[styles.infoValue, { color: isDark ? '#ffffff' : '#111827' }]}>
                Punjab, India
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Calendar size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                {t('memberSince')}
              </Text>
              <Text style={[styles.infoValue, { color: isDark ? '#ffffff' : '#111827' }]}>
                {t('january2024')}
              </Text>
            </View>
          </View>
        </View>

        {/* Options */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#111827' }]}>
            {t('options')}
          </Text>
          
          {profileOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionItem}
              onPress={option.onPress}
            >
              <View style={styles.optionLeft}>
                {option.icon}
                <View style={styles.optionContent}>
                  <Text style={[styles.optionTitle, { color: isDark ? '#ffffff' : '#111827' }]}>
                    {option.title}
                  </Text>
                  <Text style={[styles.optionSubtitle, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                    {option.subtitle}
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: isDark ? '#dc2626' : '#ef4444' }]}
          onPress={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut size={20} color="#ffffff" />
          <Text style={styles.logoutText}>
            {isLoggingOut ? t('loading') : t('logout')}
          </Text>
        </TouchableOpacity>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
            Version 1.0.0
          </Text>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 40,
  },
  statDivider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionContent: {
    marginLeft: 12,
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 12,
  },
}); 