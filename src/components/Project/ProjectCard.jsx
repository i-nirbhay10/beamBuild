import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export function ProjectCard({project}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigation = useNavigation();

  const budgetPercent = Math.round((project.spent / project.budget) * 100);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{project.name}</Text>
        <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)}>
          <Icon name="more-vertical" size={18} color="#444" />
        </TouchableOpacity>

        {menuOpen && (
          <View style={styles.menu}>
            <TouchableOpacity style={styles.menuItem}>
              <Icon name="eye" size={16} />
              <Text style={styles.menuText}>View Details</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Icon name="edit" size={16} />
              <Text style={styles.menuText}>Edit Project</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.menuItem,
                {borderTopWidth: 1, borderColor: '#eee'},
              ]}>
              <Icon name="trash" size={16} color="red" />
              <Text style={[styles.menuText, {color: 'red'}]}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Location */}
      <View style={styles.locationRow}>
        <Icon name="map-pin" size={14} color="#777" />
        <Text style={styles.location}>{project.location}</Text>
      </View>

      {/* Description */}
      <Text style={styles.desc}>
        {project.description?.slice(0, 80) || 'No description'}
      </Text>

      {/* Progress */}
      <View style={{marginTop: 10}}>
        <View style={styles.progressRow}>
          <Text style={styles.muted}>Progress</Text>
          <Text style={styles.bold}>{project.progress}%</Text>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, {width: `${project.progress}%`}]}
          />
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsGrid}>
        <View>
          <View style={styles.statBox}>
            <Icon name="calendar" size={14} color="#777" />
            <Text style={styles.statLabel}>Timeline</Text>
          </View>
          <View style={styles.statBox}>
            <Icon name="dollar-sign" size={14} color="#777" />
            <Text style={styles.statLabel}>Budget: {budgetPercent}%</Text>
          </View>
        </View>
        <View>
          <View style={styles.statBox}>
            <Icon name="users" size={14} color="#777" />
            <Text style={styles.statLabel}>{project.team} team</Text>
          </View>

          <View style={styles.statBox}>
            <Icon name="check-square" size={14} color="#777" />
            <Text style={styles.statLabel}>{project.tasks} tasks</Text>
          </View>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.viewBtn}
          onPress={() =>
            navigation.navigate('ProjectDetail', {id: project.id})
          }>
          <Text style={styles.viewBtnText}>View Project</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBtn}>
          <Icon name="check-square" size={16} color="#444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 12,
    borderRadius: 12,
    // width: '48%',
    marginBottom: 14,
    elevation: 2,
  },
  header: {flexDirection: 'row', justifyContent: 'space-between'},
  menu: {
    position: 'absolute',
    right: 0,
    top: 24,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    paddingVertical: 4,
    zIndex: 10,
  },
  menuItem: {
    flexDirection: 'row',
    padding: 8,
    alignItems: 'center',
    gap: 8,
  },
  menuText: {fontSize: 14},

  title: {fontSize: 16, fontWeight: '700', color: '#111'},
  desc: {fontSize: 13, color: '#777', marginTop: 6},

  locationRow: {flexDirection: 'row', alignItems: 'center', marginTop: 4},
  location: {marginLeft: 4, fontSize: 13, color: '#777'},

  muted: {color: '#777'},
  bold: {fontWeight: '700'},

  progressRow: {flexDirection: 'row', justifyContent: 'space-between'},
  progressTrack: {
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 6,
    marginTop: 4,
  },
  progressFill: {
    height: 6,
    backgroundColor: '#6F1FFC',
    borderRadius: 6,
  },

  statsGrid: {
    flexDirection: 'row',
    paddingVertical: 12,
    //
    gap: 6,
    justifyContent: 'space-between',
  },
  statBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  statLabel: {fontSize: 12, color: '#444'},

  buttonRow: {flexDirection: 'row', marginTop: 12, gap: 8},
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
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
