export const NAV_ITEMS = {
  contractor: [
    {name: 'Dashboard', icon: 'grid', route: 'Dashboard'},
    {name: 'Projects', icon: 'folder', route: 'Projects'},
    {name: 'Team', icon: 'users', route: 'Team'},
    {name: 'Tasks', icon: 'check-square', route: 'Tasks'},
    {name: 'Documents', icon: 'file-text', route: 'Documents', badge: 2},
    {name: 'Reports', icon: 'bar-chart-2', route: 'Reports'},
    // {name: 'Messages', icon: 'message-square', route: 'Messages', badge: 3},
  ],
  supervisor: [
    {name: 'Dashboard', icon: 'grid', route: 'SupervisorDashboard'},
    {name: 'My Projects', icon: 'folder', route: 'MyProjects'},
    {name: 'Team Management', icon: 'users', route: 'TeamManagement'},
    {name: 'Task Assignment', icon: 'clipboard', route: 'AssignTasks'},
    {name: 'Approvals', icon: 'check-circle', route: 'Approvals', badge: 2},
    {name: 'Documents', icon: 'file-text', route: 'Documents'},
    // {name: 'Messages', icon: 'message-square', route: 'Messages', badge: 3},
  ],
  engineer: [
    {name: 'Dashboard', icon: 'grid', route: 'Dashboard'},
    {name: 'My Projects', icon: 'folder', route: 'MyProjects'},
    {name: 'My Tasks', icon: 'check-square', route: 'MyTasks', badge: 3},
    {name: 'Technical Docs', icon: 'file-text', route: 'Documents'},
    {name: 'Report Progress', icon: 'bar-chart-2', route: 'Report'},
    {name: 'Issues', icon: 'alert-triangle', route: 'Issues'},
    // {name: 'Messages', icon: 'message-square', route: 'Messages', badge: 3},
  ],
  laborer: [
    {name: 'My Tasks', icon: 'check-square', route: 'MyTasks', badge: 2},
    {name: 'Daily Log', icon: 'clipboard', route: 'DailyLog'},
    {name: 'Report Issue', icon: 'alert-triangle', route: 'Issues'},
    {name: 'Safety Info', icon: 'shield', route: 'Safety'},
    // {name: 'Messages', icon: 'message-square', route: 'Messages', badge: 3},
  ],
};

// const getNavigationItems = role => {
//   switch (role) {
//     case 'contractor':
//       return [
//         {name: 'Dashboard', icon: 'grid', route: 'Dashboard'},
//         {name: 'Projects', icon: 'folder', route: 'Projects'},
//         {name: 'Team', icon: 'users', route: 'Team'},
//         {name: 'Tasks', icon: 'check-square', route: 'Tasks'},
//         {name: 'Documents', icon: 'file-text', route: 'Documents'},
//         {name: 'Reports', icon: 'bar-chart-2', route: 'Reports'},
//         // {name: 'Messages', icon: 'message-square', route: 'Messages', badge: 3},
//       ];

//     case 'supervisor':
//       return [
//         {name: 'Dashboard', icon: 'grid', route: 'SupervisorDashboard'},
//         {name: 'My Projects', icon: 'folder', route: 'MyProjects'},
//         {name: 'Team Management', icon: 'users', route: 'TeamManagement'},
//         {name: 'Task Assignment', icon: 'clipboard', route: 'AssignTasks'},
//         {name: 'Approvals', icon: 'check-circle', route: 'Approvals', badge: 2},
//         {name: 'Documents', icon: 'file-text', route: 'Documents'},
//         // {name: 'Messages', icon: 'message-square', route: 'Messages', badge: 3},
//       ];

//     case 'engineer':
//       return [
//         {name: 'My Projects', icon: 'folder', route: 'MyProjects'},
//         {name: 'My Tasks', icon: 'check-square', route: 'MyTasks', badge: 3},
//         {name: 'Technical Docs', icon: 'file-text', route: 'Documents'},
//         {name: 'Report Progress', icon: 'bar-chart-2', route: 'Report'},
//         {name: 'Issues', icon: 'alert-triangle', route: 'Issues'},
//         // {name: 'Messages', icon: 'message-square', route: 'Messages', badge: 3},
//       ];

//     case 'laborer':
//       return [
//         {name: 'My Tasks', icon: 'check-square', route: 'MyTasks', badge: 2},
//         {name: 'Daily Log', icon: 'clipboard', route: 'DailyLog'},
//         {name: 'Report Issue', icon: 'alert-triangle', route: 'Issues'},
//         {name: 'Safety Info', icon: 'shield', route: 'Safety'},
//         // {name: 'Messages', icon: 'message-square', route: 'Messages', badge: 3},
//       ];

//     default:
//       return [];
//   }
// };
