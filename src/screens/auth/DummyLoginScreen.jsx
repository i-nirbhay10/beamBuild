import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {users, teams} from '../../data/mockData';
import {useAuth} from '../../context/AuthContext';

const roleIcons = {
  contractor: 'business',
  supervisor: 'shield-checkmark',
  engineer: 'construct',
  laborer: 'hammer',
};

const roleColors = {
  contractor: '#2563eb',
  supervisor: '#f59e0b',
  engineer: '#3b82f6',
  laborer: '#10b981',
};

const roleDescriptions = {
  contractor: 'Full access to all projects, teams, reports, and settings',
  supervisor: 'Manage teams, assign tasks, approve work, view reports',
  engineer: 'View projects, edit technical documents, report progress',
  laborer: 'View assigned tasks, report work completion and issues',
};

export default function DummyLoginScreen({navigation}) {
  const [selectedUser, setSelectedUser] = useState(null);
  const {login} = useAuth();

  const handleLogin = async () => {
    if (!selectedUser) return;

    const user = users.find(u => u.id === selectedUser);

    try {
      // Clear any previous user
      await AsyncStorage.removeItem('currentUser');

      // Save the new user
      await AsyncStorage.setItem('currentUser', JSON.stringify(user));

      console.log(user, '➡️ Navigating to MainDrawer');

      // Update auth context
      login(user);

      // Navigate with role
      navigation.replace('MainDrawer', {role: user.role});
    } catch (e) {
      console.log('Failed to save user:', e);
    }
  };

  // const handleLogin = () => {
  //   if (!selectedUser) return;

  //   const user = users.find(u => u.id === selectedUser);
  //   console.log(user, '➡️ Navigating to MainDrawer');
  //   login(user);

  //   // Pass role to MainDrawer
  //   navigation.replace('MainDrawer', {role: user.role});
  // };

  // const handleLogin = () => {
  //   if (!selectedUser) return;

  //   const user = users.find(u => u.id === selectedUser);

  //   console.log(user, '➡️ Navigating to MainDrawer');
  //   login(user);

  //   // Simple role-based navigation (adjust later)
  //   if (user.role === 'contractor') {
  //     navigation.replace('MainDrawer');
  //   } else {
  //     navigation.replace('SupervisorDashboard');
  //   }
  // };

  const getUserTeamInfo = userId => {
    for (const team of teams) {
      const member = team.members.find(m => m.userId === userId);
      if (member) return {team, member};
    }
    return null;
  };

  const renderUser = ({item}) => {
    const isSelected = selectedUser === item.id;
    const teamInfo = getUserTeamInfo(item.id);

    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.cardSelected]}
        onPress={() => setSelectedUser(item.id)}>
        <Image source={{uri: item.avatar}} style={styles.avatar} />

        <View style={{flex: 1}}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.email}>{item.email}</Text>

          <View style={styles.roleRow}>
            <View
              style={[
                styles.roleBadge,
                {backgroundColor: `${roleColors[item.role]}22`},
              ]}>
              <Ionicons
                name={roleIcons[item.role]}
                size={14}
                color={roleColors[item.role]}
              />
              <Text style={[styles.roleText, {color: roleColors[item.role]}]}>
                {item.role}
              </Text>
            </View>
          </View>

          {teamInfo && (
            <Text style={styles.teamInfo}>
              {teamInfo.team.name} • {teamInfo.member.permissions.length}{' '}
              permissions
            </Text>
          )}
        </View>

        <View style={[styles.radio, isSelected && styles.radioSelected]}>
          {isSelected && <Ionicons name="checkmark" size={14} color="#fff" />}
        </View>
      </TouchableOpacity>
    );
  };

  const selectedUserObj = users.find(u => u.id === selectedUser);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logo}>
          <Ionicons name="business" size={26} color="#fff" />
        </View>
        <Text style={styles.title}>BuildPro</Text>
        <Text style={styles.subtitle}>
          Select a user to explore role-based dashboards
        </Text>
      </View>

      {/* Users */}
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={item => item.id}
        contentContainerStyle={{paddingBottom: 20}}
      />

      {/* Role Description */}
      {selectedUserObj && (
        <View style={styles.roleCard}>
          <View
            style={[
              styles.roleIcon,
              {backgroundColor: roleColors[selectedUserObj.role]},
            ]}>
            <Ionicons
              name={roleIcons[selectedUserObj.role]}
              size={20}
              color="#fff"
            />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.roleTitle}>{selectedUserObj.role} access</Text>
            <Text style={styles.roleDesc}>
              {roleDescriptions[selectedUserObj.role]}
            </Text>
          </View>
        </View>
      )}

      {/* Login Button */}
      <TouchableOpacity
        style={[styles.loginBtn, !selectedUser && styles.loginDisabled]}
        disabled={!selectedUser}
        onPress={handleLogin}>
        <Text style={styles.loginText}>
          Continue as {selectedUserObj?.name.split(' ')[0] || '...'}
        </Text>
        <Ionicons name="chevron-forward" size={18} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.demoText}>
        This is a demo login. No real authentication is used.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 16,
  },

  header: {
    alignItems: 'center',
    marginBottom: 20,
  },

  logo: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  title: {
    fontSize: 26,
    color: '#fff',
    fontWeight: '700',
  },

  subtitle: {
    color: '#94a3b8',
    marginTop: 4,
    textAlign: 'center',
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#020617',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },

  cardSelected: {
    borderWidth: 2,
    borderColor: '#2563eb',
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },

  name: {
    color: '#fff',
    fontWeight: '600',
  },

  email: {
    color: '#94a3b8',
    fontSize: 12,
  },

  roleRow: {
    flexDirection: 'row',
    marginTop: 6,
  },

  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  roleText: {
    fontSize: 12,
    textTransform: 'capitalize',
  },

  teamInfo: {
    marginTop: 6,
    fontSize: 11,
    color: '#64748b',
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#475569',
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },

  roleCard: {
    flexDirection: 'row',
    backgroundColor: '#020617',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
  },

  roleIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  roleTitle: {
    color: '#fff',
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  roleDesc: {
    color: '#94a3b8',
    fontSize: 12,
  },

  loginBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 14,
    marginTop: 20,
  },

  loginDisabled: {
    backgroundColor: '#1e293b',
  },

  loginText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  demoText: {
    textAlign: 'center',
    fontSize: 11,
    color: '#64748b',
    marginTop: 12,
  },
});
