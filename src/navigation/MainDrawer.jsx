import {createDrawerNavigator} from '@react-navigation/drawer';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import ProjectsScreen from '../screens/project/ProjectsScreen';
import TeamPage from '../screens/team/TeamPage';
import TasksPage from '../screens/task/TasksPage';
import SettingsPage from '../screens/SettingsPage';
import SupervisorDashboard from '../screens/Dashboard/supervisor/SupervisorDashboard';
import CustomDrawer from './CustomDrawer';
import MyProjectsScreen from '../screens/Dashboard/supervisor/MyProjectsScreen';
import TeamListScreen from '../screens/Dashboard/supervisor/TeamListScreen';
import TaskManagementScreen from '../screens/Dashboard/supervisor/TaskManagementScreen';
import SupervisorApprovalsScreen from '../screens/Dashboard/supervisor/SupervisorApprovalsScreen';
import MyDocumentsScreen from '../screens/Dashboard/supervisor/MyDocumentsScreen';
import ReportsScreen from '../screens/ReportsScreen';
import ContractorDocumentsScreen from '../screens/Dashboard/ContractorDocumentsScreen';
import CompanyProfileScreen from '../screens/CompanyProfileScreen';

const Drawer = createDrawerNavigator();

export default function MainDrawer({role}) {
  console.log(role, 'rol;e');

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} role={role} />}
      screenOptions={{headerShown: false}}>
      {/* Common for all roles */}

      {role === 'contractor' && (
        <>
          <Drawer.Screen name="Dashboard" component={DashboardScreen} />
          <Drawer.Screen name="Projects" component={ProjectsScreen} />
          <Drawer.Screen name="Team" component={TeamPage} />
          <Drawer.Screen name="Tasks" component={TasksPage} />
          <Drawer.Screen name="Reports" component={ReportsScreen} />
          <Drawer.Screen
            name="Documents"
            component={ContractorDocumentsScreen}
          />
        </>
      )}

      {role === 'supervisor' && (
        <>
          <Drawer.Screen
            name="SupervisorDashboard"
            component={SupervisorDashboard}
          />
          <Drawer.Screen name="MyProjects" component={MyProjectsScreen} />
          <Drawer.Screen name="TeamManagement" component={TeamListScreen} />
          <Drawer.Screen name="AssignTasks" component={TaskManagementScreen} />
          <Drawer.Screen
            name="Approvals"
            component={SupervisorApprovalsScreen}
          />
          <Drawer.Screen name="Documents" component={MyDocumentsScreen} />
        </>
      )}

      {role === 'engineer' && (
        <>
          <Drawer.Screen name="Projects" component={ProjectsScreen} />
          <Drawer.Screen name="Tasks" component={TasksPage} />
        </>
      )}

      {role === 'laborer' && (
        <>
          <Drawer.Screen name="Tasks" component={TasksPage} />
        </>
      )}

      {/* Common settings */}
      <Drawer.Screen name="CompanyProfile" component={CompanyProfileScreen} />
      <Drawer.Screen name="Settings" component={SettingsPage} />
    </Drawer.Navigator>
  );
}

// import React from 'react';
// import {createDrawerNavigator} from '@react-navigation/drawer';
// import DashboardScreen from '../screens/Dashboard/DashboardScreen';
// import ProjectsScreen from '../screens/project/ProjectsScreen';
// import TeamPage from '../screens/team/TeamPage';
// import TasksPage from '../screens/task/TasksPage';
// import SettingsPage from '../screens/SettingsPage';
// import ReportsScreen from '../screens/ReportsScreen';
// import CustomDrawer from './CustomDrawer';
// import SupervisorDashboard from '../screens/Dashboard/supervisor/SupervisorDashboard';

// const Drawer = createDrawerNavigator();

// export default function MainDrawer() {
//   return (
//     <Drawer.Navigator
//       screenOptions={{
//         headerShown: false,
//       }}
//       drawerContent={props => <CustomDrawer {...props} />}>
//       <Drawer.Screen name="Dashboard" component={DashboardScreen} />
//       <Drawer.Screen
//         name="SupervisorDashboard"
//         component={SupervisorDashboard}
//       />
//       <Drawer.Screen name="Projects" component={ProjectsScreen} />
//       <Drawer.Screen name="Team" component={TeamPage} />
//       <Drawer.Screen name="Tasks" component={TasksPage} />
//       <Drawer.Screen name="Reports" component={ReportsScreen} />
//       <Drawer.Screen name="Settings" component={SettingsPage} />
//     </Drawer.Navigator>
//   );
// }
