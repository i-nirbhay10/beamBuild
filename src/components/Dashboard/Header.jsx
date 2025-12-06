import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
export default function Header({title, subtitle}) {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      {/* LEFT */}
      <View style={styles.profileWrapper}>
        <TouchableOpacity style={styles.profileBtn}>
          <Icon name="person-circle-outline" size={40} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuBadge}
          onPress={() => navigation.openDrawer()}>
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
        <TouchableOpacity style={styles.notifyBtn}>
          <Text style={{fontSize: 16}}>🔔</Text>
          <View style={styles.notifyBadge}>
            <Text style={styles.notifyBadgeText}>3</Text>
          </View>
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
    justifyContent: 'space-between', // ⭐ keeps left, middle, right aligned nicely
    borderBottomWidth: 1,
    borderColor: '#1a1a2e',
    backgroundColor: '#000000ff',
  },

  profileWrapper: {
    width: 46,
    height: 46,
    justifyContent: 'center', // ⭐ centers profile vertically
    alignItems: 'center', // ⭐ centers profile horizontally
    marginRight: 12, // ⭐ space before title
  },

  profileBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e1e2d', // Looks better behind icon
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
    color: '#fff', // white text
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#cbd5e1', // light blue/gray for subtitle
    marginTop: 2,
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  notifyBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#003366', // slightly lighter navy
    position: 'relative',
  },

  notifyBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#ff3b30',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  notifyBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
});
