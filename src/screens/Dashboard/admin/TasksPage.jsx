import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SectionList,
  Dimensions,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import {tasks, projects} from '../../../data/mockData';
import TaskCard from '../../../components/task/TaskCard';
import Header from '../../../components/layout/Header';
import NewTaskBottomSheet from '../../../components/task/NewTaskModal';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function TasksPage() {
  const [projectFilter, setProjectFilter] = useState('all');
  const [newTaskVisible, setNewTaskVisible] = useState(false);

  useEffect(() => {
    console.log('BottomSheet :', newTaskVisible);
  }, [newTaskVisible]);

  const filteredTasks =
    projectFilter === 'all'
      ? tasks
      : tasks.filter(t => t.projectId === projectFilter);

  const statusTabs = ['all', 'pending', 'in-progress', 'completed', 'blocked'];

  const stats = [
    {
      title: 'Pending',
      value: filteredTasks.filter(t => t.status === 'pending').length,
      icon: 'clock',
      color: '#f59e0b',
    },
    {
      title: 'In Progress',
      value: filteredTasks.filter(t => t.status === 'in-progress').length,
      icon: 'loader',
      color: '#3b82f6',
    },
    {
      title: 'Completed',
      value: filteredTasks.filter(t => t.status === 'completed').length,
      icon: 'check-circle',
      color: '#10b981',
    },
    {
      title: 'Blocked',
      value: filteredTasks.filter(t => t.status === 'blocked').length,
      icon: 'alert-circle',
      color: '#ef4444',
    },
  ];

  const sections = statusTabs.map(status => {
    const tasksByStatus =
      status === 'all'
        ? filteredTasks
        : filteredTasks.filter(t => t.status === status);

    return {title: status, data: tasksByStatus};
  });

  return (
    <View style={styles.container}>
      <Header title="Tasks" subtitle="Manage your construction projects" />

      {/* Stats */}
      <View style={styles.statsRow}>
        {stats.map(stat => (
          <View key={stat.title} style={styles.statCard}>
            <View
              style={[styles.statIcon, {backgroundColor: stat.color + '22'}]}>
              <Icon name={stat.icon} size={20} color={stat.color} />
            </View>

            <View style={styles.statInfo}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Project Filters */}
      <View style={styles.tabRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              projectFilter === 'all' && styles.filterBtnActive,
            ]}
            onPress={() => setProjectFilter('all')}>
            <Text
              style={[
                styles.filterText,
                projectFilter === 'all' && styles.filterTextActive,
              ]}>
              All ({filteredTasks.length})
            </Text>
          </TouchableOpacity>

          {projects.map(p => (
            <TouchableOpacity
              key={p.id}
              style={[
                styles.filterBtn,
                projectFilter === p.id && styles.filterBtnActive,
              ]}
              onPress={() => setProjectFilter(p.id)}>
              <Text
                style={[
                  styles.filterText,
                  projectFilter === p.id && styles.filterTextActive,
                ]}>
                {p.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Search + New Task */}
      <View style={styles.searchRow}>
        <TextInput placeholder="Search tasks..." style={styles.searchInput} />

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setNewTaskVisible(!newTaskVisible)}>
          <Icon name="plus" size={16} color="#fff" />
          <Text style={styles.addBtnText}>New</Text>
        </TouchableOpacity>
      </View>

      {/* Tasks List */}
      <SectionList
        showsVerticalScrollIndicator={false}
        sections={sections}
        keyExtractor={item => item.id}
        renderItem={({item}) => <TaskCard task={item} />}
        renderSectionHeader={({section: {title, data}}) => (
          <Text style={styles.tabTitle}>
            {title.charAt(0).toUpperCase() + title.slice(1)} ({data.length})
          </Text>
        )}
        contentContainerStyle={{paddingHorizontal: 5, paddingBottom: 20}}
      />
      <NewTaskBottomSheet
        isVisible={newTaskVisible}
        onClose={() => setNewTaskVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7fb',
  },

  /* Stats */
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 5,
    marginTop: 5,
    rowGap: 5,
  },

  statCard: {
    width: SCREEN_WIDTH * 0.47,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },

  statInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },

  statTitle: {
    fontSize: 14,
    color: '#666',
  },

  /* FILTERS */
  tabRow: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    justifyContent: 'space-between',
  },
  filterScroll: {
    paddingHorizontal: 5,
    paddingVertical: 8,
    flexDirection: 'row',
  },

  filterBtn: {
    backgroundColor: '#f0f2f5',
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
  },

  filterBtnActive: {
    backgroundColor: '#6F1FFC',
  },

  filterText: {
    // margin: 20,
    fontSize: 12,
    fontWeight: '500',
    color: '#222',
  },

  filterTextActive: {
    // margin: 20,
    color: '#fff',
    fontWeight: '600',
  },

  /* Search Row */
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 5,
    marginTop: 5,
    paddingVertical: 10,
    // maxHeight: 60,
  },

  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 14,
  },

  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6F1FFC',
    paddingHorizontal: 14,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
  },

  addBtnText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
  },

  /* Task Sections */
  tabTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
    marginBottom: 10,
    marginTop: 20,
  },
});
