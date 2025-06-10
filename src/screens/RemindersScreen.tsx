import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Reminder } from '../types';

export const RemindersScreen: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      title: 'Mesure de glycémie',
      description: 'Mesurer votre glycémie avant le petit-déjeuner',
      time: '07:30',
      isActive: true,
      type: 'measurement',
    },
    {
      id: '2',
      title: 'Prise de médicament',
      description: 'Prendre votre traitement du matin',
      time: '08:00',
      isActive: true,
      type: 'medication',
    },
    {
      id: '3',
      title: 'Mesure de glycémie',
      description: 'Mesurer votre glycémie avant le déjeuner',
      time: '12:00',
      isActive: false,
      type: 'measurement',
    },
    {
      id: '4',
      title: 'Exercice',
      description: 'Marche de 30 minutes',
      time: '18:00',
      isActive: true,
      type: 'exercise',
    },
  ]);

  const toggleReminder = (id: string) => {
    setReminders(prev =>
      prev.map(reminder =>
        reminder.id === id
          ? { ...reminder, isActive: !reminder.isActive }
          : reminder
      )
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

  const activeReminders = reminders.filter(r => r.isActive);
  const nextReminder = activeReminders.sort((a, b) => a.time.localeCompare(b.time))[0];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4 space-y-4">
        {/* Header */}
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-gray-900">Rappels</Text>
          <TouchableOpacity className="p-2">
            <Ionicons name="add-circle" size={32} color="#3b82f6" />
          </TouchableOpacity>
        </View>

        {/* Next Reminder Card */}
        {nextReminder && (
          <Card className="bg-primary-50 border-primary-200">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-primary-100 rounded-full items-center justify-center mr-4">
                <Ionicons 
                  name={getIconName(nextReminder.type)} 
                  size={24} 
                  color="#3b82f6" 
                />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-primary-900">Prochain rappel</Text>
                <Text className="text-primary-800">{nextReminder.title}</Text>
                <Text className="text-sm text-primary-600">Aujourd'hui à {nextReminder.time}</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <Text className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</Text>
          <View className="flex-row space-x-3">
            <Button
              title="Mesure glycémie"
              size="sm"
              className="flex-1"
              onPress={() => {/* Navigate to add glycemia */}}
            />
            <Button
              title="Repas"
              variant="outline"
              size="sm"
              className="flex-1"
              onPress={() => {/* Navigate to add meal */}}
            />
          </View>
        </Card>

        {/* Today's Reminders */}
        <Card>
          <Text className="text-lg font-semibold text-gray-900 mb-4">Aujourd'hui</Text>
          <View className="space-y-4">
            {reminders.map((reminder) => (
              <View key={reminder.id} className="flex-row items-center">
                <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3">
                  <Ionicons 
                    name={getIconName(reminder.type)} 
                    size={20} 
                    color={getIconColor(reminder.type)} 
                  />
                </View>
                
                <View className="flex-1">
                  <Text className={`font-medium ${reminder.isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                    {reminder.title}
                  </Text>
                  <Text className={`text-sm ${reminder.isActive ? 'text-gray-600' : 'text-gray-400'}`}>
                    {reminder.time} • {reminder.description}
                  </Text>
                </View>
                
                <Switch
                  value={reminder.isActive}
                  onValueChange={() => toggleReminder(reminder.id)}
                  trackColor={{ false: '#f3f4f6', true: '#dbeafe' }}
                  thumbColor={reminder.isActive ? '#3b82f6' : '#9ca3af'}
                />
              </View>
            ))}
          </View>
        </Card>

        {/* Statistics */}
        <Card>
          <Text className="text-lg font-semibold text-gray-900 mb-4">Statistiques</Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-primary-600">{activeReminders.length}</Text>
              <Text className="text-sm text-gray-600">Actifs</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-gray-900">{reminders.length}</Text>
              <Text className="text-sm text-gray-600">Total</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-600">85%</Text>
              <Text className="text-sm text-gray-600">Respect</Text>
            </View>
          </View>
        </Card>

        {/* Add New Reminder */}
        <Button
          title="Ajouter un rappel"
          variant="outline"
          onPress={() => {/* Navigate to add reminder */}}
          className="w-full"
        />
      </View>
    </ScrollView>
  );
};
