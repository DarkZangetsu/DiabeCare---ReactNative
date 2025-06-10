import AsyncStorage from '@react-native-async-storage/async-storage';
import { GlycemiaReading, Reminder, Meal } from '../types';

const KEYS = {
  GLYCEMIA_READINGS: 'glycemia_readings',
  REMINDERS: 'reminders',
  MEALS: 'meals',
};

// Glycemia readings storage
export const saveGlycemiaReading = async (reading: GlycemiaReading): Promise<void> => {
  try {
    const existingReadings = await getGlycemiaReadings();
    const updatedReadings = [...existingReadings, reading];
    await AsyncStorage.setItem(KEYS.GLYCEMIA_READINGS, JSON.stringify(updatedReadings));
  } catch (error) {
    console.error('Error saving glycemia reading:', error);
    throw error;
  }
};

export const getGlycemiaReadings = async (): Promise<GlycemiaReading[]> => {
  try {
    const readings = await AsyncStorage.getItem(KEYS.GLYCEMIA_READINGS);
    if (readings) {
      const parsedReadings = JSON.parse(readings);
      // Convert date strings back to Date objects
      return parsedReadings.map((reading: any) => ({
        ...reading,
        date: new Date(reading.date),
      }));
    }
    return [];
  } catch (error) {
    console.error('Error getting glycemia readings:', error);
    return [];
  }
};

export const deleteGlycemiaReading = async (id: string): Promise<void> => {
  try {
    const existingReadings = await getGlycemiaReadings();
    const updatedReadings = existingReadings.filter(reading => reading.id !== id);
    await AsyncStorage.setItem(KEYS.GLYCEMIA_READINGS, JSON.stringify(updatedReadings));
  } catch (error) {
    console.error('Error deleting glycemia reading:', error);
    throw error;
  }
};

// Reminders storage
export const saveReminder = async (reminder: Reminder): Promise<void> => {
  try {
    const existingReminders = await getReminders();
    const updatedReminders = [...existingReminders, reminder];
    await AsyncStorage.setItem(KEYS.REMINDERS, JSON.stringify(updatedReminders));
  } catch (error) {
    console.error('Error saving reminder:', error);
    throw error;
  }
};

export const getReminders = async (): Promise<Reminder[]> => {
  try {
    const reminders = await AsyncStorage.getItem(KEYS.REMINDERS);
    return reminders ? JSON.parse(reminders) : [];
  } catch (error) {
    console.error('Error getting reminders:', error);
    return [];
  }
};

export const updateReminder = async (updatedReminder: Reminder): Promise<void> => {
  try {
    const existingReminders = await getReminders();
    const updatedReminders = existingReminders.map(reminder =>
      reminder.id === updatedReminder.id ? updatedReminder : reminder
    );
    await AsyncStorage.setItem(KEYS.REMINDERS, JSON.stringify(updatedReminders));
  } catch (error) {
    console.error('Error updating reminder:', error);
    throw error;
  }
};

export const deleteReminder = async (id: string): Promise<void> => {
  try {
    const existingReminders = await getReminders();
    const updatedReminders = existingReminders.filter(reminder => reminder.id !== id);
    await AsyncStorage.setItem(KEYS.REMINDERS, JSON.stringify(updatedReminders));
  } catch (error) {
    console.error('Error deleting reminder:', error);
    throw error;
  }
};

// Meals storage
export const saveMeal = async (meal: Meal): Promise<void> => {
  try {
    const existingMeals = await getMeals();
    const updatedMeals = [...existingMeals, meal];
    await AsyncStorage.setItem(KEYS.MEALS, JSON.stringify(updatedMeals));
  } catch (error) {
    console.error('Error saving meal:', error);
    throw error;
  }
};

export const getMeals = async (): Promise<Meal[]> => {
  try {
    const meals = await AsyncStorage.getItem(KEYS.MEALS);
    if (meals) {
      const parsedMeals = JSON.parse(meals);
      return parsedMeals.map((meal: any) => ({
        ...meal,
        date: new Date(meal.date),
      }));
    }
    return [];
  } catch (error) {
    console.error('Error getting meals:', error);
    return [];
  }
};

// Utility functions
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([KEYS.GLYCEMIA_READINGS, KEYS.REMINDERS, KEYS.MEALS]);
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
};
