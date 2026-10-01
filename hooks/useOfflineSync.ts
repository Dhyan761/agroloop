import { useEffect, useState } from 'react';
import { OfflineService } from '@/services/offline';
import NetInfo from '@react-native-community/netinfo';

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingLogsCount, setPendingLogsCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Monitor network connectivity
    const unsubscribe = NetInfo.addEventListener((state: any) => {
      setIsOnline(state.isConnected ?? false);
      
      // Auto-sync when coming back online
      if (state.isConnected && !isSyncing) {
        syncPendingData();
      }
    });

    // Check pending logs count on mount
    updatePendingLogsCount();

    return unsubscribe;
  }, []);

  const syncPendingData = async () => {
    setIsSyncing(true);
    try {
      await OfflineService.syncPendingLogs();
      await updatePendingLogsCount();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const updatePendingLogsCount = async () => {
    try {
      const offlineLogs = await OfflineService.getOfflineWasteLogs();
      const pendingCount = offlineLogs.filter(log => log.syncStatus === 'pending').length;
      setPendingLogsCount(pendingCount);
    } catch (error) {
      console.error('Failed to update pending logs count:', error);
    }
  };

  return {
    isOnline,
    pendingLogsCount,
    isSyncing,
    syncPendingData,
    updatePendingLogsCount,
  };
}