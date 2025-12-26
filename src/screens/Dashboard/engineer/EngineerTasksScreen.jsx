import React, {useState, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from '../../../context/AuthContext';
import {projects, tasks as allTasks} from '../../../data/mockData';
import Header from '../../../components/layout/Header';

/* ================= CONFIG ================= */

const statusConfig = {
  pending: {icon: 'ellipse-outline', color: '#94a3b8', bg: '#1e293b'},
  'in-progress': {icon: 'play', color: '#3b82f6', bg: '#3b82f622'},
  completed: {icon: 'checkmark-circle', color: '#10b981', bg: '#10b98122'},
  blocked: {icon: 'warning', color: '#ef4444', bg: '#ef444422'},
};

const priorityConfig = {
  low: {bg: '#1e293b', color: '#94a3b8'},
  medium: {bg: '#f59e0b33', color: '#f59e0b'},
  high: {bg: '#f9731633', color: '#f97316'},
  urgent: {bg: '#ef444422', color: '#ef4444'},
};

/* ================= SCREEN ================= */

export default function EngineerTasksScreen() {
  const {user} = useAuth();
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const myTasks = useMemo(
    () => allTasks.filter(t => t.assigneeId === user?.id),
    [user?.id],
  );

  const filteredTasks =
    filter === 'all' ? myTasks : myTasks.filter(t => t.status === filter);

  const taskCounts = useMemo(
    () => ({
      all: myTasks.length,
      pending: myTasks.filter(t => t.status === 'pending').length,
      'in-progress': myTasks.filter(t => t.status === 'in-progress').length,
      completed: myTasks.filter(t => t.status === 'completed').length,
      blocked: myTasks.filter(t => t.status === 'blocked').length,
    }),
    [myTasks],
  );

  const tabs = ['all', 'pending', 'in-progress', 'completed', 'blocked'];

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  /* ================= ACTION HANDLERS ================= */

  const handleStatusChange = (taskId, status) => {
    console.log(`Task ${taskId} → ${status}`);
    // connect to API later
  };

  const handleViewDetails = task => {
    console.log('View details:', task.title);
  };

  /* ================= RENDER TASK ================= */

  const renderTask = ({item: task}) => {
    const project = projects.find(p => p.id === task.projectId);
    const config = statusConfig[task.status];
    const daysUntilDue = Math.ceil(
      (new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24),
    );
    const isOverdue = daysUntilDue < 0 && task.status !== 'completed';

    return (
      <View style={styles.taskCard}>
        {/* LEFT ICON */}
        <View style={[styles.statusIcon, {backgroundColor: config.bg}]}>
          <Ionicons name={config.icon} size={20} color={config.color} />
        </View>

        {/* RIGHT CONTENT */}
        <View style={styles.taskContent}>
          {/* Row 1: Title + Due */}
          <View style={styles.rowBetween}>
            <Text style={styles.taskTitle} numberOfLines={1}>
              {task.title}
            </Text>
            <Text style={[styles.dueText, isOverdue && {color: '#ef4444'}]}>
              {task.status === 'completed'
                ? 'Done'
                : isOverdue
                ? 'Overdue'
                : `${daysUntilDue}d`}
            </Text>
          </View>

          {/* Row 2: Description */}
          {task.description ? (
            <Text style={styles.taskDesc} numberOfLines={2}>
              {task.description}
            </Text>
          ) : null}

          <Text style={styles.projectName}>{project?.name}</Text>

          {/* Row 3: Priority + Actions */}
          <View style={styles.bottomRow}>
            <View
              style={[
                styles.priorityBadge,
                {backgroundColor: priorityConfig[task.priority].bg},
              ]}>
              <Text
                style={{
                  color: priorityConfig[task.priority].color,
                  fontSize: 12,
                }}>
                {task.priority}
              </Text>
            </View>

            <View style={styles.actionsRow}>
              {task.status === 'pending' && (
                <TouchableOpacity
                  style={[styles.actionBtn, styles.startBtn]}
                  onPress={() => handleStatusChange(task.id, 'in-progress')}>
                  <Ionicons name="play" size={16} color="#3b82f6" />
                </TouchableOpacity>
              )}

              {task.status === 'in-progress' && (
                <>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.doneBtn]}
                    onPress={() => handleStatusChange(task.id, 'completed')}>
                    <Ionicons name="checkmark" size={16} color="#10b981" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionBtn, styles.blockBtn]}
                    onPress={() => handleStatusChange(task.id, 'blocked')}>
                    <Ionicons name="warning" size={16} color="#ef4444" />
                  </TouchableOpacity>
                </>
              )}

              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleViewDetails(task)}>
                <Ionicons
                  name="information-circle-outline"
                  size={16}
                  color="#94a3b8"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  /* ================= UI ================= */

  return (
    <View style={styles.container}>
      <Header title="My Tasks" subtitle="Manage your assigned tasks" />

      {/* Tabs */}
      <View>
        <ScrollView horizontal style={styles.tabsRow}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, filter === tab && styles.activeTab]}
              onPress={() => setFilter(tab)}>
              <Text
                style={[
                  styles.tabText,
                  filter === tab && styles.activeTabText,
                ]}>
                {tab.replace('-', ' ')} ({taskCounts[tab]})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* List */}
      <FlatList
        data={filteredTasks}
        keyExtractor={item => item.id.toString()}
        renderItem={renderTask}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{paddingBottom: 80}}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <MaterialIcons
              name="check-circle-outline"
              size={48}
              color="#94a3b8"
            />
            <Text style={styles.emptyText}>No tasks found</Text>
          </View>
        }
      />
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  /* ===== Screen ===== */
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },

  /* ===== Tabs ===== */
  tabsRow: {
    flexDirection: 'row',
    // flexWrap: 'wrap',
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 4,
  },
  tabButton: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  activeTab: {
    backgroundColor: '#6366f1',
  },
  tabText: {
    color: '#94a3b8',
    fontSize: 13,
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },

  /* ===== Task Card ===== */
  taskCard: {
    flexDirection: 'row',
    backgroundColor: '#020617',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 12,
    marginVertical: 6,
  },

  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  taskContent: {
    flex: 1,
  },

  /* ===== Text ===== */
  taskTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  taskDesc: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  projectName: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 4,
  },
  dueText: {
    color: '#94a3b8',
    fontSize: 12,
    marginLeft: 8,
  },

  /* ===== Layout Rows ===== */
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },

  /* ===== Priority ===== */
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },

  /* ===== Actions ===== */
  actionsRow: {
    flexDirection: 'row',
  },
  actionBtn: {
    width: 30,
    height: 30,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    backgroundColor: '#1e293b',
  },
  startBtn: {
    backgroundColor: '#3b82f622',
  },
  doneBtn: {
    backgroundColor: '#10b98122',
  },
  blockBtn: {
    backgroundColor: '#ef444422',
  },

  /* ===== Empty State ===== */
  emptyCard: {
    backgroundColor: '#020617',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    margin: 20,
  },
  emptyText: {
    color: '#94a3b8',
    marginTop: 12,
  },
});
