// USERS
export const currentUser = {
  id: 'u1',
  name: 'John Martinez',
  email: 'john@buildpro.com',
  role: 'contractor',
  avatar: '/professional-contractor-man.jpg',
  phone: '+1 (555) 123-4567',
};

export const users = [
  currentUser,
  {
    id: 'u2',
    name: 'Sarah Chen',
    email: 'sarah@buildpro.com',
    role: 'supervisor',
    avatar: '/professional-woman-supervisor.png',
  },
  {
    id: 'u3',
    name: 'Mike Johnson',
    email: 'mike@buildpro.com',
    role: 'engineer',
    avatar: '/professional-engineer-man.jpg',
  },
  {
    id: 'u4',
    name: 'Emily Davis',
    email: 'emily@buildpro.com',
    role: 'engineer',
    avatar: '/professional-woman-engineer.png',
  },
  {
    id: 'u5',
    name: 'Carlos Rodriguez',
    email: 'carlos@buildpro.com',
    role: 'laborer',
    avatar: '/construction-worker-man.jpg',
  },
  {
    id: 'u6',
    name: 'James Wilson',
    email: 'james@buildpro.com',
    role: 'laborer',
    avatar: '/construction-worker-safety.png',
  },
];

// PROJECTS
export const projects = [
  {
    id: 'p1',
    name: 'Downtown Office Complex',
    location: '123 Main Street, Downtown',
    startDate: '2024-01-15',
    endDate: '2024-12-31',
    status: 'in-progress',
    budget: 2500000,
    spent: 1250000,
    progress: 45,
    description:
      'A 12-story commercial office building with underground parking and modern amenities.',
    teamId: 't1',
  },
  {
    id: 'p2',
    name: 'Riverside Apartments',
    location: '456 River Road, Eastside',
    startDate: '2024-03-01',
    endDate: '2025-06-30',
    status: 'in-progress',
    budget: 4200000,
    spent: 840000,
    progress: 20,
    description:
      'Luxury residential complex with 120 units, pool, and fitness center.',
    teamId: 't2',
  },
  {
    id: 'p3',
    name: 'Community Center Renovation',
    location: '789 Oak Avenue, Midtown',
    startDate: '2024-06-01',
    endDate: '2024-10-15',
    status: 'planning',
    budget: 750000,
    spent: 25000,
    progress: 5,
    description:
      'Complete renovation of the historic community center including ADA compliance upgrades.',
    teamId: 't3',
  },
];

// TEAMS
export const teams = [
  {
    id: 't1',
    name: 'Alpha Team',
    projectId: 'p1',
    members: [
      {
        id: 'tm1',
        userId: 'u2',
        role: 'supervisor',
        permissions: ['view', 'edit', 'assign', 'approve'],
      },
      {
        id: 'tm2',
        userId: 'u3',
        role: 'engineer',
        permissions: ['view', 'edit', 'report'],
      },
      {
        id: 'tm3',
        userId: 'u5',
        role: 'laborer',
        permissions: ['view', 'report'],
      },
    ],
  },
  {
    id: 't2',
    name: 'Beta Team',
    projectId: 'p2',
    members: [
      {
        id: 'tm4',
        userId: 'u4',
        role: 'engineer',
        permissions: ['view', 'edit', 'report'],
      },
      {
        id: 'tm5',
        userId: 'u6',
        role: 'laborer',
        permissions: ['view', 'report'],
      },
    ],
  },
  {
    id: 't3',
    name: 'Gamma Team',
    projectId: 'p3',
    members: [
      {
        id: 'tm6',
        userId: 'u2',
        role: 'supervisor',
        permissions: ['view', 'edit', 'assign', 'approve'],
      },
    ],
  },
];

