import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { Reminder } from '../types';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  static async requestPermissions(): Promise<boolean> {
    try {
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        
        if (finalStatus !== 'granted') {
          console.log('Failed to get push token for push notification!');
          return false;
        }
        
        // Configure notification channel for Android
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('diabecare-reminders', {
            name: 'DiabeCare Rappels',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#3b82f6',
            sound: 'default',
          });
        }
        
        return true;
      } else {
        console.log('Must use physical device for Push Notifications');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  static async scheduleReminderNotification(reminder: Reminder): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      // Parse time (format: "HH:MM")
      const [hours, minutes] = reminder.time.split(':').map(Number);
      
      // Create trigger for daily notification
      const trigger: Notifications.NotificationTriggerInput = {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: hours,
        minute: minutes,
        repeats: true,
      };

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: reminder.title,
          body: reminder.description,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
          categoryIdentifier: 'reminder',
          data: {
            reminderId: reminder.id,
            type: reminder.type,
          },
        },
        trigger,
      });

      console.log(`Scheduled notification for reminder ${reminder.id}: ${notificationId}`);
      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  }

  static async cancelReminderNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log(`Cancelled notification: ${notificationId}`);
    } catch (error) {
      console.error('Error cancelling notification:', error);
    }
  }

  static async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('Cancelled all notifications');
    } catch (error) {
      console.error('Error cancelling all notifications:', error);
    }
  }

  static async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  static async rescheduleAllReminders(reminders: Reminder[]): Promise<void> {
    try {
      // Cancel all existing notifications
      await this.cancelAllNotifications();
      
      // Schedule notifications for active reminders
      for (const reminder of reminders) {
        if (reminder.isActive) {
          await this.scheduleReminderNotification(reminder);
        }
      }
      
      console.log(`Rescheduled ${reminders.filter(r => r.isActive).length} reminder notifications`);
    } catch (error) {
      console.error('Error rescheduling reminders:', error);
    }
  }

  static getNotificationIcon(type: Reminder['type']): string {
    switch (type) {
      case 'medication':
        return '💊';
      case 'measurement':
        return '🩸';
      case 'meal':
        return '🍽️';
      case 'exercise':
        return '🏃‍♂️';
      default:
        return '⏰';
    }
  }

  static async testNotification(): Promise<void> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.log('No notification permission');
        return;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Test DiabeCare',
          body: 'Les notifications fonctionnent correctement !',
          sound: 'default',
        },
        trigger: { seconds: 2 },
      });
      
      console.log('Test notification scheduled');
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  }
}

// Notification response handler
export const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
  const data = response.notification.request.content.data;
  console.log('Notification tapped:', data);
  
  // Here you can navigate to specific screens based on the notification data
  // For example, navigate to the reminders screen or add glycemia screen
};

// Set up notification response listener
Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);
