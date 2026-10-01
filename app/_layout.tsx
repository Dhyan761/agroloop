import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { ActivityProvider } from '@/context/ActivityContext';

function RootLayoutContent() {
  useFrameworkReady();
  const { user, loading } = useAuth();
  const { isDark } = useTheme();

  // Check if user is authenticated
  const shouldShowLogin = !user;

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {!loading && (
          <>
            {shouldShowLogin ? (
              <Stack.Screen name="auth/login" />
            ) : (
              <Stack.Screen name="(tabs)" />
            )}
            <Stack.Screen name="auth/signup" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="privacy-security" />
            <Stack.Screen name="language-settings" />
            <Stack.Screen name="statistics-analytics" />
            <Stack.Screen name="activity-history" />
            <Stack.Screen name="verification-codes" />
            <Stack.Screen name="verification-code-generator" />
            <Stack.Screen name="+not-found" />
          </>
        )}
      </Stack>
      <StatusBar style={isDark ? "light" : "dark"} />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ActivityProvider>
          <LanguageProvider>
            <RootLayoutContent />
          </LanguageProvider>
        </ActivityProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}