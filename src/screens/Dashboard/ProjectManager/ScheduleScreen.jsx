import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // Vector icons
import {useAuth} from '../../../context/AuthContext';
import {projects, tasks, teams, getUserById} from '../../../data/mockData';
import Header from '../../../components/layout/Header';

const statusColors = {
  pending: '#facc15', // yellow
  'in-progress': '#3b82f6', // blue
  completed: '#22c55e', // green
  blocked: '#ef4444', // red
};

export default function SchedulePage() {
  const {user} = useAuth();

  const tasksByDate = tasks.reduce((acc, task) => {
    const date = new Date(task.dueDate).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {});

  return (
    <View style={{flex: 1}}>
      <Header
        title="Project Tracking"
        subtitle={`Welcome back, ${user?.name || ''}`}
        notifications="3"
      />
      <ScrollView style={styles.container}>
        {/* Upcoming Tasks */}
        {/* <Text style={styles.sectionTitle}>Upcoming Tasks</Text> */}
        {Object.entries(tasksByDate)
          .slice(0, 3)
          .map(([date, dateTasks]) => (
            <View key={date} style={styles.dateSection}>
              <Text style={styles.dateTitle}>{date}</Text>
              {dateTasks.map(task => {
                const project = projects.find(p => p.id === task.projectId);
                const assignee = getUserById(task.assigneeId);

                return (
                  <View key={task.id} style={styles.card}>
                    <View style={styles.cardHeader}>
                      <View style={{flex: 1}}>
                        <View style={styles.titleRow}>
                          <Text style={styles.cardTitle}>{task.title}</Text>
                          <Text
                            style={[
                              styles.badge,
                              {backgroundColor: statusColors[task.status]},
                            ]}>
                            {task.status}
                          </Text>
                        </View>
                        <Text style={styles.projectName}>{project?.name}</Text>
                        <View style={styles.metaRow}>
                          <View style={styles.metaItem}>
                            <Icon name="map-pin" size={12} />
                            <Text>{project?.location.split(',')[0]}</Text>
                          </View>
                          <View style={styles.metaItem}>
                            <Icon name="users" size={12} />
                            <Text>{assignee?.name}</Text>
                          </View>
                          <View style={styles.metaItem}>
                            <Icon name="clock" size={12} />
                            <Text>Due {task.dueDate}</Text>
                          </View>
                        </View>
                      </View>
                      {task.status === 'completed' && (
                        <Icon name="check-circle" size={20} color="#22c55e" />
                      )}
                      {task.status === 'blocked' && (
                        <Icon name="alert-circle" size={20} color="#ef4444" />
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          ))}

        {/* Project Timelines */}
        <Text style={styles.sectionTitle}>Project Timelines</Text>
        {projects.map(project => {
          const team = teams.find(t => t.projectId === project.id);
          const projectTasks = tasks.filter(t => t.projectId === project.id);
          const completedTasks = projectTasks.filter(
            t => t.status === 'completed',
          ).length;

          return (
            <View key={project.id} style={styles.card}>
              <Text style={styles.cardTitle}>{project.name}</Text>
              <Text style={styles.dateRange}>
                {new Date(project.startDate).toLocaleDateString()} -{' '}
                {new Date(project.endDate).toLocaleDateString()}
              </Text>
              <View style={styles.infoRow}>
                <Text>Progress:</Text>
                <Text>{project.progress}%</Text>
              </View>
              <View style={styles.infoRow}>
                <Text>Tasks:</Text>
                <Text>
                  {completedTasks}/{projectTasks.length}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text>Team:</Text>
                <Text>{team?.members.length || 0} members</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {padding: 5, backgroundColor: '#f8fafc'},

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    // marginTop: 8,
    marginBottom: 8,
  },
  dateSection: {marginBottom: 16},
  dateTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cardTitle: {fontWeight: '600', fontSize: 15},
  badge: {
    color: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 10,
  },
  projectName: {color: '#64748b', fontSize: 12},
  metaRow: {flexDirection: 'row', gap: 12, marginTop: 6, flexWrap: 'wrap'},
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    fontSize: 10,
    color: '#64748b',
  },
  dateRange: {fontSize: 12, color: '#64748b', marginBottom: 8},
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
});
