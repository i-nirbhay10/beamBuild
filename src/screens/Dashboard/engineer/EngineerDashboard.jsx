import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

import {useAuth} from '../../../context/AuthContext';

import {
  teams,
  documents,
  getProjectById,
  getTasksByAssigneeId,
} from '../../../data/mockData';
import Header from '../../../components/layout/Header';

export default function EngineerDashboard() {
  const {user} = useAuth();
  const navigation = useNavigation();

  const myTasks = getTasksByAssigneeId(user?.id || '');
  const pendingTasks = myTasks.filter(t => t.status === 'pending');
  const inProgressTasks = myTasks.filter(t => t.status === 'in-progress');
  const completedTasks = myTasks.filter(t => t.status === 'completed');

  const engineerTeams = teams.filter(team =>
    team.members.some(m => m.userId === user?.id),
  );

  const assignedProjects = engineerTeams
    .map(t => getProjectById(t.projectId))
    .filter(Boolean);

  const projectDocuments = documents.filter(d =>
    assignedProjects.some(p => p.id === d.projectId),
  );

  const technicalDocs = projectDocuments.filter(
    d => d.type === 'plan' || d.type === 'report',
  );

  const upcomingTasks = myTasks
    .filter(t => t.status !== 'completed')
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    )
    .slice(0, 5);

  const stats = [
    {
      title: 'My Tasks',
      value: myTasks.length,
      icon: 'checkmark-done',
      color: '#6366f1',
    },
    {
      title: 'In Progress',
      value: inProgressTasks.length,
      icon: 'time',
      color: '#3b82f6',
    },
    {
      title: 'Completed',
      value: completedTasks.length,
      icon: 'checkmark-circle',
      color: '#10b981',
    },
    {
      title: 'Documents',
      value: technicalDocs.length,
      icon: 'document-text',
      color: '#f59e0b',
    },
  ];

  return (
    <View style={{flex: 1}}>
      <Header
        title="Dashboard"
        subtitle={`Welcome back, ${user?.name || ''}`}
        notifications={'3'}
      />
      <ScrollView style={styles.container}>
        {/* Stats */}
        <View style={styles.statsGrid}>
          {stats.map(stat => (
            <View key={stat.title} style={styles.statCard}>
              <View
                style={[styles.iconBox, {backgroundColor: stat.color + '22'}]}>
                <Icon name={stat.icon} size={20} color={stat.color} />
              </View>
              <View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statTitle}>{stat.title}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* My Projects */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>My Projects</Text>

          {assignedProjects.map(project => {
            const projectTasks = myTasks.filter(
              t => t.projectId === project.id,
            );
            const completed = projectTasks.filter(
              t => t.status === 'completed',
            ).length;

            const progress =
              projectTasks.length > 0
                ? (completed / projectTasks.length) * 100
                : 0;

            return (
              <View key={project.id} style={styles.projectItem}>
                <View style={{marginBottom: 8}}>
                  <View style={styles.projectHeader}>
                    <View>
                      <Text style={styles.projectName}>{project.name}</Text>
                    </View>
                    <Text style={styles.badge}>{project.status}</Text>
                  </View>
                  <Text style={styles.mutedText}>
                    {project.location.split(',')[0]}
                  </Text>
                </View>

                <View style={styles.progressRow}>
                  <Text style={styles.mutedText}>My Tasks</Text>
                  <Text style={styles.boldText}>
                    {completed}/{projectTasks.length}
                  </Text>
                </View>

                <View style={styles.progressBarBg}>
                  <View
                    style={[styles.progressBarFill, {width: `${progress}%`}]}
                  />
                </View>
              </View>
            );
          })}
        </View>

        {/* Upcoming Tasks */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Upcoming Deadlines</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Tasks')}>
              <Text style={styles.link}>View All</Text>
            </TouchableOpacity>
          </View>

          {upcomingTasks.map(task => {
            const project = getProjectById(task.projectId);
            const daysLeft = Math.ceil(
              (new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24),
            );
            const overdue = daysLeft < 0;

            return (
              <View key={task.id} style={styles.taskItem}>
                <View
                  style={[
                    styles.iconBox,
                    {
                      backgroundColor: overdue ? '#ef444422' : '#6366f122',
                    },
                  ]}>
                  <Icon
                    name="construct"
                    size={20}
                    color={overdue ? '#ef4444' : '#6366f1'}
                  />
                </View>

                <View style={{flex: 1}}>
                  <Text style={styles.boldText}>{task.title}</Text>
                  <Text style={styles.mutedText}>{project?.name}</Text>
                </View>

                <View style={{alignItems: 'flex-end'}}>
                  <Text style={styles.badge}>{task.priority}</Text>
                  <Text
                    style={[styles.mutedText, overdue && {color: '#ef4444'}]}>
                    {overdue
                      ? `${Math.abs(daysLeft)} days overdue`
                      : `${daysLeft} days left`}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Technical Documents */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Technical Documents</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Documents')}>
              <Text style={styles.link}>View All</Text>
            </TouchableOpacity>
          </View>

          {technicalDocs.slice(0, 6).map(doc => {
            const project = getProjectById(doc.projectId);
            return (
              <View key={doc.id} style={styles.docItem}>
                <View style={styles.iconBox}>
                  <Icon name="document" size={20} color="#f59e0b" />
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.boldText}>{doc.name}</Text>
                  <Text style={styles.mutedText}>
                    {project?.name} • {doc.size}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#020617',
    padding: 12,
    borderRadius: 12,
    width: '48%',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  statTitle: {
    color: '#94a3b8',
    fontSize: 12,
  },
  card: {
    backgroundColor: '#020617',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  projectItem: {
    backgroundColor: '#020617',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  projectName: {
    color: '#fff',
    fontWeight: '600',
  },
  mutedText: {
    color: '#94a3b8',
    fontSize: 12,
  },
  boldText: {
    color: '#fff',
    fontWeight: '500',
  },
  badge: {
    color: '#fff',
    fontSize: 12,
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#1e293b',
    borderRadius: 4,
  },
  progressBarFill: {
    height: 6,
    backgroundColor: '#6366f1',
    borderRadius: 4,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  link: {
    color: '#6366f1',
    fontSize: 13,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#020617',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  docItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#020617',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
});
