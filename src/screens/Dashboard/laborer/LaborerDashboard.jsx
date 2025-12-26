import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import Header from '../../../components/layout/Header';
import {useAuth} from '../../../context/AuthContext';
import {
  teams,
  getProjectById,
  getTasksByAssigneeId,
} from '../../../data/mockData';

const safetyChecklist = [
  {id: 'ppe', label: 'Personal Protective Equipment worn'},
  {id: 'tools', label: 'Tools inspected and in good condition'},
  {id: 'area', label: 'Work area clear of hazards'},
  {id: 'weather', label: 'Weather conditions checked'},
  {id: 'briefing', label: 'Safety briefing attended'},
];

const LaborerDashboard = ({navigation}) => {
  const {user} = useAuth();
  const [checkedItems, setCheckedItems] = useState([]);

  const myTasks = useMemo(() => {
    if (!user?.id) return [];
    return getTasksByAssigneeId(user.id);
  }, [user?.id]);

  const inProgressTasks = myTasks.filter(t => t.status === 'in-progress');
  const completedTasks = myTasks.filter(t => t.status === 'completed');

  const laborerTeams = useMemo(
    () => teams.filter(team => team.members.some(m => m.userId === user?.id)),
    [user?.id],
  );

  const assignedProjects = useMemo(
    () => laborerTeams.map(t => getProjectById(t.projectId)).filter(Boolean),
    [laborerTeams],
  );

  const todaysTasks = myTasks.filter(t => t.status !== 'completed').slice(0, 5);
  const safetyProgress = (checkedItems.length / safetyChecklist.length) * 100;

  const toggleCheckItem = id => {
    setCheckedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
    );
  };

  const stats = [
    {label: "Today's Tasks", value: todaysTasks.length, icon: 'check-square'},
    {label: 'In Progress', value: inProgressTasks.length, icon: 'clock'},
    {label: 'Completed', value: completedTasks.length, icon: 'check-circle'},
    {label: 'Projects', value: assignedProjects.length, icon: 'briefcase'},
  ];

  return (
    <View style={styles.screen}>
      <Header title="Laborer Dashboard" />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        {/* STATS */}
        <View style={styles.statsRow}>
          {stats.map(item => (
            <View key={item.label} style={styles.statCardRow}>
              <Icon
                name={item.icon}
                size={24}
                color="#3b82f6"
                style={{marginRight: 12}}
              />
              <View>
                <Text style={styles.statValue}>{item.value}</Text>
                <Text style={styles.statLabel}>{item.label}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* SAFETY CHECK */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Daily Safety Check</Text>
          {safetyChecklist.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.checkItem}
              onPress={() => toggleCheckItem(item.id)}
              activeOpacity={0.7}>
              <Icon
                name={
                  checkedItems.includes(item.id) ? 'check-square' : 'square'
                }
                size={20}
                color="#10b981"
              />
              <Text style={styles.checkLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.progressText}>
            Completion: {checkedItems.length}/{safetyChecklist.length}
          </Text>
          {safetyProgress === 100 && (
            <Text style={styles.successText}>Safety Check Complete ✅</Text>
          )}
        </View>

        {/* TASKS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Tasks</Text>
          {todaysTasks.length === 0 ? (
            <Text style={styles.emptyText}>No tasks for today</Text>
          ) : (
            <FlatList
              data={todaysTasks}
              keyExtractor={item => item.id.toString()}
              scrollEnabled={false}
              renderItem={({item}) => {
                const project = getProjectById(item.projectId);
                return (
                  <View style={styles.taskRow}>
                    <Icon name="check-square" size={18} color="#3b82f6" />
                    <View style={styles.taskInfo}>
                      <Text style={styles.taskTitle}>{item.title}</Text>
                      <Text style={styles.taskSub}>{project?.name || '—'}</Text>
                    </View>
                    <Text style={styles.badge}>{item.priority}</Text>
                  </View>
                );
              }}
            />
          )}
        </View>

        {/* PROJECTS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>My Projects</Text>
          {assignedProjects.map(project => {
            const projectTasks = myTasks.filter(
              t => t.projectId === project.id,
            );
            const completed = projectTasks.filter(
              t => t.status === 'completed',
            ).length;
            return (
              <View key={project.id} style={styles.projectCard}>
                <Text style={styles.projectName}>{project.name}</Text>
                <Text style={styles.projectSub}>
                  {completed}/{projectTasks.length} tasks completed
                </Text>
              </View>
            );
          })}
        </View>

        {/* ACTIONS */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('DailyLog')}>
            <Icon name="clipboard" size={20} color="#2563eb" />
            <Text style={styles.actionText}>Daily Log</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
            <Icon name="alert-triangle" size={20} color="#ef4444" />
            <Text style={styles.actionText}>Report Issue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default LaborerDashboard;

/* =====================
   STYLES
===================== */
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#111827',
  },
  container: {
    padding: 5,
    paddingBottom: 24,
  },

  /* STATS */
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  statCardRow: {
    width: '48%',
    backgroundColor: '#1f2937',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f9fafb',
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },

  /* CARDS */
  card: {
    backgroundColor: '#1f2937',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f9fafb',
    marginBottom: 12,
  },

  /* SAFETY */
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkLabel: {
    marginLeft: 10,
    fontSize: 14,
    color: '#f9fafb',
  },
  progressText: {
    marginTop: 8,
    fontSize: 13,
    color: '#9ca3af',
  },
  successText: {
    marginTop: 8,
    color: '#10b981',
    fontWeight: '600',
  },

  /* TASKS */
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskInfo: {
    flex: 1,
    marginHorizontal: 8,
  },
  taskTitle: {
    fontWeight: '600',
    color: '#f9fafb',
  },
  taskSub: {
    fontSize: 12,
    color: '#9ca3af',
  },
  badge: {
    fontSize: 12,
    color: '#3b82f6',
    textTransform: 'capitalize',
  },

  /* PROJECTS */
  projectCard: {
    marginBottom: 12,
  },
  projectName: {
    fontWeight: '600',
    color: '#f9fafb',
  },
  projectSub: {
    fontSize: 12,
    color: '#9ca3af',
  },

  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
  },

  /* ACTIONS */
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#1f2937',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionText: {
    marginTop: 6,
    fontWeight: '600',
    color: '#f9fafb',
  },
});
