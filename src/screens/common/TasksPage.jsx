import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useAuth} from '../../context/AuthContext';
import {getTasksByAssigneeId, getProjectById} from '../../data/mockData';
import Icon from 'react-native-vector-icons/Feather';
import Header from '../../components/layout/Header';

const statusConfig = {
  pending: {icon: 'circle', color: '#9ca3af', bg: '#374151'},
  'in-progress': {icon: 'play', color: '#3b82f6', bg: '#1e40af'},
  completed: {icon: 'check-circle', color: '#10b981', bg: '#065f46'},
  blocked: {icon: 'alert-triangle', color: '#ef4444', bg: '#7f1d1d'},
};

const priorityConfig = {
  low: {bg: '#1f2937', color: '#9ca3af'},
  medium: {bg: '#78350f', color: '#f59e0b'},
  high: {bg: '#92400e', color: '#f97316'},
  urgent: {bg: '#7f1d1d', color: '#ef4444'},
};

export default function TasksPage({navigation}) {
  const {user} = useAuth();
  const [filter, setFilter] = useState('all');

  if (!user || !['supervisor', 'engineer', 'laborer'].includes(user.role)) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>
          You are not authorized to view this page.
        </Text>
      </View>
    );
  }

  const myTasks = getTasksByAssigneeId(user?.id || '');
  const filteredTasks =
    filter === 'all' ? myTasks : myTasks.filter(t => t.status === filter);

  const taskCounts = {
    all: myTasks.length,
    pending: myTasks.filter(t => t.status === 'pending').length,
    'in-progress': myTasks.filter(t => t.status === 'in-progress').length,
    completed: myTasks.filter(t => t.status === 'completed').length,
    blocked: myTasks.filter(t => t.status === 'blocked').length,
  };

  const renderTask = ({item}) => {
    const project = getProjectById(item.projectId);
    const config = statusConfig[item.status];
    const daysUntilDue = Math.ceil(
      (new Date(item.dueDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const isOverdue = daysUntilDue < 0 && item.status !== 'completed';

    return (
      <View style={[styles.card]}>
        <View style={styles.taskHeader}>
          <View style={[styles.statusIcon, {backgroundColor: config.bg}]}>
            <Icon name={config.icon} size={20} color={config.color} />
          </View>
          <View style={styles.taskInfo}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text style={styles.taskDesc}>{item.description}</Text>
            <Text style={styles.taskProject}>{project?.name}</Text>
          </View>
          <View style={styles.taskMeta}>
            <View
              style={[
                styles.priorityBadge,
                {backgroundColor: priorityConfig[item.priority].bg},
              ]}>
              <Text
                style={{
                  color: priorityConfig[item.priority].color,
                  fontSize: 12,
                }}>
                {item.priority}
              </Text>
            </View>
            <Text style={[styles.dueText, isOverdue && {color: '#f87171'}]}>
              {isOverdue
                ? 'Overdue!'
                : item.status === 'completed'
                ? 'Completed'
                : `Due in ${daysUntilDue} days`}
            </Text>
          </View>
        </View>

        {item.status !== 'completed' && (
          <View style={styles.actions}>
            {item.status === 'pending' && (
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="play" size={16} color="#fff" />
                <Text style={styles.actionText}>Start Task</Text>
              </TouchableOpacity>
            )}
            {item.status === 'in-progress' && (
              <>
                <TouchableOpacity
                  style={[styles.actionButton, {backgroundColor: '#10b981'}]}>
                  <Icon name="check-circle" size={16} color="#fff" />
                  <Text style={styles.actionText}>Mark Complete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, {backgroundColor: '#374151'}]}>
                  <Icon name="pause" size={16} color="#9ca3af" />
                  <Text style={styles.actionText}>Pause</Text>
                </TouchableOpacity>
              </>
            )}
            {item.status === 'blocked' && (
              <TouchableOpacity
                style={[styles.actionButton, {backgroundColor: '#ef4444'}]}>
                <Icon name="alert-triangle" size={16} color="#fff" />
                <Text style={styles.actionText}>Report Issue</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: '#111827'}}>
      <Header title="My Tasks" subtitle="Manage your assigned tasks" />
      <ScrollView style={styles.container}>
        <View>
          <ScrollView
            horizontal
            style={styles.tabsRow}
            showsHorizontalScrollIndicator={false}>
            <View style={styles.filters}>
              {['all', 'pending', 'in-progress', 'completed', 'blocked'].map(
                f => (
                  <TouchableOpacity
                    key={f}
                    style={[
                      styles.filterButton,
                      filter === f && styles.filterActive,
                    ]}
                    onPress={() => setFilter(f)}>
                    <Text
                      style={
                        filter === f
                          ? styles.filterTextActive
                          : styles.filterText
                      }>
                      {f.charAt(0).toUpperCase() + f.slice(1)} ({taskCounts[f]})
                    </Text>
                  </TouchableOpacity>
                ),
              )}
            </View>
          </ScrollView>
        </View>
        {filteredTasks.length === 0 ? (
          <View style={styles.center}>
            <Icon name="check-circle" size={60} color="#9ca3af" />
            <Text style={{color: '#9ca3af', marginTop: 8}}>
              No tasks in this category
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredTasks}
            keyExtractor={item => item.id}
            renderItem={renderTask}
            scrollEnabled={false}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 5},
  center: {alignItems: 'center', justifyContent: 'center', padding: 40},
  text: {color: '#fff'},
  filters: {flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16},
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    margin: 4,
    backgroundColor: '#374151',
  },
  filterActive: {backgroundColor: '#3b82f6'},
  filterText: {color: '#9ca3af'},
  filterTextActive: {color: '#fff'},
  card: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#1f2937',
    marginBottom: 12,
  },
  taskHeader: {flexDirection: 'row', alignItems: 'center'},
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  taskInfo: {flex: 1},
  taskTitle: {fontSize: 16, fontWeight: '600', color: '#f9fafb'},
  taskDesc: {fontSize: 12, color: '#d1d5db', marginTop: 2},
  taskProject: {fontSize: 10, color: '#9ca3af', marginTop: 2},
  taskMeta: {alignItems: 'flex-end'},
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  dueText: {fontSize: 10, color: '#9ca3af'},
  actions: {flexDirection: 'row', marginTop: 12, gap: 8},
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
    marginRight: 8,
  },
  actionText: {color: '#fff', fontSize: 12, marginLeft: 4},
});
