import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../../context/AuthContext';

export default function Header({title, subtitle, notifications = 0}) {
  const navigation = useNavigation();
  const {user} = useAuth();
  console.log(user, 'useruseruseruseruser');

  const handleNotificationPress = () => {
    // Navigate to Notifications screen
    navigation.navigate('Notifications'); // Make sure 'Notifications' exists in your navigator
  };

  return (
    <View style={styles.header}>
      {/* LEFT */}
      <View style={styles.profileWrapper}>
        <TouchableOpacity style={styles.profileBtn} activeOpacity={0.7}>
          {user?.avatar ? (
            <Image
              source={{uri: user.avatar}}
              style={styles.avatar}
              resizeMode="cover"
            />
          ) : (
            <Icon name="person-circle-outline" size={40} color="#fff" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuBadge}
          onPress={() => navigation.openDrawer()}
          activeOpacity={0.7}>
          <Icon name="menu-outline" size={14} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* CENTER – TITLE */}
      <View style={{flex: 1}}>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
      </View>

      {/* RIGHT */}
      <View style={styles.headerRight}>
        <TouchableOpacity
          style={styles.notifyBtn}
          onPress={handleNotificationPress}
          activeOpacity={0.7}>
          <Text style={{fontSize: 14}}>🔔</Text>
          {notifications > 0 && (
            <View style={styles.notifyBadge}>
              <Text style={styles.notifyBadgeText}>{notifications}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    backgroundColor: '#000000ff',
  },

  profileWrapper: {
    width: 46,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },

  avatar: {
    width: '100%',
    height: '100%',
  },

  profileBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e1e2d',
  },

  menuBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#003366',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#cbd5e1',
    marginTop: 2,
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  notifyBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#21d673ff',
    position: 'relative',
  },

  notifyBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#ff3b30',
    width: 14,
    height: 14,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  notifyBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});
