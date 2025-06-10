import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GlycemiaReading } from '../types';
import { getGlycemiaReadings, saveGlycemiaReading, deleteGlycemiaReading } from '../utils/storage';

export const useGlycemia = () => {
  const [readings, setReadings] = useState<GlycemiaReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReadings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getGlycemiaReadings();
      setReadings(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addReading = async (reading: Omit<GlycemiaReading, 'id'>) => {
    try {
      const newReading: GlycemiaReading = {
        ...reading,
        id: Date.now().toString(),
        unit: reading.unit || 'mg/dL', // Default to mg/dL if not specified
      };
      await saveGlycemiaReading(newReading);
      await loadReadings();
      return newReading;
    } catch (err) {
      setError('Erreur lors de l\'ajout de la mesure');
      console.error(err);
      throw err;
    }
  };

  const removeReading = async (id: string) => {
    try {
      await deleteGlycemiaReading(id);
      await loadReadings();
    } catch (err) {
      setError('Erreur lors de la suppression');
      console.error(err);
      throw err;
    }
  };

  const getLastSevenDays = () => {
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return readings.filter(reading => 
      new Date(reading.date) >= sevenDaysAgo && new Date(reading.date) <= today
    );
  };

  const getAverageGlycemia = (days: number = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentReadings = readings.filter(reading => 
      new Date(reading.date) >= cutoffDate
    );
    
    if (recentReadings.length === 0) return 0;
    
    const sum = recentReadings.reduce((acc, reading) => acc + reading.value, 0);
    return Math.round(sum / recentReadings.length);
  };

  const getLatestReading = () => {
    return readings.length > 0 ? readings[0] : null;
  };

  useEffect(() => {
    loadReadings();
  }, []);

  const updateReading = async (id: string, updatedReading: Partial<Omit<GlycemiaReading, 'id'>>) => {
    try {
      const existingReadings = await getGlycemiaReadings();
      const updatedReadings = existingReadings.map(reading =>
        reading.id === id ? { ...reading, ...updatedReading } : reading
      );
      await AsyncStorage.setItem('glycemia_readings', JSON.stringify(updatedReadings));
      await loadReadings();
    } catch (err) {
      setError('Erreur lors de la modification');
      console.error(err);
      throw err;
    }
  };

  return {
    readings,
    loading,
    error,
    addReading,
    updateReading,
    removeReading,
    loadReadings,
    getLastSevenDays,
    getAverageGlycemia,
    getLatestReading,
  };
};
