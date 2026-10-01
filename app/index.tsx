import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Sprout } from 'lucide-react-native';

export default function IndexScreen() {
  useEffect(() => {
    // Simulate checking authentication status
    const timer = setTimeout(() => {
      // TODO: Check if user is authenticated via Firebase
      // For now, redirect to login
      router.replace('/auth/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Sprout size={64} color="#22c55e" />
        <Text style={styles.appName}>AgroLoop</Text>
        <Text style={styles.tagline}>Circular Agriculture Platform</Text>
      </View>
      <View style={styles.loadingIndicator}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  loadingIndicator: {
    marginTop: 48,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
});