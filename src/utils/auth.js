import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Check if user is logged in
 */
export const isAuthenticated = async () => {
  const token = await AsyncStorage.getItem('token');
  return !!token;
};

/**
 * Get stored user
 */
export const getUser = async () => {
  const user = await AsyncStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * Logout helper
 */
export const logout = async navigation => {
  await AsyncStorage.multiRemove(['token', 'user']);
  navigation.reset({
    index: 0,
    routes: [{name: 'Login'}],
  });
};
