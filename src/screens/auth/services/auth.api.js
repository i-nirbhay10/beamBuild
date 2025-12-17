// Mock API - replace with real backend calls
export const signup = async data => {
  console.log('Signup data:', data);
  return {success: true, userId: 'owner1', token: 'mock-jwt-token'};
};

export const login = async data => {
  console.log('Login data:', data);
  return {
    token: 'mock-jwt-token',
    user: {
      id: 'u2',
      name: 'Alex',
      role: 'supervisor', // this comes from backend
      teams: [{teamId: 't1', projectId: 'p1', role: 'supervisor'}],
    },
  };
};
