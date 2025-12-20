import React, {useState} from 'react';
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
import {useAuth} from '../../../context/AuthContext';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function TaskManagementScreen() {
  const {user} = useAuth();

  const [projectFilter, setProjectFilter] = useState('all');
  const [newTaskVisible, setNewTaskVisible] = useState(false);

  /* ================== FILTER TASKS BY USER ================== */
  const userTasks = tasks.filter(task => task.assigneeId === user?.id);

  /* ================== FILTER PROJECTS THAT HAVE USER TASKS ================== */
  const userProjectIds = [...new Set(userTasks.map(t => t.projectId))];
  const userProjects = projects.filter(p => userProjectIds.includes(p.id));

  /* ================== APPLY PROJECT FILTER ================== */
  const filteredTasks =
    projectFilter === 'all'
      ? userTasks
      : userTasks.filter(t => t.projectId === projectFilter);

  /* ================== STATS ================== */
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

  /* ================== TASK SECTIONS ================== */
  const statusTabs = ['all', 'pending', 'in-progress', 'completed', 'blocked'];

  const sections = statusTabs.map(status => ({
    title: status,
    data:
      status === 'all'
        ? filteredTasks
        : filteredTasks.filter(t => t.status === status),
  }));

  /* ================== RENDER ================== */
  return (
    <View style={styles.container}>
      <Header
        title="Tasks"
        subtitle={`Welcome, ${user?.name}`}
        avatar={user?.avatar}
      />

      {/* Stats */}
      <View style={styles.statsRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingHorizontal: 5}}>
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
        </ScrollView>
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
              All ({userTasks.length})
            </Text>
          </TouchableOpacity>

          {userProjects.map(p => (
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
          onPress={() => setNewTaskVisible(true)}>
          <Icon name="plus" size={16} color="#fff" />
          <Text style={styles.addBtnText}>New</Text>
        </TouchableOpacity>
      </View>

      {/* Task List */}
      <SectionList
        showsVerticalScrollIndicator={false}
        sections={sections}
        keyExtractor={item => item.id}
        renderItem={({item}) => <TaskCard task={item} />}
        renderSectionHeader={({section}) => (
          <Text style={styles.tabTitle}>
            {section.title.charAt(0).toUpperCase() + section.title.slice(1)} (
            {section.data.length})
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

/* ================== STYLES ================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7fb',
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    // paddingHorizontal: 5,
    rowGap: 5,
    gap: 10,
    paddingVertical: 10,
    backgroundColor: '#1e293b',
  },
  statCard: {
    width: SCREEN_WIDTH * 0.3,
    // gap: 5,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    // backgroundColor: '#020617',
    marginRight: 10,
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
  tabRow: {
    marginTop: 15,
    paddingHorizontal: 5,
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
    fontSize: 12,
    fontWeight: '500',
    color: '#222',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 5,
    marginTop: 5,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
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
  tabTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
    marginBottom: 10,
    marginTop: 20,
  },
});
