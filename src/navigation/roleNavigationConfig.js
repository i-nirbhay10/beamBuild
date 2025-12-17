import {ROLES} from '../constants/roles';

export const ROLE_NAVIGATION = {
  [ROLES.OWNER]: [
    {label: 'Dashboard', route: 'OwnerDashboard', icon: 'home'},
    {label: 'Projects', route: 'Projects', icon: 'folder'},
    {label: 'Teams', route: 'Teams', icon: 'users'},
    {label: 'Reports', route: 'Reports', icon: 'bar-chart'},
    {label: 'Settings', route: 'Settings', icon: 'settings'},
  ],

  [ROLES.SUPERVISOR]: [
    {label: 'Dashboard', route: 'SupervisorDashboard', icon: 'home'},
    {label: 'Tasks', route: 'Tasks', icon: 'check-square'},
    {label: 'Team', route: 'Team', icon: 'users'},
    {label: 'Reports', route: 'Reports', icon: 'bar-chart'},
  ],

  [ROLES.ENGINEER]: [
    {label: 'Dashboard', route: 'EngineerDashboard', icon: 'home'},
    {label: 'Tasks', route: 'Tasks', icon: 'check-square'},
    {label: 'Documents', route: 'Documents', icon: 'file-text'},
    {label: 'Reports', route: 'Reports', icon: 'bar-chart'},
  ],

  [ROLES.LABORER]: [
    {label: 'Dashboard', route: 'LaborerDashboard', icon: 'home'},
    {label: 'My Tasks', route: 'MyTasks', icon: 'check-circle'},
  ],
};
