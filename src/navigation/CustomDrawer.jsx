import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';

const navigationItems = [
  {name: 'Dashboard', icon: 'grid', route: 'Dashboard'},
  {name: 'Projects', icon: 'folder', route: 'Projects'},
  {name: 'Team', icon: 'users', route: 'Team'},
  {name: 'Tasks', icon: 'check-square', route: 'Tasks'},
  {name: 'Report', icon: 'bar-chart', route: 'Reports'},
];

const secondaryItems = [
  {name: 'Settings', icon: 'settings', route: 'Settings'},
];

export default function CustomDrawer(props) {
  const navigation = useNavigation();

  const currentUser = {
    name: 'Nirbhay',
    role: 'project manager',
    avatar:
      'https://www.devoutgrowth.com/admin/team_uploads/1763707290_6920099a27a61_WhatsApp%20Image%202025-11-21%20at%2012.08.10%20PM.jpeg',
  };

  return (
    <DrawerContentScrollView
      {...props}
      style={{backgroundColor: '#f8f9fc'}}
      contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between'}}>
      <View>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Icon name="cpu" color="#fff" size={20} />
          </View>
          <Text style={styles.logoText}>Beam Build</Text>
        </View>

        {/* Main Menu */}
        <View style={{paddingHorizontal: 12}}>
          <Text style={styles.sectionTitle}>MAIN MENU</Text>

          {navigationItems.map(item => {
            const isActive =
              props.state.routeNames[props.state.index] === item.route;

            return (
              <TouchableOpacity
                key={item.name}
                onPress={() => props.navigation.navigate(item.route)}
                style={[styles.navItem, isActive && styles.activeNavItem]}>
                <Icon
                  name={item.icon}
                  size={20}
                  color={isActive ? '#0b74ff' : '#5a5f6e'}
                />
                <Text
                  style={[styles.navText, isActive && styles.activeNavText]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* Settings */}
          <Text style={[styles.sectionTitle, {marginTop: 20}]}>SETTINGS</Text>

          {secondaryItems.map(item => (
            <TouchableOpacity
              key={item.name}
              onPress={() => props.navigation.navigate(item.route)}
              style={styles.navItem}>
              <Icon name={item.icon} size={20} color="#5a5f6e" />
              <Text style={styles.navText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Footer — User Profile */}
      <View style={styles.footer}>
        <Image source={{uri: currentUser.avatar}} style={styles.avatar} />
        <View style={{flex: 1}}>
          <Text style={styles.userName}>{currentUser.name}</Text>
          <Text style={styles.userRole}>{currentUser.role}</Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{name: 'Login'}],
            });
            console.log('Logout pressed');
          }}>
          <Icon name="log-out" size={18} color="#777" />
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#e4e7ee',
  },
  logoIcon: {
    height: 36,
    width: 36,
    backgroundColor: '#0c0c0cff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1e2e',
  },
  sectionTitle: {
    marginVertical: 10,
    fontSize: 11,
    fontWeight: '700',
    color: '#8a8f9e',
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  navText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#1a1e2e',
  },
  activeNavItem: {
    backgroundColor: '#eaf3ff',
  },
  activeNavText: {
    color: '#0b74ff',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#e4e7ee',
    padding: 16,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 10,
    marginRight: 10,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
  },
  userRole: {
    fontSize: 12,
    color: '#8a8f9e',
    textTransform: 'capitalize',
  },
});
