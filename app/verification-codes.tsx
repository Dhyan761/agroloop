import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { verificationService, VerificationCode } from '../services/verification';
import { router } from 'expo-router';
import {
  ArrowLeft,
  QrCode,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  RefreshCw,
} from 'lucide-react-native';

export default function VerificationCodesScreen() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { isDark } = useTheme();
  
  const [codes, setCodes] = useState<VerificationCode[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    used: 0,
    active: 0,
    expired: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadCodes = async () => {
    if (!user?.uid) return;

    try {
      const farmerCodes = await verificationService.getFarmerVerificationCodes(user.uid);
      const farmerStats = await verificationService.getVerificationStats(user.uid);
      
      setCodes(farmerCodes);
      setStats(farmerStats);
    } catch (error) {
      console.error('Error loading verification codes:', error);
      Alert.alert(t('error'), t('failedToLoadCodes'));
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCodes();
  }, [user?.uid]);

  const onRefresh = () => {
    setRefreshing(true);
    loadCodes();
  };

  const cleanupExpiredCodes = async () => {
    try {
      await verificationService.cleanupExpiredCodes();
      await loadCodes();
      Alert.alert(t('success'), t('expiredCodesCleaned'));
    } catch (error) {
      console.error('Error cleaning up expired codes:', error);
      Alert.alert(t('error'), t('cleanupFailed'));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) <= new Date();
  };

  const getCodeStatus = (code: VerificationCode) => {
    if (code.isUsed) {
      return { status: 'used', icon: <CheckCircle size={16} color="#22c55e" />, text: t('used') };
    } else if (isExpired(code.expiresAt)) {
      return { status: 'expired', icon: <XCircle size={16} color="#ef4444" />, text: t('expired') };
    } else {
      return { status: 'active', icon: <Clock size={16} color="#f59e0b" />, text: t('active') };
    }
  };

  const renderCodeCard = (code: VerificationCode) => {
    const status = getCodeStatus(code);
    
    return (
      <View key={code.id} style={[styles.codeCard, { backgroundColor: isDark ? '#374151' : '#ffffff' }]}>
        <View style={styles.codeHeader}>
          <View style={styles.codeInfo}>
            <Text style={[styles.codeText, { color: isDark ? '#ffffff' : '#111827' }]}>
              {code.code}
            </Text>
            <View style={styles.statusContainer}>
              {status.icon}
              <Text style={[styles.statusText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                {status.text}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.codeDetails}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              {t('wasteType')}:
            </Text>
            <Text style={[styles.detailValue, { color: isDark ? '#ffffff' : '#111827' }]}>
              {code.wasteType}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              {t('quantity')}:
            </Text>
            <Text style={[styles.detailValue, { color: isDark ? '#ffffff' : '#111827' }]}>
              {code.quantity} kg
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              {t('location')}:
            </Text>
            <Text style={[styles.detailValue, { color: isDark ? '#ffffff' : '#111827' }]}>
              {code.location}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              {t('created')}:
            </Text>
            <Text style={[styles.detailValue, { color: isDark ? '#ffffff' : '#111827' }]}>
              {formatDate(code.createdAt)}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              {t('expires')}:
            </Text>
            <Text style={[styles.detailValue, { color: isDark ? '#ffffff' : '#111827' }]}>
              {formatDate(code.expiresAt)}
            </Text>
          </View>
          
          {code.isUsed && code.usedAt && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                {t('usedAt')}:
              </Text>
              <Text style={[styles.detailValue, { color: isDark ? '#ffffff' : '#111827' }]}>
                {formatDate(code.usedAt)}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1f2937' : '#ffffff' }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={isDark ? '#ffffff' : '#111827'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? '#ffffff' : '#111827' }]}>
          {t('verificationCodes')}
        </Text>
        <View style={styles.generateButton} />
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: isDark ? '#374151' : '#ffffff' }]}>
            <Text style={[styles.statValue, { color: isDark ? '#ffffff' : '#111827' }]}>
              {stats.total}
            </Text>
            <Text style={[styles.statLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              {t('totalCodes')}
            </Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: isDark ? '#374151' : '#ffffff' }]}>
            <Text style={[styles.statValue, { color: '#22c55e' }]}>
              {stats.used}
            </Text>
            <Text style={[styles.statLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              {t('usedCodes')}
            </Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: isDark ? '#374151' : '#ffffff' }]}>
            <Text style={[styles.statValue, { color: '#f59e0b' }]}>
              {stats.active}
            </Text>
            <Text style={[styles.statLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              {t('activeCodes')}
            </Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: isDark ? '#374151' : '#ffffff' }]}>
            <Text style={[styles.statValue, { color: '#ef4444' }]}>
              {stats.expired}
            </Text>
            <Text style={[styles.statLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              {t('expiredCodes')}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: isDark ? '#374151' : '#f3f4f6' }]}
            onPress={cleanupExpiredCodes}
          >
            <RefreshCw size={16} color="#6b7280" />
            <Text style={[styles.actionButtonText, { color: isDark ? '#ffffff' : '#111827' }]}>
              {t('cleanupExpired')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Codes List */}
        <View style={styles.codesContainer}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#111827' }]}>
            {t('allCodes')} ({codes.length})
          </Text>
          
          {codes.length === 0 ? (
            <View style={styles.emptyState}>
              <QrCode size={48} color={isDark ? '#9ca3af' : '#6b7280'} />
              <Text style={[styles.emptyStateText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                {t('noVerificationCodes')}
              </Text>
              <Text style={[styles.emptyStateSubtext, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                {t('noCodesYet')}
              </Text>
            </View>
          ) : (
            codes.map(renderCodeCard)
          )}
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
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  generateButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  codesContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  codeCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  codeHeader: {
    marginBottom: 12,
  },
  codeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  codeText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  codeDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
}); 