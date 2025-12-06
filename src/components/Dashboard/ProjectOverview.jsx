import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useData} from '../../context/DataContext';

export default function ProjectOverview({onOpenProject, onOpenAllProjects}) {
  const {projects} = useData();
  const top = projects.slice(0, 3);

  return (
    <View style={styles.card}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <Text style={styles.cardTitle}>Active Projects</Text>

        <TouchableOpacity onPress={onOpenProject} style={styles.viewAllBtn}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Top Projects */}
      {top.map(p => (
        <View key={p.id} style={styles.projectRow}>
          {/* Main content */}
          <TouchableOpacity
            style={{flex: 1}}
            // onPress={() => onOpenProject?.(p.id)}
          >
            <View style={styles.projectHeader}>
              <Text style={styles.projectName}>{p.name}</Text>
              <Text style={styles.projectProgress}>{p.progress}%</Text>
            </View>

            <Text style={styles.projectMeta}>
              {p.location} • Due {new Date(p.endDate).toLocaleDateString()}
            </Text>

            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, {width: `${p.progress}%`}]} />
            </View>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    elevation: 1,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

  viewAllBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },

  viewAllText: {
    fontSize: 13,
    color: '#0b74ff',
    fontWeight: '600',
  },

  projectRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#f0f2f6',
  },

  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  projectName: {
    fontSize: 15,
    fontWeight: '700',
  },

  projectProgress: {
    fontWeight: '700',
  },

  projectMeta: {
    color: '#777',
    marginTop: 4,
  },

  progressBarContainer: {
    height: 8,
    backgroundColor: '#eef2fb',
    borderRadius: 8,
    marginTop: 8,
    overflow: 'hidden',
  },

  progressBar: {
    height: 8,
    backgroundColor: '#6F1FFC',
  },
});
