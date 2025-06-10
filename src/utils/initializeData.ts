import AsyncStorage from '@react-native-async-storage/async-storage';
import { GlycemiaReading, Reminder } from '../types';

const KEYS = {
  GLYCEMIA_READINGS: 'glycemia_readings',
  REMINDERS: 'reminders',
  DATA_INITIALIZED: 'data_initialized',
};

// Note: No more fake data - users will add their own real data
// Application starts with empty reminders and glycemia readings

export const initializeAppData = async (): Promise<void> => {
  try {
    console.log('Initializing app data...');

    // ALWAYS initialize empty glycemia readings (no fake data ever)
    await AsyncStorage.setItem(KEYS.GLYCEMIA_READINGS, JSON.stringify([]));

    // ALWAYS initialize empty reminders (no fake data ever)
    await AsyncStorage.setItem(KEYS.REMINDERS, JSON.stringify([]));

    // Mark as initialized
    await AsyncStorage.setItem(KEYS.DATA_INITIALIZED, 'true');

    console.log('App data initialized successfully - starting with empty data');
  } catch (error) {
    console.error('Error initializing app data:', error);
  }
};

export const resetAppData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      KEYS.GLYCEMIA_READINGS,
      KEYS.REMINDERS,
      KEYS.DATA_INITIALIZED,
    ]);
    console.log('App data reset successfully');
  } catch (error) {
    console.error('Error resetting app data:', error);
  }
};

export const clearGlycemiaData = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.GLYCEMIA_READINGS, JSON.stringify([]));
    console.log('Glycemia data cleared successfully');
  } catch (error) {
    console.error('Error clearing glycemia data:', error);
  }
};

export const clearRemindersData = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.REMINDERS, JSON.stringify([]));
    console.log('Reminders data cleared');
  } catch (error) {
    console.error('Error clearing reminders data:', error);
  }
};
