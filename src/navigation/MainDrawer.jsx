import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import CustomDrawer from '../CustomDrawer';
import ProjectsScreen from '../screens/project/ProjectsScreen';
import TeamPage from '../screens/team/TeamPage';
import TasksPage from '../screens/task/TasksPage';
import SettingsPage from '../screens/SettingsPage';

const Drawer = createDrawerNavigator();

export default function MainDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
      }}
      drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="Projects" component={ProjectsScreen} />
      <Drawer.Screen name="Team" component={TeamPage} />
      <Drawer.Screen name="Tasks" component={TasksPage} />
      <Drawer.Screen name="Settings" component={SettingsPage} />
    </Drawer.Navigator>
  );
}
