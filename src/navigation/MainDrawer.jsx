import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from './CustomDrawer';

/* =====================
   COMMON
===================== */
import SettingsPage from '../screens/common/SettingsPage';
import CompanyProfileScreen from '../screens/common/CompanyProfileScreen';
import TasksPage from '../screens/common/TasksPage';
import IssuesPage from '../screens/common/IssuesPage';

/* =====================
   ADMIN / CONTRACTOR
===================== */
import DashboardScreen from '../screens/Dashboard/admin/DashboardScreen';
import ProjectsScreen from '../screens/Dashboard/admin/ProjectsScreen';
import TeamPage from '../screens/Dashboard/admin/TeamPage';
import ReportsScreen from '../screens/Dashboard/admin/ReportsScreen';
import ContractorDocumentsScreen from '../screens/Dashboard/admin/ContractorDocumentsScreen';
import AdminTasksPage from '../screens/Dashboard/admin/AdminTasksPage';

/* =====================
   PROJECT MANAGER
===================== */
import {ProjectManagerDashboard} from '../screens/Dashboard/ProjectManager/ProjectManagerDashboard';
import {ProjectTrackingScreen} from '../screens/Dashboard/ProjectManager/ProjectTrackingScreen';
import ScheduleScreen from '../screens/Dashboard/ProjectManager/ScheduleScreen';
import PMTasksPage from '../screens/Dashboard/ProjectManager/PMTasksPage';
import MyProjects from '../screens/Dashboard/engineer/MyProjects';

/* =====================
   SUPERVISOR
===================== */
import SupervisorDashboard from '../screens/Dashboard/supervisor/SupervisorDashboard';
import MyProjectsScreen from '../screens/Dashboard/supervisor/MyProjectsScreen';
import TeamListScreen from '../screens/Dashboard/supervisor/TeamListScreen';
import TaskManagementScreen from '../screens/Dashboard/supervisor/TaskManagementScreen';
import SupervisorApprovalsScreen from '../screens/Dashboard/supervisor/SupervisorApprovalsScreen';
import MyDocumentsScreen from '../screens/Dashboard/supervisor/MyDocumentsScreen';

/* =====================
   ENGINEER
===================== */
import EngineerDashboard from '../screens/Dashboard/engineer/EngineerDashboard';
import EngineerDocumentsScreen from '../screens/Dashboard/engineer/EngineerDocumentsScreen';
import ReportProgressScreen from '../screens/Dashboard/engineer/ReportProgressScreen';

/* =====================
   LABORER
===================== */
import LaborerDashboard from '../screens/Dashboard/laborer/LaborerDashboard';
import DailyLogPage from '../screens/Dashboard/laborer/DailyLogPage';
import SafetyPage from '../screens/Dashboard/laborer/SafetyPage';

const Drawer = createDrawerNavigator();

export default function MainDrawer({role}) {
  console.log('USER ROLE:', role);

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} role={role} />}
      screenOptions={{headerShown: false}}>
      {/* =====================
          ADMIN / CONTRACTOR
      ===================== */}
      {role === 'contractor' && (
        <>
          <Drawer.Screen name="Dashboard" component={DashboardScreen} />
          <Drawer.Screen name="Projects" component={ProjectsScreen} />
          <Drawer.Screen name="Team" component={TeamPage} />
          <Drawer.Screen name="Tasks" component={AdminTasksPage} />
          <Drawer.Screen name="Reports" component={ReportsScreen} />
          <Drawer.Screen
            name="Documents"
            component={ContractorDocumentsScreen}
          />
        </>
      )}

      {/* =====================
          PROJECT MANAGER
      ===================== */}
      {role === 'project-manager' && (
        <>
          <Drawer.Screen name="Dashboard" component={ProjectManagerDashboard} />
          <Drawer.Screen name="MyProjects" component={MyProjects} />
          <Drawer.Screen name="Tracking" component={ProjectTrackingScreen} />
          <Drawer.Screen name="TaskAssignment" component={PMTasksPage} />
          <Drawer.Screen name="Schedule" component={ScheduleScreen} />
          <Drawer.Screen
            name="Documents"
            component={ContractorDocumentsScreen}
          />
        </>
      )}

      {/* =====================
          SUPERVISOR
      ===================== */}
      {role === 'supervisor' && (
        <>
          <Drawer.Screen name="Dashboard" component={SupervisorDashboard} />
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

      {/* =====================
          ENGINEER
      ===================== */}
      {role === 'engineer' && (
        <>
          <Drawer.Screen name="Dashboard" component={EngineerDashboard} />
          <Drawer.Screen name="MyProjects" component={MyProjects} />
          <Drawer.Screen name="MyTasks" component={TasksPage} />
          <Drawer.Screen name="Documents" component={EngineerDocumentsScreen} />
          <Drawer.Screen name="Report" component={ReportProgressScreen} />
          <Drawer.Screen name="Issues" component={IssuesPage} />
        </>
      )}

      {/* =====================
          LABORER
      ===================== */}
      {role === 'laborer' && (
        <>
          <Drawer.Screen name="Dashboard" component={LaborerDashboard} />
          <Drawer.Screen name="MyTasks" component={TasksPage} />
          <Drawer.Screen name="DailyLog" component={DailyLogPage} />
          <Drawer.Screen name="Issues" component={IssuesPage} />
          <Drawer.Screen name="Safety" component={SafetyPage} />
        </>
      )}

      {/* =====================
          COMMON
      ===================== */}
      <Drawer.Screen name="CompanyProfile" component={CompanyProfileScreen} />
      <Drawer.Screen name="Settings" component={SettingsPage} />
    </Drawer.Navigator>
  );
}