// TASKS
export const tasks = [
  {
    id: 'task1',
    projectId: 'p1',
    title: 'Foundation inspection',
    description:
      'Complete foundation inspection before proceeding with structural work',
    assigneeId: 'u3',
    status: 'completed',
    priority: 'high',
    dueDate: '2024-11-20',
    createdAt: '2024-11-01',
  },
  {
    id: 'task2',
    projectId: 'p1',
    title: 'Steel framework installation',
    description: 'Install main steel framework for floors 5-8',
    assigneeId: 'u5',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2024-12-15',
    createdAt: '2024-11-05',
  },
  {
    id: 'task3',
    projectId: 'p1',
    title: 'Electrical conduit planning',
    description: 'Plan and document electrical conduit routes for all floors',
    assigneeId: 'u3',
    status: 'pending',
    priority: 'medium',
    dueDate: '2024-12-20',
    createdAt: '2024-11-10',
  },
  {
    id: 'task4',
    projectId: 'p2',
    title: 'Site preparation',
    description: 'Clear and level the construction site',
    assigneeId: 'u6',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2024-12-01',
    createdAt: '2024-11-01',
  },
  {
    id: 'task5',
    projectId: 'p2',
    title: 'Permit documentation',
    description: 'Prepare and submit building permit documentation',
    assigneeId: 'u4',
    status: 'completed',
    priority: 'urgent',
    dueDate: '2024-11-15',
    createdAt: '2024-10-20',
  },
  {
    id: 'task6',
    projectId: 'p3',
    title: 'Architectural assessment',
    description: 'Complete architectural assessment of existing structure',
    assigneeId: 'u2',
    status: 'pending',
    priority: 'medium',
    dueDate: '2024-12-10',
    createdAt: '2024-11-15',
  },
  {
    id: 'task7',
    projectId: 'p1',
    title: 'Safety equipment check',
    description:
      'Verify all safety equipment is up to date and properly maintained',
    assigneeId: 'u2',
    status: 'blocked',
    priority: 'urgent',
    dueDate: '2024-11-25',
    createdAt: '2024-11-08',
  },
];

// DOCUMENTS
export const documents = [
  {
    id: 'doc1',
    projectId: 'p1',
    name: 'Building Blueprint v2.pdf',
    type: 'plan',
    size: '4.2 MB',
    uploadedBy: 'u1',
    uploadedAt: '2024-11-01',
    url: '#',
  },
  {
    id: 'doc2',
    projectId: 'p1',
    name: 'Construction Contract.pdf',
    type: 'contract',
    size: '1.8 MB',
    uploadedBy: 'u1',
    uploadedAt: '2024-10-15',
    url: '#',
  },
  {
    id: 'doc3',
    projectId: 'p1',
    name: 'Building Permit A-2024.pdf',
    type: 'permit',
    size: '856 KB',
    uploadedBy: 'u2',
    uploadedAt: '2024-10-20',
    url: '#',
  },
  {
    id: 'doc4',
    projectId: 'p2',
    name: 'Site Survey Report.pdf',
    type: 'report',
    size: '2.1 MB',
    uploadedBy: 'u4',
    uploadedAt: '2024-11-10',
    url: '#',
  },
  {
    id: 'doc5',
    projectId: 'p2',
    name: 'Environmental Assessment.pdf',
    type: 'permit',
    size: '3.5 MB',
    uploadedBy: 'u1',
    uploadedAt: '2024-11-05',
    url: '#',
  },
  {
    id: 'doc6',
    projectId: 'p3',
    name: 'Renovation Plans.pdf',
    type: 'plan',
    size: '5.2 MB',
    uploadedBy: 'u2',
    uploadedAt: '2024-11-12',
    url: '#',
  },
];

// MESSAGES
export const messages = [
  {
    id: 'msg1',
    projectId: 'p1',
    senderId: 'u2',
    content:
      'The foundation inspection passed. We can proceed with the structural work.',
    timestamp: '2024-11-20T09:30:00',
  },
  {
    id: 'msg2',
    projectId: 'p1',
    senderId: 'u3',
    content:
      "Great news! I'll start coordinating the steel delivery for next week.",
    timestamp: '2024-11-20T09:45:00',
  },
  {
    id: 'msg3',
    projectId: 'p1',
    senderId: 'u1',
    content:
      'Perfect. Make sure we have all safety equipment ready before the crew arrives.',
    timestamp: '2024-11-20T10:00:00',
  },
  {
    id: 'msg4',
    projectId: 'p1',
    senderId: 'u5',
    content: 'Safety equipment has been checked and verified. All good to go!',
    timestamp: '2024-11-20T10:30:00',
  },
  {
    id: 'msg5',
    projectId: 'p2',
    senderId: 'u4',
    content: 'Site preparation is 80% complete. Should be done by end of week.',
    timestamp: '2024-11-19T14:00:00',
  },
  {
    id: 'msg6',
    projectId: 'p2',
    senderId: 'u1',
    content: 'Excellent progress. Keep me updated on any issues.',
    timestamp: '2024-11-19T14:15:00',
  },
];

