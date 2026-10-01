import React from 'react';
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
import { ChevronLeft, Check } from 'lucide-react-native';
import { router } from 'expo-router';

export type Language = 'en' | 'hi' | 'pa' | 'bn' | 'kn';

export default function LanguageSettingsScreen() {
  const { language, setLanguage, t } = useLanguage();
  const { isDark } = useTheme();

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  ];

  const handleLanguageChange = async (langCode: Language) => {
    await setLanguage(langCode);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1f2937' : '#ffffff' }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft size={24} color={isDark ? '#ffffff' : '#111827'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? '#ffffff' : '#111827' }]}>
          Language Settings
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={[styles.description, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
          Choose your preferred language for the app
        </Text>

        <View style={styles.languagesContainer}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageItem,
                { backgroundColor: isDark ? '#374151' : '#ffffff' },
                language === lang.code && { borderColor: '#22c55e' }
              ]}
              onPress={() => handleLanguageChange(lang.code as Language)}
            >
              <View style={styles.languageInfo}>
                <Text style={[styles.languageName, { color: isDark ? '#ffffff' : '#111827' }]}>
                  {lang.name}
                </Text>
                <Text style={[styles.nativeName, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                  {lang.nativeName}
                </Text>
              </View>
              {language === lang.code && (
                <Check size={20} color="#22c55e" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoContainer}>
          <Text style={[styles.infoTitle, { color: isDark ? '#ffffff' : '#111827' }]}>
            Note
          </Text>
          <Text style={[styles.infoText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
            Language changes will be applied immediately. Some content may take a moment to update.
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
    padding: 20,
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  languagesContainer: {
    gap: 12,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  nativeName: {
    fontSize: 14,
  },
  infoContainer: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
}); 