import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { ArrowUpRight, ArrowDownLeft, Coins, Calendar, Filter } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useActivity } from '../../context/ActivityContext';

interface Transaction {
  id: string;
  type: 'earned' | 'redeemed';
  amount: number;
  description: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
}

export default function TransactionsScreen() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const { activities } = useActivity();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<'all' | 'earned' | 'redeemed'>('all');

  useEffect(() => {
    // Convert activities to transactions
    const activityTransactions: Transaction[] = activities.map((activity) => ({
      id: activity.id,
      type: activity.type === 'reward_redemption' ? 'redeemed' : 'earned',
      amount: activity.type === 'waste_log' ? (activity.credits || 0) : 
              activity.type === 'reward_redemption' ? (activity.credits || 0) : 0,
      description: activity.title,
      timestamp: new Date(activity.date),
      status: 'completed' as const,
    }));
    
    setTransactions(activityTransactions);
  }, [activities]);

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#22c55e';
      case 'pending':
        return '#f59e0b';
      case 'failed':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionIcon = (type: string) => {
    if (type === 'earned') {
      return <ArrowUpRight size={20} color="#22c55e" />;
    } else {
      return <ArrowDownLeft size={20} color="#ef4444" />;
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? '#1f2937' : '#ffffff' }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#ffffff' : '#111827' }]}>{t('transactionHistory')}</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#64748b" />
        </TouchableOpacity>
      </View>

      <View style={[styles.filterContainer, { backgroundColor: isDark ? '#374151' : '#f3f4f6' }]}>
        <TouchableOpacity
          style={[
            styles.filterTab, 
            filter === 'all' && styles.activeFilterTab,
            { backgroundColor: isDark ? '#374151' : '#f3f4f6' }
          ]}
          onPress={() => setFilter('all')}
        >
          <Text style={[
            styles.filterText, 
            filter === 'all' && styles.activeFilterText,
            { color: isDark ? '#9ca3af' : '#6b7280' }
          ]}>
            {t('all')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab, 
            filter === 'earned' && styles.activeFilterTab,
            { backgroundColor: isDark ? '#374151' : '#f3f4f6' }
          ]}
          onPress={() => setFilter('earned')}
        >
          <Text style={[
            styles.filterText, 
            filter === 'earned' && styles.activeFilterText,
            { color: isDark ? '#9ca3af' : '#6b7280' }
          ]}>
            {t('earned')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab, 
            filter === 'redeemed' && styles.activeFilterTab,
            { backgroundColor: isDark ? '#374151' : '#f3f4f6' }
          ]}
          onPress={() => setFilter('redeemed')}
        >
          <Text style={[
            styles.filterText, 
            filter === 'redeemed' && styles.activeFilterText,
            { color: isDark ? '#9ca3af' : '#6b7280' }
          ]}>
            {t('redeemed')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.transactionsContainer}>
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <View key={transaction.id} style={[styles.transactionCard, { backgroundColor: isDark ? '#374151' : '#ffffff' }]}>
              <View style={styles.transactionHeader}>
                <View style={[styles.transactionIcon, { backgroundColor: isDark ? '#4b5563' : '#f3f4f6' }]}>
                  {getTransactionIcon(transaction.type)}
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={[styles.transactionDescription, { color: isDark ? '#ffffff' : '#111827' }]}>
                    {transaction.description}
                  </Text>
                  <Text style={[styles.transactionDate, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                    {formatDate(transaction.timestamp)}
                  </Text>
                </View>
                <View style={styles.transactionAmount}>
                  <Text style={[
                    styles.amountText,
                    transaction.amount > 0 ? styles.positiveAmount : styles.negativeAmount
                  ]}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                  </Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(transaction.status) + '20' }
                  ]}>
                    <Text style={[
                      styles.statusText,
                      { color: getStatusColor(transaction.status) }
                    ]}>
                      {transaction.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Coins size={48} color={isDark ? '#9ca3af' : '#cbd5e1'} />
            <Text style={[styles.emptyStateTitle, { color: isDark ? '#ffffff' : '#111827' }]}>{t('noTransactions')}</Text>
            <Text style={[styles.emptyStateText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>{t('noTransactionsDescription')}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  filterButton: {
    padding: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeFilterTab: {
    backgroundColor: '#22c55e',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeFilterText: {
    color: '#ffffff',
  },
  transactionsContainer: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  transactionCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  positiveAmount: {
    color: '#22c55e',
  },
  negativeAmount: {
    color: '#ef4444',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
}); 