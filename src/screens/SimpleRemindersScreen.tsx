import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Reminder } from '../types';
import { useReminders } from '../hooks/useReminders';

export const SimpleRemindersScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const {
    reminders,
    loading,
    toggleReminder,
    removeReminder,
    loadReminders,
    getActiveReminders,
    getNextReminder
  } = useReminders();

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // Simple refresh without causing infinite loops
      loadReminders();
    }, [])
  );

  const handleDeleteReminder = (id: string, title: string) => {
    Alert.alert(
      'Supprimer le rappel',
      `Voulez-vous vraiment supprimer le rappel "${title}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeReminder(id);
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer le rappel');
            }
          }
        }
      ]
    );
  };

  const getIconName = (type: Reminder['type']) => {
    switch (type) {
      case 'medication':
        return 'medical';
      case 'measurement':
        return 'analytics';
      case 'meal':
        return 'restaurant';
      case 'exercise':
        return 'fitness';
      default:
        return 'notifications';
    }
  };

  const getIconColor = (type: Reminder['type']) => {
    switch (type) {
      case 'medication':
        return '#ef4444';
      case 'measurement':
        return '#3b82f6';
      case 'meal':
        return '#f59e0b';
      case 'exercise':
        return '#22c55e';
      default:
        return '#6b7280';
    }
  };

  const activeReminders = getActiveReminders();
  const nextReminder = getNextReminder();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Rappels"
        rightComponent={
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation?.navigate('AddReminder')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="add-circle" size={28} color="#3b82f6" />
          </TouchableOpacity>
        }
      />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.content}>

        {/* Next Reminder Card - Only show if user has active reminders */}
        {nextReminder && reminders.length > 0 && (
          <Card style={styles.nextReminderCard}>
            <View style={styles.nextReminderContent}>
              <View style={styles.nextReminderIcon}>
                <Ionicons
                  name={getIconName(nextReminder.type)}
                  size={24}
                  color="#3b82f6"
                />
              </View>
              <View style={styles.nextReminderText}>
                <Text style={styles.nextReminderLabel}>Prochain rappel</Text>
                <Text style={styles.nextReminderTitle}>{nextReminder.title}</Text>
                <Text style={styles.nextReminderTime}>Aujourd'hui à {nextReminder.time}</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Quick Actions */}
        <Card style={styles.cardSpacing}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.quickActionsContainer}>
            <Button
              title="Mesure glycémie"
              size="sm"
              style={styles.quickActionButton}
              onPress={() => navigation?.navigate('Glycémie', { screen: 'AddGlycemia' })}
            />
            <Button
              title="Repas"
              variant="outline"
              size="sm"
              style={styles.quickActionButton}
              onPress={() => {/* Navigate to add meal */}}
            />
          </View>
        </Card>

        {/* Today's Reminders */}
        <Card style={styles.cardSpacing}>
          <Text style={styles.sectionTitle}>Aujourd'hui</Text>
          {loading ? (
            <Text style={styles.loadingText}>Chargement...</Text>
          ) : reminders.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="notifications-outline" size={48} color="#9ca3af" />
              <Text style={styles.emptyStateTitle}>Aucun rappel configuré</Text>
              <Text style={styles.emptyStateText}>
                Créez votre premier rappel pour commencer à suivre vos soins
              </Text>
            </View>
          ) : (
            <View style={styles.remindersList}>
              {reminders.map((reminder) => (
                <View key={reminder.id} style={styles.reminderItem}>
                  <View style={styles.reminderIcon}>
                    <Ionicons
                      name={getIconName(reminder.type)}
                      size={20}
                      color={getIconColor(reminder.type)}
                    />
                  </View>

                  <View style={styles.reminderContent}>
                    <Text style={[styles.reminderTitle, { opacity: reminder.isActive ? 1 : 0.5 }]}>
                      {reminder.title}
                    </Text>
                    <Text style={[styles.reminderDescription, { opacity: reminder.isActive ? 1 : 0.5 }]}>
                      {reminder.time} • {reminder.description}
                    </Text>
                  </View>

                  <View style={styles.reminderActions}>
                    <Switch
                      value={reminder.isActive}
                      onValueChange={() => toggleReminder(reminder.id)}
                      trackColor={{ false: '#f3f4f6', true: '#dbeafe' }}
                      thumbColor={reminder.isActive ? '#3b82f6' : '#9ca3af'}
                    />
                    <TouchableOpacity
                      onPress={() => handleDeleteReminder(reminder.id, reminder.title)}
                      style={styles.deleteButton}
                    >
                      <Ionicons name="trash-outline" size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </Card>

        {/* Statistics - Only show if user has reminders */}
        {reminders.length > 0 && (
          <Card style={styles.cardSpacing}>
            <Text style={styles.sectionTitle}>Statistiques</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{activeReminders.length}</Text>
                <Text style={styles.statLabel}>Actifs</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValueSecondary}>{reminders.length}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValueSecondary}>
                  {reminders.length > 0 ? Math.round((activeReminders.length / reminders.length) * 100) : 0}%
                </Text>
                <Text style={styles.statLabel}>Activés</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Add New Reminder */}
        <Button
          title="Ajouter un rappel"
          variant="outline"
          onPress={() => navigation?.navigate('AddReminder')}
          style={styles.addReminderButton}
        />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  addButton: {
    padding: 4,
  },
  cardSpacing: {
    marginBottom: 20,
  },
  nextReminderCard: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
    marginBottom: 20,
  },
  nextReminderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextReminderIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#dbeafe',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  nextReminderText: {
    flex: 1,
  },
  nextReminderLabel: {
    fontWeight: '600',
    color: '#1e40af',
  },
  nextReminderTitle: {
    color: '#1e3a8a',
  },
  nextReminderTime: {
    fontSize: 14,
    color: '#2563eb',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
  },
  remindersList: {
    gap: 16,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontWeight: '500',
    color: '#111827',
  },
  reminderDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  statValueSecondary: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  statValueSuccess: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  addReminderButton: {
    width: '100%',
    marginTop: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    color: '#6b7280',
  },
  reminderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteButton: {
    padding: 4,
    borderRadius: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  emptyStateButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  },
});
