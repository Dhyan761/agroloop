import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useActivity } from '../context/ActivityContext';
import { useAuth } from '../context/AuthContext';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChevronLeft, Bell, Moon, Sun, Smartphone, Wifi, Shield, Info } from 'lucide-react-native';

export default function SettingsScreen() {
  const { t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { clearActivities } = useActivity();
  const { signOut } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [dataUsage, setDataUsage] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your activities, credits, and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear all AsyncStorage data
              await AsyncStorage.clear();
              
              // Clear activities from context
              clearActivities();
              
              // Reset local state
              setNotifications(true);
              setPushNotifications(true);
              setEmailNotifications(false);
              setAutoSync(true);
              setDataUsage(false);
              
                             Alert.alert(
                 'Success', 
                 'All data has been cleared successfully. Your activities, credits, and settings have been reset.',
                 [
                   {
                     text: 'OK',
                     onPress: () => {
                       // Navigate back to home screen
                       router.replace('/(tabs)');
                     }
                   }
                 ]
               );
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Error', 'Failed to clear data. Please try again.');
            }
          },
        },
      ]
    );
  };

  const settingsSections = [
    {
      title: 'Appearance',
      items: [
        {
          icon: isDark ? <Moon size={20} color="#6b7280" /> : <Sun size={20} color="#6b7280" />,
          title: 'Dark Mode',
          subtitle: 'Switch between light and dark themes',
          type: 'toggle',
          value: isDark,
          onPress: toggleTheme,
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          icon: <Bell size={20} color="#6b7280" />,
          title: 'Push Notifications',
          subtitle: 'Receive notifications on your device',
          type: 'toggle',
          value: pushNotifications,
          onPress: () => setPushNotifications(!pushNotifications),
        },
        {
          icon: <Bell size={20} color="#6b7280" />,
          title: 'Email Notifications',
          subtitle: 'Receive notifications via email',
          type: 'toggle',
          value: emailNotifications,
          onPress: () => setEmailNotifications(!emailNotifications),
        },
        {
          icon: <Bell size={20} color="#6b7280" />,
          title: 'Activity Reminders',
          subtitle: 'Get reminded to log waste regularly',
          type: 'toggle',
          value: notifications,
          onPress: () => setNotifications(!notifications),
        },
      ],
    },
    {
      title: 'Data & Sync',
      items: [
        {
          icon: <Wifi size={20} color="#6b7280" />,
          title: 'Auto Sync',
          subtitle: 'Automatically sync data when online',
          type: 'toggle',
          value: autoSync,
          onPress: () => setAutoSync(!autoSync),
        },
        {
          icon: <Smartphone size={20} color="#6b7280" />,
          title: 'Data Usage',
          subtitle: 'Use mobile data for syncing',
          type: 'toggle',
          value: dataUsage,
          onPress: () => setDataUsage(!dataUsage),
        },
      ],
    },
    {
      title: 'Privacy & Security',
      items: [
        {
          icon: <Shield size={20} color="#6b7280" />,
          title: 'Privacy Policy',
          subtitle: 'View our privacy policy',
          type: 'link',
          onPress: () => {
            // TODO: Navigate to privacy policy
            Alert.alert('Privacy Policy', 'Privacy policy content would be displayed here.');
          },
        },
        {
          icon: <Info size={20} color="#6b7280" />,
          title: 'Terms of Service',
          subtitle: 'View our terms of service',
          type: 'link',
          onPress: () => {
            // TODO: Navigate to terms of service
            Alert.alert('Terms of Service', 'Terms of service content would be displayed here.');
          },
        },
      ],
    },
    {
      title: 'Data Management',
      items: [
        {
          icon: <Info size={20} color="#ef4444" />,
          title: 'Clear All Data',
          subtitle: 'Permanently delete all your data',
          type: 'danger',
          onPress: handleClearData,
        },
      ],
    },
  ];

  const renderSettingItem = (item: any) => (
    <TouchableOpacity
      key={item.title}
      style={[styles.settingItem, { backgroundColor: isDark ? '#374151' : '#ffffff' }]}
      onPress={item.onPress}
      disabled={item.type === 'toggle'}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          {item.icon}
        </View>
        <View style={styles.settingContent}>
          <Text style={[styles.settingTitle, { color: isDark ? '#ffffff' : '#111827' }]}>
            {item.title}
          </Text>
          <Text style={[styles.settingSubtitle, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
            {item.subtitle}
          </Text>
        </View>
      </View>
      {item.type === 'toggle' && (
        <Switch
          value={item.value}
          onValueChange={item.onPress}
          trackColor={{ false: '#e5e7eb', true: '#22c55e' }}
          thumbColor={item.value ? '#ffffff' : '#ffffff'}
        />
      )}
      {item.type === 'link' && (
        <Text style={[styles.settingArrow, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
          ›
        </Text>
      )}
      {item.type === 'danger' && (
        <Text style={[styles.settingArrow, { color: '#ef4444' }]}>
          ›
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1f2937' : '#ffffff' }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft size={24} color={isDark ? '#ffffff' : '#111827'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? '#ffffff' : '#111827' }]}>
          Settings
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {settingsSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#111827' }]}>
              {section.title}
            </Text>
            <View style={styles.sectionContent}>
              {section.items.map(renderSettingItem)}
            </View>
          </View>
        ))}

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
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sectionContent: {
    backgroundColor: '#f8fafc',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
  },
  settingArrow: {
    fontSize: 18,
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