import 'react-native-gesture-handler';
import React from 'react';
import AppNavigation from './src/navigation/AppNavigation';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{flex: 1, backgroundColor: 'black'}}
        edges={['top', 'right', 'left', 'bottom']}>
        <AppNavigation />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// import React from 'react';
// import {createStackNavigator} from '@react-navigation/stack';
// import {NavigationContainer} from '@react-navigation/native';
// import InviteScreen from './src/screens/InviteScreen';
// import WorkspaceScreen from './src/screens/WorkspaceScreen';
// import DashboardScreen from './src/screens/Dashboard/DashboardScreen';

// const Stack = createStackNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{headerShown: false}}>
//         <Stack.Screen name="Dashboard" component={DashboardScreen} />
//         <Stack.Screen name="Invite" component={InviteScreen} />
//         <Stack.Screen name="Workspace" component={WorkspaceScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
