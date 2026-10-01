import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

export interface Activity {
  id: string;
  type: 'waste_log' | 'disease_detection' | 'reward_redemption';
  title: string;
  date: string;
  credits?: number;
  severity?: string;
  verificationCode?: string;
  wasteType?: string;
  quantity?: number;
  location?: string;
}

interface ActivityContextType {
  activities: Activity[];
  wasteLogged: number;
  ecoCredits: number;
  addActivity: (activity: Omit<Activity, 'id' | 'date'>) => void;
  clearActivities: () => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
};

interface ActivityProviderProps {
  children: React.ReactNode;
}

export const ActivityProvider: React.FC<ActivityProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [wasteLogged, setWasteLogged] = useState(0);
  const [ecoCredits, setEcoCredits] = useState(0);

  // Get user-specific storage keys
  const getStorageKeys = (userId: string) => ({
    activities: `activities_${userId}`,
    wasteLogged: `wasteLogged_${userId}`,
    ecoCredits: `ecoCredits_${userId}`,
  });

  useEffect(() => {
    // Load saved activities from AsyncStorage for the current user
    const loadActivities = async () => {
      if (!user?.uid) return;
      
      const keys = getStorageKeys(user.uid);
      
      try {
        const savedActivities = await AsyncStorage.getItem(keys.activities);
        const savedWasteLogged = await AsyncStorage.getItem(keys.wasteLogged);
        const savedEcoCredits = await AsyncStorage.getItem(keys.ecoCredits);
        
        if (savedActivities) {
          setActivities(JSON.parse(savedActivities));
        } else {
          setActivities([]);
        }
        if (savedWasteLogged) {
          setWasteLogged(parseInt(savedWasteLogged));
        } else {
          setWasteLogged(0);
        }
        if (savedEcoCredits) {
          setEcoCredits(parseInt(savedEcoCredits));
        } else {
          setEcoCredits(0);
        }
      } catch (error) {
        console.log('Error loading activities:', error);
        // Reset to default values if there's an error
        setActivities([]);
        setWasteLogged(0);
        setEcoCredits(0);
      }
    };

    loadActivities();
  }, [user?.uid]);

  const addActivity = async (activityData: Omit<Activity, 'id' | 'date'>) => {
    if (!user?.uid) return;
    
    const keys = getStorageKeys(user.uid);
    
    const newActivity: Activity = {
      ...activityData,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
    };

    const updatedActivities = [newActivity, ...activities];
    setActivities(updatedActivities);

    // Update eco credits based on activity type
    if (activityData.credits !== undefined) {
      const newEcoCredits = ecoCredits + activityData.credits;
      setEcoCredits(newEcoCredits);

      // Update waste logged count only for positive waste_log activities
      if (activityData.type === 'waste_log' && activityData.credits > 0) {
        const newWasteLogged = wasteLogged + 1;
        setWasteLogged(newWasteLogged);

        // Save to AsyncStorage
        try {
          await AsyncStorage.setItem(keys.activities, JSON.stringify(updatedActivities));
          await AsyncStorage.setItem(keys.wasteLogged, newWasteLogged.toString());
          await AsyncStorage.setItem(keys.ecoCredits, newEcoCredits.toString());
        } catch (error) {
          console.log('Error saving activity:', error);
        }
      } else {
        // Save only activities and eco credits for other types
        try {
          await AsyncStorage.setItem(keys.activities, JSON.stringify(updatedActivities));
          await AsyncStorage.setItem(keys.ecoCredits, newEcoCredits.toString());
        } catch (error) {
          console.log('Error saving activity:', error);
        }
      }
    } else {
      // Save only activities for disease detection (no credit change)
      try {
        await AsyncStorage.setItem(keys.activities, JSON.stringify(updatedActivities));
      } catch (error) {
        console.log('Error saving activity:', error);
      }
    }
  };

  const clearActivities = async () => {
    if (!user?.uid) return;
    
    const keys = getStorageKeys(user.uid);
    
    setActivities([]);
    setWasteLogged(0);
    setEcoCredits(0);
    
    try {
      await AsyncStorage.removeItem(keys.activities);
      await AsyncStorage.removeItem(keys.wasteLogged);
      await AsyncStorage.removeItem(keys.ecoCredits);
    } catch (error) {
      console.log('Error clearing activities:', error);
    }
  };

  const value = {
    activities,
    wasteLogged,
    ecoCredits,
    addActivity,
    clearActivities,
  };

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  );
}; 