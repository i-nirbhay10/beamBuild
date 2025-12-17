// import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import MainDrawer from './MainDrawer';
import ProjectDetailScreen from '../screens/project/ProjectDetailScreen';
import ProjectsScreen from '../screens/project/ProjectsScreen';
import TeamProfileScreen from '../screens/team/TeamProfileScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import LoginScreen from '../screens/auth/LoginScreen';

const Stack = createStackNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {/* Auth */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />

        <Stack.Screen name="MainDrawer" component={MainDrawer} />
        <Stack.Screen name="Projects" component={ProjectsScreen} />
        <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
        <Stack.Screen name="TeamProfile" component={TeamProfileScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// import 'react-native-gesture-handler';
// import React from 'react';
// import {NavigationContainer} from '@react-navigation/native';
// import {createStackNavigator} from '@react-navigation/stack';

// import MainDrawer from './MainDrawer';

// // Optional: Auth screens here
// // import LoginScreen from '../screens/Auth/LoginScreen';

// const Stack = createStackNavigator();

// export default function AppNavigation() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         screenOptions={{
//           headerShown: false,
//         }}>
//         {/* Auth Flow (optional) */}
//         {/* <Stack.Screen name="Login" component={LoginScreen} /> */}

//         {/* Main App */}
//         <Stack.Screen name="MainDrawer" component={MainDrawer} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
