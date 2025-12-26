import React, {useMemo, useState} from 'react';
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

import {projects, tasks as mockTasks, users} from '../../../data/mockData';
import {useAuth} from '../../../context/AuthContext';

import TaskCard from '../../../components/task/TaskCard';
import Header from '../../../components/layout/Header';
import NewTaskBottomSheet from '../../../components/task/NewTaskModal';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function PMTasksPage() {
  const {user, teamMemberInfo} = useAuth();

  const [projectFilter, setProjectFilter] = useState('all');
  const [newTaskVisible, setNewTaskVisible] = useState(false);
  const [taskList, setTaskList] = useState(mockTasks);

  /* ------------------ ROLE CHECK ------------------ */
  const isPM =
    user?.role === 'project-manager' || teamMemberInfo?.role === 'supervisor';

  /* ------------------ VISIBLE TASKS ------------------ */
  const visibleTasks = useMemo(() => {
    if (!user) return [];

    if (isPM) {
      return taskList;
    }

    return taskList.filter(t => t.assigneeId === user.id);
  }, [taskList, user, isPM]);

  /* ------------------ PROJECT FILTER ------------------ */
  const filteredTasks =
    projectFilter === 'all'
      ? visibleTasks
      : visibleTasks.filter(t => t.projectId === projectFilter);

  /* ------------------ CREATE TASK (PM) ------------------ */
  const handleCreateTask = data => {
    const newTask = {
      id: `task_${Date.now()}`,
      title: data.title,
      description: data.description,
      projectId: data.projectId,
      assigneeId: data.assigneeId,
      priority: data.priority || 'medium',
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      dueDate: data.dueDate,
    };

    setTaskList(prev => [newTask, ...prev]);
    setNewTaskVisible(false);
  };

  /* ------------------ STATUS SECTIONS ------------------ */
  const statusTabs = ['pending', 'in-progress', 'completed', 'blocked'];

  const sections = statusTabs.map(status => ({
    title: status,
    data: filteredTasks.filter(t => t.status === status),
  }));

  return (
    <View style={styles.container}>
      <Header
        title="Tasks"
        subtitle={isPM ? 'Project tasks overview' : 'Your assigned tasks'}
      />

      {/* Filters */}
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
              All
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

      {/* Search + Create */}
      <View style={styles.searchRow}>
        <TextInput placeholder="Search tasks..." style={styles.searchInput} />

        {isPM && (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setNewTaskVisible(true)}>
            <Icon name="plus" size={16} color="#fff" />
            <Text style={styles.addBtnText}>New</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tasks */}
      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        renderItem={({item}) => <TaskCard task={item} />}
        renderSectionHeader={({section}) => (
          <Text style={styles.tabTitle}>
            {section.title.toUpperCase()} ({section.data.length})
          </Text>
        )}
        contentContainerStyle={{paddingBottom: 30}}
      />

      {/* Create Task Modal */}
      <NewTaskBottomSheet
        isVisible={newTaskVisible}
        onClose={() => setNewTaskVisible(false)}
        users={users}
        projects={projects}
        onCreate={handleCreateTask}
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