// NOTIFICATIONS
export const notifications = [
  {
    id: 'n1',
    userId: 'u1',
    type: 'task',
    title: 'Task Completed',
    message: 'Foundation inspection has been marked as completed',
    read: false,
    timestamp: '2024-11-20T09:30:00',
    link: '/tasks',
  },
  {
    id: 'n2',
    userId: 'u1',
    type: 'deadline',
    title: 'Deadline Approaching',
    message: 'Steel framework installation is due in 3 days',
    read: false,
    timestamp: '2024-11-20T08:00:00',
    link: '/tasks',
  },
  {
    id: 'n3',
    userId: 'u1',
    type: 'project',
    title: 'Project Update',
    message: 'Downtown Office Complex reached 45% completion',
    read: true,
    timestamp: '2024-11-19T16:00:00',
    link: '/projects/p1',
  },
  {
    id: 'n4',
    userId: 'u1',
    type: 'team',
    title: 'New Team Member',
    message: 'Carlos Rodriguez has been added to Alpha Team',
    read: true,
    timestamp: '2024-11-18T11:00:00',
    link: '/team',
  },
  {
    id: 'n5',
    userId: 'u1',
    type: 'message',
    title: 'New Message',
    message: 'Sarah Chen sent a message in Downtown Office Complex',
    read: false,
    timestamp: '2024-11-20T09:30:00',
    link: '/messages',
  },
];

// COMPANY PROFILE
export const companyProfile = {
  id: 'c1',
  name: 'BuildPro Construction',
  email: 'contact@buildpro.com',
  phone: '+1 (555) 000-1234',
  address: '500 Construction Ave, Suite 200, New York, NY 10001',
  logo: '/construction-company-logo.png',
  description:
    'BuildPro Construction is a leading construction company specializing in commercial and residential projects. With over 15 years of experience, we deliver high-quality construction services on time and within budget.',
  expertise: [
    'Commercial Buildings',
    'Residential Complexes',
    'Renovations',
    'Infrastructure',
  ],
  established: '2009',
  employeeCount: 150,
  completedProjects: 87,
};

// FUNCTIONS
export function getProjectById(id) {
  return projects.find(p => p.id === id);
}

export function getTeamByProjectId(projectId) {
  return teams.find(t => t.projectId === projectId);
}

export function getUserById(id) {
  return users.find(u => u.id === id);
}

export function getTasksByProjectId(projectId) {
  return tasks.filter(t => t.projectId === projectId);
}

export function getTasksByAssigneeId(assigneeId) {
  return tasks.filter(t => t.assigneeId === assigneeId);
}

export function getDocumentsByProjectId(projectId) {
  return documents.filter(d => d.projectId === projectId);
}

export function getMessagesByProjectId(projectId) {
  return messages.filter(m => m.projectId === projectId);
}

export function getNotificationsByUserId(userId) {
  return notifications.filter(n => n.userId === userId);
}

export function getUnreadNotificationsCount(userId) {
  return notifications.filter(n => n.userId === userId && !n.read).length;
}

// // src/data/mockData.js
// // Plain JS version of your dummy data + query helpers

// export const currentUser = {
//   id: 'u1',
//   name: 'John Martinez',
//   email: 'john@buildpro.com',
//   role: 'contractor',
//   avatar: 'https://example.com/contractor.jpg',
//   phone: '+1 (555) 123-4567',
// };

// export const users = [
//   currentUser,
//   {
//     id: 'u2',
//     name: 'Sarah Chen',
//     email: 'sarah@buildpro.com',
//     role: 'supervisor',
//     avatar: 'https://example.com/supervisor1.png',
//   },
//   {
//     id: 'u3',
//     name: 'Mike Johnson',
//     email: 'mike@buildpro.com',
//     role: 'engineer',
//     avatar: 'https://example.com/engineer1.jpg',
//   },
//   {
//     id: 'u4',
//     name: 'Emily Davis',
//     email: 'emily@buildpro.com',
//     role: 'engineer',
//     avatar: 'https://example.com/engineer2.png',
//   },
//   {
//     id: 'u5',
//     name: 'Carlos Rodriguez',
//     email: 'carlos@buildpro.com',
//     role: 'laborer',
//     avatar: 'https://example.com/laborer1.jpg',
//   },
//   {
//     id: 'u6',
//     name: 'James Wilson',
//     email: 'james@buildpro.com',
//     role: 'laborer',
//     avatar: 'https://example.com/laborer2.png',
//   },
// ];

// export const projects = [
//   {
//     id: 'p1',
//     name: 'Downtown Office Complex',
//     location: '123 Main Street, Downtown',
//     startDate: '2024-01-15',
//     endDate: '2024-12-31',
//     status: 'in-progress',
//     budget: 2500000,
//     spent: 1250000,
//     progress: 45,
//     description:
//       'A 12-story commercial office building with underground parking and modern amenities.',
//     teamId: 't1',
//   },
//   {
//     id: 'p2',
//     name: 'Riverside Apartments',
//     location: '456 River Road, Eastside',
//     startDate: '2024-03-01',
//     endDate: '2025-06-30',
//     status: 'in-progress',
//     budget: 4200000,
//     spent: 840000,
//     progress: 20,
//     description:
//       'Luxury residential complex with 120 units, pool, and fitness center.',
//     teamId: 't2',
//   },
//   {
//     id: 'p3',
//     name: 'Community Center Renovation',
//     location: '789 Oak Avenue, Midtown',
//     startDate: '2024-06-01',
//     endDate: '2024-10-15',
//     status: 'planning',
//     budget: 750000,
//     spent: 25000,
//     progress: 5,
//     description:
//       'Complete renovation of the historic community center including ADA compliance upgrades.',
//     teamId: 't3',
//   },
// ];

