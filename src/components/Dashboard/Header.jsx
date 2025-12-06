import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
export default function Header({title, subtitle}) {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      {/* Left side – Hamburger */}
      <TouchableOpacity
        style={styles.menuBtn}
        onPress={() => navigation.openDrawer()}>
        <Icon name="menu-outline" size={38} color="#fff" />
      </TouchableOpacity>

      {/* Title block */}
      <View style={{flex: 1}}>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle ? (
          <Text style={styles.headerSubtitle}>{subtitle}</Text>
        ) : null}
      </View>

      {/* Right side */}
      <View style={styles.headerRight}>
        {/* <View style={styles.searchBox}>
          <Text style={styles.searchText}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Search</Text>
        </View> */}
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
    height: 62,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#1a1a2e', // darker border for navy theme
    backgroundColor: '#001f4d', // navy background
  },

  menuBtn: {
    marginRight: 12,
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
