import { useState, useEffect, useCallback } from 'react';
import { Reminder } from '../types';
import { getReminders, saveReminder, updateReminder, deleteReminder } from '../utils/storage';
import { NotificationService } from '../services/notificationService';

export const useReminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReminders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReminders();
      setReminders(data.sort((a, b) => a.time.localeCompare(b.time)));
    } catch (err) {
      setError('Erreur lors du chargement des rappels');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addReminder = async (reminder: Omit<Reminder, 'id'>) => {
    try {
      const newReminder: Reminder = {
        ...reminder,
        id: Date.now().toString(),
      };
      await saveReminder(newReminder);

      // Schedule notification if reminder is active
      if (newReminder.isActive) {
        await NotificationService.scheduleReminderNotification(newReminder);
      }

      await loadReminders();
      return newReminder;
    } catch (err) {
      setError('Erreur lors de l\'ajout du rappel');
      console.error(err);
      throw err;
    }
  };

  const toggleReminder = async (id: string) => {
    try {
      const reminder = reminders.find(r => r.id === id);
      if (reminder) {
        const updatedReminder = { ...reminder, isActive: !reminder.isActive };
        await updateReminder(updatedReminder);

        // Reschedule all notifications to ensure consistency
        const allReminders = await getReminders();
        const updatedReminders = allReminders.map(r =>
          r.id === id ? updatedReminder : r
        );
        await NotificationService.rescheduleAllReminders(updatedReminders);

        await loadReminders();
      }
    } catch (err) {
      setError('Erreur lors de la modification du rappel');
      console.error(err);
      throw err;
    }
  };

  const removeReminder = async (id: string) => {
    try {
      await deleteReminder(id);

      // Reschedule all notifications after deletion
      const remainingReminders = await getReminders();
      await NotificationService.rescheduleAllReminders(remainingReminders);

      await loadReminders();
    } catch (err) {
      setError('Erreur lors de la suppression');
      console.error(err);
      throw err;
    }
  };

  const getActiveReminders = () => {
    return reminders.filter(reminder => reminder.isActive);
  };

  const getNextReminder = () => {
    const activeReminders = getActiveReminders();
    const now = new Date();
    const currentTime = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    
    // Find next reminder for today
    const todayReminders = activeReminders.filter(r => r.time > currentTime);
    if (todayReminders.length > 0) {
      return todayReminders.sort((a, b) => a.time.localeCompare(b.time))[0];
    }
    
    // If no more reminders today, return first reminder of tomorrow
    return activeReminders.sort((a, b) => a.time.localeCompare(b.time))[0];
  };

  const getRemindersByType = (type: Reminder['type']) => {
    return reminders.filter(reminder => reminder.type === type);
  };

  useEffect(() => {
    const initializeReminders = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getReminders();
        setReminders(data.sort((a, b) => a.time.localeCompare(b.time)));

        // Initialize notifications on first load
        await NotificationService.rescheduleAllReminders(data);
      } catch (err) {
        setError('Erreur lors du chargement des rappels');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    initializeReminders();
  }, []); // Empty dependency array to run only once

  return {
    reminders,
    loading,
    error,
    addReminder,
    toggleReminder,
    removeReminder,
    loadReminders,
    getActiveReminders,
    getNextReminder,
    getRemindersByType,
  };
};
