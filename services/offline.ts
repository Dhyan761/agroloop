// Offline storage and sync service
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OfflineWasteLog {
  id: string;
  data: any;
  timestamp: Date;
  syncStatus: 'pending' | 'failed' | 'synced';
}

export class OfflineService {
  private static readonly WASTE_LOGS_KEY = 'offline_waste_logs';
  private static readonly USER_DATA_KEY = 'cached_user_data';

  static async storeWasteLogOffline(log: any): Promise<void> {
    try {
      const existingLogs = await this.getOfflineWasteLogs();
      const newLog: OfflineWasteLog = {
        id: Date.now().toString(),
        data: log,
        timestamp: new Date(),
        syncStatus: 'pending',
      };
      
      existingLogs.push(newLog);
      await AsyncStorage.setItem(this.WASTE_LOGS_KEY, JSON.stringify(existingLogs));
    } catch (error) {
      console.error('Failed to store waste log offline:', error);
    }
  }

  static async getOfflineWasteLogs(): Promise<OfflineWasteLog[]> {
    try {
      const logsJson = await AsyncStorage.getItem(this.WASTE_LOGS_KEY);
      return logsJson ? JSON.parse(logsJson) : [];
    } catch (error) {
      console.error('Failed to retrieve offline waste logs:', error);
      return [];
    }
  }

  static async syncPendingLogs(): Promise<void> {
    try {
      const pendingLogs = await this.getOfflineWasteLogs();
      const unsyncedLogs = pendingLogs.filter(log => log.syncStatus === 'pending');

      for (const log of unsyncedLogs) {
        try {
          // TODO: Sync with Firebase
          console.log('Syncing log:', log.id);
          log.syncStatus = 'failed'; // Will be 'synced' when Firebase is integrated
        } catch (error) {
          log.syncStatus = 'failed';
          console.error('Failed to sync log:', log.id, error);
        }
      }

      await AsyncStorage.setItem(this.WASTE_LOGS_KEY, JSON.stringify(pendingLogs));
    } catch (error) {
      console.error('Failed to sync pending logs:', error);
    }
  }

  static async clearSyncedLogs(): Promise<void> {
    try {
      const allLogs = await this.getOfflineWasteLogs();
      const pendingLogs = allLogs.filter(log => log.syncStatus !== 'synced');
      await AsyncStorage.setItem(this.WASTE_LOGS_KEY, JSON.stringify(pendingLogs));
    } catch (error) {
      console.error('Failed to clear synced logs:', error);
    }
  }

  static async cacheUserData(userData: any): Promise<void> {
    try {
      await AsyncStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to cache user data:', error);
    }
  }

  static async getCachedUserData(): Promise<any | null> {
    try {
      const userDataJson = await AsyncStorage.getItem(this.USER_DATA_KEY);
      return userDataJson ? JSON.parse(userDataJson) : null;
    } catch (error) {
      console.error('Failed to retrieve cached user data:', error);
      return null;
    }
  }
}