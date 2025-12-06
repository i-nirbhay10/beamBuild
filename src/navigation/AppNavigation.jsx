// import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import MainDrawer from './MainDrawer';
import ProjectDetailScreen from '../screens/project/ProjectDetailScreen';
import ProjectsScreen from '../screens/project/ProjectsScreen';

const Stack = createStackNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="MainDrawer" component={MainDrawer} />
        <Stack.Screen name="Projects" component={ProjectsScreen} />
        <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
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
