import 'react-native-gesture-handler';
import React from 'react';
import AppNavigation from './src/navigation/AppNavigation';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {AuthProvider} from './src/context/AuthContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SafeAreaView
          style={{flex: 1, backgroundColor: 'black'}}
          edges={['top', 'right', 'left', 'bottom']}>
          <AppNavigation />
        </SafeAreaView>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