// export const teams = [
//   {
//     id: 't1',
//     name: 'Alpha Team',
//     projectId: 'p1',
//     members: [
//       {
//         id: 'tm1',
//         userId: 'u2',
//         role: 'supervisor',
//         permissions: ['view', 'edit', 'assign', 'approve'],
//       },
//       {
//         id: 'tm2',
//         userId: 'u3',
//         role: 'engineer',
//         permissions: ['view', 'edit', 'report'],
//       },
//       {
//         id: 'tm3',
//         userId: 'u5',
//         role: 'laborer',
//         permissions: ['view', 'report'],
//       },
//     ],
//   },
//   {
//     id: 't2',
//     name: 'Beta Team',
//     projectId: 'p2',
//     members: [
//       {
//         id: 'tm4',
//         userId: 'u4',
//         role: 'engineer',
//         permissions: ['view', 'edit', 'report'],
//       },
//       {
//         id: 'tm5',
//         userId: 'u6',
//         role: 'laborer',
//         permissions: ['view', 'report'],
//       },
//     ],
//   },
//   {
//     id: 't3',
//     name: 'Gamma Team',
//     projectId: 'p3',
//     members: [
//       {
//         id: 'tm6',
//         userId: 'u2',
//         role: 'supervisor',
//         permissions: ['view', 'edit', 'assign', 'approve'],
//       },
//     ],
//   },
// ];

// export const tasks = [
//   {
//     id: 'task1',
//     projectId: 'p1',
//     title: 'Foundation inspection',
//     description:
//       'Complete foundation inspection before proceeding with structural work',
//     assigneeId: 'u3',
//     status: 'completed',
//     priority: 'high',
//     dueDate: '2024-11-20',
//     createdAt: '2024-11-01',
//   },
//   {
//     id: 'task2',
//     projectId: 'p1',
//     title: 'Steel framework installation',
//     description: 'Install main steel framework for floors 5-8',
//     assigneeId: 'u5',
//     status: 'in-progress',
//     priority: 'high',
//     dueDate: '2024-12-15',
//     createdAt: '2024-11-05',
//   },
//   {
//     id: 'task3',
//     projectId: 'p1',
//     title: 'Electrical conduit planning',
//     description: 'Plan and document electrical conduit routes for all floors',
//     assigneeId: 'u3',
//     status: 'pending',
//     priority: 'medium',
//     dueDate: '2024-12-20',
//     createdAt: '2024-11-10',
//   },
//   {
//     id: 'task4',
//     projectId: 'p2',
//     title: 'Site preparation',
//     description: 'Clear and level the construction site',
//     assigneeId: 'u6',
//     status: 'in-progress',
//     priority: 'high',
//     dueDate: '2024-12-01',
//     createdAt: '2024-11-01',
//   },
//   {
//     id: 'task5',
//     projectId: 'p2',
//     title: 'Permit documentation',
//     description: 'Prepare and submit building permit documentation',
//     assigneeId: 'u4',
//     status: 'completed',
//     priority: 'urgent',
//     dueDate: '2024-11-15',
//     createdAt: '2024-10-20',
//   },
//   {
//     id: 'task6',
//     projectId: 'p3',
//     title: 'Architectural assessment',
//     description: 'Complete architectural assessment of existing structure',
//     assigneeId: 'u2',
//     status: 'pending',
//     priority: 'medium',
//     dueDate: '2024-12-10',
//     createdAt: '2024-11-15',
//   },
//   {
//     id: 'task7',
//     projectId: 'p1',
//     title: 'Safety equipment check',
//     description:
//       'Verify all safety equipment is up to date and properly maintained',
//     assigneeId: 'u2',
//     status: 'blocked',
//     priority: 'urgent',
//     dueDate: '2024-11-25',
//     createdAt: '2024-11-08',
//   },
// ];

// // --------- helper functions (pure, read-only) ----------
// export function getProjectById(id) {
//   return projects.find(p => p.id === id);
// }

// export function getTeamByProjectId(projectId) {
//   return teams.find(t => t.projectId === projectId);
// }

// export function getUserById(id) {
//   return users.find(u => u.id === id);
// }

// export function getTasksByProjectId(projectId) {
//   return tasks.filter(t => t.projectId === projectId);
// }

// export function getTasksByAssigneeId(assigneeId) {
//   return tasks.filter(t => t.assigneeId === assigneeId);
// }
