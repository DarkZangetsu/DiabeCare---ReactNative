import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

// Simple Screens
import { SimpleRemindersScreen } from '../screens/SimpleRemindersScreen';
import { AddReminderScreen } from '../screens/AddReminderScreen';
import { SimpleGlycemiaScreen } from '../screens/SimpleGlycemiaScreen';
import { SimpleAddGlycemiaScreen } from '../screens/SimpleAddGlycemiaScreen';
import { GlycemiaHistoryScreen } from '../screens/GlycemiaHistoryScreen';
import { SimpleAdviceScreen } from '../screens/SimpleAdviceScreen';
import { SimpleAdviceDetailScreen } from '../screens/SimpleAdviceDetailScreen';
import { SimpleDiabetesInfoScreen } from '../screens/SimpleDiabetesInfoScreen';

// Types
import { RootTabParamList, RemindersStackParamList, GlycemiaStackParamList, AdviceStackParamList } from '../types';

const Tab = createBottomTabNavigator<RootTabParamList>();
const RemindersStack = createStackNavigator<RemindersStackParamList>();
const GlycemiaStack = createStackNavigator<GlycemiaStackParamList>();
const AdviceStack = createStackNavigator<AdviceStackParamList>();

// Reminders Stack Navigator
const RemindersStackNavigator = () => {
  return (
    <RemindersStack.Navigator screenOptions={{ headerShown: false }}>
      <RemindersStack.Screen name="RemindersHome" component={SimpleRemindersScreen} />
      <RemindersStack.Screen name="AddReminder" component={AddReminderScreen} />
    </RemindersStack.Navigator>
  );
};

// Glycemia Stack Navigator
const GlycemiaStackNavigator = () => {
  return (
    <GlycemiaStack.Navigator screenOptions={{ headerShown: false }}>
      <GlycemiaStack.Screen name="GlycemiaHome" component={SimpleGlycemiaScreen} />
      <GlycemiaStack.Screen name="AddGlycemia" component={SimpleAddGlycemiaScreen} />
      <GlycemiaStack.Screen name="GlycemiaHistory" component={GlycemiaHistoryScreen} />
    </GlycemiaStack.Navigator>
  );
};

// Advice Stack Navigator
const AdviceStackNavigator = () => {
  return (
    <AdviceStack.Navigator screenOptions={{ headerShown: false }}>
      <AdviceStack.Screen name="AdviceHome" component={SimpleAdviceScreen} />
      <AdviceStack.Screen name="AdviceDetail" component={SimpleAdviceDetailScreen} />
      <AdviceStack.Screen name="DiabetesInfo" component={SimpleDiabetesInfoScreen} />
    </AdviceStack.Navigator>
  );
};

// Custom Tab Bar Icon Component
const TabBarIcon = ({ name, color, size }: { name: string; color: string; size: number }) => {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name={name as any} size={size} color={color} />
    </View>
  );
};

// Main Tab Navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'Rappels') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Glycémie') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === 'Conseils') {
            iconName = focused ? 'book' : 'book-outline';
          } else {
            iconName = 'circle';
          }

          return <TabBarIcon name={iconName} color={color} size={size} />;
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#f3f4f6',
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
      })}
    >
      <Tab.Screen
        name="Rappels"
        component={RemindersStackNavigator}
        options={{
          tabBarLabel: 'Rappels',
        }}
      />
      <Tab.Screen 
        name="Glycémie" 
        component={GlycemiaStackNavigator}
        options={{
          tabBarLabel: 'Glycémie',
        }}
      />
      <Tab.Screen 
        name="Conseils" 
        component={AdviceStackNavigator}
        options={{
          tabBarLabel: 'Conseils',
        }}
      />
    </Tab.Navigator>
  );
};

// Main App Navigator
export const SimpleAppNavigator = () => {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
};
