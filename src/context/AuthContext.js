import React, {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {users, teams} from '../data/mockData';

const AuthContext = createContext(null);
const STORAGE_KEY = 'buildpro_user_id';

export function AuthProvider({children}) {
  const [user, setUser] = useState(null);
  const [teamMemberInfo, setTeamMemberInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /* ---------- Load stored session ---------- */
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem(STORAGE_KEY);

        if (!storedUserId) return;

        const foundUser = users.find(u => u.id === storedUserId);
        if (!foundUser) return;

        setUser(foundUser);
        setTeamMemberInfo(findTeamMemberInfo(storedUserId));
      } catch (err) {
        console.warn('Auth restore failed', err);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  /* ---------- Login ---------- */
  const login = async input => {
    const userId = typeof input === 'string' ? input : input?.id;
    if (!userId) return;

    const foundUser = users.find(u => u.id === userId);
    if (!foundUser) return;

    setUser(foundUser);
    setTeamMemberInfo(findTeamMemberInfo(userId));

    try {
      await AsyncStorage.setItem(STORAGE_KEY, userId);
    } catch (err) {
      console.warn('Failed to persist login', err);
    }
  };

  /* ---------- Logout ---------- */
  const logout = async () => {
    setUser(null);
    setTeamMemberInfo(null);

    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn('Logout cleanup failed', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        teamMemberInfo,
        login,
        logout,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

/* ---------- Hook ---------- */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}

/* ---------- Helpers ---------- */
function findTeamMemberInfo(userId) {
  for (const team of teams) {
    const member = team.members.find(m => m.userId === userId);
    if (member) {
      return {
        teamId: team.id,
        teamName: team.name,
        projectId: team.projectId,
        role: member.role,
        permissions: member.permissions,
      };
    }
  }
  return null;
}

/* ---------- Permission Helpers ---------- */
export const hasPermission = (permissions, p) =>
  permissions?.includes(p) ?? false;

export const canView = p => hasPermission(p, 'view');
export const canEdit = p => hasPermission(p, 'edit');
export const canAssign = p => hasPermission(p, 'assign');
export const canApprove = p => hasPermission(p, 'approve');
export const canReport = p => hasPermission(p, 'report');

// import React, {createContext, useContext, useState, useEffect} from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {users, teams} from '../data/mockData';

// const AuthContext = createContext(undefined);
// const STORAGE_KEY = 'buildpro_user_id';

// export function AuthProvider({children}) {
//   const [user, setUser] = useState(null);
//   const [teamMemberInfo, setTeamMemberInfo] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const loadStoredUser = async () => {
//       try {
//         const storedUserId = await AsyncStorage.getItem(STORAGE_KEY);

//         if (storedUserId) {
//           const foundUser = users.find(u => u.id === storedUserId);

//           if (foundUser) {
//             setUser(foundUser);

//             const memberInfo = teams
//               .flatMap(t => t.members)
//               .find(m => m.userId === storedUserId);

//             setTeamMemberInfo(memberInfo || null);
//           }
//         }
//       } catch (error) {
//         console.warn('Failed to load user from storage', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadStoredUser();
//   }, []);

//   const login = async userId => {
//     const foundUser = users.find(u => u.id === userId);

//     if (foundUser) {
//       setUser(foundUser);
//       setTeamMemberInfo(
//         teams.flatMap(t => t.members).find(m => m.userId === userId) || null,
//       );

//       try {
//         await AsyncStorage.setItem(STORAGE_KEY, userId);
//       } catch (error) {
//         console.warn('Failed to save user', error);
//       }
//     }
//   };

//   const logout = async () => {
//     setUser(null);
//     setTeamMemberInfo(null);

//     try {
//       await AsyncStorage.removeItem(STORAGE_KEY);
//     } catch (error) {
//       console.warn('Failed to remove user', error);
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         teamMemberInfo,
//         login,
//         logout,
//         isLoading,
//       }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);

//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }

//   return context;
// }

// /* ---------- Permission Helpers ---------- */

// export function hasPermission(permissions, permission) {
//   return permissions?.includes(permission) ?? false;
// }

// export function canView(permissions) {
//   return hasPermission(permissions, 'view');
// }

// export function canEdit(permissions) {
//   return hasPermission(permissions, 'edit');
// }

// export function canAssign(permissions) {
//   return hasPermission(permissions, 'assign');
// }

// export function canApprove(permissions) {
//   return hasPermission(permissions, 'approve');
// }

// export function canReport(permissions) {
//   return hasPermission(permissions, 'report');
// }
