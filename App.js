import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SimpleAppNavigator } from './src/navigation/SimpleAppNavigator';
import { AppInitializer } from './src/components/AppInitializer';
import { ToastProvider } from './src/contexts/ToastContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <ToastProvider>
        <AppInitializer>
          <SimpleAppNavigator />
        </AppInitializer>
        <StatusBar style="auto" />
      </ToastProvider>
    </SafeAreaProvider>
  );
}
