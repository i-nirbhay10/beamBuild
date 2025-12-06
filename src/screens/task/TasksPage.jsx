import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {tasks, projects} from '../../data/mockData';
import TaskCard from '../../components/task/TaskCard';
import TaskBoard from '../../components/task/TaskBoard';
import Header from '../../components/Dashboard/Header';
import NewTaskModal from '../../components/task/NewTaskModal';

export default function TasksPage() {
  const [viewMode, setViewMode] = useState('list');
  const [projectFilter, setProjectFilter] = useState('all');
  const [newTaskVisible, setNewTaskVisible] = useState(false);

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

  return (
    <View style={{flex: 1}}>
      <Header title="Tasks" subtitle={`Manage your construction projects`} />
      <ScrollView style={styles.container}>
        {/* Stats */}
        <View style={styles.statsRow}>
          {stats.map(stat => (
            <View key={stat.title} style={styles.statCard}>
              <View
                style={[styles.statIcon, {backgroundColor: stat.color + '33'}]}>
                <Icon name={stat.icon} size={22} color={stat.color} />
              </View>

              <View
                style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statTitle}>{stat.title}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Filters + View Toggle + Add Task */}
        <View style={styles.filterRow}>
          <View style={styles.filters}>
            <TextInput
              placeholder="Search tasks..."
              style={styles.searchInput}
            />
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

          <View style={styles.viewToggleRow}>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                viewMode === 'list' && styles.toggleBtnActive,
              ]}
              onPress={() => setViewMode('list')}>
              <Icon
                name="list"
                size={18}
                color={viewMode === 'list' ? '#fff' : '#333'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                viewMode === 'board' && styles.toggleBtnActive,
              ]}
              onPress={() => setViewMode('board')}>
              <Icon
                name="grid"
                size={18}
                color={viewMode === 'board' ? '#fff' : '#333'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => setNewTaskVisible(true)}>
              <Icon name="plus" size={18} color="#fff" />
              <Text style={styles.addBtnText}>New Task</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tasks */}
        {viewMode === 'board' ? (
          <TaskBoard tasks={filteredTasks} />
        ) : (
          statusTabs.map(status => {
            const tasksByStatus =
              status === 'all'
                ? filteredTasks
                : filteredTasks.filter(t => t.status === status);
            return (
              <View key={status} style={{marginBottom: 16}}>
                <Text style={styles.tabTitle}>
                  {status.charAt(0).toUpperCase() + status.slice(1)} (
                  {tasksByStatus.length})
                </Text>
                <FlatList
                  data={tasksByStatus}
                  keyExtractor={item => item.id}
                  renderItem={({item}) => <TaskCard task={item} />}
                  scrollEnabled={false} // disable inner scroll to avoid conflict
                />
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Separate New Task Modal */}
      <NewTaskModal
        visible={newTaskVisible}
        onClose={() => setNewTaskVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 12},
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: 140, // ensures consistent card size
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  //   width: 36,
  //   height: 36,
  //   borderRadius: 8,
  //   marginBottom: 12,
  // },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  statTitle: {
    fontSize: 14,
    color: '#555',
    // marginTop: 4,
    textAlign: 'center',
  },

  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  filters: {flex: 1, marginRight: 8},
  searchInput: {
    padding: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 8,
  },
  filterBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#eee',
    marginRight: 6,
  },
  filterBtnActive: {backgroundColor: '#0b74ff'},
  filterText: {fontSize: 12, color: '#333'},
  filterTextActive: {color: '#fff'},
  viewToggleRow: {flexDirection: 'row', alignItems: 'center'},
  toggleBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#eee',
    marginRight: 4,
  },
  toggleBtnActive: {backgroundColor: '#0b74ff'},
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#0b74ff',
  },
  addBtnText: {color: '#fff', marginLeft: 6},
  tabTitle: {fontWeight: '700', marginBottom: 6},
});
