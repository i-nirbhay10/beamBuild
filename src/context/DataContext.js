import React, {createContext, useContext, useState} from 'react';
import {
  currentUser,
  users as initialUsers,
  projects as initialProjects,
  teams as initialTeams,
  tasks as initialTasks,
} from '../data/mockData';

const DataContext = createContext();

export function DataProvider({children}) {
  const [projects, setProjects] = useState(initialProjects);
  const [teams, setTeams] = useState(initialTeams);
  const [users, setUsers] = useState(initialUsers);
  const [tasks, setTasks] = useState(initialTasks);

  function updateTaskStatus(taskId, status) {
    setTasks(prev => prev.map(t => (t.id === taskId ? {...t, status} : t)));
  }

  const value = {currentUser, projects, teams, users, tasks, updateTaskStatus};
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  return useContext(DataContext);
}
