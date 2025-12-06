import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';

export default function TeamMemberCard({user}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigation = useNavigation();

  console.log(user, 'useruseruseruser');

  const initials = user.name.slice(0, 2).toUpperCase();

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.row}>
          <View style={styles.avatar}>
            {user.avatar ? (
              <Image source={{uri: user.avatar}} style={styles.avatarImg} />
            ) : (
              <Text style={styles.avatarTxt}>{initials}</Text>
            )}
          </View>
          <View>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.role}>{user.role}</Text>
          </View>
        </View>

        {/* Menu button */}
        <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)}>
          <Icon name="more-vertical" size={20} />
        </TouchableOpacity>

        {/* Dropdown menu */}
        {menuOpen && (
          <View style={styles.menu}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                navigation.navigate('TeamProfile', {id: user.id});
              }}>
              <Icon name="user" size={16} />
              <Text style={styles.menuText}>View Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                navigation.navigate('EditMember', {id: user.id});
              }}>
              <Icon name="edit" size={16} />
              <Text style={styles.menuText}>Edit Member</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.menuItem,
                {borderTopWidth: 1, borderColor: '#eee'},
              ]}>
              <Icon name="trash" size={16} color="red" />
              <Text style={[styles.menuText, {color: 'red'}]}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Email */}
      <View style={styles.row}>
        <Icon name="mail" size={14} color="#777" />
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* Phone */}
      {user.phone ? (
        <View style={[styles.row, {marginTop: 4}]}>
          <Icon name="phone" size={14} color="#777" />
          <Text style={styles.email}>{user.phone}</Text>
        </View>
      ) : null}

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.viewBtn}
          onPress={() => navigation.navigate('UserTasks', {id: user.id})}>
          <Text style={styles.viewBtnText}>View Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBtn}>
          <Icon name="mail" size={16} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    // width: '48%',
    marginBottom: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  row: {flexDirection: 'row', alignItems: 'center', gap: 6},
  avatar: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImg: {height: 48, width: 48, borderRadius: 24},
  avatarTxt: {fontWeight: '700', color: '#333'},

  name: {fontSize: 16, fontWeight: '700', color: '#111'},
  role: {fontSize: 12, color: '#777', marginTop: 2},

  menu: {
    position: 'absolute',
    top: 26,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 4,
    zIndex: 10,
  },
  menuItem: {
    flexDirection: 'row',
    padding: 8,
    alignItems: 'center',
    gap: 6,
  },
  menuText: {fontSize: 14},

  email: {marginLeft: 4, fontSize: 13, color: '#777'},

  buttonRow: {flexDirection: 'row', marginTop: 14, gap: 8},
  viewBtn: {
    flex: 1,
    backgroundColor: '#eef4ff',
    padding: 8,
    borderRadius: 6,
  },
  viewBtnText: {textAlign: 'center', color: '#0b74ff', fontWeight: '600'},
  iconBtn: {
    width: 38,
    height: 38,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
